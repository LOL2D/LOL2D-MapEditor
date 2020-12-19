// others
function preventRightClick(id) {
    document.getElementById(id).addEventListener(
        "contextmenu",
        function (evt) {
            evt.preventDefault();
        },
        false
    );
}

// https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
function copyToClipboard(id) {
    /* Get the text field */
    var copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");

    alert("Copied");
}

function getBound(rects) {
    let top = Infinity,
        left = Infinity,
        right = -Infinity,
        bottom = -Infinity;

    for (let p of rects) {
        top = min(p.y, top);
        bottom = max(p.y + p.h, bottom);
        left = min(p.x, left);
        right = max(p.x + p.w, right);
    }

    return { top, left, right, bottom };
}

function calculateFitBound(w, h, bound, symmetry = false) {
    const { top, left, right, bottom } = bound;

    let W, H;

    if (symmetry) {
        W = abs(right) - abs(left) > 0 ? abs(right) * 2 : abs(left) * 2;
        H = abs(bottom) - abs(top) > 0 ? abs(bottom) * 2 : abs(top) * 2;
    } else {
        W = abs(right) - abs(left) > 0 ? abs(right) : abs(left);
        H = abs(bottom) - abs(top) > 0 ? abs(bottom) : abs(top);
    }

    let scaleRatio = min(w, h) / max(W, H);

    return {
        scaleRatio,
        W: W,
        H: H,
    };
}
