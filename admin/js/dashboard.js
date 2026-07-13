import { auth } from "../../firebase/config.js";
import { onAuthStateChanged } from "../../firebase/auth.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

    }

});
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const pageContent = document.getElementById("pageContent");

const menuItems = document.querySelectorAll(".sidebar li[data-page]");

const pageInfo = {
    dashboard: {
        title: "Dashboard",
        description: "Manage your website from one place."
    },
    hero: {
        title: "Hero Section",
        description: "Manage hero title, subtitle and hero video."
    },
    about: {
        title: "About Section",
        description: "Manage about content and video."
    },
    portfolio: {
        title: "Portfolio",
        description: "Upload and manage portfolio videos."
    },
    contact: {
        title: "Contact",
        description: "Manage contact information."
    },
    settings: {
        title: "Settings",
        description: "Website settings."
    }
};

async function loadPage(page){

    const response = await fetch(`pages/${page}.html`);

    const html = await response.text();

    pageContent.innerHTML = html;

    pageTitle.textContent = pageInfo[page].title;

    pageDescription.textContent = pageInfo[page].description;

    switch(page){

        case "hero":
            import("./hero.js");
            break;

        case "about":
            import("./about.js");
            break;

        case "portfolio":
            import("./portfolio.js");
            break;

        case "contact":
            import("./contact.js");
            break;

        case "settings":
            import("./settings.js");
            break;

    }

}

menuItems.forEach(item=>{

    item.addEventListener("click",()=>{

        menuItems.forEach(menu=>{

            menu.classList.remove("active");

        });

        item.classList.add("active");

        loadPage(item.dataset.page);

    });

});

loadPage("dashboard");
import { logout } from "../../firebase/auth.js";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    await logout();

    window.location.href = "index.html";

});