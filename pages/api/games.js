import canPlayCard from '../../client/canPlayCard';

class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }
}


class GameDeck {
    constructor() {
        this.cards = [];
        ['red', 'green', 'blue', 'yellow'].forEach((color) => {
            ['0', '1', '2', '3', '4', '5', '6', '7', '8','9','SKIP', 'REVERSE', 'DRAW_2'].forEach((value) => {
                this.cards.push(new Card(color, value));
                if(value !== '0') { // there is only one 0 card, all other cards are repeated in a color
                    this.cards.push(new Card(color, value));
                }
            });
        });
        for(let i=0; i< 4; i++) {
            this.cards.push(new Card('black', 'WILD'))
            this.cards.push(new Card('black', 'WILD_DRAW_4'))
        }
        // Durstenfeld shuffle algorithm
        for (var i = this.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    getRandomFirstCard() {
        let firstCard = null;
        while(firstCard == null) {
            const randomIndex = Math.floor(Math.random() * this.cards.length);
            const randomCard = this.cards[randomIndex];
            if (!isNaN(randomCard.value)) {
                firstCard = randomCard;
                this.cards.splice(randomIndex, 1);
            }
        }
        return firstCard;
    }

    pickCard() {
        const card = this.cards.pop();
        return card;
    }
}


class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard(color, value) {
        const cardIndex = this.cards.findIndex(card => card.value === value && (card.value.includes('WILD') || card.color === color));
        this.cards.splice(cardIndex, 1);
    }
}

class Game {
    constructor(gameID) {
        this.gameID = gameID;
        this.players = [];
        this.gameDeck = new GameDeck();
        this.discardedCardDeck = [];
        this.status = "NOT_STARTED";
        this.currentPlayer = null;
        this.direction = "CLOCKWISE";
    }

    addPlayer(playerName) {
        if (this.status !== 'NOT_STARTED') {
          return "INVALID_GAME_STATUS";
        }
        if (this.players.some(({name}) => name === playerName)) {
            return "PLAYER_NAME_USED";
        }
        this.players.push(new Player(playerName));
        return "SUCCESS";
    }

    startGame() {
        // deal cards
        for (let i=0; i<7; i++) {
            this.players.forEach(player => {
                player.addCard(this.gameDeck.pickCard());
            });
        }

        // get first card for discard pile
        this.discardedCardDeck.push(this.gameDeck.getRandomFirstCard());

        // assign random player to begin game
        this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)].name;
        this.status = "STARTED";
    }

    setNextPlayer() {
        const currentPlayerName = this.currentPlayer;
        const currentPlayerIndex = this.players.findIndex(player => player.name === currentPlayerName);
        let nextPlayerIndex = 0;
        if(this.direction === 'CLOCKWISE') {
            nextPlayerIndex = currentPlayerIndex + 1;
            if (nextPlayerIndex === this.players.length) {
                nextPlayerIndex = 0;
            }
        } else {
            nextPlayerIndex = currentPlayerIndex - 1;
            if (nextPlayerIndex === -1) {
                nextPlayerIndex = this.players.length - 1;
            }
        }
        this.currentPlayer = this.players[nextPlayerIndex].name;
    }

    pickCard(playerName) {
        const player = this.players.find(player => player.name === playerName);
        const card = this.gameDeck.pickCard();
        player.addCard(card);
    }

    playCard(playerName, color, value) {
        if (this.currentPlayer !== playerName) {
            return 'NOT_PLAYERS_TURN';
        }
        if(!canPlayCard(this.discardedCardDeck[this.discardedCardDeck.length -1], new Card(color, value))) {
            return 'CANNOT_PLAY_CARD';
        }

        // take card away from player
        const player = this.players.find(player => player.name === playerName);
        player.removeCard(color, value);

        // add card to discard pile top
        this.discardedCardDeck.push(new Card(color, value));

        // take action based on card value
        if (value === 'DRAW_2') {
            this.setNextPlayer();
            this.pickCard(this.currentPlayer);
            this.pickCard(this.currentPlayer);
        } else if (value === 'SKIP') {
            this.setNextPlayer();
        } else if (value === 'REVERSE') {
            this.direction = this.direction === 'CLOCKWISE' ? 'ANTI_CLOCKWISE' : 'CLOCKWISE';
        }

        // Set next player to play
        this.setNextPlayer();
        return 'SUCCESS';
    }
}

const games = {};

export default {
    getGame(gameID) {
        if(!games[gameID]) {
            games[gameID] = new Game(gameID);
        }
        return games[gameID];
    },

    hasGame(gameID) {
        return games[gameID] != null;
    },

    getGameStateForUser(game, playerName) {
        return {
            name: playerName,
            gameID: game.gameID,
            game: {
                ...game,
                players: game.players.map(player => {
                    if (player.name === playerName) {
                        return player;
                    } else {
                        return {
                            ...player,
                            cards: player.cards.map(() => {})
                        }
                    }
                })
            }
        }
    }
};
