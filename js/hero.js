import { getSection } from "../firebase/firestore.js";

async function loadHero() {

    try {

        const hero = await getSection("hero");

        if (!hero || !hero.videoUrl) return;

        const source = document.getElementById("heroVideoSource");
        const video = document.getElementById("heroVideoPlayer");

        if (!source || !video) return;

        source.src = hero.videoUrl;

        video.load();

        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        video.play().catch(() => {});

    } catch (err) {

        console.error("Hero Load Error:", err);

    }

}

loadHero();