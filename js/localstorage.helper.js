const localStorageKey = "lol2d-mapeditor-username";

function localstorageSaveUserName(username) {
    localStorage.setItem(localStorageKey, username);
}

function localStorageGetUsername() {
    return localStorage.getItem(localStorageKey);
}
