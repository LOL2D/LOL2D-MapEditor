let mode = MODE.MAP;
let stats;

function setup() {
    createCanvas(800, 600).id("game-canvas");
    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    preventRightClick("game-canvas");

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    resetTerrainCamera();
    resetMapCamera();
}

function draw() {
    stats.begin();

    background(30);

    // body
    if (mode == MODE.TERRAIN) {
        drawModeTerrain();
        drawHeader("Terrain Editor");
    } else {
        drawModeMap();
        drawHeader("Map Editor");
    }

    // input
    runInput();

    stats.end();
}

// --------------- draw methods ---------------
function drawHeader(t) {
    fill(30);
    rect(0, 0, width, 40);

    if (button(...UI.tabTerrainBtn, mode == MODE.TERRAIN)) {
        mode = MODE.TERRAIN;
    }
    if (button(...UI.tabMapBtn, mode == MODE.MAP)) {
        mode = MODE.MAP;
    }

    fill("white");
    text(t, width / 2 + UI.menuTerrainZone[2] / 2, 20);
}

// map editor
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

    if (button(...UI.importMapBtn)) {
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

function drawEditMapZone(x, y, w, h) {
    fill("#222");
    rect(x, y, w, h);
}

// terrain editor
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

    if (getEditingTerrain()) {
        if (button(...UI.deleteTerrainBtn)) {
            deleteEditingTerrainConfirm();
        }

        if (button(...UI.importTerrainBtn)) {
            console.log("import");
        }

        if (button(...UI.exportTerrainBtn)) {
            exportEditingTerrainData();
        }

        if (button(...UI.removeImageTerrainBtn)) {
            setTerrainImageData(null);
        }

        if (button(...UI.loadImageTerrainBtn)) {
            getLocalFile((file) => {
                setTerrainImageData(createImageFromFile(file));
            });
        }

        if (button(...UI.resetCameraTerrainBtn)) {
            resetTerrainCamera();
        }

        if (button(...UI.createRectBtn)) {
            createRectForEditingTerrain();
        }

        if (getSelectedRect()) {
            if (button(...UI.deleteSelectedRectBtn)) {
                deleteSelectedRect();
            }

            if (button(...UI.editSelectedRectBtn)) {
                editSelectedRect();
            }
        }
    }
}

function drawEditTerrainZone(x, y, w, h) {
    fill("#222");
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

    let camera = getTerrainCamera();

    // grid
    drawGrid(camera, UI.terrainEditorZone);

    // image data
    const imageData = getTerrainImageData();
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
        `Terrain: ${getEditingTerrainIndex()} - ${terrain.name}`,
        x + w / 2,
        y + 10
    );
}

// ---------- helpers ----------

// scroll list
function listScrollTerrains(x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);

    // data
    let terrains = getListTerrains();
    const { itemIndex, itemPerPage } = getScrollListTerrainsData();

    // buttons
    if (button("Scroll Up ↑", x, y, w, 20, itemIndex == 0)) {
        scollListTerrainItems(-1);
    }

    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfListTerrains())) {
        scollListTerrainItems(1);
    }

    // list terrains
    let itemW = w;
    let itemH = (h - 40) / itemPerPage;

    for (let i = itemIndex; i < itemIndex + itemPerPage; i++) {
        if (terrains[i]) {
            let itemX = x;
            let itemY = y + (i - itemIndex) * itemH + 20;

            renderTerrainItem(i, terrains[i], itemX, itemY, itemW, itemH);
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

    // title + size
    fill("white");
    noStroke();

    let title = index + " - " + terrain.name;
    text(title, x + textWidth(title) / 2 + 10, y + 10);

    let size = W + " x " + H;
    text(size, w - textWidth(size) / 2, y + 10);

    // show buttons on hover list item
    if (isMouseInRect(x, y, w, h)) {
        if (button("Delete", x + 1, y + h - 20, 55, 20, 0, "#9995", "red")) {
            deleteTerrainAtIndexConfirm(index);
        }
        if (button("Edit", x + 56, y + h - 20, 50, 20, false, "#9995")) {
            mode = MODE.TERRAIN;
            editTerrainAtIndex(index);
        }

        if (button("Add to map →", x + 106, y + h - 20, 83, 20, 0, "#9995")) {
            console.log("add");
        }
    }
}
