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
