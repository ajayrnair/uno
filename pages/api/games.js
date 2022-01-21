class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }

    canPlay(topCard) {
        return this.value === 'WILD' || this.value === 'WILD_DRAW_4' || topCard.color === this.color || topCard.value === this.color;
    }
}


class GameDeck {
    constructor() {
        this.cards = [];
        ['red', 'green', 'yellow', 'blue'].forEach((color) => {
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

    pickCard() {
        return this.cards.pop();
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
        const cardIndex = this.cards.findIndex(card => card.color === color && card.value === value);
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

        // assign random player to begin game
        this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)].name;
        this.status = "STARTED";
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
