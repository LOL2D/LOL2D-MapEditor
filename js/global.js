const MODE = {
    TERRAIN: "Terrain",
    MAP: "Map",
};

let globalData = {
    maptab: {
        scrollList: {
            itemIndex: 0,
            itemPerPage: 3,
        },
        listTerrains: TERRAIN_MAP.SUMMORNER_RIFT,
        editzone: {
            camera: { x: 0, y: 0, scale: 1, xTo: 0, yTo: 0, scaleTo: 1 },
            selectedTerrainIndex: -1,
            selectedTerrainMouseDelta: { x: 0, y: 0 },
        },
    },
    terraintab: {
        currentTerrainIndex: -1,
        editzone: {
            imageData: null,
            camera: { x: 0, y: 0, scale: 1, xTo: 0, yTo: 0, scaleTo: 1 },
            selectedRectIndex: -1,
            selectedRectMouseDelta: { x: 0, y: 0 },
        },
    },
};

// ----------------------- image data -----------------------
function getTerrainImageData() {
    return globalData.terraintab.editzone.imageData;
}

function setTerrainImageData(value) {
    globalData.terraintab.editzone.imageData = value;
}

// ----------------------- camera -----------------------
function runCamera() {
    lerpCamera(getTerrainCamera());
    lerpCamera(getMapCamera());
}

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

function locateTerrainIndex(index) {
    let terrain = getTerrainAtIndex(index);
    let camera = getMapCamera();

    camera.scaleTo = 1;
    camera.xTo = terrain.position.x;
    camera.yTo = terrain.position.y;

    setSelectedTerrainIndex(index);
}

// ----------------------- drag event -----------------------
function dragRect(rect) {
    const { x: delX, y: delY } = getSelectedRectMouseDelta();

    const camera = getTerrainCamera();
    rect.x = ~~((mouseX + delX - camera.x) / camera.scale);
    rect.y = ~~((mouseY + delY - camera.y) / camera.scale);
}

function dragTerrain(terrain) {
    const { x: delX, y: delY } = getSelectedTerrainMouseDelta();

    const camera = getMapCamera();
    terrain.position.x = ~~((mouseX + delX - camera.x) / camera.scale);
    terrain.position.y = ~~((mouseY + delY - camera.y) / camera.scale);
}

function dragCamera(camera) {
    camera.xTo -= movedX / camera.scale;
    camera.yTo -= movedY / camera.scale;
}

function dragTerrainCamera() {
    dragCamera(getTerrainCamera());
}

function dragMapCamera() {
    dragCamera(getMapCamera());
}

// ----------------------- map -----------------------
function newMap() {
    Swal.fire({
        title: "Create new map?",
        html:
            "<u>Mọi terrains</u> sẽ bị <u>XÓA</u>. Hãy <u>Export</u> và lưu dữ liệu trước khi tạo map mới.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Create now",
        confirmButtonColor: "red",
    }).then((result) => {
        if (result.isConfirmed) {
            globalData.maptab.listTerrains = [];
            resetCamera(getMapCamera());
        }
    });
}

function getSelectedTerrain() {
    return globalData.maptab.listTerrains[getSelectedTerrainIndex()];
}

function getSelectedTerrainIndex() {
    return globalData.maptab.editzone.selectedTerrainIndex;
}

function setSelectedTerrainIndex(index) {
    globalData.maptab.editzone.selectedTerrainIndex = index;
}

function getSelectedTerrainMouseDelta() {
    return globalData.maptab.editzone.selectedTerrainMouseDelta;
}

function setSelectedTerrainMouseDelta(x, y) {
    globalData.maptab.editzone.selectedTerrainMouseDelta = { x, y };
}

function getMapData() {
    return globalData.maptab.listTerrains;
}

function setMapData() {}

function exportMap(format) {
    let map = getListTerrains();
    let data = format ? JSON.stringify(map, null, 4) : JSON.stringify(map);

    Swal.fire({
        title: "Map data" + (format ? " formatted" : ""),
        icon: "success",
        html: `
            <p>
                Select all and press Ctrl+C to copy or click 
                <button onClick="copyToClipboard('mapdata')">Copy</button>
            </p> 
            <textarea id="mapdata" style="width: 100%; min-height: 350px">${data}</textarea>
        `,
        focusConfirm: false,
        confirmButtonText: "Auto Format!",
        showCancelButton: true,
        cancelButtonText: "Close",
    }).then((result) => {
        if (result.isConfirmed) {
            exportMap(true);
        }
    });
}

function editTerrainAtIndex(index) {
    resetTerrainCamera();
    setEditingTerrainIndex(index);
}

// ----------------------- terrain -----------------------
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

function newTerrain(successCallback) {
    Swal.fire({
        title: "Create new terrain",
        text: "Name of terrain:",
        input: "text",
        showCancelButton: true,
        confirmButtonText: `Create`,
        denyButtonText: `Cancel`,
    }).then((result) => {
        if (result.isConfirmed) {
            // add to begin of array
            globalData.maptab.listTerrains.unshift({
                name: result.value,
                position: { x: 0, y: 0 },
                rects: [],
            });

            resetCamera(getTerrainCamera());
            setEditingTerrainIndex(0);
            successCallback && successCallback();
        }
    });
}

function cloneTerrainAtIndex(index) {
    let terrain = { ...getTerrainAtIndex(index) };

    Swal.fire({
        title: `Clone terrain "${terrain.name}"`,
        text: "Name of new terrain:",
        input: "text",
        inputValue: terrain.name,
        showCancelButton: true,
        confirmButtonText: `Clone`,
        denyButtonText: `Cancel`,
    }).then((result) => {
        if (result.isConfirmed) {
            terrain.name = result.value;
            terrain.position.x = 0;
            terrain.position.y = 0;

            globalData.maptab.listTerrains.splice(index + 1, 0, terrain);
            setEditingTerrainIndex(index + 1);
            locateTerrainIndex(index + 1);
        }
    });
}

function cloneEditingTerrain() {
    cloneTerrainAtIndex(getEditingTerrainIndex());
}

function renameTerrainAtIndex(index) {
    let terrain = getTerrainAtIndex(index);

    Swal.fire({
        title: "Rename terrain",
        input: "text",
        inputLabel: "New name",
        inputValue: terrain.name,
        showCancelButton: true,
        confirmButtonText: "Rename it",
    }).then((result) => {
        if (result.isConfirmed) {
            terrain.name = result.value;
        }
    });
}

function renameEditingTerrain() {
    renameTerrainAtIndex(getEditingTerrainIndex());
}

function deleteTerrainAtIndexConfirm(index) {
    let terrain = getTerrainAtIndex(index);

    Swal.fire({
        title: `Delele terrain "${terrain.name}"?`,
        text: `Are you sure want to delete this terrain? \n index: ${index}, name: ${terrain.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            globalData.maptab.listTerrains.splice(index, 1);
            setEditingTerrainIndex(-1);
        }
    });
}

function deleteEditingTerrainConfirm() {
    let index = getEditingTerrainIndex();
    deleteTerrainAtIndexConfirm(index);
}

function exportEditingTerrainData(format) {
    let terrain = getEditingTerrain();
    let data = format
        ? JSON.stringify(terrain, null, 4)
        : JSON.stringify(terrain);

    Swal.fire({
        title: "Terrain data" + (format ? " formatted" : ""),
        icon: "success",
        html: `
            <p>
                Select all and press Ctrl+C to copy or click 
                <button onClick="copyToClipboard('mapdata')">Copy</button>
            </p> 
            <textarea id="mapdata" style="width: 100%; min-height: 350px">${data}</textarea>
        `,
        focusConfirm: false,
        confirmButtonText: "Auto Format!",
        showCancelButton: true,
        cancelButtonText: "Close",
    }).then((result) => {
        if (result.isConfirmed) {
            exportEditingTerrainData(true);
        }
    });
}

// ----------------------- rect -----------------------
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

function getSelectedRectMouseDelta() {
    return globalData.terraintab.editzone.selectedRectMouseDelta;
}

function setSelectedRectMouseDelta(x, y) {
    globalData.terraintab.editzone.selectedRectMouseDelta = { x, y };
}

function newRect() {
    Swal.fire({
        title: "Create new rect",
        input: "number",
        inputLabel: "Width",
        inputValue: 50,
        showCancelButton: true,
        confirmButtonText: `Next`,
        denyButtonText: `Cancel`,
    }).then((resultW) => {
        if (resultW.isConfirmed) {
            Swal.fire({
                title: "Create new rect",
                input: "number",
                inputLabel: "Height",
                inputValue: 50,
                showCancelButton: true,
                confirmButtonText: `Create`,
                denyButtonText: `Cancel`,
            }).then((resultH) => {
                if (resultH.isConfirmed) {
                    let w = Number(resultW.value) || 50;
                    let h = Number(resultH.value) || 50;

                    getEditingTerrain().rects.push({
                        x: -w / 2,
                        y: -h / 2,
                        w,
                        h,
                    });
                }
            });
        }
    });
}

function editSelectedRect() {
    let selectedRect = getSelectedRect();

    Swal.fire({
        title: "Edit selected rect",
        input: "number",
        inputLabel: "Width",
        inputValue: selectedRect.w,
        showCancelButton: true,
        confirmButtonText: `Next`,
        denyButtonText: `Cancel`,
    }).then((resultW) => {
        if (resultW.isConfirmed) {
            Swal.fire({
                title: "Edit selected rect",
                input: "number",
                inputLabel: "Height",
                inputValue: selectedRect.h,
                showCancelButton: true,
                confirmButtonText: `Save`,
                denyButtonText: `Cancel`,
            }).then((resultH) => {
                if (resultH.isConfirmed) {
                    let w = Number(resultW.value) || 50;
                    let h = Number(resultH.value) || 50;

                    selectedRect.w = w;
                    selectedRect.h = h;
                }
            });
        }
    });
}

function deleteSelectedRect() {
    Swal.fire({
        title: "Delele rect?",
        text: `Are you sure want to delete selected rect?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            // remove from array
            getEditingTerrain().rects.splice(getSelectedRectIndex(), 1);
            // reset selected index
            setSelectedRectIndex(-1);
        }
    });
}

// ----------------------- scroll list terrains -----------------------
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
