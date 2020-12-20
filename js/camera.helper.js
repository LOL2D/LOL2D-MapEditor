// camera
function resetCamera(camera) {
    camera.scaleTo = 1;
    camera.xTo = width / 2;
    camera.yTo = height / 2;
}

function lerpCamera(camera, d = 0.2) {
    camera.scale = lerp(camera.scale, camera.scaleTo, d);
    camera.x = lerp(camera.x, camera.xTo, d);
    camera.y = lerp(camera.y, camera.yTo, d);
}

// source: https://github.com/HoangTran0410/ImageToSpriteJson/blob/db1f19ec11ba899e71dff1af31f656495d5a7281/main.js#L197
function zoomTo(camera, ratio) {
    ratio = constrain(ratio, 0.05, 10);

    let tiLe = ratio / camera.scale;

    camera.scaleTo = ratio;

    // Zoom from the triggering point of the event
    camera.xTo = mouseX + (camera.x - mouseX) * tiLe;
    camera.yTo = mouseY + (camera.y - mouseY) * tiLe;
}

function zoomBy(camera, value) {
    let newScale = camera.scale + (camera.scale / 5) * (value > 0 ? -1 : 1);

    zoomTo(camera, newScale);
}
