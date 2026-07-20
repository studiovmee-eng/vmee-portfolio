const uploadStatus = document.getElementById("aboutUploadStatus");

const uploadText = document.getElementById("aboutUploadText");

const progressFill = document.getElementById("aboutProgressFill");

const saveButton = document.getElementById("aboutSaveBtn");
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

    return result;

}

loadAbout();

aboutForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        if (!aboutVideo.files.length) {

            return alert("Please select an About video.");

        }
        uploadStatus.style.display = "block";

uploadText.textContent = "Uploading About Video...";

progressFill.style.width = "20%";

saveButton.disabled = true;

saveButton.textContent = "Uploading...";

        const currentAbout = await getSection("about");

const oldVideoUrl = currentAbout?.videoUrl || null;
const oldFileName = currentAbout?.fileName || null;

const result = await uploadFile(aboutVideo.files[0]);
progressFill.style.width = "80%";

uploadText.textContent = "Saving...";
await saveSection("about", {
    videoUrl: result.url,
    fileName: result.fileName
});

if (oldVideoUrl) {

    await fetch("http://127.0.0.1:3000/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileName: oldFileName,
            fileUrl: oldVideoUrl
        })
    });

}
progressFill.style.width = "100%";

uploadText.textContent = "About Updated Successfully";
       

        aboutForm.reset();
        setTimeout(() => {

    uploadStatus.style.display = "none";

    progressFill.style.width = "0%";

}, 1000);

    } catch (err) {

        console.error(err);

        alert(err.message || "Upload Failed");

    }
    finally {

    saveButton.disabled = false;

    saveButton.textContent = "Save About";

}

});

async function loadAbout() {

    const about = await getSection("about");

    if (!about) return;

    console.log("Current About Video:", about.videoUrl);

}