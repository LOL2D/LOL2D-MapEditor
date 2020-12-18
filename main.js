const MODE = {
    BLOCK: "Block",
    MAP: "Map",
};
let mode = MODE.MAP;
let pMouseIsPressed;
let stats;

let setting = {
    maptab: {
        listBlocks: {
            itemIndex: 0,
            itemPerPage: 2,
            data: TERRAIN_MAP.SUMMORNER_RIFT,
        },
    },
    blocktab: {},
};

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
    // ---------- background ----------
    fill("#333");
    rect(0, 40, width, height - 40 - 5);

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
    rect(210, 45, width - 210 - 5, height - 45 - 5);

    fill("white");
    text("BLOCK", width / 2, height / 2);
}

function drawModeMap() {
    // ---------- background ----------
    fill("#333");
    rect(0, 40, width, height - 40 - 5);

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

    listScrollBlocks(10, 235, 190, 355);

    // ---------- editor zone ----------
    // fill("gray");
    // rect(210, 45, width - 210 - 5, height - 45 - 5);

    // fill("white");
    // text("MAP", width / 2, height / 2);
}

// helpers
function listScrollBlocks(x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);

    // data
    const { itemIndex, itemPerPage, data } = setting.maptab.listBlocks;

    // buttons
    if (button("Scroll Up ↑", x, y, w, 20, itemIndex == 0)) {
        if (itemIndex > 0) setting.maptab.listBlocks.itemIndex--;
    }

    let isEndOfList = itemIndex == data.length - itemPerPage;
    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfList)) {
        if (!isEndOfList) setting.maptab.listBlocks.itemIndex++;
    }

    // list blocks
    let blockW = w;
    let blockH = (h - 40) / itemPerPage;

    for (let i = itemIndex; i < itemIndex + itemPerPage; i++) {
        let blockX = x;
        let blockY = y + (i - itemIndex) * blockH + 20;
        renderBlockItem(i, data[i], blockX, blockY, blockW, blockH);
    }
}

function renderBlockItem(title, block, x, y, w, h) {
    // background
    stroke("white");
    noFill();
    rect(x, y, w, h);

    // scale up/down to fit item container
    let maxDistance = 0;
    for (let p of block.shapeVertices) {
        for (let p2 of block.shapeVertices) {
            let distance = dist(p.x, p.y, p2.x, p2.y);
            maxDistance = max(maxDistance, distance);
        }
    }

    let scaleRatio = min(w, h) / maxDistance;

    // draw shape
    fill("gray");
    beginShape();
    for (let p of block.shapeVertices) {
        vertex(p.x * scaleRatio + x + w / 2, p.y * scaleRatio + y + h / 2);
    }
    endShape(CLOSE);

    // title
    fill("white");
    noStroke();
    text(title, x + 10, y + 10);

    // buttons
    if (button("Edit", x + w - 50, y + h - 20, 50, 20)) {
        console.log("edit");
    }
}

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
    fill(isActive ? "gray" : "white");
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
