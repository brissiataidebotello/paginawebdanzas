/* ===== Typed.js efecto ===== */
var typed = new Typed(".typing", {
    strings: ["", "CON RITMO", "Y PASIÓN", "VIVE LA PAZ", "EN CANCIÓN"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

/* ===== Navegación ===== */
const nav = document.querySelector(".nav"),
      navList = nav?.querySelectorAll("li") || [],
      totalNavList = navList.length,
      allSection = document.querySelectorAll(".section"),
      totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function() {
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) addBackSection(j);
            navList[j].querySelector("a").classList.remove("active");
        }
        this.classList.add("active");
        showSection(this);
        if (window.innerWidth < 1200) asideSectionTogglerBtn();
    });
}

function addBackSection(num) { allSection[num].classList.add("back-section"); }
function removeBackSection() { for (let i = 0; i < totalSection; i++) allSection[i].classList.remove("back-section"); }
function showSection(element) {
    for (let i = 0; i < totalSection; i++) allSection[i].classList.remove("active");
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active");
}
function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split("#")[1]) navList[i].querySelector("a").classList.add("active");
    }
}

document.querySelector(".hire-me")?.addEventListener("click", function() {
    const sectionIndex = this.getAttribute("data-section-index");
    showSection(this);
    updateNav(this);
    removeBackSection();
    addBackSection(sectionIndex);
});

const navTogglerBtn = document.querySelector(".nav-toggler"),
      aside = document.querySelector(".aside");

navTogglerBtn?.addEventListener("click", () => asideSectionTogglerBtn());
function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < totalSection; i++) allSection[i].classList.toggle("open");
}

/* ===== Modal único para imagen y mapa con botón 3D ===== */
const modal = document.getElementById("modal"),
      modalImg = document.getElementById("modal-img"),
      modalTitle = document.getElementById("modal-title"),
      modalDesc = document.getElementById("modal-desc"),
      modalMap = document.getElementById("modal-map"),
      visitBtn = document.getElementById("visit-btn"),
      closeBtn = modal.querySelector(".close");

// Abrir modal al hacer clic en un item
document.querySelectorAll(".portafolio-item").forEach(item => {
    item.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = item.dataset.img;
        modalTitle.textContent = item.dataset.title;
        modalDesc.textContent = item.dataset.desc;

        // Guardamos coordenadas en el botón
        visitBtn.dataset.coords = item.dataset.coords;

        // Limpiamos el mapa hasta que se haga clic en el botón
        modalMap.src = '';

        if (aside.classList.contains("open")) asideSectionTogglerBtn();
    });
});

// Cargar mapa 3D al hacer clic en "¿Quieres visitarlo?"
visitBtn.addEventListener("click", () => {
    const coords = visitBtn.dataset.coords.split(',');
    const lat = coords[0].trim();
    const lng = coords[1].trim();
    modalMap.src = `https://www.google.com/maps?q=${lat},${lng}&z=18&layer=c&output=embed`;
});

// Cerrar modal
closeBtn.onclick = () => { modal.style.display = "none"; modalMap.src = ''; };
window.onclick = e => { if (e.target == modal) { modal.style.display = "none"; modalMap.src = ''; } };

/* ===== Modal de videos (local + YouTube) ===== */
const videoModal = document.getElementById("video-modal"),
      closeVideoBtn = videoModal.querySelector(".close-video");

// Crear dinámicamente elementos de video y iframe
let modalVideoPlayer = document.createElement("video");
modalVideoPlayer.controls = true;

let modalIframe = document.createElement("iframe");
modalIframe.frameBorder = 0;
modalIframe.allow = "autoplay; encrypted-media";
modalIframe.allowFullscreen = true;

videoModal.appendChild(modalVideoPlayer);
videoModal.appendChild(modalIframe);

// Abrir modal al hacer clic en cualquier miniatura
document.querySelectorAll(".video-lightbox").forEach(video => {
    video.addEventListener("click", () => {
        const videoUrl = video.dataset.video;

        videoModal.style.display = "flex";
        videoModal.classList.add("show");

        // Reset
        modalVideoPlayer.style.display = "none";
        modalIframe.style.display = "none";
        modalVideoPlayer.pause();
        modalVideoPlayer.src = '';
        modalIframe.src = '';

        if(videoUrl.includes("youtu")) {
            let videoId = "";
            if (videoUrl.includes("youtu.be/")) {
                videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
            } else if (videoUrl.includes("v=")) {
                videoId = videoUrl.split("v=")[1].split("&")[0];
            }
            modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
            modalIframe.style.display = "block";
        } else {
            modalVideoPlayer.src = videoUrl;
            modalVideoPlayer.style.display = "block";
            modalVideoPlayer.play();
        }
    });
});

// Cerrar modal
closeVideoBtn.onclick = () => {
    videoModal.style.display = "none";
    videoModal.classList.remove("show");
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';
    modalIframe.src = '';
};

// Cerrar modal haciendo click fuera del video
window.addEventListener("click", e => {
    if(e.target == videoModal) {
        videoModal.style.display = "none";
        videoModal.classList.remove("show");
        modalVideoPlayer.pause();
        modalVideoPlayer.src = '';
        modalIframe.src = '';
    }
});

/* ===== Reseñas dinámicas ===== */
const reviewForm = document.querySelector(".contact-form");
if (reviewForm) {
    const nameInput = reviewForm.querySelector('input[type="text"]');
    const emailInput = reviewForm.querySelector('input[type="email"]');
    const commentInput = reviewForm.querySelector("textarea");
    const ratingInputs = reviewForm.querySelectorAll('input[name="star"]');
    const reviewsContainer = document.querySelector(".reviews");

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    displayReviews();

    const sendButton = reviewForm.querySelector(".btn");
    sendButton.addEventListener("click", (e) => {
        e.preventDefault();
        const name = nameInput.value.trim() || "Anónimo";
        const comment = commentInput.value.trim();
        const rating = [...ratingInputs].find(r => r.checked)?.id.replace("star", "") || 0;

        if (!comment) { alert("Por favor, escribe tu reseña antes de enviarla."); return; }

        const newReview = { name, comment, rating: parseInt(rating), date: new Date().toLocaleString() };
        reviews.unshift(newReview);
        if (reviews.length > 100) reviews = reviews.slice(0, 100);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        displayReviews();
        reviewForm.reset();
    });

    function displayReviews() {
        reviewsContainer.querySelectorAll(".review-card").forEach(c => c.remove());
        reviews.slice(0, 4).forEach(r => {
            const stars = "⭐".repeat(r.rating);
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");
            reviewCard.innerHTML = `<h4><i class="fa fa-user-circle"></i> ${r.name}</h4><p class="stars">${stars}</p><p>${r.comment}</p>`;
            reviewsContainer.appendChild(reviewCard);
        });
    }
}
