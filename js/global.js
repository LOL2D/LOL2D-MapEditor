const MODE = {
    TERRAIN: "Terrain",
    MAP: "Map",
};

let globalData = {
    maptab: {
        scrollList: {
            itemIndex: 0,
            itemPerPage: 2,
        },
        listTerrains: TERRAIN_MAP.SUMMORNER_RIFT,
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

// ----------------------- helpers -----------------------

// image data
function getTerrainImageData() {
    return globalData.terraintab.editzone.imageData;
}

function setTerrainImageData(value) {
    globalData.terraintab.editzone.imageData = value;
}

// camera
function getTerrainCamera() {
    return globalData.terraintab.editzone.camera;
}

function getMapCamera() {
    return globalData.maptab.editzone.camera;
}

function resetTerrainCamera() {
    resetCamera(getTerrainCamera());
}

function resetMapCamera() {
    resetCamera(getMapCamera());
}

// drag event
function dragRect(rect) {
    const {
        x: delX,
        y: delY,
    } = globalData.terraintab.editzone.selectedRectMouseDelta;

    const camera = getTerrainCamera();
    rect.x = ~~((mouseX + delX - camera.x) / camera.scale);
    rect.y = ~~((mouseY + delY - camera.y) / camera.scale);
}

function dragCamera(camera) {
    camera.x += movedX;
    camera.y += movedY;
}

function dragTerrainCamera() {
    dragCamera(getTerrainCamera());
}

function dragMapCamera() {
    dragCamera(getMapCamera());
}

// get/set terrain
function getEditingTerrainIndex() {
    return globalData.terraintab.currentTerrainIndex;
}

function setEditingTerrainIndex(index) {
    globalData.terraintab.currentTerrainIndex = index;
}

function getEditingTerrain() {
    return getTerrainAtIndex(getEditingTerrainIndex());
}

function getTerrainAtIndex(index) {
    return globalData.maptab.listTerrains[index];
}

function removeTerrainAtIndex(index) {
    globalData.maptab.listTerrains.splice(index, 1);
}

function deleteEditingTerrain() {
    let index = getEditingTerrainIndex();
    let terrain = getTerrainAtIndex(index);
    let t = `Are you sure want to delete this terrain index: ${index}, name: ${terrain.name}`;

    if (window.confirm(t)) {
        removeTerrainAtIndex(index);
        setEditingTerrainIndex(-1);
    }
}

function exportEditingTerrainData() {
    let terrain = getEditingTerrain();
    let data = JSON.stringify(terrain);
    window.prompt("Terrain data: (Ctrl+C to copy)", data);
}

// get/set rect
function getSelectedRectIndex() {
    return globalData.terraintab.editzone.selectedRectIndex;
}

function setSelectedRectIndex(index) {
    globalData.terraintab.editzone.selectedRectIndex = index;
}

function getSelectedRect() {
    return getRectAtIndex(getSelectedRectIndex());
}

function getRectAtIndex(index) {
    return getEditingTerrain()?.rects[index];
}

function createRectForEditingTerrain() {
    let w = Number(window.prompt("width: "));
    let h = Number(window.prompt("height: "));

    if (w && h) {
        getEditingTerrain().rects.push({
            x: -w / 2,
            y: -h / 2,
            w,
            h,
        });
    } else {
        alert("Thêm không thành công, dữ liệu không đúng.");
    }
}

function editSelectedRect() {
    let selectedRect = getSelectedRect();

    let w = Number(window.prompt("width: ", selectedRect.w));
    let h = Number(window.prompt("height: ", selectedRect.h));

    if (w && h) {
        selectedRect.w = w;
        selectedRect.h = h;
    } else {
        alert("Sửa không thành công, dữ liệu không đúng.");
    }
}

function deleteSelectedRect() {
    if (window.confirm("Are you sure want to delete selected rect")) {
        // remove from array
        getEditingTerrain().rects.splice(getSelectedRectIndex(), 1);

        // reset selected index
        setSelectedRectIndex(-1);
    }
}

// list terrains
function getListTerrains() {
    return globalData.maptab.listTerrains;
}

function getScrollListTerrainsData() {
    return globalData.maptab.scrollList;
}

function isEndOfListTerrains() {
    let terrains = getListTerrains();
    const { itemIndex, itemPerPage } = getScrollListTerrainsData();

    return itemIndex >= terrains.length - itemPerPage;
}

function scollListTerrainItems(scrollValue) {
    const { itemIndex } = getScrollListTerrainsData();

    // scroll down
    if (scrollValue > 0) {
        if (!isEndOfListTerrains()) globalData.maptab.scrollList.itemIndex++;
    }
    // scoll up
    else if (itemIndex > 0) {
        globalData.maptab.scrollList.itemIndex--;
    }
}
