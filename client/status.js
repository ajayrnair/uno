import { useSelector } from 'react-redux'

export default function GameStatus() {
    const game = useSelector( state => state.game);
    let status = '';
    const gameStatus = game != null ? game.game.status : null;
    if(gameStatus == null) {
        status = "Invite friends and start a game!";
    } else if (gameStatus === 'NOT_STARTED') {
        if(game != null && game.game.players != null && game.game.players.length >= 2) {
            status = 'Waiting for game to start';
        } else {
            status = 'Waiting for players to join';
        }
    } else if (gameStatus === 'STARTED') {
        const currentPlayer = game.game.currentPlayer;
        const player = game.name;
        if (currentPlayer === player) {
            status = "It is your turn to play";
        } else {
            status = `${currentPlayer} is playing`;
        }
    } else {
        status = 'That is game! Another round?';
    }
    return (
        <div className='status-info'>{status}</div>
    );
}
