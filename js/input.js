let pMouseIsPressed;

function runInput() {
    pMouseIsPressed = mouseIsPressed;
}

// p5js events
function mouseDragged() {
    if (mode == MODE.TERRAIN) {
        if (isMouseInRect(...UI.terrainEditorZone)) {
            let rect = getSelectedRect();
            if (rect && mouseButton == LEFT) {
                dragRect(rect);
            } else {
                dragTerrainCamera();
            }
        }
    } else {
        if (isMouseInRect(...UI.mapEditorZone)) {
            dragMapCamera();
        }
    }
}

function mousePressed() {}

function mouseWheel(event) {
    // scroll list terrains
    if (mode == MODE.MAP && isMouseInRect(...UI.listTerrainsZone)) {
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
