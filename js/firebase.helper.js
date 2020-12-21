function initFireBase() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyCJA-xM0_tS6WCCytQooUQcjWPo0ttxFoY",
        authDomain: "lol2d-terrain-maps.firebaseapp.com",
        databaseURL: "https://lol2d-terrain-maps-default-rtdb.firebaseio.com",
        projectId: "lol2d-terrain-maps",
        storageBucket: "lol2d-terrain-maps.appspot.com",
        messagingSenderId: "76192993850",
        appId: "1:76192993850:web:77517a2875aba66ff15b03",
        measurementId: "G-5F6DDW0877",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

function listenToFireBase(dataCallback, onlineCallback) {
    let database = firebase.database();

    database.ref("data/").on("value", (snapshot) => {
        const data = snapshot.val();

        dataCallback && dataCallback(data);
    });

    database.ref("online/").on("value", (snapshot) => {
        const data = snapshot.val();

        onlineCallback && onlineCallback(data);
    });
}

function removeFirebaseOnline(userName) {
    firebase
        .database()
        .ref("online/" + userName)
        .remove();
}

function updateFirebaseOnline(userName, edittingTerrainIndex) {
    // https://firebase.google.com/docs/database/web/lists-of-data
    firebase
        .database()
        .ref("online/" + userName)
        .set(edittingTerrainIndex, (error) => {
            if (error) {
                Toast.fire({
                    icon: "error",
                    title: "Failed to update online data. Please try again.",
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: "Online data has been pushed to firebase.",
                });
            }
        });
}

function updateFirebaseTerrain(index, data) {
    firebase
        .database()
        .ref("data/" + index)
        .set(data, (error) => {
            if (error) {
                Toast.fire({
                    icon: "error",
                    title: "Failed to save terrain data. Please try again.",
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: "Terrain data has been pushed to firebase.",
                });
            }
        });
}
