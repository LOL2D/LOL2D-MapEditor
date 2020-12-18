const MODE = {
    BLOCK: "Block",
    MAP: "Map",
};
let mode = MODE.MAP;
let pMouseIsPressed;

let stats;

function setup() {
    createCanvas(800, 600).id("game-canvas");
    textAlign(CENTER, CENTER);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

function draw() {
    stats.begin();

    background(30);

    cursor(ARROW); // reset cursor

    // header tabs
    if (button("Block", 5, 10, 100, 30, mode == MODE.BLOCK)) {
        mode = MODE.BLOCK;
    }
    if (button("Map", 105, 10, 100, 30, mode == MODE.MAP)) {
        mode = MODE.MAP;
    }

    fill("white");
    text("LOL2D MAP EDITOR", width / 2 + 100, 20);

    // body
    if (mode == MODE.BLOCK) {
        drawModeBlock();
    } else {
        drawModeMap();
    }

    // input
    pMouseIsPressed = mouseIsPressed;

    stats.end();
}

function drawModeBlock() {
    // ---------- menu zone ----------
    fill("#333");
    rect(5, 40, 200, height - 40 - 5);

    // buttons
    if (button("New block", 10, 60, 190, 25)) {
        console.log("new");
    }

    if (button("Open block", 10, 90, 190, 25)) {
        console.log("open");
    }

    if (button("Load Image for block", 10, 120, 190, 25)) {
        console.log("load image");
    }

    if (button("Undo", 10, 150, 92.5, 25)) {
        console.log("undo");
    }

    if (button("Redo", 107.5, 150, 92.5, 25)) {
        console.log("redo");
    }

    if (button("Save block", 10, 200, 190, 25)) {
        console.log("save");
    }

    // ---------- editor zone ----------
    fill("gray");
    rect(210, 40, width - 210 - 5, height - 40 - 5);

    fill("white");
    text("BLOCK", width / 2, height / 2);
}

function drawModeMap() {
    // ---------- menu zone ----------
    fill("#333");
    rect(5, 40, 200, height - 40 - 5);

    // buttons
    if (button("New map", 10, 60, 190, 25)) {
        console.log("new");
    }

    if (button("Open map", 10, 90, 190, 25)) {
        console.log("open");
    }

    if (button("Undo", 10, 120, 92.5, 25)) {
        console.log("undo");
    }

    if (button("Redo", 107.5, 120, 92.5, 25)) {
        console.log("redo");
    }

    if (button("Save map", 10, 170, 190, 25)) {
        console.log("save");
    }

    // blocks zone
    fill("white");
    text("List Blocks: ", 45, 220);

    listBlocks(10, 235, 190, 355);

    // ---------- editor zone ----------
    fill("gray");
    rect(210, 40, width - 210 - 5, height - 40 - 5);

    fill("white");
    text("MAP", width / 2, height / 2);
}

// helpers
function button(t, x, y, w, h, isActive) {
    let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    // cursor
    if (isHover) {
        cursor(HAND);
    }

    // color
    if (isActive) {
        fill("#333");
    } else if (isHover) {
        fill("#999");
    } else {
        fill("#555");
    }
    //stroke("#333");
    noStroke();

    // background
    rect(x, y, w, h);

    // text
    fill("white");
    noStroke();
    text(t, x + w / 2, y + h / 2);

    return isMousePressed() && isHover;
}

function listBlocks(x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);
}

function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}
