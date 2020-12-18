const MODE = {
    TERRAIN: "Terrain",
    MAP: "Map",
};
let mode = MODE.MAP;
let pMouseIsPressed;
let stats;

let setting = {
    maptab: {
        listTerrains: {
            itemIndex: 0,
            itemPerPage: 2,
            data: TERRAIN_MAP.SUMMORNER_RIFT,
        },
        editzone: {
            camera: { x: 0, y: 0 },
        },
    },
    terraintab: {
        currentTerrainIndex: -1,
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

    setting.terraintab.editzone.camera.x = width / 2;
    setting.terraintab.editzone.camera.y = height / 2;
}

function draw() {
    stats.begin();

    background(30);

    cursor(ARROW); // reset cursor

    // body
    if (mode == MODE.TERRAIN) {
        drawModeTerrain();
    } else {
        drawModeMap();
    }

    // header tabs
    fill(30);
    rect(0, 0, width, 40);

    if (button("Terrain", 5, 10, 100, 30, mode == MODE.TERRAIN)) {
        mode = MODE.TERRAIN;
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
    if (mode == MODE.TERRAIN) {
        setting.terraintab.editzone.camera.x += movedX;
        setting.terraintab.editzone.camera.y += movedY;
    } else {
        setting.maptab.editzone.camera.x += movedX;
        setting.maptab.editzone.camera.y += movedY;
    }
    // }
}

function drawModeTerrain() {
    // ---------- background ----------
    fill("#333");
    rect(0, 40, width, height - 40 - 5);

    // ---------- editor zone ----------
    drawEditTerrainZone(210, 45, width - 210 - 5, height - 45 - 5);

    // ---------- menu zone ----------
    fill("#333");
    noStroke();
    rect(5, 40, 200, height - 40 - 5);

    // buttons
    if (button("New terrain", 10, 60, 190, 25)) {
        console.log("new");
    }

    if (button("Open terrain", 10, 90, 190, 25)) {
        console.log("open");
    }

    if (button("Load Image for terrain", 10, 120, 190, 25)) {
        console.log("load image");
    }

    if (button("Undo", 10, 150, 92.5, 25)) {
        console.log("undo");
    }

    if (button("Redo", 107.5, 150, 92.5, 25)) {
        console.log("redo");
    }

    if (button("Save terrain", 10, 200, 190, 25)) {
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

    // terrains zone
    fill("white");
    text("List Terrains: ", 45, 220);

    listScrollTerrains(10, 235, 190, 355);
}

function drawEditTerrainZone(x, y, w, h) {
    fill("#555");
    rect(x, y, w, h);

    let index = setting.terraintab.currentTerrainIndex;
    if (index >= 0) {
        let terrain = setting.maptab.listTerrains.data[index];

        if (terrain) {
            // edit zone
            fill("gray");
            stroke("white");

            const { camera } = setting.terraintab.editzone;

            for (let r of terrain.rects) {
                rect(r.x + x + camera.x, r.y + y + camera.y, r.w, r.h);
            }

            // terrain name
            fill("white");
            noStroke();
            text(`Terrain: ${index} - ${terrain.name}`, x + w / 2, y + 10);
        }
    }
}

function drawEditMapZone(x, y, w, h) {
    fill("#555");
    rect(x, y, w, h);
}

// helpers
function listScrollTerrains(x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);

    // data
    const { itemIndex, itemPerPage, data } = setting.maptab.listTerrains;

    // buttons
    if (button("Scroll Up ↑", x, y, w, 20, itemIndex == 0)) {
        if (itemIndex > 0) setting.maptab.listTerrains.itemIndex--;
    }

    let isEndOfList = itemIndex >= data.length - itemPerPage;
    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfList)) {
        if (!isEndOfList) setting.maptab.listTerrains.itemIndex++;
    }

    // list terrains
    let terrainW = w;
    let terrainH = (h - 40) / itemPerPage;
    let index2 = min(data.length, itemIndex + itemPerPage);

    for (let i = itemIndex; i < index2; i++) {
        let terrainX = x;
        let terrainY = y + (i - itemIndex) * terrainH + 20;
        renderTerrainItem(i, data[i], terrainX, terrainY, terrainW, terrainH);
    }
}

function mouseWheel(event) {
    // scroll list terrains
    if (mode == MODE.MAP && isMouseInRect(10, 235, 190, 355)) {
        const { itemIndex, itemPerPage, data } = setting.maptab.listTerrains;

        if (event.delta > 0) {
            let isEndOfList = itemIndex >= data.length - itemPerPage;
            if (!isEndOfList) setting.maptab.listTerrains.itemIndex++;
        } else {
            if (itemIndex > 0) setting.maptab.listTerrains.itemIndex--;
        }
    }
}

function renderTerrainItem(index, terrain, x, y, w, h) {
    // background
    stroke("white");
    noFill();
    rect(x, y, w, h);

    // scale up/down to fit item container
    let top = Infinity,
        left = Infinity,
        right = -Infinity,
        bottom = -Infinity;

    for (let p of terrain.rects) {
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
    for (let r of terrain.rects) {
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

    let title = index + " - " + terrain.name;
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
                    `Are you sure want to delete this terrain index: ${index}, name: ${terrain.name}`
                )
            )
                setting.maptab.listTerrains.data.splice(index, 1);
        }
        if (button("Edit", x + 56, y + h - 20, 50, 20, false, "#9995")) {
            mode = MODE.TERRAIN;
            setting.terraintab.currentTerrainIndex = index;
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
