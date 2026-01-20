'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    // modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    // modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}


// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// Certificate modal variables
const certModalContainer = document.querySelector("[data-cert-modal-container]");
const certModalCloseBtn = document.querySelector("[data-cert-modal-close-btn]");
const certModalImg = document.querySelector("[data-cert-modal-img]");
const certModalTitle = document.querySelector("[data-cert-modal-title]");
const certImages = document.querySelectorAll("[data-cert-image]");
const certOverlay = document.querySelector("[data-cert-overlay]");

function openCertModal(imgSrc, imgAlt, title) {
  certModalImg.src = imgSrc;
  certModalImg.alt = imgAlt;
  certModalTitle.textContent = title;
  certModalContainer.classList.add("active");
  certOverlay.classList.add("active");
}

function closeCertModal() {
  certModalContainer.classList.remove("active");
  certOverlay.classList.remove("active");
}

certImages.forEach(certImage => {
  certImage.addEventListener("click", function () {
    const img = certImage.querySelector("img");
    const title = certImage.parentElement.querySelector(".certification-title").textContent;
    openCertModal(img.src, img.alt, title);
  });
});

certModalCloseBtn.addEventListener("click", closeCertModal);
certOverlay.addEventListener("click", closeCertModal);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Articles (CMS content) rendering
let articlesLoaded = false;

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function normalizeImagePath(path) {
  if (!path) return "";
  // allow absolute URLs + root-relative URLs
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  // Decap often stores media as relative paths
  if (path.startsWith("./")) return path.slice(1);
  return `/${path}`;
}

function renderArticlesList(items) {
  const listEl = document.getElementById("articles-list");
  if (!listEl) return;

  if (!Array.isArray(items) || items.length === 0) {
    listEl.innerHTML = `
      <li class="blog-post-item">
        <div class="cont">
          <div class="blog-content">
            <h3 class="h3 blog-item-title">No articles yet</h3>
            <p class="blog-text">Check back soon.</p>
          </div>
        </div>
      </li>
    `;
    return;
  }

  const sorted = [...items].sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));

  listEl.innerHTML = sorted.map((a) => {
    const slug = a?.slug || "";
    const title = a?.title || "Untitled";
    const dateLabel = formatDateLabel(a?.date);
    const image = normalizeImagePath(a?.image);
    const excerpt = a?.excerpt || a?.description || "";

    // Use existing blog-post-item styling (same structure as Projects)
    return `
      <li class="blog-post-item">
        <a href="./article.html?slug=${encodeURIComponent(slug)}">
          ${image ? `
            <figure class="blog-banner-box">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">
            </figure>
          ` : ""}

          <div class="blog-content">
            <div class="blog-meta">
              ${dateLabel ? `<time datetime="${escapeHtml(a?.date || "")}">${escapeHtml(dateLabel)}</time>` : ""}
            </div>
            <h3 class="h3 blog-item-title">${escapeHtml(title)}</h3>
            ${excerpt ? `<p class="blog-text">${escapeHtml(excerpt)}</p>` : ""}
          </div>
        </a>
      </li>
    `;
  }).join("");
}

async function loadArticlesOnce() {
  if (articlesLoaded) return;
  articlesLoaded = true;

  try {
    // NOTE: Static hosting cannot list directories. We use a manifest file.
    const res = await fetch("/content/articles/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load /content/articles/index.json (${res.status})`);
    const items = await res.json();
    renderArticlesList(items);
  } catch (err) {
    const listEl = document.getElementById("articles-list");
    if (!listEl) return;
    listEl.innerHTML = `
      <li class="blog-post-item">
        <div class="cont">
          <div class="blog-content">
            <h3 class="h3 blog-item-title">Couldn’t load articles</h3>
            <p class="blog-text">Please ensure <strong>/content/articles/index.json</strong> exists.</p>
          </div>
        </div>
      </li>
    `;
    console.error(err);
  }
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const navLinkValue = this.dataset.navLink;
    let targetPage = navLinkValue || this.innerHTML.toLowerCase();

    // Show the correct page
    for (let j = 0; j < pages.length; j++) {
      if (targetPage === pages[j].dataset.page) {
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
      }
    }

    if (targetPage === "articles") {
      loadArticlesOnce();
    }

    // Only update .navbar-link active state for main navbar
    if (!navLinkValue || !navLinkValue.startsWith('blog-')) {
      document.querySelectorAll('.navbar-link').forEach(link => link.classList.remove('active'));
      // Add active to the clicked navbar link
      if (this.classList.contains('navbar-link')) {
        this.classList.add('active');
      }
    }
  });
}