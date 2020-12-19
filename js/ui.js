const UI = {
    //canvas
    cnvWidth: 1000,
    cnvHeight: 700,

    // grid
    gridColor: "#5558",
    gridColorHightlight: "#9998",
    gridSizeRange: [50, 100],

    // map tab
    tabMapBtn: ["Map", 5, 10, 100, 30],
    menuMapZone: [5, 40, 200, 655],
    mapEditorZone: [205, 40, 790, 655],
    newMapBtn: ["New map +", 10, 60, 190, 25, 0, 0, "green"],
    importMapBtn: ["Import..", 10, 90, 92.5, 25, 0, 0, "black"],
    exportMapBtn: ["Export..", 107.5, 90, 92.5, 25, 0, 0, "black"],
    deleteSelectedTerrainBtn: ["Delete", 10, 120, 92.5, 25, 0, 0, "red"],
    editSelectedTerrainBtn: ["Edit", 107.5, 120, 92.5, 25],
    listTerrainsSroll: ["List terrains:", 10, 200, 190, 490],

    // terrain tab
    tabTerrainBtn: ["Terrain", 105, 10, 100, 30],
    menuTerrainZone: [5, 40, 200, 655],
    terrainEditorZone: [205, 40, 790, 655],
    newTerrainBtn: ["New terrain +", 10, 60, 190, 25, 0, 0, "green"],
    deleteTerrainBtn: ["Delete terrain", 10, 90, 190, 25, 0, 0, "red"],
    importTerrainBtn: ["Import..", 10, 120, 92.5, 25, 0, 0, "black"],
    exportTerrainBtn: ["Export..", 107.5, 120, 92.5, 25, 0, 0, "black"],

    removeImageTerrainBtn: ["Remove image", 10, 170, 92.5, 25, 0, 0, "red"],
    loadImageTerrainBtn: ["Load image..", 107.5, 170, 92.5, 25, 0, 0, "black"],
    resetCameraTerrainBtn: ["Reset camera", 10, 200, 92.5, 25, 0, 0, "blue"],
    newRectBtn: ["New rect +", 107.5, 200, 92.5, 25, 0, 0, "green"],
    deleteSelectedRectBtn: ["Delete rect", 10, 230, 92.5, 25, 0, 0, "red"],
    editSelectedRectBtn: ["Edit rect", 107.5, 230, 92.5, 25],
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

function drawGrid(camera, bound) {
    let x = bound[0];
    let y = bound[1];
    let w = bound[2];
    let h = bound[3];

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
            gridSize = ~~(gridSize / 2);
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

    // hightlight center line
    stroke(UI.gridColorHightlight);
    line(camera.x, top, camera.x, bottom);
    line(left, camera.y, right, camera.y);

    // draw info
    let gs = (gridSize / camera.scale).toFixed(2);
    fill("white");
    text(`Scale: ${camera.scale.toFixed(2)}`, x, y + h - 50, 100, 30);
    text(`Grid size: ${gs}px`, x, y + h - 30, 150, 30);
}
