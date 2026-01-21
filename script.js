const API_URL = "http://127.0.0.1:5000";

fetch(`${API_URL}/creatures`)
    .then(res => res.json())
    .then(creatures => {
        const grid = document.getElementById("seaGrid");

        creatures.forEach(c => {
            const img = document.createElement("img");
            img.src = `images/${c.image}`;
            img.onclick = () => loadInfo(c.id);
            grid.appendChild(img);
        });
    });

function loadInfo(id) {
    fetch(`${API_URL}/creatures/${id}`)
        .then(res => res.json())
        .then(c => {
            document.getElementById("infoPanel").innerHTML = `
        <h2>${c.name}</h2>
        <p>${c.description}</p>
      `;
        });
}
