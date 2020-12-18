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
            imageData: null,
            camera: { x: 0, y: 0, scale: 1 },
            selectedRectIndex: -1,
            selectedRectMouseDelta: { x: 0, y: 0 },
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
    exportMapBtn: ["Export map...", 10, 120, 190, 25],

    listTerrainsZoneTitle: "List terrains:",
    listTerrainsZone: [10, 235, 190, 355],

    // terrain tab
    menuTerrainZone: [5, 40, 200, 555],
    terrainEditorZone: [210, 45, 585, 550],
    tabTerrainBtn: ["Terrain", 5, 10, 100, 30],
    newTerrainBtn: ["New terrain", 10, 60, 190, 25],
    openTerrainBtn: ["Open terrain...", 10, 90, 190, 25],
    exportTerrainBtn: ["Export terrain...", 10, 120, 190, 25],

    removeImageTerrainBtn: ["Remove image", 10, 160, 92.5, 25],
    loadImageTerrainBtn: ["Load image...", 107.5, 160, 92.5, 25, 0, 0, "black"],
    resetCameraTerrainBtn: ["Reset camera", 10, 190, 92.5, 25],
    createRectBtn: ["Create rect", 107.5, 190, 92.5, 25, 0, 0, "green"],
    deleteSelectedRectBtn: ["Delete selected", 10, 220, 92.5, 25, 0, 0, "red"],
    editSelectedRectBtn: ["Edit selected", 107.5, 220, 92.5, 25],
};

function setup() {
    createCanvas(800, 600).id("game-canvas");
    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    preventRightClick("game-canvas");

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
    if (mode == MODE.TERRAIN) {
        if (isMouseInRect(...UI.terrainEditorZone)) {
            let rect = getSelectedRect();
            if (rect) {
                // drag selected rect
                const {
                    x: delX,
                    y: delY,
                } = globalData.terraintab.editzone.selectedRectMouseDelta;

                const { camera } = globalData.terraintab.editzone;
                rect.x = ~~((mouseX + delX - camera.x) / camera.scale);
                rect.y = ~~((mouseY + delY - camera.y) / camera.scale);
            } else {
                // drag camera
                globalData.terraintab.editzone.camera.x += movedX;
                globalData.terraintab.editzone.camera.y += movedY;
            }
        }
    } else {
        if (isMouseInRect(...UI.mapEditorZone)) {
            globalData.maptab.editzone.camera.x += movedX;
            globalData.maptab.editzone.camera.y += movedY;
        }
    }
}

function mousePressed() {}

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

function keyPressed() {
    let selectedRect = getSelectedRect();
    if (selectedRect) {
        if (keyCode == LEFT_ARROW) {
            selectedRect.x--;
        }

        if (keyCode == RIGHT_ARROW) {
            selectedRect.x++;
        }

        if (keyCode == UP_ARROW) {
            selectedRect.y--;
        }

        if (keyCode == DOWN_ARROW) {
            selectedRect.y++;
        }
    }
}

// --------------- draw methods ---------------
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

    if (button(...UI.removeImageTerrainBtn)) {
        globalData.terraintab.editzone.imageData = null;
    }

    if (button(...UI.loadImageTerrainBtn)) {
        let terrain = getEditingTerrain();

        if (terrain) {
            createFileInput((files) => {
                globalData.terraintab.editzone.imageData = getFileLocal(files);
                removeElements(); // https://p5js.org/reference/#/p5/removeElements
            })
                .style("display: none")
                .elt.click();
        }
    }

    if (button(...UI.resetCameraTerrainBtn)) {
        resetCamera(globalData.terraintab.editzone.camera);
    }

    if (button(...UI.createRectBtn)) {
        let terrain = getEditingTerrain();
        if (terrain) {
            let w = window.prompt("width: ");
            let h = window.prompt("height: ");

            terrain.rects.push({ x: 0, y: 0, w, h });
        }
    }

    if (button(...UI.deleteSelectedRectBtn)) {
        let selectedRect = getSelectedRect();

        if (selectedRect != null) {
            if (window.confirm("Are you sure want to delete selected rect")) {
                getEditingTerrain().rects.splice(
                    globalData.terraintab.editzone.selectedRectIndex,
                    1
                );

                globalData.terraintab.editzone.selectedRectIndex = -1;
            }
        }
    }

    if (button(...UI.editSelectedRectBtn)) {
        let selectedRect = getSelectedRect();

        if (selectedRect != null) {
            selectedRect.w = Number(window.prompt("width: ", selectedRect.w));
            selectedRect.h = Number(window.prompt("height: ", selectedRect.h));

            globalData.terraintab.editzone.selectedRectIndex = -1;
        }
    }

    if (button(...UI.exportTerrainBtn)) {
        let terrain = getEditingTerrain();

        if (terrain) {
            let data = JSON.stringify(terrain);
            window.prompt("Terrain data: (Ctrl+C to copy)", data);
        }
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

    if (button(...UI.exportMapBtn)) {
        console.log("export");
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
    fill("#333");
    rect(x, y, w, h);

    let terrain = getEditingTerrain();

    if (!terrain) {
        fill("white");
        text(
            "Click tab 'Map' -> Choose terrain in 'List terrains' -> Click 'Edit'.",
            x + w / 2,
            y + h / 2
        );
        return;
    }

    let { camera } = globalData.terraintab.editzone;

    // grid
    stroke("#555");
    strokeWeight(1);
    let zoneLeft = UI.terrainEditorZone[0];
    let zoneRight = zoneLeft + UI.terrainEditorZone[2];
    let zoneTop = UI.terrainEditorZone[1];
    let zoneBottom = zoneTop + UI.terrainEditorZone[3];
    let gridSizeRange = [50, 100];
    let gridSize = 50 * camera.scale;

    if (gridSize < gridSizeRange[0]) {
        while (gridSize < gridSizeRange[0]) {
            gridSize *= 2;
        }
    } else if (gridSize > gridSizeRange[1]) {
        while (gridSize > gridSizeRange[1]) {
            gridSize = ~~(gridSize / 2);
        }
    }

    for (let i = camera.x; i > zoneLeft; i -= gridSize) {
        line(i, zoneTop, i, zoneBottom);
    }

    for (let i = camera.x; i < zoneRight; i += gridSize) {
        line(i, zoneTop, i, zoneBottom);
    }

    for (let i = camera.y; i > zoneTop; i -= gridSize) {
        line(zoneLeft, i, zoneRight, i);
    }

    for (let i = camera.y; i < zoneBottom; i += gridSize) {
        line(zoneLeft, i, zoneRight, i);
    }

    let gs = (gridSize / camera.scale).toFixed(2);
    fill("white");
    text(`Grid size: ${gs}px`, x, y + h - 30, 150, 30);

    // image data
    const { imageData } = globalData.terraintab.editzone;
    if (imageData) {
        image(
            imageData,
            camera.x,
            camera.y,
            imageData.width * camera.scale,
            imageData.height * camera.scale
        );
    }

    // flags
    let hovered = false;
    let isSelectRect = false;

    // rects
    fill("#ddd9");
    strokeWeight(1);

    for (let i = 0; i < terrain.rects.length; i++) {
        let r = terrain.rects[i];

        let rx = r.x * camera.scale + camera.x;
        let ry = r.y * camera.scale + camera.y;
        let rw = r.w * camera.scale;
        let rh = r.h * camera.scale;

        // hight light on hover
        if (!hovered && isMouseInRect(rx, ry, rw, rh)) {
            stroke("red");
            hovered = true;
        } else {
            stroke("white");
        }

        // hight light selected rect
        if (globalData.terraintab.editzone.selectedRectIndex == i) {
            stroke("yellow");
            strokeWeight(2);
        } else {
            strokeWeight(1);
        }

        // select rect
        if (isMousePressed()) {
            if (isMouseInRect(rx, ry, rw, rh)) {
                globalData.terraintab.editzone.selectedRectIndex = i;
                globalData.terraintab.editzone.selectedRectMouseDelta = {
                    x: rx - mouseX,
                    y: ry - mouseY,
                };

                isSelectRect = true;
            }
        }

        // draw rect
        rect(rx, ry, rw, rh);
    }

    // remove selected index on click outside rects
    if (!isSelectRect && isMousePressed() && isMouseInRect(x, y, w, h)) {
        globalData.terraintab.editzone.selectedRectIndex = -1;
    }

    // center point
    fill("red");
    noStroke();
    circle(camera.x, camera.y, 5);

    // terrain name
    fill("white");
    noStroke();
    text(
        `Terrain: ${globalData.terraintab.currentTerrainIndex} - ${terrain.name}`,
        x + w / 2,
        y + 10
    );
}

function drawEditMapZone(x, y, w, h) {
    fill("#333");
    rect(x, y, w, h);
}

// ---------- helpers ----------
// get data
function getSelectedRect() {
    return getRectAtIndex(globalData.terraintab.editzone.selectedRectIndex);
}

function getRectAtIndex(index) {
    return getEditingTerrain()?.rects[index];
}

function getEditingTerrain() {
    return getTerrainAtIndex(globalData.terraintab.currentTerrainIndex);
}

function getTerrainAtIndex(index) {
    return globalData.maptab.listTerrains.data[index];
}

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
    fill("#ddd9");
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
            resetCamera(globalData.terraintab.editzone.camera);
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

    return isMouseReleased() && isHover;
}

function isMouseInRect(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

// interactive rect
function draggableRect(x, y, w, h, onDrag) {
    rect(x, y, w, h);

    if (isMouseInRect(x, y, w, h) && isMouseDragged() && mouseButton == LEFT) {
        onDrag && onDrag(mouseX - pmouseX, mouseY - pmouseY);
    }
}

// mouse event
function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}

function isMouseDragged() {
    return mouseIsPressed && (pmouseX != mouseX || pmouseY != mouseY);
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
    zoomTo(camera, camera.scale + (value > 0 ? -0.3 : 0.3));
}

// others
function preventRightClick(id) {
    document.getElementById(id).addEventListener(
        "contextmenu",
        function (evt) {
            evt.preventDefault();
        },
        false
    );
}

// files
// https://github.com/HoangTran0410/Paint-P5/blob/75a4f7ad5d0568b0d4bb1a5743a488191e38be53/Skech.js#L20
function getFileLocal(file) {
    if (file.type === "image") {
        return createImg(file.data).hide();
    } else {
        alert("Not an image file! , Please choose another file");
        return null;
    }
}
