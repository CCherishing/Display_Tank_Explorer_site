const API_URL = "https://display-tank-explorer-api.onrender.com";

// Elements
const grid = document.getElementById("seaGrid");
const overlay = document.getElementById("overlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalHabitat = document.getElementById("modal-habitat");
const modalFunFact = document.getElementById("modal-funfact");
const modalImage = document.getElementById("modalImage");

// Fetch list of species and render sprites
fetch(`${API_URL}/species`)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load species list");
        return res.json();
    })
    .then(species => {
        species.forEach(s => {
            const img = document.createElement("img");

            // Determine image filename from available fields
            const spriteName = s.sprite || s.s_image || s.image || "";
            img.src = spriteName ? `images/${spriteName}` : `images/placeholder.png`;
            img.alt = s.common_name || s.name || "creature";
            img.dataset.id = s.id; // keep id for detail fetch
            img.addEventListener("click", () => loadInfo(s.id));
            grid.appendChild(img);
        });
    })
    .catch(err => {
        console.error("Error loading species:", err);
        grid.textContent = "Could not load creatures at this time.";
    });

function loadInfo(id) {
    fetch(`${API_URL}/species/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Species not found");
            return res.json();
        })
        .then(s => {
            showModal(s);
        })
        .catch(err => {
            console.error("Error loading species details:", err);
            alert("Could not load details for that creature.");
        });
}
function showModal(s) {
    // Title and text
    modalTitle.textContent = s.common_name || s.name || "Unknown";
    modalDescription.textContent = s.description || "";
    modalHabitat.textContent = s.habitat_info ? `Habitat: ${s.habitat_info}` : "";
    modalFunFact.textContent = s.fun_fact ? `Fun fact: ${s.fun_fact}` : "";

    // prefer the large image field(s), strip any "sprites/" prefix if present
    const photoRaw = s.s_image || s.image || s.p_image || s.photo || '';
    const photoName = photoRaw ? photoRaw.replace(/^\/?sprites\//, '') : '';
    // Sprite vs. popup image selection:
    // - spriteName is used for the small grid image (already set when creating grid)
    // - photoName is used for the modal / popup (larger, more detailed image)
    let src;
    if (photoName) {
        src = `images/${photoName}`;
        console.log('showModal: using large image ->', src);
    } else if (s.sprite) {
        src = `images/${s.sprite}`;
        console.log('showModal: no large image, falling back to sprite ->', src);
    } else {
        src = 'images/placeholder.png';
        console.log('showModal: no image fields, using placeholder');
    }
    // set modal image (use placeholder if no large image)
    modalImage.src = photoName ? new URL(`images/${photoName}`, location.href).href : 'images/placeholder.png';
    modalImage.alt = s.common_name || s.name || "creature image";

    overlay.classList.remove("hidden");
    modalClose.focus();
}

function hideModal() {
    overlay.classList.add("hidden");
}

// Close handlers
modalClose.addEventListener("click", hideModal);
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hideModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        hideModal();
    }
});
