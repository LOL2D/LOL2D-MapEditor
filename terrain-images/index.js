// to get filenames in folder -> open cmd: dir /b > filenames.txt
function filesnameToArray(filenames, prefix) {
    let a = filenames;
    a = a.split("\n");
    for (let i = 0; i < a.length; i++) a[i] = prefix + a[i];

    return a;
}

function imagePathsToMapJson(imgPaths) {
    let b = [];
    for (let p of imgPaths)
        b.push({
            name: p,
            position: { x: 0, y: 0 },
            rects: [],
        });
    return b;
}

// result
let imagePaths = [
    // blue team
    "blue-team/bird.png",
    "blue-team/blue.png",
    "blue-team/bot1.png",
    "blue-team/bot2.png",
    "blue-team/bot3.png",
    "blue-team/bot4.png",
    "blue-team/dragon.png",
    "blue-team/front-red.png",
    "blue-team/mid1.png",
    "blue-team/mid2.png",
    "blue-team/mid3.png",
    "blue-team/mid4.png",
    "blue-team/wall1.png",
    "blue-team/wall2.png",
    "blue-team/nexus.png",
    "blue-team/red.png",
    "blue-team/rock.png",
    "blue-team/spawn.png",
    "blue-team/top1.png",
    "blue-team/top2.png",

    // red team
    "red-team/baron.png",
    "red-team/bird.png",
    "red-team/blue.png",
    "red-team/bot1.png",
    "red-team/bot2.png",
    "red-team/bot3.png",
    "red-team/red2.png",
    "red-team/mid1.png",
    "red-team/mid2.png",
    "red-team/mid3.png",
    "red-team/mid4.png",
    "red-team/wall1.png",
    "red-team/wall2.png",
    "red-team/nexus.png",
    "red-team/red.png",
    "red-team/rock.png",
    "red-team/spawn.png",
    "red-team/top1.png",
    "red-team/top2.png",
    "red-team/top3.png",
];
