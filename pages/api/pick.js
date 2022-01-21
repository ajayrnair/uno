import Games from './games';

export default function handler(req, res) {
    const name = req.query.name;
    const gameID = req.query.gameID;
    if(name == null || gameID == null) {
        res.status(500).json({name, gameID, error: 'name and gameID cannot be null'});
    }
    if(!Games.hasGame(gameID)) {
        res.status(200).json({status: 'GAME_DOES_NOT_EXIST'});
    } else {
        Games.getGame(gameID).pickCard(name);
        Games.getGame(gameID).setNextPlayer();
    }
}
