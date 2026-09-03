// Accordion Toggle Logik
function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
}

// Synchronisiere Textfelder direkt mit der Vorschau
const syncInput = (inputId, displayId) => {
    document.getElementById(inputId).addEventListener('input', (e) => {
        document.getElementById(displayId).innerText = e.target.value;
    });
};

syncInput('input-title', 'display-title');
syncInput('input-home-name', 'display-home-name');
syncInput('input-away-name', 'display-away-name');
syncInput('input-date', 'display-date');
syncInput('input-time', 'display-time');
syncInput('input-location', 'display-location');

// Schnellauswahl Spieler (inkl. Namensanzeige-Logik & base.png Prüfung)
function applyPlayerSelection() {
    const select = document.getElementById('select-player');
    const val = select.value;
    const nameOverlay = document.getElementById('player-name-overlay');
    const imgElement = document.getElementById('display-player-img');

    if (!val) return;

    const [imagePath, playerName] = val.split('|');

    // Bild-Quelle setzen
    imgElement.src = imagePath;

    // Prüfen, ob es sich um das Standardbild (base.png) handelt oder kein Name übergeben wurde
    if (imagePath === 'base.png' || imagePath.includes('base.png') || !playerName) {
        if (nameOverlay) {
            nameOverlay.style.display = 'none';
            nameOverlay.innerText = '';
        }
    } else {
        if (nameOverlay) {
            nameOverlay.innerText = playerName;
            nameOverlay.style.display = 'block';
        }
    }
}

document.getElementById('select-player').addEventListener('change', applyPlayerSelection);

// Schnellauswahl Mannschaften / Logos
function applyTeamSelection(side) {
    const select = document.getElementById(`select-${side}-team`);
    const val = select.value;
    if (!val) return;

    const [teamName, logoFileName] = val.split('|');
    const upperName = teamName.toUpperCase();

    // Name aktualisieren
    document.getElementById(`input-${side}-name`).value = upperName;
    document.getElementById(`display-${side}-name`).innerText = upperName;

    // Logo-Pfad aktualisieren (aus dem Unterordner "logos/")
    document.getElementById(`display-${side}-logo`).src = `logos/${logoFileName}`;
}

// Bilder-Upload Handhaber (Eigene Dateien vom PC)
const handleImageUpload = (inputId, displayId) => {
    document.getElementById(inputId).addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById(displayId).src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
};

// Manueller Upload für Spieler-Foto (blendet das Namens-Overlay aus)
document.getElementById('input-player-img').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('display-player-img').src = event.target.result;
            
            const nameOverlay = document.getElementById('player-name-overlay');
            if (nameOverlay) {
                nameOverlay.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
});

handleImageUpload('input-home-logo', 'display-home-logo');
handleImageUpload('input-away-logo', 'display-away-logo');

// TRANSPARENZ REGLER
document.getElementById('opacity-player').addEventListener('input', (e) => {
    document.getElementById('display-player-img').style.opacity = e.target.value / 100;
});

document.getElementById('opacity-logos').addEventListener('input', (e) => {
    const val = e.target.value / 100;
    document.getElementById('frame-home-logo').style.opacity = val;
    document.getElementById('frame-away-logo').style.opacity = val;
});

// X/Y-POSITIONEN REGLER
const updatePosition = (blockId, xInputId, yInputId) => {
    const element = document.getElementById(blockId);
    const xVal = document.getElementById(xInputId).value;
    const yVal = document.getElementById(yInputId).value;
    element.style.transform = `translate(${xVal}px, ${yVal}px)`;
};

const setupTransformControls = (blockId, xInputId, yInputId) => {
    document.getElementById(xInputId).addEventListener('input', () => updatePosition(blockId, xInputId, yInputId));
    document.getElementById(yInputId).addEventListener('input', () => updatePosition(blockId, xInputId, yInputId));
};

setupTransformControls('block-title', 'title-x', 'title-y');
setupTransformControls('block-teams', 'teams-x', 'teams-y');
setupTransformControls('block-info', 'info-x', 'info-y');

// RESET FUNKTIONEN
function resetSection(xInputId, yInputId) {
    document.getElementById(xInputId).value = 0;
    document.getElementById(yInputId).value = 0;
    document.getElementById(xInputId).dispatchEvent(new Event('input'));
}

function resetOpacity(sliderId, imgId, defaultValue) {
    document.getElementById(sliderId).value = defaultValue;
    document.getElementById(imgId).style.opacity = defaultValue / 100;
}

function resetLogosOpacity() {
    document.getElementById('opacity-logos').value = 100;
    document.getElementById('frame-home-logo').style.opacity = 1;
    document.getElementById('frame-away-logo').style.opacity = 1;
}

// ROBSTERER PNG EXPORT
function downloadGraphic() {
    if (typeof html2canvas === 'undefined') {
        alert("Fehler: html2canvas wurde nicht geladen.");
        return;
    }

    const card = document.getElementById('matchday-card');

    html2canvas(card, {
        scale: 2,               // Erzeugt ein gestochen scharfes 1200x1200px PNG
        width: 600,             // Erzwingt exakt 600px Breite
        height: 600,            // Erzwingt exakt 600px Höhe
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        const homeName = document.getElementById('input-home-name').value || 'Matchday';
        const cleanFileName = homeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        link.download = `matchday_${cleanFileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Export-Fehler:", err);
        alert("Beim Erstellen des Bildes ist ein Fehler aufgetreten.");
    });
}

function updateScoreDisplay() {
    const homeVal = document.getElementById('input-home-score').value.trim();
    const awayVal = document.getElementById('input-away-score').value.trim();
    const displayScore = document.getElementById('display-score');

    if (!displayScore) return;

    // Wenn beide Felder leer sind, zeige nichts an
    if (homeVal === '' && awayVal === '') {
        displayScore.innerText = '';
    } else {
        // Falls nur ein Feld ausgefüllt ist, bleibt das leere Feld leer statt 0
        displayScore.innerText = `${homeVal} : ${awayVal}`;
    }
}