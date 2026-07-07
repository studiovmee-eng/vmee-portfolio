const menuButton = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
const header = document.querySelector(".header");
const navLinks = document.querySelectorAll(".navbar a");
const filterButtons = document.querySelectorAll(".portfolio-filter button");
const portfolioGrid = document.querySelector("#portfolio-grid");
const reveals = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const featuredVideo = document.querySelector(".showcase-video video");
const playControl = document.querySelector(".play-control");

const fallbackProjects = [
  {
    title: "Explainer Video",
    category: "Explainer",
    ratio: "landscape",
    video: "assets/videos/explainer1.mp4",
    software: "Adobe After Effects"
  },
  {
    title: "SaaS Product Demo",
    category: "SaaS",
    ratio: "four-three",
    video: "assets/videos/explainer2.mp4",
    software: "Product Motion"
  },
  {
    title: "Social Reel",
    category: "Social",
    ratio: "portrait",
    video: "assets/videos/explainer3.mp4",
    software: "Vertical Animation"
  },
  {
    title: "E-learning Module",
    category: "E-learning",
    ratio: "landscape",
    video: "assets/videos/explainer2.mp4",
    software: "Learning Design"
  }
];

let portfolioCards = [];

function normalizeCategory(category = "") {
  return category.toLowerCase().trim();
}

function setMenu(open) {
  menuButton.classList.toggle("active", open);
  navbar.classList.toggle("active", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

function createPortfolioCard(project) {
  const category = normalizeCategory(project.category);
  const card = document.createElement("article");
  card.className = `portfolio-card ${project.ratio || "landscape"}`;
  card.dataset.category = category;

  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";

  const source = document.createElement("source");
  source.src = project.video;
  source.type = "video/mp4";
  video.append(source);

  const info = document.createElement("div");
  info.className = "portfolio-info";
  info.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.software || "Motion Design"}</p>
    <span class="portfolio-tag">${project.category}</span>
  `;

  card.append(video, info);
  return card;
}

function filterPortfolio(filter) {
  portfolioCards.forEach((card) => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.hidden = !shouldShow;
  });
}

async function loadPortfolio() {
  let projects = fallbackProjects;

  try {
    const response = await fetch("videos.json");
    if (!response.ok) throw new Error("Portfolio data could not be loaded.");

    projects = await response.json();
  } catch (error) {
    projects = fallbackProjects;
  }

  portfolioGrid.innerHTML = "";
  portfolioCards = projects.map(createPortfolioCard);
  portfolioGrid.append(...portfolioCards);
}

function revealSections() {
  const trigger = window.innerHeight - 90;

  reveals.forEach((section) => {
    if (section.getBoundingClientRect().top < trigger) {
      section.classList.add("active");
    }
  });
}

function updateActiveNav() {
  const sections = [...document.querySelectorAll("main section")];
  const current = sections.findLast((section) => section.getBoundingClientRect().top <= 120);

  if (!current) return;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}

menuButton?.addEventListener("click", () => {
  setMenu(!navbar.classList.contains("active"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterPortfolio(button.dataset.filter);
  });
});

playControl?.addEventListener("click", () => {
  if (!featuredVideo) return;

  if (featuredVideo.paused) {
    featuredVideo.play();
    playControl.classList.remove("paused");
    playControl.setAttribute("aria-label", "Pause featured video");
  } else {
    featuredVideo.pause();
    playControl.classList.add("paused");
    playControl.setAttribute("aria-label", "Play featured video");
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Thanks. Your project details are ready to send to VMEE.";
  contactForm.reset();
});

window.addEventListener("scroll", () => {
  revealSections();
  updateActiveNav();
  updateHeader();
});

loadPortfolio();
revealSections();
updateActiveNav();
updateHeader();
