import Games from './games';

export default function handler(req, res) {
    const name = req.query.name;
    const gameID = req.query.gameID;
    if(name == null || gameID == null) {
        res.status(500).json({name, gameID, error: 'name and gameID cannot be null'});
    }
    const game = Games.getGame(gameID);
    const status = game.addPlayer(name);
    if (status === "SUCCESS") {
        res.status(200).json(Games.getGameStateForUser(game, name));
    } else {
        res.status(500).json({status: status});
    }
}
