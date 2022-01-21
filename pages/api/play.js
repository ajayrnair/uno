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
        const color = req.query.color;
        const value = req.query.value;
        const newColor = req.query.newColor;
        const status = Games.getGame(gameID).playCard(name, color, value);
        res.status(200).json({status});
    }
}
