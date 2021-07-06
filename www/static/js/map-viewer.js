window.addEventListener('DOMContentLoaded', integrateElements);

// Called when the DOM is loaded
// Injects the map viewer
function integrateElements() {
    let mapContent = document.getElementById("map-content").textContent;
    let uiMapViewer = document.getElementById("map-viewer");

    let mapViewer = document.createElement("p");
    mapViewer.textContent = mapContent + " !";

    uiMapViewer.appendChild(mapViewer);
}
