let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];


const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];


let currentPlayer = 'circle';


function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content'); // greift auf die ID content zu

    let table = '<table>'; //kreiert eine Tabelle
    for (let i = 0; i < 3; i++) { // Zeile
        table += '<tr>'; // fügt eine Tabellenreihe hinzu
        for (let j = 0; j < 3; j++) { // Feld
            let index = i * 3 + j; // Rechnung um das Feld zu bestimmen
            let symbol = ''; // Symbol wird definiert
            if (fields[index] === 'circle') { // wenn circle in das Array geschrieben wird, dann wird es zum Symbol O
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') { // wenn circle in das Array geschrieben wird, dann wird es zum Symbol x
                symbol = generateCrossSVG();
            }
            table += `<td onclick="handleClick(this, ${index})">${symbol}</td>`; // das Symbol wird hier eingefügt
        }
        table += '</tr>'; // definiert das Ende der Tabellenreihe
    }
    table += '</table>'; // definiert das Ende der Tabelle

    contentDiv.innerHTML = table; // hier wird es im HTML geupdatet/eingefügt
}

// Function to switch player


// Set initial player to cross
function handleClick(cell, index) { // welches Feld wurde geklickt / existiert es?
    const playerText = document.getElementById('player-text');

    if (fields[index] === null) { // nur klickbar wenn es nicht gefüllt ist
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null; // funktion kann nicht nochmal aufgerufen werden
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; // spieler wird abwechselnd geändert (=== verkürztes if else)
        playerText.textContent = `${currentPlayer === 'cross' ? 'Kreuz' : 'Kreis'} ist am Zug`;

        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
            playerText.textContent = `${fields[winCombination[0]] === 'cross' ? 'Kreuz' : 'Kreis'} hat gewonnen!`;
        }
    }
}

function generateCircleSVG() {
    return `
    <svg width="100" height="100">
    <circle cx="50" cy="50" r="35" stroke="#00B0EF" stroke-width="10" fill="none">
    <animate attributeName="stroke-dasharray" from="0,157" to="157,0" dur="0.125s" fill="freeze" />
  </circle>
      </svg>
    `;
}

function generateCrossSVG() {
    return `
    <svg width="100" height="100" transform="rotate(45)">
      <rect x="0" y="45" width="100" height="10" fill="#FFC000" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.125s" fill="freeze" />
      </rect>
      <rect x="45" y="0" width="10" height="100" fill="#FFC000" opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.125s" fill="freeze" />
      </rect>
    </svg>
  `;
}

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null; // prüft ob alle Felder im Array gefüllt sind. Wenn nicht alle Felder gefüllt sind wird geprüft, ob es eine Winning Combination gibt
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) { // geht mit einer For-Schleife durch alle Kombinationen durch
        const [a, b, c] = WINNING_COMBINATIONS[i]; // Bsp.: [0, 1, 2]
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) { // wird geschaut ob in allen Feldern das selbe Symbol ist
            return WINNING_COMBINATIONS[i]; // gibt Gewinnkombination zurück, ansonsten null
        }
    }
    return null;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff'; // Farbe der Linie

    const line = document.createElement('div'); // container für die Linie wird kreiert
    line.id = 'line';
    line.style.position = 'absolute'; // CSS style start
    line.style.backgroundColor = lineColor;
    line.style.transformOrigin = `top left`; // CSS style end

    document.getElementById('content').appendChild(line); // fügt es zu der id 'content' hinzu

    currentCombination = combination;
    positionWinningLine();
}

let currentCombination;

function positionWinningLine() {
    const lineWidth = 5; // Linienbreite

    const startCell = document.querySelectorAll(`td`)[currentCombination[0]]; // wo die Linie startet
    const endCell = document.querySelectorAll(`td`)[currentCombination[2]]; // wo die Linie endet
    const startRect = startCell.getBoundingClientRect(); //
    const endRect = endCell.getBoundingClientRect(); //
    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2) // definiert die Länge der Linie
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left); // Winkel der Linie wird berechnet

    const line = document.getElementById('line'); // container für die Linie wird kreiert
    line.style.width = `${lineLength}px`; // CSS style start
    line.style.height = `${lineWidth}px`;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2} px`;
    line.style.left = `${startRect.left + startRect.width / 2} px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`; // CSS style end
}

function restartGame() { // setzt alle Felder auf null zurück
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    isGameFinished();
    document.getElementById('player-text').innerHTML = `${currentPlayer === 'cross' ? 'Kreuz' : 'Kreis'} ist am Zug`;
    render(); // updatet die Funktion
}

window.addEventListener('resize', positionWinningLine);

