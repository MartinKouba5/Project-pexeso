let playerScore = 0;
let lockBoard = false;
let countdownInterval;

let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;

function showDifficultyMenu() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('difficulty-menu').style.display = 'flex';
}

function backToMainMenu() {
    document.getElementById('difficulty-menu').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function startGame(difficulty) {
    document.getElementById('difficulty-menu').style.display = 'none';
    createGameBoard(difficulty);
}

function startTwoPlayerGame() {
    document.getElementById('main-menu').style.display = 'none';
    createTwoPlayerGameBoard();
}

function createGameBoard(difficulty) {
    document.body.innerHTML = "";

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container');

    const title = document.createElement('h2');
    title.classList.add('game-title');
    title.innerText = `Pexeso - Level ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;

    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');

    const scoreDisplay = document.createElement('div');
    scoreDisplay.classList.add('score-display');
    scoreDisplay.innerText = `Score: ${playerScore}`;

    const countdownDisplay = document.createElement('div');
    countdownDisplay.classList.add('countdown-display');
    countdownDisplay.innerText = `Karty se zakryjí za 0s`;

    let gridSize;
    if (difficulty === 'easy') gridSize = 4;
    else if (difficulty === 'medium') gridSize = 6;
    else gridSize = 8;

    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const emojiList = [
        '😀', '😂', '😍', '😎', '😭', '😡', '😱', '🤔',
        '🤩', '🥳', '🤪', '🤓', '🤑', '😴', '🙄', '😇',
        '🦄', '🐉', '🌈', '🔥', '⚡', '🍎', '🍇', '🍒',
        '🍓', '🥝', '🍍', '🌻', '🌷', '🌵', '🚀', '🚁'
    ];
    const totalPairs = (gridSize * gridSize) / 2;
    const emojis = [...emojiList.slice(0, totalPairs), ...emojiList.slice(0, totalPairs)];
    emojis.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;

    const cards = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emojis[i];

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.innerText = emojis[i];

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        gameContainer.appendChild(card);
        cards.push(card);

        card.addEventListener('click', () => {
            if (lockBoard || card.classList.contains('flipped')) return;

            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                lockBoard = true;

                if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                    playerScore++;
                    scoreDisplay.innerText = `Score: ${playerScore}`;
                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                } else {
                    setTimeout(() => {
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                        shuffleUnflippedCards(cards, gameContainer);
                        firstCard = null;
                        secondCard = null;
                        lockBoard = false;
                    }, 1000);
                }
            }
        });
    }

    mainContainer.appendChild(title);
    mainContainer.appendChild(scoreDisplay);
    mainContainer.appendChild(countdownDisplay);
    mainContainer.appendChild(gameContainer);
    document.body.appendChild(mainContainer);

    initializeCards(cards, difficulty, countdownDisplay);
}

function createTwoPlayerGameBoard() {
    document.body.innerHTML = "";

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main-container');

    const title = document.createElement('h2');
    title.classList.add('game-title');
    title.innerText = `Pexeso - Two Players`;

    const scoreDisplay = document.createElement('div');
    scoreDisplay.classList.add('score-display');
    scoreDisplay.innerHTML = `
        <span id="player1-score">Player 1: ${player1Score}</span> | 
        <span id="player2-score">Player 2: ${player2Score}</span>
    `;

    const currentPlayerDisplay = document.createElement('div');
    currentPlayerDisplay.classList.add('current-player-display');
    currentPlayerDisplay.innerText = `Current Player: Player ${currentPlayer}`;

    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    gameContainer.style.gridTemplateColumns = `repeat(9, 1fr)`;

    const emojiList = ['😀', '😂', '😍', '😎', '😭', '😡', '😱', '🤔',
        '🤩', '🥳', '🤪', '🤓', '🤑', '😴', '🙄', '😇',
        '🦄', '🐉', '🌈', '🔥', '⚡', '🍎', '🍇', '🍒',
        '🍓', '🥝', '🍍', '🌻', '🌷', '🌵', '🚀', '🚁','❤️','🎶','🤞','🤮','🤦‍♂️','💕','😶‍🌫️'];
    const totalPairs = (9 * 9) / 2;
    const emojis = [...emojiList.slice(0, totalPairs), ...emojiList.slice(0, totalPairs)];
    emojis.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;

    const cards = [];
    for (let i = 0; i < 9 * 9; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emojis[i];

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.innerText = emojis[i];

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        gameContainer.appendChild(card);
        cards.push(card);

        card.addEventListener('click', () => {
            if (lockBoard || card.classList.contains('flipped')) return;

            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                lockBoard = true;

                if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                    if (currentPlayer === 1) player1Score++;
                    else player2Score++;

                    scoreDisplay.innerHTML = `
                        <span id="player1-score">Player 1: ${player1Score}</span> | 
                        <span id="player2-score">Player 2: ${player2Score}</span>
                    `;
                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                } else {
                    setTimeout(() => {
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                        shuffleUnflippedCards(cards, gameContainer);
                        firstCard = null;
                        secondCard = null;
                        lockBoard = false;
                        currentPlayer = currentPlayer === 1 ? 2 : 1;
                        updateScoreDisplay();
                    }, 1000);
                }
            }
        });
    }

    mainContainer.appendChild(title);
    mainContainer.appendChild(scoreDisplay);
    mainContainer.appendChild(currentPlayerDisplay);
    mainContainer.appendChild(gameContainer);
    document.body.appendChild(mainContainer);

    updateScoreDisplay();
}

function updateScoreDisplay() {
    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');

    if (player1ScoreElement && player2ScoreElement) {
        player1ScoreElement.style.color = currentPlayer === 1 ? 'red' : 'white';
        player2ScoreElement.style.color = currentPlayer === 2 ? 'red' : 'white';
    }
}

function initializeCards(cards, difficulty, countdownDisplay) {
    let revealTime;
    if (difficulty === 'easy') revealTime = 5000; // 5 sekund
    else if (difficulty === 'medium') revealTime = 15000; // 15 sekund
    else revealTime = 30000; // 30 sekund

    lockBoard = true;

    cards.forEach(card => {
        card.classList.add('flipped');
    });

    // časovač
    let remainingTime = revealTime / 1000;
    countdownDisplay.innerText = `Karty se zakryjí za ${remainingTime} sekund`;

    countdownInterval = setInterval(() => {
        remainingTime--;
        countdownDisplay.innerText = `Karty se zakryjí za ${remainingTime} sekund`;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerText = ` `;
        }
    }, 1000);

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
        lockBoard = false;
    }, revealTime);
}

function shuffleUnflippedCards(cards, container) {
    const unflippedCards = cards.filter(card => !card.classList.contains('flipped'));
    if (unflippedCards.length < 2) return;

    const shuffledIndices = [];
    while (shuffledIndices.length < 2) {
        const randomIndex = Math.floor(Math.random() * unflippedCards.length);
        if (!shuffledIndices.includes(randomIndex)) shuffledIndices.push(randomIndex);
    }

    const [card1, card2] = [unflippedCards[shuffledIndices[0]], unflippedCards[shuffledIndices[1]]];
    const card1Rect = card1.getBoundingClientRect();
    const card2Rect = card2.getBoundingClientRect();

    const dx1 = card2Rect.left - card1Rect.left;
    const dy1 = card2Rect.top - card1Rect.top;
    const dx2 = card1Rect.left - card2Rect.left;
    const dy2 = card1Rect.top - card2Rect.top;

    card1.style.transition = 'transform 0.5s ease';
    card2.style.transition = 'transform 0.5s ease';
    card1.style.transform = `translate(${dx1}px, ${dy1}px)`;
    card2.style.transform = `translate(${dx2}px, ${dy2}px)`;

    setTimeout(() => {
        const tempEmoji = card1.dataset.emoji;
        card1.dataset.emoji = card2.dataset.emoji;
        card2.dataset.emoji = tempEmoji;

        card1.querySelector('.card-back').innerText = card1.dataset.emoji;
        card2.querySelector('.card-back').innerText = card2.dataset.emoji;

        card1.style.transition = '';
        card2.style.transition = '';
        card1.style.transform = '';
        card2.style.transform = '';
    }, 500);
}