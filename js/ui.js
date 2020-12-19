const UI = {
    // map tab
    tabMapBtn: ["Map", 5, 10, 100, 30],
    menuMapZone: [5, 40, 200, 555],
    mapEditorZone: [205, 40, 590, 555],
    newMapBtn: ["New map", 10, 60, 190, 25],
    importMapBtn: ["Import map...", 10, 90, 92.5, 25],
    exportMapBtn: ["Export map...", 107.5, 90, 92.5, 25],

    listTerrainsZoneTitle: "List terrains:",
    listTerrainsZone: [10, 235, 190, 355],

    // terrain tab
    tabTerrainBtn: ["Terrain", 105, 10, 100, 30],
    menuTerrainZone: [5, 40, 200, 555],
    terrainEditorZone: [205, 40, 590, 555],
    newTerrainBtn: ["New terrain", 10, 60, 190, 25],
    deleteTerrainBtn: ["Delete terrain", 10, 90, 190, 25, 0, 0, "red"],
    importTerrainBtn: ["Import terrain...", 10, 120, 92.5, 25],
    exportTerrainBtn: ["Export terrain...", 107.5, 120, 92.5, 25],

    removeImageTerrainBtn: ["Remove image", 10, 170, 92.5, 25, 0, 0, "red"],
    loadImageTerrainBtn: ["Load image...", 107.5, 170, 92.5, 25, 0, 0, "black"],
    resetCameraTerrainBtn: ["Reset camera", 10, 200, 92.5, 25],
    createRectBtn: ["Create rect", 107.5, 200, 92.5, 25, 0, 0, "green"],
    deleteSelectedRectBtn: ["Delete selected", 10, 230, 92.5, 25, 0, 0, "red"],
    editSelectedRectBtn: ["Edit selected", 107.5, 230, 92.5, 25],
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

    stroke("#555");
    strokeWeight(1);
    let zoneLeft = x;
    let zoneRight = zoneLeft + w;
    let zoneTop = y;
    let zoneBottom = zoneTop + h;
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
}
