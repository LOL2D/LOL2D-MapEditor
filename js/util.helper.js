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
