import Games from '../../server_game/game_manager';

export default async function handler(req, res) {
    const name = req.query.name;
    const gameID = req.query.gameID;
    if(name == null || gameID == null) {
        res.status(500).json({name, gameID, error: 'name and gameID cannot be null'});
    }
    const game = await Games.getGame(gameID);
    if(!game) {
        res.status(200).json({status: 'GAME_DOES_NOT_EXIST'});
    } else {
        res.status(200).json(Games.getGameStateForUser(game, name));
    }

}
