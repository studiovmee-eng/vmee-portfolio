import { saveSection, getSection } from "../../firebase/firestore.js";

const heroForm = document.getElementById("heroForm");

const heroVideo = document.getElementById("heroVideo");

const uploadStatus = document.getElementById("heroUploadStatus");

const uploadText = document.getElementById("heroUploadText");

const progressFill = document.getElementById("heroProgressFill");

const saveButton = document.getElementById("heroSaveBtn");

loadHero();

heroForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        if (!heroVideo.files.length) {

            return alert("Please select a hero video.");

        }

        uploadStatus.style.display = "block";

        uploadText.textContent = "Uploading Hero Video...";

        progressFill.style.width = "20%";

        saveButton.disabled = true;

        saveButton.textContent = "Uploading...";

        const formData = new FormData();

        formData.append("file", heroVideo.files[0]);

        const response = await fetch("http://localhost:3000/upload", {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        if (!result.success) {

            throw new Error(result.message);

        }

        progressFill.style.width = "80%";

        uploadText.textContent = "Saving...";

        await saveSection("hero", {

            videoUrl: result.url

        });

        progressFill.style.width = "100%";

        uploadText.textContent = "Hero Updated Successfully";

        heroForm.reset();

        setTimeout(() => {

            uploadStatus.style.display = "none";

            progressFill.style.width = "0%";

        }, 1000);

    } catch (err) {

        console.error(err);

        alert(err.message || "Upload Failed");

    } finally {

        saveButton.disabled = false;

        saveButton.textContent = "Save Hero";

    }

});

async function loadHero() {

    const hero = await getSection("hero");

    if (!hero) return;

    console.log("Current Hero Video:", hero.videoUrl);

}