import { saveSection, getSection } from "../../firebase/firestore.js";

const aboutForm = document.getElementById("aboutForm");
const aboutVideo = document.getElementById("aboutVideo");

async function uploadFile(file) {

    const data = new FormData();

    data.append("file", file);

    const response = await fetch("http://127.0.0.1:3000/upload", {
        method: "POST",
        body: data
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Upload Failed");
    }

    return result.url;

}

loadAbout();

aboutForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        if (!aboutVideo.files.length) {

            return alert("Please select an About video.");

        }

        const videoUrl = await uploadFile(aboutVideo.files[0]);

        await saveSection("about", {

            videoUrl

        });

        alert("About Video Updated Successfully");

        aboutForm.reset();

    } catch (err) {

        console.error(err);

        alert(err.message || "Upload Failed");

    }

});

async function loadAbout() {

    const about = await getSection("about");

    if (!about) return;

    console.log("Current About Video:", about.videoUrl);

}