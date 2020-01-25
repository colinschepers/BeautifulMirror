const width = 500;
const height = 700;
const backgroundColorFrom = 250;
const backgroundColorTo = 220;

const frameOffsetX = 30;
const frameOffsetY = 30;
const frameColor = 255;

const infoTextOffsetX = 20;
const infoTextOffsetY = 20;
const infoTextColor = 50;
const infoTextAlpha = 200;
const infoTextFont = 'Arial'

const wheelItemCount = 5;
const wheelScrollSpeed = 0.9;
const wheelScrollSensitivity = 70;
const wheelTextSize = 64;
const wheelTextDistance = 90;
const wheelTextColor = 50;
const wheelTextFont = 'Arial'

const beautifulWords = [
    'Safe', 'Ready', 'Marvelous', 'Pretty', 'Positive',
    'Okay', 'Powerful', 'Superb', 'Breathtaking', 'Satisfied',
    'Happy', 'Beautiful'
]

var acceleration = 0.0;
var scrollValue = 0.0;

function preload() {
    partlyCloudyImage = loadImage('Images/partly_cloudy.png');
}

function setup() {
    createCanvas(width, height);
}

function draw() {
    noStroke();
    updateVars();
    drawBackground();
    drawFrame();
    drawDate();
    drawWeather();
    drawWheel();

    // textSize(22);
    // textAlign(CENTER, CENTER);
    // fill(255, 0, 0, 100);
    // text(scrollValue.toString(), width / 2, 15)
    // stroke(255, 0, 0, 50);
    // line(width / 2, 0, width / 2, height);
    // line(0, height / 2, width, height / 2);
}

function updateVars() {
    scrollValue -= acceleration / wheelScrollSensitivity;
    scrollValue += beautifulWords.length;
    scrollValue %= beautifulWords.length;
    acceleration *= wheelScrollSpeed;
}

function drawBackground() {
    background(255);
    setGradient(0, 0, width, height, color(backgroundColorFrom), color(backgroundColorTo), 1);
    setGradient(0, 0, width, height, color(backgroundColorFrom), color(backgroundColorTo), 2);
}

function drawFrame() {
    noFill()
    stroke(frameColor, 255);
    rect(frameOffsetX, frameOffsetY, width - 2 * frameOffsetX, height - 2 * frameOffsetY);
}

function drawDate() {
    w = width / 2 - frameOffsetX - 2 * infoTextOffsetX;
    h = (height / 2 - frameOffsetY - 2 * infoTextOffsetY) / 6;

    graphics = createGraphics(w, h);
    graphics.background(0, 0);
    graphics.fill(infoTextColor, infoTextAlpha);
    graphics.textFont(infoTextFont);

    graphics.textSize(12);
    graphics.textAlign(LEFT, CENTER);
    graphics.text(getDateString(), 0, h * 0.25);

    graphics.textSize(20);
    graphics.textAlign(LEFT, BASELINE);
    graphics.text(getTimeString(), 0, h - 5);
    graphics.textSize(12);
    graphics.text(getAMPM(), 55, h - 5);

    image(graphics, frameOffsetX + infoTextOffsetX, frameOffsetY + infoTextOffsetY, w, h);
}

function drawWeather() {
    w = width / 2 - frameOffsetX - 2 * infoTextOffsetX;
    h = (height / 2 - frameOffsetY - 2 * infoTextOffsetY) / 6;
    x = frameOffsetX + infoTextOffsetX * 3 + w;
    y = frameOffsetY + infoTextOffsetY;

    graphics = createGraphics(w, h);

    graphics.imageMode(CENTER);
    graphics.image(partlyCloudyImage, w * 0.6, h * 0.25, 40, 40);

    graphics.background(0, 0);
    graphics.fill(infoTextColor, infoTextAlpha);
    graphics.textFont(infoTextFont);

    graphics.textSize(20);
    graphics.textAlign(RIGHT, CENTER);
    graphics.text('11ºC', w, h / 3);

    graphics.textSize(12);
    graphics.textAlign(RIGHT, BASELINE);
    graphics.text('Eindhoven, the Netherlands', w, h - 5);

    image(graphics, x, y, w, h);
}

function drawWheel() {

    infoTextHeight = (height / 2 - frameOffsetY - 2 * infoTextOffsetY) / 5

    w = width - 2 * frameOffsetX;
    h = height - 2 * frameOffsetY - infoTextOffsetY - infoTextHeight;
    x = frameOffsetX;
    y = frameOffsetY + infoTextOffsetY + infoTextHeight;

    graphics = createGraphics(w, h);
    graphics.noStroke();
    graphics.background(0, 0);
    graphics.textFont(wheelTextFont);
    graphics.textAlign(CENTER, BOTTOM);
    graphics.textSize(wheelTextSize);

    for (let i = 0; i < beautifulWords.length; i++) {
        const word = beautifulWords[i];

        let dh = wheelTextDistance * (scrollValue - i);
        if (dh > h / 2) {
            dh -= wheelTextDistance * beautifulWords.length;
        } else if (dh < -h / 2 - wheelTextDistance) {
            dh += wheelTextDistance * beautifulWords.length;
        }

        let alpha = 255 * (1 - (Math.abs(dh) + wheelTextDistance / 2) / h * 2);
        graphics.fill(wheelTextColor, alpha);
        graphics.text(word, w / 2, h / 2 - dh);
    }

    image(graphics, x, y, w, h);
}

function mouseDragged() {
    acceleration = movedY;
}

function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
    if (axis === 1) {
        for (let i = y; i <= y + h; i++) {
            let inter = map(i, y, y + h, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis === 2) {
        for (let i = x; i <= x + w; i++) {
            let inter = map(i, x, x + w, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}

function getDateString() {
    let date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function getTimeString() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
}

function getAMPM() {
    let date = new Date();
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    return ampm;
}