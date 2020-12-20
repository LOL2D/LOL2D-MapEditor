let mode = MODE.MAP;
let isShowMenu = true;
let stats;

function setup() {
    createCanvas(UI.cnvWidth, UI.cnvHeight).id("game-canvas");
    textAlign(CENTER, CENTER);
    textFont("Consolas", 13);
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

    if (mode == MODE.TERRAIN) {
        drawEditTerrainZone(...UI.terrainEditorZone);
        isShowMenu && drawMenuTerrain();
        drawHeader("Terrain Editor - " + getEditingTerrain()?.name);
    } else {
        drawEditMapZone(...UI.mapEditorZone);
        isShowMenu && drawMenuMap();
        drawHeader("Map Editor");
    }

    !isShowMenu && drawAuthorInfo();

    // input
    runInput();
    runCamera();

    stats.end();
}

// --------------- draw methods ----------------
function drawHeader(t) {
    fill(30);
    rect(0, 0, width, 40);

    if (button(...UI.tabTerrainBtn, mode == MODE.TERRAIN)) {
        mode = MODE.TERRAIN;
    }
    if (button(...UI.tabMapBtn, mode == MODE.MAP)) {
        mode = MODE.MAP;
    }
    if (button(isShowMenu ? "↑" : "↓", ...UI.hideMenuBtnZone)) {
        isShowMenu = !isShowMenu;
    }

    fill("white");
    text(t, width / 2 + UI.menuTerrainZone[2] / 2, 20);
}

function drawAuthorInfo() {
    fill("#333");
    rect(...UI.menuMapZone);

    fill("white");
    textAlign(LEFT);
    text(
        `Author: Hoang Tran\ngithub.com/hoangtran0410\nCopy right @2020`,
        ...UI.author
    );
    textAlign(CENTER);
}

// =============================================
// ================= map editor ================
// =============================================
function drawMenuMap() {
    fill("#333");
    rect(...UI.menuMapZone);

    // buttons
    if (button(...UI.newMapBtn)) {
        newMap();
    }

    if (button(...UI.importMapBtn)) {
        console.log("import");
    }

    if (button(...UI.exportMapBtn)) {
        exportMap();
    }

    let selectedTerrainIndex = getSelectedTerrainIndex();
    if (selectedTerrainIndex >= 0) {
        if (button(...UI.deleteSelectedTerrainBtn)) {
            deleteTerrainAtIndexConfirm(selectedTerrainIndex);
        }

        if (button(...UI.editSelectedTerrainBtn)) {
            mode = MODE.TERRAIN;
            setEditingTerrainIndex(selectedTerrainIndex);
        }
    }

    // terrains zone
    listScrollTerrains(...UI.listTerrainsSroll);
}

function drawEditMapZone(x, y, w, h) {
    fill("#222");
    rect(x, y, w, h);

    let mapData = getMapData();

    if (!mapData) {
        fill("white");
        text("There is no map data.", x + w / 2, y + h / 2);
        return;
    }

    let camera = getMapCamera();

    // grid
    drawGrid(camera, UI.mapEditorZone);

    // flags
    let isHoveredTerrain = false;
    let isSelectTerrain = false;

    // rects
    fill("#ddd9");
    strokeWeight(1);

    for (let i = 0; i < mapData.length; i++) {
        let terrain = mapData[i];

        // flags
        let isHoveredRect = false;

        // check hover and select
        for (let j = 0; j < terrain.rects.length; j++) {
            let r = terrain.rects[j];

            let rx = (terrain.position.x + r.x) * camera.scale + camera.x;
            let ry = (terrain.position.y + r.y) * camera.scale + camera.y;
            let rw = r.w * camera.scale;
            let rh = r.h * camera.scale;

            // hight light on hover
            if (!isHoveredRect && isMouseInRect(rx, ry, rw, rh)) {
                isHoveredRect = true;
            }

            // select rect -> selecte terrain
            if (isMousePressed() && mouseButton == LEFT) {
                if (isMouseInRect(rx, ry, rw, rh)) {
                    setSelectedTerrainIndex(i);
                    setSelectedTerrainMouseDelta(
                        terrain.position.x * camera.scale + camera.x - mouseX,
                        terrain.position.y * camera.scale + camera.y - mouseY
                    );

                    isSelectTerrain = true;
                }
            }
        }

        // hover
        if (!isHoveredTerrain && isHoveredRect) {
            isHoveredTerrain = true;
            stroke("red");
        } else {
            stroke("white");
        }

        // hight light selected rect
        if (getSelectedTerrainIndex() == i) {
            stroke("yellow");
            strokeWeight(2);
        } else {
            strokeWeight(1);
        }

        // draw rects
        for (let j = 0; j < terrain.rects.length; j++) {
            let r = terrain.rects[j];

            let rx = (terrain.position.x + r.x) * camera.scale + camera.x;
            let ry = (terrain.position.y + r.y) * camera.scale + camera.y;
            let rw = r.w * camera.scale;
            let rh = r.h * camera.scale;

            // draw rect
            rect(rx, ry, rw, rh);
        }
    }

    // remove selected index on click outside rects
    if (!isSelectTerrain && isMousePressed() && isMouseInRect(x, y, w, h)) {
        setSelectedTerrainIndex(-1);
    }

    // center point
    fill("red");
    noStroke();
    circle(camera.x, camera.y, 5);

    // terrain name
    let selectedIndex = getSelectedTerrainIndex();
    if (selectedIndex >= 0) {
        fill("white");
        noStroke();
        text(
            `Terrain: ${selectedIndex} - ${getSelectedTerrain().name}`,
            x + w / 2,
            y + 10
        );
    }
}

function listScrollTerrains(title, x, y, w, h) {
    // background
    fill("#111");
    rect(x, y, w, h);

    // data
    let terrains = getListTerrains();
    const { itemIndex, itemPerPage } = getScrollListTerrainsData();

    // title
    let t = title + `(${terrains.length})`;
    fill("white");
    text(t, x + textWidth(t) / 2, y - 15);

    // buttons
    if (button("New +", x + w - 50, y - 30, 50, 25, 0, 0, "green")) {
        newTerrain(() => {
            mode = MODE.TERRAIN;
        });
    }
    if (button("Scroll Up ↑", x, y, w, 20, itemIndex == 0)) {
        scollListTerrainItems(-1);
    }

    if (button("Scroll Down ↓", x, y + h - 20, w, 20, isEndOfListTerrains())) {
        scollListTerrainItems(1);
    }

    // selected arrow hint
    let selectedTerrainIndex = getSelectedTerrainIndex();
    if (selectedTerrainIndex >= 0) {
        if (selectedTerrainIndex < itemIndex) {
            fill("yellow");
            text("selected ↑", x + w - 40, y + 30);
        } else if (selectedTerrainIndex >= itemIndex + itemPerPage) {
            fill("yellow");
            text("selected ↓", x + w - 40, y + h - 30);
        }
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
    let selectedTerrainIndex = getSelectedTerrainIndex();

    // background
    noFill();
    if (selectedTerrainIndex == index) {
        stroke("yellow");
        strokeWeight(2);
    } else {
        stroke("gray");
        strokeWeight(1);
    }
    rect(x, y, w, h);

    // scale up/down to fit item container
    const { scaleRatio, W, H } = calculateFitBound(
        w,
        h,
        getBound(terrain.rects),
        true
    );

    // draw shape
    fill("#ddd9");
    stroke("white");
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
    text(title, x + textWidth(title) / 2 + 5, y + 10);

    // on hover list item
    if (isMouseInRect(x, y, w, h)) {
        // show size
        let size = W + " x " + H;
        text(size, x + textWidth(size) / 2 + 5, y + 30);

        // show buttons
        let btnW = w / 3;

        if (button("Clone", x, y + h - 40, btnW, 20, 0, "#9995", "green")) {
            cloneTerrainAtIndex(index);
        }

        if (button("Delete", x, y + h - 20, btnW, 20, 0, "#9995", "red")) {
            deleteTerrainAtIndexConfirm(index);
        }
        if (button("Edit", x + btnW, y + h - 20, btnW, 20, 0, "#9995")) {
            mode = MODE.TERRAIN;
            editTerrainAtIndex(index);
        }

        if (button("Locate", x + btnW * 2, y + h - 20, btnW, 20, 0, "#9995")) {
            locateTerrainIndex(index);
        }
    }
}

// =============================================
// =============== terrain editor ==============
// =============================================
function drawMenuTerrain() {
    fill("#333");
    noStroke();
    rect(...UI.menuTerrainZone);

    // buttons
    if (button(...UI.newTerrainBtn)) {
        newTerrain();
    }

    if (getEditingTerrain()) {
        if (button(...UI.cloneTerrainBtn)) {
            cloneEditingTerrain();
        }

        if (button(...UI.deleteTerrainBtn)) {
            deleteEditingTerrainConfirm();
        }

        if (button(...UI.renameTerrainBtn)) {
            renameEditingTerrain();
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

        if (button(...UI.newRectBtn)) {
            newRect();
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

    // grid
    drawGrid(camera, UI.terrainEditorZone);

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
        if (getSelectedRectIndex() == i) {
            stroke("yellow");
            strokeWeight(2);
        } else {
            strokeWeight(1);
        }

        // select rect
        if (isMousePressed() && mouseButton == LEFT) {
            if (isMouseInRect(rx, ry, rw, rh)) {
                setSelectedRectIndex(i);
                setSelectedRectMouseDelta(rx - mouseX, ry - mouseY);

                isSelectRect = true;
            }
        }

        // draw rect
        rect(rx, ry, rw, rh);
    }

    // remove selected index on click outside rects
    if (!isSelectRect && isMousePressed() && isMouseInRect(x, y, w, h)) {
        setSelectedRectIndex(-1);
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
