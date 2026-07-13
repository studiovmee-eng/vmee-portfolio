import { getSection } from "../firebase/firestore.js";

async function loadAbout() {

    try {

        const about = await getSection("about");

        if (!about || !about.videoUrl) return;

        const video = document.getElementById("aboutVideoPlayer");
        const source = document.getElementById("aboutVideoSource");

        if (!video || !source) return;

        source.src = about.videoUrl;

        video.load();

        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        video.play().catch(() => {});

    } catch (err) {

        console.error("About Load Error:", err);

    }

}

loadAbout();