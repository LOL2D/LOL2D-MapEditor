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

    // Zoom from the triggering point of the event
    camera.x = mouseX + (camera.x - mouseX) * tiLe;
    camera.y = mouseY + (camera.y - mouseY) * tiLe;
}

function zoomBy(camera, value) {
    let newScale = camera.scale + (camera.scale / 10) * (value > 0 ? -1 : 1);

    zoomTo(camera, newScale);
}
