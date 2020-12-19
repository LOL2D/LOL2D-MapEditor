let pMouseIsPressed;

function runInput() {
    pMouseIsPressed = mouseIsPressed;
}

// helper mouse events
function isMousePressed() {
    return !pMouseIsPressed && mouseIsPressed;
}

function isMouseReleased() {
    return pMouseIsPressed && !mouseIsPressed;
}

function isMouseDragged() {
    return mouseIsPressed && (pmouseX != mouseX || pmouseY != mouseY);
}

// p5js events
function mousePressed() {}

function mouseDragged() {
    if (mode == MODE.TERRAIN) {
        if (isMouseInRect(...UI.terrainEditorZone)) {
            let rect = getSelectedRect();
            if (rect && mouseButton == LEFT) {
                dragRect(rect);
            } else if (mouseButton == RIGHT) {
                dragTerrainCamera();
            }
        }
    } else {
        if (isMouseInRect(...UI.mapEditorZone)) {
            let terrain = getSelectedTerrain();
            if (terrain && mouseButton == LEFT) {
                dragTerrain(terrain);
            } else if (mouseButton == RIGHT) {
                dragMapCamera();
            }
        }
    }
}

function mouseWheel(event) {
    // scroll list terrains
    if (mode == MODE.MAP && isMouseInRect(...UI.listTerrainsSroll.slice(1))) {
        scollListTerrainItems(event.delta);
    }

    // zoom in/out terrain editor
    if (mode == MODE.TERRAIN && isMouseInRect(...UI.terrainEditorZone)) {
        zoomBy(getTerrainCamera(), event.delta);
    }

    // zoom in/out map editor
    if (mode == MODE.MAP && isMouseInRect(...UI.mapEditorZone)) {
        zoomBy(getMapCamera(), event.delta);
    }
}

function keyPressed() {
    if (mode == MODE.MAP) {
        let selectedTerrain = getSelectedTerrain();

        if (selectedTerrain) {
            if (keyCode == LEFT_ARROW) {
                selectedTerrain.position.x--;
            }

            if (keyCode == RIGHT_ARROW) {
                selectedTerrain.position.x++;
            }

            if (keyCode == UP_ARROW) {
                selectedTerrain.position.y--;
            }

            if (keyCode == DOWN_ARROW) {
                selectedTerrain.position.y++;
            }
        }
    }

    if (mode == MODE.TERRAIN) {
        let selectedRect = getSelectedRect();
        if (selectedRect) {
            if (keyCode == LEFT_ARROW) {
                selectedRect.x--;
            }

            if (keyCode == RIGHT_ARROW) {
                selectedRect.x++;
            }

            if (keyCode == UP_ARROW) {
                selectedRect.y--;
            }

            if (keyCode == DOWN_ARROW) {
                selectedRect.y++;
            }
        }
    }
}
