import memjs from 'memjs';
import GameUtils from './game';

var memc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
})

async function getGame(gameID, createNew=false) {
    const {value} = await memc.get(gameID);
    if (value) {
        return JSON.parse(value);
    } else if (createNew === true) {
        const game = GameUtils.createGame(gameID);
        memc.set(gameID, JSON.stringify(game));
        return game;
    }
    return null;
}

export default {
    async getGame(gameID, createNew=false) {
        return await getGame(gameID, createNew);
    },

    async saveGame(game) {
        await memc.set(game.gameID, JSON.stringify(game));
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
}
