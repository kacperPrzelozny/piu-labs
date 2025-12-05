const board = document.getElementById('board');
const STORAGE_KEY = 'kanban_data_v1';

let state = {
    todo: [],
    inprogress: [],
    done: []
};

const columnNames = {
    todo: 'Do zrobienia',
    inprogress: 'W trakcie',
    done: 'Zrobione'
};

function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
    }
    render();
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getRandomColor() {
    const letters = 'BCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function createCardObj(text = 'Nowe zadanie') {
    return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        text: text,
        color: getRandomColor()
    };
}

function render() {
    board.innerHTML = '';

    Object.keys(columnNames).forEach(colId => {
        const colData = state[colId];

        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.id = colId;

        const header = document.createElement('div');
        header.className = 'column-header';
        header.innerHTML = `
            <span class="column-title">${columnNames[colId]}</span>
            <span class="counter">${colData.length}</span>
        `;

        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button class="btn-action btn-sort">Sortuj A-Z</button>
            <button class="btn-action btn-color-col">Koloruj</button>
        `;

        const addBtn = document.createElement('div');
        addBtn.innerHTML = `<button class="btn-add">Dodaj kartę +</button>`;

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';

        colData.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.style.backgroundColor = card.color;
            cardEl.dataset.cardId = card.id;

            const leftBtn = colId !== 'todo' ? '<button class="btn-card btn-left">←</button>' : '<span></span>';
            const rightBtn = colId !== 'done' ? '<button class="btn-card btn-right">→</button>' : '<span></span>';

            cardEl.innerHTML = `
                <button class="btn-delete">&times;</button>
                <div class="card-content" contenteditable="true">${card.text}</div>
                <div class="card-actions">
                    ${leftBtn}
                    <button class="btn-card btn-color-one">🎨</button>
                    ${rightBtn}
                </div>
            `;
            cardsContainer.appendChild(cardEl);
        });

        column.append(header, addBtn, controls, cardsContainer);
        board.appendChild(column);
    });
}

board.addEventListener('click', (e) => {
    const target = e.target;
    const column = target.closest('.column');
    const card = target.closest('.card');

    if (!column) return;

    const colId = column.dataset.id;
    const cardId = card ? card.dataset.cardId : null;

    if (target.classList.contains('btn-add')) {
        state[colId].push(createCardObj());
        saveState();
        render();
    }

    if (target.classList.contains('btn-delete') && cardId) {
        state[colId] = state[colId].filter(c => c.id !== cardId);
        saveState();
        render();
    }

    if (target.classList.contains('btn-left') && cardId) {
        moveCard(cardId, colId, 'left');
    }

    if (target.classList.contains('btn-right') && cardId) {
        moveCard(cardId, colId, 'right');
    }

    if (target.classList.contains('btn-color-one') && cardId) {
        const cardObj = state[colId].find(c => c.id === cardId);
        if (cardObj) {
            cardObj.color = getRandomColor();
            saveState();
            render();
        }
    }

    if (target.classList.contains('btn-color-col')) {
        state[colId].forEach(c => c.color = getRandomColor());
        saveState();
        render();
    }

    if (target.classList.contains('btn-sort')) {
        state[colId].sort((a, b) => a.text.localeCompare(b.text));
        saveState();
        render();
    }
});

board.addEventListener('input', (e) => {
    if (e.target.classList.contains('card-content')) {
        const cardEl = e.target.closest('.card');
        const colEl = e.target.closest('.column');

        if (cardEl && colEl) {
            const cardId = cardEl.dataset.cardId;
            const colId = colEl.dataset.id;
            const cardObj = state[colId].find(c => c.id === cardId);

            if (cardObj) {
                cardObj.text = e.target.innerText;
                saveState();
            }
        }
    }
});

function moveCard(cardId, fromColId, direction) {
    const cols = Object.keys(columnNames);
    const currentIndex = cols.indexOf(fromColId);
    const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < cols.length) {
        const toColId = cols[nextIndex];
        const cardIndex = state[fromColId].findIndex(c => c.id === cardId);

        if (cardIndex > -1) {
            const [card] = state[fromColId].splice(cardIndex, 1);
            state[toColId].push(card);
            saveState();
            render();
        }
    }
}

init();