
import canPlayCard from '../client/canPlayCard';

// Card Utils

function getCard(color, value) {
    return {
        color,
        value
    };
}

// GardDeck Utils

function getRandomFirstCard(cards) {
    let firstCard = null;
    while(firstCard == null) {
        const randomIndex = Math.floor(Math.random() * cards.length-1);
        const randomCard = cards[randomIndex];
        if (!isNaN(randomCard.value)) {
            firstCard = randomCard;
            cards.splice(randomIndex, 1);
        }
    }
    return firstCard;
}

function pickCard(cards) {
    const card = cards.pop();
    return card;
}

function getCardDeck() {
    const cards = [];

    ['red', 'green', 'blue', 'yellow'].forEach((color) => {
        ['0', '1', '2', '3', '4', '5', '6', '7', '8','9','SKIP', 'REVERSE', 'DRAW_2'].forEach((value) => {
            cards.push(getCard(color, value));
            if(value !== '0') { // there is only one 0 card, all other cards are repeated in a color
                cards.push(getCard(color, value));
            }
        });
    });
    for(let i=0; i< 4; i++) {
        cards.push(getCard('black', 'WILD'))
        cards.push(getCard('black', 'WILD_DRAW4'))
    }
    // Durstenfeld shuffle algorithm
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }

    return {
        cards
    }
}


// Player Utils

function getPlayer(name) {
    return {
        name,
        cards: [],
        allowedToSkip: false,
        isAdmin: false,
        unoStatus: '', // UNO_CALLED, PENALIZED
    }
}

function addCardToPlayer(player, card) {
    player.cards.push(card);
}

function removeCardFromPlayer(player, color, value) {
    const cardIndex = player.cards.findIndex(card => card.value === value && (card.value.includes('WILD') || card.color === color));
    player.cards.splice(cardIndex, 1);
}


// Game Utils

function createGame(gameID) {
    return {
         gameID,
         players: [],
         gameDeck: getCardDeck(),
         discardedCardDeck: [],
         status: 'NOT_STARTED',
         currentPlayer: null,
         direction: 'CLOCKWISE',
         winner: null,
    }
}

function addPlayerToGame(game, playerName) {
    if (game.status !== 'NOT_STARTED') {
        return "INVALID_GAME_STATUS";
      }
      if (game.players.some(({name}) => name === playerName)) {
          return "PLAYER_NAME_USED";
      }
      const player = getPlayer(playerName);
      if(game.players.length === 0) { // first player is the admin
        player.isAdmin = true;
      }
      game.players.push(player);
      return "SUCCESS";
}

function startGame(game, restartGame=false) {

    if (restartGame === true) {
        const players = game.players.map(player => getPlayer(player.name));
        players[0].isAdmin = true;

        game = createGame(game.gameID);
        game.players = players;

        game.discardedCardDeck = [];
    }


    // deal cards
    for (let i=0; i<7; i++) {
        game.players.forEach(player => {
            addCardToPlayer(player, pickCard(game.gameDeck.cards));
        });
    }

    // get first card for discard pile
    game.discardedCardDeck.push(getRandomFirstCard(game.gameDeck.cards));

    // assign random player to begin game
    game.currentPlayer = game.players[Math.floor(Math.random() * game.players.length)].name;
    game.status = "STARTED";
    return game;
}

function setNextPlayer(game) {
    const currentPlayerName = game.currentPlayer;
    const currentPlayerIndex = game.players.findIndex(player => player.name === currentPlayerName);
    let nextPlayerIndex = 0;
    if(game.direction === 'CLOCKWISE') {
        nextPlayerIndex = currentPlayerIndex + 1;
        if (nextPlayerIndex === game.players.length) {
            nextPlayerIndex = 0;
        }
    } else {
        nextPlayerIndex = currentPlayerIndex - 1;
        if (nextPlayerIndex === -1) {
            nextPlayerIndex = game.players.length - 1;
        }
    }
    game.currentPlayer = game.players[nextPlayerIndex].name;
}

function playPickCard(game, playerName, forcedToPick=false) {
    const player = game.players.find(player => player.name === playerName);
    const card = pickCard(game.gameDeck.cards);
    if (!forcedToPick) {
        // This player can not skip the turn without playing a card
        player.allowedToSkip = true;
    }
    addCardToPlayer(player, card);
}

function callUNO(game, playerName) {
    const player = game.players.find(player => player.name === playerName);
    if(player.cards.length > 2) {
        return 'TOO_MANY_CARDS';
    }
    player.unoStatus = 'UNO_CALLED';
    return 'SUCCESS';
}

function catchUNO(game, playerNameToCatch) {
    const player = game.players.find(player => player.name === playerNameToCatch);
    if(player.cards.length >= 2) {
        return 'TOO_MANY_CARDS';
    } else if (player.unoStatus === 'UNO_CALLED') {
        return 'PLAYER_CALLED_UNO';
    } else if (player.unoStatus === 'PENALIZED') {
        return 'PLAYER_ALREADY_PENALIZED';
    }
    playPickCard(game, player.name, true);
    playPickCard(game, player.name, true);
    playPickCard(game, player.name, true);
    playPickCard(game, player.name, true);
    player.unoStatus = 'PENALIZED';
}

function playCard(game, playerName, color, value) {
    if (game.currentPlayer !== playerName) {
        return 'NOT_PLAYERS_TURN';
    }
    if(!canPlayCard(game.discardedCardDeck[game.discardedCardDeck.length -1], getCard(color, value))) {
        return 'CANNOT_PLAY_CARD';
    }

    // take card away from player
    const player = game.players.find(player => player.name === playerName);
    removeCardFromPlayer(player, color, value);

    // add card to discard pile top
    game.discardedCardDeck.push(getCard(color, value));

    // take action based on card value
    if (value === 'WILD_DRAW4') {
        setNextPlayer(game);
        playPickCard(game, game.currentPlayer, true);
        playPickCard(game, game.currentPlayer, true);
        playPickCard(game, game.currentPlayer, true);
        playPickCard(game, game.currentPlayer, true);
    }
    else if (value === 'DRAW_2') {
        setNextPlayer(game);
        playPickCard(game, game.currentPlayer, true);
        playPickCard(game, game.currentPlayer, true);
    } else if (value === 'SKIP') {
        setNextPlayer(game);
    } else if (value === 'REVERSE') {
        game.direction = game.direction === 'CLOCKWISE' ? 'ANTI_CLOCKWISE' : 'CLOCKWISE';
        if(game.players.length === 2) { // For two player game, reverse should work like Skip
            setNextPlayer(game);
        }
    }

    // Set next player to play
    setNextPlayer(game);

    //Check if anyone won
    const winner = game.players.find(player => player.cards.length === 0);
    if (winner != null) {
        game.status = 'COMPLETED';
        game.winner = winner.name;
    }
    return 'SUCCESS';
}

export default {
    createGame,
    addPlayerToGame,
    startGame,
    setNextPlayer,
    playPickCard,
    playCard,
    callUNO,
    catchUNO
}
