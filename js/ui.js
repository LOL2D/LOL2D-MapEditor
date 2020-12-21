const UI = {
    //canvas
    cnvWidth: 1000,
    cnvHeight: 700,

    // grid
    gridColor: "#5558",
    gridColorHightlight: "#9998",
    gridSizeRange: [50, 100],

    // tabs
    hideMenuBtnZone: [210, 10, 30, 30],
    saveTerrainToFireBaseBtn: ["Save Terrain", 245, 10, 140, 30, 0, 0, "green"],
    savePositionToFireBaseBtn: ["Save Position", 245, 10, 140, 30, 0, 0, "green"],
    userNameZone: [815, 5, 100, 30],
    onlineCountZone: [920, 5, 35, 30],
    howToUserBtn: ["?", 960, 5, 35, 30],
    author: [10, 75],

    // map tab
    tabMapBtn: ["Map", 5, 10, 100, 30],
    menuMapZone: [5, 40, 200, 655],
    mapEditorZone: [205, 40, 790, 655],
    changeMapSizeBtn: ["Change size", 10, 60, 92.5, 25],
    newMapBtn: ["New map +", 107.5, 60, 92.5, 25, 0, 0, "green"],
    importMapBtn: ["Import..", 10, 90, 92.5, 25, 0, 0, "black"],
    exportMapBtn: ["Export..", 107.5, 90, 92.5, 25, 0, 0, "black"],
    deleteSelectedTerrainBtn: ["Delete", 10, 120, 92.5, 25, 0, 0, "red"],
    editSelectedTerrainBtn: ["Edit", 107.5, 120, 92.5, 25],
    resetCameraMapBtn: ["Reset camera", 10, 150, 190, 25, 0, 0, "blue"],
    listTerrainsSroll: ["List terrains:", 10, 230, 190, 460],

    // terrain tab
    tabTerrainBtn: ["Terrain", 105, 10, 100, 30],
    menuTerrainZone: [5, 40, 200, 655],
    terrainEditorZone: [205, 40, 790, 655],
    newTerrainBtn: ["New terrain +", 10, 60, 190, 25, 0, 0, "green"],
    cloneTerrainBtn: ["Clone terrain", 10, 90, 190, 25, 0, 0, "green"],
    deleteTerrainBtn: ["Delete", 10, 120, 92.5, 25, 0, 0, "red"],
    renameTerrainBtn: ["Rename", 107.5, 120, 92.5, 25],
    removeImageTerrainBtn: ["Remove image", 10, 150, 92.5, 25, 0, 0, "red"],
    loadImageTerrainBtn: ["Load image..", 107.5, 150, 92.5, 25, 0, 0, "black"],
    exportTerrainBtn: ["Export..", 10, 180, 190, 25, 0, 0, "black"],

    resetCameraTerrainBtn: ["Reset camera", 10, 230, 190, 25, 0, 0, "blue"],
    newRectBtn: ["New rect +", 10, 280, 190, 25, 0, 0, "green"],
    importTerrainBtn: ["Import..", 10, 310, 190, 25, 0, 0, "black"],
    deleteSelectedRectBtn: ["Delete rect", 10, 340, 92.5, 25, 0, 0, "red"],
    editSelectedRectBtn: ["Edit rect", 107.5, 340, 92.5, 25],
};

// button
function button(t, x, y, w, h, isActive, bgColor, hoverColor, activeColor) {
    let isHover = isMouseInRect(x, y, w, h);

    // color
    if (isActive) {
        fill(activeColor || "#333");
    } else if (isHover) {
        fill(hoverColor || "#999");
    } else {
        fill(bgColor || "#555");
    }

    // background
    noStroke();
    rect(x, y, w, h);

    // text
    fill(isActive ? "gray" : "white");
    text(t, x + w / 2, y + h / 2);

    return isMouseReleased() && isHover;
}

function isMouseInRect(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function drawGrid(camera, edgeBound, mapSize) {
    let x = edgeBound[0];
    let y = edgeBound[1];
    let w = edgeBound[2];
    let h = edgeBound[3];

    let left = x;
    let right = left + w;
    let top = y;
    let bottom = top + h;
    let gridSize = 50 * camera.scale;

    if (gridSize < UI.gridSizeRange[0]) {
        while (gridSize < UI.gridSizeRange[0]) {
            gridSize *= 2;
        }
    } else if (gridSize > UI.gridSizeRange[1]) {
        while (gridSize > UI.gridSizeRange[1]) {
            gridSize = gridSize / 2;
        }
    }

    // draw grid
    strokeWeight(1);
    stroke(UI.gridColor);

    for (let i = camera.x; i > left; i -= gridSize) {
        line(i, top, i, bottom);
    }

    for (let i = camera.x; i < right; i += gridSize) {
        line(i, top, i, bottom);
    }

    for (let i = camera.y; i > top; i -= gridSize) {
        line(left, i, right, i);
    }

    for (let i = camera.y; i < bottom; i += gridSize) {
        line(left, i, right, i);
    }

    // draw map size
    if (mapSize) {
        let mw = mapSize[0] * camera.scale;
        let mh = mapSize[1] * camera.scale;

        noFill();
        stroke("red");
        rect(camera.x, camera.y, mw, mh);
    }

    // hightlight center line
    stroke(UI.gridColorHightlight);
    line(camera.x, top, camera.x, bottom);
    line(left, camera.y, right, camera.y);

    // hightlight center screen point
    noFill();
    circle(width / 2, height / 2, 10);

    // draw info
    let gs = (gridSize / camera.scale).toFixed(2);

    let camx = ~~((width / 2 - camera.x) / camera.scale);
    let camy = ~~((height / 2 - camera.y) / camera.scale);

    fill("white");
    textAlign(LEFT);
    text(`Camera: ${camx} ${camy}`, x + 5, y + h - 70, 150, 30);
    text(`Scale: ${camera.scale.toFixed(2)}`, x + 5, y + h - 50, 100, 30);
    text(`Grid size: ${gs}px`, x + 5, y + h - 30, 150, 30);
    textAlign(CENTER);
}
