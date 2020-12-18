const MODE = {
    TERRAIN: "Terrain",
    MAP: "Map",
};
let mode = MODE.MAP;
let pMouseIsPressed;
let stats;

let globalData = {
    maptab: {
        listTerrains: {
            itemIndex: 0,
            itemPerPage: 2,
            data: TERRAIN_MAP.SUMMORNER_RIFT,
        },
        editzone: {
            camera: { x: 0, y: 0, scale: 1 },
        },
    },
    terraintab: {
        currentTerrainIndex: -1,
        editzone: {
            camera: { x: 0, y: 0, scale: 1 },
            selected: null,
        },
    },
};

let UI = {
    // map tab
    menuMapZone: [5, 40, 200, 555],
    mapEditorZone: [210, 45, 585, 550],
    tabMapBtn: ["Map", 105, 10, 100, 30],
    newMapBtn: ["New map", 10, 60, 190, 25],
    openMapBtn: ["Open map...", 10, 90, 190, 25],
    saveMapBtn: ["Save map", 10, 120, 190, 25],
    undoMapBtn: ["Undo", 10, 160, 92.5, 25],
    redoMapBtn: ["Redo", 107.5, 160, 92.5, 25],

    listTerrainsZoneTitle: "List terrains:",
    listTerrainsZone: [10, 235, 190, 355],

    // terrain tab
    menuTerrainZone: [5, 40, 200, 555],
    terrainEditorZone: [210, 45, 585, 550],
    tabTerrainBtn: ["Terrain", 5, 10, 100, 30],
    newTerrainBtn: ["New terrain", 10, 60, 190, 25],
    openTerrainBtn: ["Open terrain...", 10, 90, 190, 25],
    saveTerrainBtn: ["Save terrain", 10, 120, 190, 25],

    loadImageTerrainBtn: ["Load image for terrain", 10, 160, 190, 25],
    undoTerrainBtn: ["Undo", 10, 190, 92.5, 25],
    redoTerrainBtn: ["Redo", 107.5, 190, 92.5, 25],
    newRectBtn: [],
    goToCenterTerrainBtn: ["Reset camera", 10, 250, 92.5, 25],
};

function setup() {
    createCanvas(800, 600).id("game-canvas");
    textAlign(CENTER, CENTER);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    resetCamera(globalData.terraintab.editzone.camera);
    resetCamera(globalData.maptab.editzone.camera);
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

    if (button(...UI.tabTerrainBtn, mode == MODE.TERRAIN)) {
        mode = MODE.TERRAIN;
    }
    if (button(...UI.tabMapBtn, mode == MODE.MAP)) {
        mode = MODE.MAP;
    }

    fill("white");
    text("LOL2D MAP EDITOR", width / 2 + UI.menuTerrainZone[2] / 2, 20);

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
        globalData.terraintab.editzone.camera.x += movedX;
        globalData.terraintab.editzone.camera.y += movedY;
    } else {
        globalData.maptab.editzone.camera.x += movedX;
        globalData.maptab.editzone.camera.y += movedY;
    }
    // }
}

function mouseWheel(event) {
    // scroll list terrains
    if (mode == MODE.MAP && isMouseInRect(...UI.listTerrainsZone)) {
        const { itemIndex, itemPerPage, data } = globalData.maptab.listTerrains;

        if (event.delta > 0) {
            let isEndOfList = itemIndex >= data.length - itemPerPage;
            if (!isEndOfList) globalData.maptab.listTerrains.itemIndex++;
        } else {
            if (itemIndex > 0) globalData.maptab.listTerrains.itemIndex--;
        }
    }

    // zoom in/out terrain editor
    if (mode == MODE.TERRAIN && isMouseInRect(...UI.terrainEditorZone)) {
        let { camera } = globalData.terraintab.editzone;

        // camera.scale -= (camera.scale / 10) * (event.delta > 0 ? 1 : -2);
        zoomBy(camera, event.delta);
    }

    // zoom in/out map editor
}

function drawModeTerrain() {
    // ---------- editor zone ----------
    drawEditTerrainZone(...UI.terrainEditorZone);

    // ---------- menu zone ----------
    fill("#333");
    noStroke();
    rect(...UI.menuTerrainZone);

    // buttons
    if (button(...UI.newTerrainBtn)) {
        console.log("new");
    }

    if (button(...UI.openTerrainBtn)) {
        console.log("open");
    }

    if (button(...UI.loadImageTerrainBtn)) {
        console.log("load image");
    }

    if (button(...UI.undoTerrainBtn)) {
        console.log("undo");
    }

    if (button(...UI.redoTerrainBtn)) {
        console.log("redo");
    }

    if (button(...UI.saveTerrainBtn)) {
        console.log("save");
    }

    if (button(...UI.goToCenterTerrainBtn)) {
        resetCamera(globalData.terraintab.editzone.camera);
    }
}

function drawModeMap() {
    // ---------- editor zone ----------
    drawEditMapZone(...UI.mapEditorZone);

    // ---------- menu zone ----------
    fill("#333");
    rect(...UI.menuMapZone);

    // buttons
    if (button(...UI.newMapBtn)) {
        console.log("new");
    }

    if (button(...UI.openMapBtn)) {
        console.log("open");
    }

    if (button(...UI.undoMapBtn)) {
        console.log("undo");
    }

    if (button(...UI.redoMapBtn)) {
        console.log("redo");
    }

    if (button(...UI.saveMapBtn)) {
        console.log("save");
    }

    // terrains zone
    fill("white");
    text(
        UI.listTerrainsZoneTitle,
        UI.listTerrainsZone[0] + textWidth(UI.listTerrainsZoneTitle) / 2,
        UI.listTerrainsZone[1] - 15
    );

    listScrollTerrains(...UI.listTerrainsZone);
}

function drawEditTerrainZone(x, y, w, h) {
    fill("#555");
    rect(x, y, w, h);

    let index = globalData.terraintab.currentTerrainIndex;
    if (index >= 0) {
        let terrain = globalData.maptab.listTerrains.data[index];

        if (terrain) {
            // edit zone
            const { camera } = globalData.terraintab.editzone;

            // rects
            fill("gray");
            stroke("white");
            for (let r of terrain.rects) {
                rect(
                    r.x * camera.scale + camera.x,
                    r.y * camera.scale + camera.y,
                    r.w * camera.scale,
                    r.h * camera.scale
                );
            }

            // grid
            // for(let gx = 0; gx > )

            // center point
            fill("red");
            noStroke();
            circle(camera.x, camera.y, 5);

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

// ---------- helpers ----------
// scroll list
function listScrollTerrains(x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);

    // data
    const { itemIndex, itemPerPage, data } = globalData.maptab.listTerrains;

    // buttons
    if (button("Scroll Up ↑", x, y, w, 20, itemIndex == 0)) {
        if (itemIndex > 0) globalData.maptab.listTerrains.itemIndex--;
    }

    let isEndOfList = itemIndex >= data.length - itemPerPage;
    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfList)) {
        if (!isEndOfList) globalData.maptab.listTerrains.itemIndex++;
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
                globalData.maptab.listTerrains.data.splice(index, 1);
        }
        if (button("Edit", x + 56, y + h - 20, 50, 20, false, "#9995")) {
            mode = MODE.TERRAIN;
            globalData.terraintab.editzone.camera;
            globalData.terraintab.currentTerrainIndex = index;
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

// button
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

// mouse event
function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}

// camera

function resetCamera(camera) {
    camera.scale = 1;
    camera.x = width / 2;
    camera.y = height / 2;
}

// source: https://github.com/HoangTran0410/ImageToSpriteJson/blob/db1f19ec11ba899e71dff1af31f656495d5a7281/main.js#L197
function zoomTo(camera, _ratio) {
    let ratio = max(0.1, _ratio);

    let tiLe = ratio / camera.scale;

    camera.scale = ratio;

    let mx = mouseX; //- UI.terrainEditorZone[0];
    let my = mouseY; //- UI.terrainEditorZone[1];

    // Zoom from the triggering point of the event
    camera.x = mx + (camera.x - mx) * tiLe;
    camera.y = my + (camera.y - my) * tiLe;
}

function zoomBy(camera, value) {
    zoomTo(camera, camera.scale + (value > 0 ? -0.1 : 0.1));
}
