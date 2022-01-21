import Games from '../../server_game/game_manager';
import GameUtils from '../../server_game/game';

export default async function handler(req, res) {
    const name = req.query.name;
    const gameID = req.query.gameID;
    if(name == null || gameID == null) {
        res.status(500).json({name, gameID, error: 'name and gameID cannot be null'});
    }
    const game = await Games.getGame(gameID, true);
    const status = GameUtils.addPlayerToGame(game, name);
    if (status === "SUCCESS") {
        Games.saveGame(game);
        res.status(200).json(Games.getGameStateForUser(game, name));
    } else {
        res.status(500).json({status: status});
    }
}
