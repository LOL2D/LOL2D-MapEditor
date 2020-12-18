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
        editzone: {
            camera: { x: 0, y: 0 },
        },
    },
    blocktab: {
        currentBlockIndex: -1,
        editzone: {
            camera: { x: 0, y: 0 },
        },
    },
};

function setup() {
    createCanvas(800, 600).id("game-canvas");
    textAlign(CENTER, CENTER);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    setting.blocktab.editzone.camera.x = width / 2;
    setting.blocktab.editzone.camera.y = height / 2;
}

function draw() {
    stats.begin();

    background(30);

    cursor(ARROW); // reset cursor

    // body
    if (mode == MODE.BLOCK) {
        drawModeBlock();
    } else {
        drawModeMap();
    }

    // header tabs
    fill(30);
    rect(0, 0, width, 40);

    if (button("Block", 5, 10, 100, 30, mode == MODE.BLOCK)) {
        mode = MODE.BLOCK;
    }
    if (button("Map", 105, 10, 100, 30, mode == MODE.MAP)) {
        mode = MODE.MAP;
    }

    fill("white");
    text("LOL2D MAP EDITOR", width / 2 + 100, 20);

    // input
    pMouseIsPressed = mouseIsPressed;
    if (keyIsDown(32)) {
        cursor(MOVE);
    } else {
        cursor(ARROW);
    }

    stats.end();
}

function mouseDragged() {
    // if (keyIsDown(32)) {
    if (mode == MODE.BLOCK) {
        setting.blocktab.editzone.camera.x += movedX;
        setting.blocktab.editzone.camera.y += movedY;
    } else {
        setting.maptab.editzone.camera.x += movedX;
        setting.maptab.editzone.camera.y += movedY;
    }
    // }
}

function drawModeBlock() {
    // ---------- background ----------
    fill("#333");
    rect(0, 40, width, height - 40 - 5);

    // ---------- editor zone ----------
    drawEditBlockZone(210, 45, width - 210 - 5, height - 45 - 5);

    // ---------- menu zone ----------
    fill("#333");
    noStroke();
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
}

function drawModeMap() {
    // ---------- background ----------
    fill("#333");
    rect(0, 40, width, height - 40 - 5);

    // ---------- editor zone ----------
    drawEditMapZone(210, 45, width - 210 - 5, height - 45 - 5);

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
}

function drawEditBlockZone(x, y, w, h) {
    fill("#555");
    rect(x, y, w, h);

    let index = setting.blocktab.currentBlockIndex;
    if (index >= 0) {
        let block = setting.maptab.listBlocks.data[index];

        if (block) {
            // edit zone
            fill("gray");
            stroke("white");

            const { camera } = setting.blocktab.editzone;

            for (let r of block.rects) {
                rect(r.x + x + camera.x, r.y + y + camera.y, r.w, r.h);
            }

            // block name
            fill("white");
            noStroke();
            text(`Block: ${index} - ${block.name}`, x + w / 2, y + 10);
        }
    }
}

function drawEditMapZone(x, y, w, h) {
    fill("#555");
    rect(x, y, w, h);
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

    let isEndOfList = itemIndex >= data.length - itemPerPage;
    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfList)) {
        if (!isEndOfList) setting.maptab.listBlocks.itemIndex++;
    }

    // list blocks
    let blockW = w;
    let blockH = (h - 40) / itemPerPage;
    let index2 = min(data.length, itemIndex + itemPerPage);

    for (let i = itemIndex; i < index2; i++) {
        let blockX = x;
        let blockY = y + (i - itemIndex) * blockH + 20;
        renderBlockItem(i, data[i], blockX, blockY, blockW, blockH);
    }
}

function mouseWheel(event) {
    // scroll list blocks
    if (mode == MODE.MAP && isMouseInRect(10, 235, 190, 355)) {
        const { itemIndex, itemPerPage, data } = setting.maptab.listBlocks;

        if (event.delta > 0) {
            let isEndOfList = itemIndex >= data.length - itemPerPage;
            if (!isEndOfList) setting.maptab.listBlocks.itemIndex++;
        } else {
            if (itemIndex > 0) setting.maptab.listBlocks.itemIndex--;
        }
    }
}

function renderBlockItem(index, block, x, y, w, h) {
    // background
    stroke("white");
    noFill();
    rect(x, y, w, h);

    // scale up/down to fit item container
    let top = Infinity,
        left = Infinity,
        right = -Infinity,
        bottom = -Infinity;

    for (let p of block.rects) {
        top = min(p.y, top);
        bottom = max(p.y + p.h, bottom);
        left = min(p.x, left);
        right = max(p.x + p.w, right);
    }

    let W = abs(right) - abs(left) > 0 ? abs(right) * 2 : abs(left) * 2;
    let H = abs(bottom) - abs(top) > 0 ? abs(bottom) * 2 : abs(top) * 2;

    let scaleRatio = min(w, h) / max(W, H);

    // draw shape
    fill("gray");
    for (let r of block.rects) {
        rect(
            r.x * scaleRatio + x + w / 2,
            r.y * scaleRatio + y + h / 2,
            r.w * scaleRatio,
            r.h * scaleRatio
        );
    }

    // draw center point
    fill("red");
    noStroke();
    circle(x + w / 2, y + h / 2, 5);

    // title
    fill("white");
    noStroke();

    let title = index + " - " + block.name;
    text(title, x + textWidth(title) / 2 + 10, y + 10);

    let size = W + " x " + H;
    text(size, w - textWidth(size) / 2, y + 10);

    // on hover
    if (isMouseInRect(x, y, w, h)) {
        // show buttons
        if (
            button("Delete", x + 1, y + h - 20, 55, 20, false, "#9995", "red")
        ) {
            if (
                window.confirm(
                    `Are you sure want to delete this block index: ${index}, name: ${block.name}`
                )
            )
                setting.maptab.listBlocks.data.splice(index, 1);
        }
        if (button("Edit", x + 56, y + h - 20, 50, 20, false, "#9995")) {
            mode = MODE.BLOCK;
            setting.blocktab.currentBlockIndex = index;
        }
        if (
            button("Add to map →", x + 106, y + h - 20, 83, 20, false, "#9995")
        ) {
            console.log("add");
        }

        // show info
        fill("white");
        noStroke();
    }
}

function button(t, x, y, w, h, isActive, bgColor, hoverColor, activeColor) {
    let isHover = isMouseInRect(x, y, w, h);

    // cursor
    if (isHover) {
        cursor(HAND);
    }

    // color
    if (isActive) {
        fill(activeColor || "#333");
    } else if (isHover) {
        fill(hoverColor || "#999");
    } else {
        fill(bgColor || "#555");
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

function isMouseInRect(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}
