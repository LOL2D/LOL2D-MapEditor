const MODE = {
    TERRAIN: "Terrain",
    MAP: "Map",
};

let globalData = {
    isFirebaseMode: false,
    online: {},
    userName: null,
    maptab: {
        scrollList: {
            itemIndex: 0,
            itemPerPage: 3,
        },
        listTerrains: [],
        editzone: {
            camera: { x: 0, y: 0, scale: 1, xTo: 0, yTo: 0, scaleTo: 1 },
            selectedTerrainIndex: -1,
            selectedTerrainMouseDelta: { x: 0, y: 0 },
            mapsize: [9600, 9600],
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

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

// ----------------------- Online ---------------------------
function getUserName() {
    return globalData.userName;
}
function setUserName(userName) {
    globalData.userName = userName;
}
function isUserNameExist(username) {
    return globalData.online[username] != null;
}

function getOnlineUsers() {
    return globalData.online;
}
function setOnlineUsers(users) {
    console.log(users);
    globalData.online = users;
}

window.addEventListener("beforeunload", function (e) {
    removeFirebaseOnline(getUserName());
});

// ----------------------- firebase --------------------------
function getFirebaseMode() {
    return globalData.isFirebaseMode;
}
function setFirebaseMode(value) {
    globalData.isFirebaseMode = value;
}
function chooseMode() {
    setPaused(true);
    Swal.fire({
        title: "Choose mode",
        html: `
        <p style="text-align: left;">
            <b>+ Normal</b>: Play zone<br/>
            <b>+ Firebase</b>: Connect to firebase, create map for 
                <a target="_blank" href="https://github.com/LOL2D/LOL2D-Core">LOL2D-Core</a>
        </p>`,
        showCancelButton: true,
        cancelButtonText: "Firebase",
        confirmButtonText: "Normal",
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        if (result.isConfirmed) {
            // using normal mode
            loadJSON("map/sample.json", (data) => {
                setMapData(data);
            });
            setFirebaseMode(false);
            setPaused(false);
        } else {
            // using fire base
            usingFirebaseMode();
        }
    });
}

function usingFirebaseMode() {
    let username =
        localStorageGetUsername() ||
        "Guest-" + (Math.random() * 10000).toFixed(0);

    Swal.fire({
        title: "Your Name",
        text: "To make other user can see your work",
        input: "text",
        inputValue: username,
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((resultName) => {
        if (resultName.isConfirmed) {
            setPaused(false);
            initFireBase();

            listenToFireBase(
                // data
                (data) => {
                    setMapData(data);
                },
                //online users
                (users) => {
                    setOnlineUsers(users);
                }
            );

            // lưu tên thật vào localstorage
            localstorageSaveUserName(resultName.value);

            // tạo tên mới có thêm random id (tránh trùng  tên)
            let name = resultName.value + (Math.random() * 10000).toFixed(0);
            setUserName(name);
            updateFirebaseOnline(name, -1);

            setFirebaseMode(true);
        } else {
            // chọn lại mode
            chooseMode();
        }
    });
}

function pushEdittedTerrainDataToFirebase() {
    let index = getEditingTerrainIndex();
    if (index >= 0) {
        updateFirebaseTerrain(index, getEditingTerrain());
    } else {
        Toast.fire({
            icon: "info",
            title: "Chưa Edit Terrain nào để Save",
        });
    }
}

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

function viewAllMap() {
    let camera = getMapCamera();
    let mapSize = getMapSize();

    camera.scaleTo = min(width, height) / max(mapSize[0], mapSize[1]);
    camera.xTo = 250;
    camera.yTo = 0;
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
    camera.xTo = -terrain.position.x + width / 2;
    camera.yTo = -terrain.position.y + height / 2;

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
    camera.xTo += movedX;
    camera.yTo += movedY;
}

function dragTerrainCamera() {
    dragCamera(getTerrainCamera());
}

function dragMapCamera() {
    dragCamera(getMapCamera());
}

// ----------------------- map -----------------------
function newMap() {
    setPaused(true);
    Swal.mixin({
        title: "Create new map",
        showCancelButton: true,
        progressSteps: ["1", "2", "3"],
    })
        .queue([
            {
                html: `All terrains will be <b>REMOVED</b>.<br/> 
                    Please <b>EXPORT</b> and SAVE Map Data<br/>
                    <b>BEFORE</b> create new one.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "I understood!",
                confirmButtonColor: "red",
            },
            {
                text: "Map width?",
                confirmButtonText: "Next &rarr;",
                input: "number",
                inputValue: 1000,
            },
            {
                text: "Map height?",
                confirmButtonText: "Create now",
                input: "number",
                inputValue: 1000,
            },
        ])
        .then((resultSize) => {
            setPaused(false);
            if (resultSize.value) {
                setMapSize(
                    Number(resultSize.value[0]),
                    Number(resultSize.value[1])
                );
                setMapData([]);
            }
        });
}

function changeMapSize() {
    let currentSize = getMapSize();

    setPaused(true);
    Swal.mixin({
        title: "Change map size",
        input: "number",
        inputValue: 1000,
        showCancelButton: true,
        progressSteps: ["1", "2"],
    })
        .queue([
            {
                text: "Map width?",
                inputValue: currentSize[0],
                confirmButtonText: "Next &rarr;",
            },
            {
                text: "Map height?",
                inputValue: currentSize[1],
                confirmButtonText: "Save",
            },
        ])
        .then((resultSize) => {
            setPaused(false);
            if (resultSize.value) {
                setMapSize(
                    Number(resultSize.value[0]),
                    Number(resultSize.value[1])
                );
            }
        });
}

function getMapSize() {
    return globalData.maptab.editzone.mapsize;
}

function setMapSize(w, h) {
    globalData.maptab.editzone.mapsize = [w, h];
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

function setMapData(value) {
    globalData.maptab.listTerrains = value;
}

function processJsonMapData(datastr) {
    try {
        let data = JSON.parse(datastr);

        Swal.fire({
            title: `Import ${data.length} terrains?`,
            text: "Choose import mode. Override or Add to exist map?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Add`,
            denyButtonText: `Override`,
        }).then((resultMode) => {
            if (resultMode.isDenied) {
                Swal.fire({
                    title: "Override map data?",
                    html: `All current terrains will be <b>REMOVED</b>.<br/> 
                        Please <b>EXPORT</b> and SAVE Map Data<br/>
                        <b>BEFORE</b> override.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "I understood!",
                    confirmButtonColor: "red",
                }).then((resultConfirmOverride) => {
                    if (resultConfirmOverride.isConfirmed) {
                        setMapData(data);
                    }
                });
            } else if (resultMode.isConfirmed) {
                setMapData([...getMapData(), ...data]);
            }
        });
    } catch (e) {
        Swal.fire({
            title: "Error",
            html: "Failed to import json data<br/>" + e,
            icon: "error",
        });
    }
}

async function importMapFile() {
    const { value: file } = await Swal.fire({
        title: "Select json file",
        input: "file",
        inputAttributes: {
            accept: ".json",
            "aria-label": "Upload your json file",
        },
    });

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            importMap(e.target.result);
        };
        reader.readAsText(file);
    }
}

function importMap(json = "") {
    setPaused(true);
    Swal.fire({
        title: "Import JSON map data",
        input: "textarea",
        inputValue: json,
        inputLabel: "JSON data (array of terrain)",
        confirmButtonText: "Import",
        showCancelButton: true,
        footer: `<button onClick="importMapFile()">
                    Import file?
                </button>`,
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            processJsonMapData(result.value);
        }
    });
}

function exportMap(format) {
    let map = getListTerrains();
    let data = format ? JSON.stringify(map, null, 4) : JSON.stringify(map);

    setPaused(true);

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
        setPaused(false);
        if (result.isConfirmed) {
            exportMap(true);
        }
    });
}

function editTerrainAtIndex(index) {
    resetTerrainCamera();
    setEditingTerrainIndex(index);

    // load image of terrain
    let terrain = getTerrainAtIndex(index);
    loadImage(
        "terrain-images/" + terrain.name + ".png",
        // on success
        (data) => {
            setTerrainImageData(data);
        },
        // on failed
        () => {
            Toast.fire({
                icon: "error",
                title: "Can not get image for this terrain.",
            });
            setTerrainImageData(null);
        }
    );
}

// ----------------------- terrain -----------------------
function getEditingTerrainIndex() {
    return globalData.terraintab.currentTerrainIndex;
}

function setEditingTerrainIndex(index) {
    updateFirebaseOnline(getUserName(), index);
    globalData.terraintab.currentTerrainIndex = index;
}

function getEditingTerrain() {
    return getTerrainAtIndex(getEditingTerrainIndex());
}

function getTerrainAtIndex(index) {
    return globalData.maptab.listTerrains[index];
}

function newTerrain(successCallback) {
    setPaused(true);
    Swal.fire({
        title: "Create new terrain",
        text: "Name of terrain:",
        input: "text",
        inputValue: "new terrain",
        showCancelButton: true,
        confirmButtonText: `Create`,
        denyButtonText: `Cancel`,
    }).then((result) => {
        setPaused(false);
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
    let terrain = getTerrainAtIndex(index);

    setPaused(true);
    Swal.fire({
        title: `Clone terrain "${terrain.name}"`,
        text: "Name of new terrain:",
        input: "text",
        inputValue: terrain.name,
        showCancelButton: true,
        confirmButtonText: `Clone`,
        denyButtonText: `Cancel`,
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            let newT = JSON.parse(JSON.stringify(terrain));

            newT.name = result.value;
            newT.position = { x: 0, y: 0 };

            globalData.maptab.listTerrains.splice(index + 1, 0, newT);
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

    setPaused(true);
    Swal.fire({
        title: "Rename terrain",
        input: "text",
        inputLabel: "New name",
        inputValue: terrain.name,
        showCancelButton: true,
        confirmButtonText: "Rename it",
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            terrain.name = result.value;
        }
    });
}

function renameEditingTerrain() {
    renameTerrainAtIndex(getEditingTerrainIndex());
}

function deleteTerrainAtIndex(index) {
    globalData.maptab.listTerrains.splice(index, 1);
    setEditingTerrainIndex(-1);
    if (getSelectedTerrainIndex() == index) setSelectedTerrainIndex(-1);
}

function deleteTerrainAtIndexConfirm(index) {
    let terrain = getTerrainAtIndex(index);

    setPaused(true);
    Swal.fire({
        title: `Delele terrain "${terrain.name}"?`,
        text: `Are you sure want to delete this terrain? \n index: ${index}, name: ${terrain.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            deleteTerrainAtIndex(index);
        }
    });
}

function deleteEditingTerrainConfirm() {
    let index = getEditingTerrainIndex();
    deleteTerrainAtIndexConfirm(index);
}

function processJsonTerrainData(datastr) {
    try {
        let rects = JSON.parse(datastr);

        Swal.fire({
            title: `Import ${rects.length} rects to this terrain?`,
            text: "Choose import mode. Override or Add to exist rects?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Add`,
            denyButtonText: `Override`,
        }).then((resultMode) => {
            if (resultMode.isDenied) {
                Swal.fire({
                    title: "Override terrain data?",
                    html: `All current rects will be <b>REMOVED</b>.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Override!",
                    confirmButtonColor: "red",
                }).then((resultConfirmOverride) => {
                    if (resultConfirmOverride.isConfirmed) {
                        getEditingTerrain().rects = rects;
                    }
                });
            } else if (resultMode.isConfirmed) {
                let editingTerrain = getEditingTerrain();
                editingTerrain.rects = [...editingTerrain.rects, ...rects];
            }
        });
    } catch (e) {
        Swal.fire({
            title: "Error",
            html: "Failed to import json data<br/>" + e,
            icon: "error",
        });
    }
}

function importTerrain() {
    setPaused(true);
    Swal.fire({
        title: "Import rects",
        input: "textarea",
        inputValue: "",
        inputLabel: "JSON data (array of rects)",
        confirmButtonText: "Import",
        showCancelButton: true,
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            processJsonTerrainData(result.value);
        }
    });
}

function exportEditingTerrainData(format) {
    let terrain = getEditingTerrain();
    let data = format
        ? JSON.stringify(terrain, null, 4)
        : JSON.stringify(terrain);

    setPaused(true);

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
        setPaused(false);
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

function addRectToEditingTerrain(x, y, w, h) {
    getEditingTerrain().rects.push({ x, y, w, h });
}

function newRect() {
    setPaused(true);
    Swal.mixin({
        title: "Create new rect",
        input: "number",
        inputValue: 50,
        showCancelButton: true,
        progressSteps: ["1", "2"],
    })
        .queue([
            { text: "Rect Width?", confirmButtonText: "Next &rarr;" },
            { text: "Rect Height?", confirmButtonText: "Create" },
        ])
        .then((resultSize) => {
            setPaused(false);
            if (resultSize.value) {
                let w = Number(resultSize.value[0]) || 50;
                let h = Number(resultSize.value[1]) || 50;

                addRectToEditingTerrain(-w / 2, -h / 2, w, h);
            }
        });
}

function editSelectedRect() {
    let selectedRect = getSelectedRect();

    setPaused(true);
    Swal.mixin({
        title: "Edit selected rect",
        input: "number",
        showCancelButton: true,
        denyButtonText: `Cancel`,
    })
        .queue([
            {
                inputLabel: "Width",
                inputValue: selectedRect.w,
                confirmButtonText: `Next`,
            },
            {
                inputLabel: "Height",
                inputValue: selectedRect.h,
                confirmButtonText: `Save`,
            },
        ])
        .then((result) => {
            setPaused(false);
            if (result.value) {
                let w = Number(result.value[0]) || 50;
                let h = Number(result.value[1]) || 50;

                selectedRect.w = w;
                selectedRect.h = h;
            }
        });
}

function deleteSelectedRect() {
    setPaused(true);
    Swal.fire({
        title: "Delele rect?",
        text: `Are you sure want to delete selected rect?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        setPaused(false);
        if (result.isConfirmed) {
            console.log(getSelectedRect());
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
