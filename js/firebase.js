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

function listenToFireBase(callback) {
    firebase
        .database()
        .ref("data/")
        .on("value", (snapshot) => {
            const data = snapshot.val();

            callback && callback(data);
        });
}

function updateFirebaseTerrain(index, data) {
    firebase
        .database()
        .ref("data/" + index)
        .set(data);

    // notify
    Toast.fire({
        icon: "success",
        title: "Terrain data has been pushed to firebase.",
    });
}
