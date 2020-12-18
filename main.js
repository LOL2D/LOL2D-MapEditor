const MODE = {
    BLOCK: "Block",
    MAP: "Map",
};
let mode = MODE.BLOCK;
let pMouseIsPressed;

function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(30);

    if (button("Tạo " + mode, 10, 10, 100, 25)) {
        mode = mode == MODE.BLOCK ? MODE.MAP : MODE.BLOCK;
    }

    if (mode == MODE.BLOCK) {
        text("BLOCK", width / 2, height / 2);
    } else {
        text("MAP", width / 2, height / 2);
    }

    pMouseIsPressed = mouseIsPressed;
}

// helpers
function button(t, x, y, w, h, isActive) {
    let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    // cursor
    if (isHover) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    // color
    if (isActive) {
        fill("#444");
    } else if (isHover) {
        fill("#999");
    } else {
        fill("#555");
    }
    stroke("black");

    // background
    rect(x, y, w, h);

    // text
    fill("white");
    noStroke();
    text(t, x + w / 2, y + h / 2);

    return isMousePressed() && isHover;
}

function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}
