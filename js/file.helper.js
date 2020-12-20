// https://github.com/HoangTran0410/Paint-P5/blob/75a4f7ad5d0568b0d4bb1a5743a488191e38be53/Skech.js#L20
function createImageFromFile(file) {
    if (file.type === "image") {
        return createImg(file.data).hide();
    } else {
        alert("Not an image file! , Please choose another file");
        return null;
    }
}

function createJsonFromFile(file) {
    
}

function getLocalFile(calback) {
    createFileInput((files) => {
        calback(files);

        removeElements(); // https://p5js.org/reference/#/p5/removeElements
    })
        .style("display: none")
        .elt.click();
}

async function getFileUsingSwal_Test() {
    const { value: file } = await Swal.fire({
        title: "Select image",
        input: "file",
        inputAttributes: {
            accept: "image/*",
            "aria-label": "Upload your profile picture",
        },
    });

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            Swal.fire({
                title: "Your uploaded picture",
                imageUrl: e.target.result,
                imageAlt: "The uploaded picture",
            });
        };
        reader.readAsDataURL(file);
    }
}
