import { db } from "../../firebase/config.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const form = document.getElementById("portfolioForm");
const uploadedVideos = document.getElementById("uploadedVideos");

const uploadStatus = document.getElementById("uploadStatus");
const uploadText = document.getElementById("uploadText");
const progressFill = document.getElementById("progressFill");

const uploadButton = form?.querySelector('button[type="submit"]');

function showLoading(message = "Uploading...") {

    uploadStatus.style.display = "block";

    uploadText.textContent = message;

    progressFill.style.width = "0%";

    uploadButton.disabled = true;

    uploadButton.textContent = "Uploading...";

}

function hideLoading() {

    uploadStatus.style.display = "none";

    progressFill.style.width = "0%";

    uploadButton.disabled = false;

    uploadButton.textContent = "Upload";

}

async function uploadFile(file){

    const data = new FormData();

    data.append("file", file);

    const response = await fetch("http://127.0.0.1:3000/upload", {

        method:"POST",

        body:data

    });

    const result = await response.json();

    if(!result.success){

        throw new Error(result.message || "Upload Failed");

    }

   return result;

}
async function savePortfolio(data){

    await addDoc(collection(db,"portfolio"),{

        title:data.title,

        description:data.description,

        category:data.category,

        videoUrl:data.videoUrl,

        thumbnailUrl:data.thumbnailUrl,
        videoFileName: data.videoFileName,
thumbnailFileName: data.thumbnailFileName,

        createdAt:serverTimestamp()

    });

}

if(form){

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    try{

        showLoading("Uploading Video...");

        const title=document.getElementById("portfolioTitle").value.trim();

        const description=document.getElementById("portfolioDescription").value.trim();

        const category=document.getElementById("portfolioCategory").value;

        const video=document.getElementById("portfolioVideo").files[0];

        const thumbnail=document.getElementById("portfolioThumbnail").files[0];

        if(!video){

            hideLoading();

            return alert("Please select a video.");

        }

      const videoResult = await uploadFile(video);

const videoUrl = videoResult.url;
const videoFileName = videoResult.fileName;
let thumbnailUrl = "";
let thumbnailFileName = "";

if (thumbnail) {

    uploadText.textContent = "Uploading Thumbnail...";

    const thumbnailResult = await uploadFile(thumbnail);

    thumbnailUrl = thumbnailResult.url;
    thumbnailFileName = thumbnailResult.fileName;

}

        uploadText.textContent="Saving Portfolio...";

await savePortfolio({

    title,
    description,
    category,

    videoUrl,
    videoFileName,

    thumbnailUrl,
    thumbnailFileName

});

        uploadText.textContent="✅ Upload Successful";

        form.reset();

        await loadVideos();

        setTimeout(()=>{

            hideLoading();

        },1200);

    }catch(err){

        console.error(err);

        hideLoading();

        alert(err.message || "Upload Failed");

    }

});

}
async function loadVideos() {

    if (!uploadedVideos) return;

    uploadedVideos.innerHTML = "<p>Loading...</p>";

    try {

        const q = query(
            collection(db, "portfolio"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        uploadedVideos.innerHTML = "";

        if (snapshot.empty) {

            uploadedVideos.innerHTML = "<p>No Videos Found</p>";

            return;

        }

        snapshot.forEach((item) => {

            const data = item.data();

            uploadedVideos.innerHTML += `

           <div class="video-card"
    data-id="${item.id}"
    data-video="${data.videoFileName || ""}"
    data-thumbnail="${data.thumbnailFileName || ""}">

                <video
                    src="${data.videoUrl}"
                    controls
                    preload="metadata">
                </video>

                <div class="video-info">

                    <h3>${data.title || "Untitled"}</h3>

                    <p>${data.category}</p>

                    <small>${data.description || ""}</small>

                </div>

                <div class="video-actions">

                    <button
                        class="edit-btn"
                        data-id="${item.id}">
                        ✏ Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${item.id}">
                        🗑 Delete
                    </button>

                </div>

            </div>

            `;

        });

    } catch (err) {

        console.error(err);

        uploadedVideos.innerHTML =
            "<p>Failed to load videos.</p>";

    }

}

loadVideos();


// =============================
// DELETE VIDEO
// =============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) return;

    const button = e.target;

    const id = button.dataset.id;

    if (!confirm("Are you sure you want to delete this video?")) return;

    button.disabled = true;
    button.textContent = "Deleting...";

    try {

        const docRef = doc(db, "portfolio", id);

        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            throw new Error("Portfolio not found");
        }

        const data = snap.data();

        // Delete Video
        if (data.videoFileName) {

            const response = await fetch("http://127.0.0.1:3000/delete", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fileName: data.videoFileName
                })

            });

            if (!response.ok) {
                throw new Error("Video delete failed");
            }

        }

        // Delete Thumbnail
        if (data.thumbnailFileName) {

            const response = await fetch("http://127.0.0.1:3000/delete", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fileName: data.thumbnailFileName
                })

            });

            if (!response.ok) {
                throw new Error("Thumbnail delete failed");
            }

        }

        // Delete Firestore document
        await deleteDoc(docRef);

        // Remove card instantly
        button.closest(".video-card")?.remove();

        alert("Portfolio Deleted Successfully");

    }

    catch (err) {

        console.error(err);

        alert(err.message || "Delete Failed");

        button.disabled = false;
        button.textContent = "🗑 Delete";

    }

});




// =============================
// EDIT VIDEO
// =============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("edit-btn")) return;

    const id = e.target.dataset.id;

    const newTitle = prompt("Enter New Title");

    if (newTitle === null) return;

    const newDescription = prompt("Enter New Description");

    if (newDescription === null) return;

    const newCategory = prompt(
        "Enter Category\n\nExplainer\nSaaS\nLogo Animation\nE-learning"
    );

    if (newCategory === null) return;

    try {

        await updateDoc(doc(db, "portfolio", id), {

            title: newTitle.trim(),

            description: newDescription.trim(),

            category: newCategory.trim()

        });

        await loadVideos();

        alert("Portfolio Updated Successfully");

    } catch (err) {

        console.error(err);

        alert("Update Failed");

    }

});