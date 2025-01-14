let playerScore = 0;
let lockBoard = false;

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
    mainContainer.appendChild(gameContainer);
    document.body.appendChild(mainContainer);
}

function shuffleUnflippedCards(cards, container) {
    const unflippedCards = cards.filter(card => !card.classList.contains('flipped'));
    const positions = unflippedCards.map(card => {
        const rect = card.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    });

    const shuffledCards = [...unflippedCards];
    shuffledCards.sort(() => Math.random() - 0.09);

    shuffledCards.forEach((card, index) => {
        const targetPosition = positions[index];
        const currentPosition = card.getBoundingClientRect();

        const dx = targetPosition.x - currentPosition.x;
        const dy = targetPosition.y - currentPosition.y;

        card.style.transition = 'transform 1.0s ease';
        card.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    setTimeout(() => {
        shuffledCards.forEach(card => {
            card.style.transition = '';
            card.style.transform = '';
            container.appendChild(card);
        });
    }, 1000);
}
