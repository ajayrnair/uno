import { useSelector, useDispatch } from 'react-redux'
import fetch from 'node-fetch';
import { updateGame } from './gameSlice'
import {useState} from 'react';
import GameInProgress from './game_in_progress';

let intervalID;

export default function GamePlay() {
    const game = useSelector( state => state.game);
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');

    if (intervalID == null) {
        intervalID = window.setInterval(async () => {
          const response = await fetch(`/api/fetch?name=${game.name}&gameID=${game.gameID}`, {method: 'GET'});
          const gameData = await response.json();
          if (gameData.status === 'GAME_DOES_NOT_EXIST') {
            setErrorMessage('This game no longer exists!');
          } else {
            dispatch(updateGame(gameData));
          }
        }, 1000);
    }

    const gameStatus = game.game.status;
    if (errorMessage.length === 0) {
        return (
            <div>
                <div>
                    Name: {game.name}
                </div>
                <div>
                    Game ID: {game.gameID}
                </div>
                <div>
                    Number of Players: {game.game.players.length}
                </div>
                {gameStatus === 'NOT_STARTED' && <div>
                    { game.game.players.length >= 2 && <button  onClick={() => {
                        fetch(`/api/start?name=${game.name}&gameID=${game.gameID}`, {method: 'GET'});
                    }}>Start Game</button>}
                {game.game.players.length < 2 && <div>Waiting for more players to join</div>
                }
                </div>}
                {gameStatus === 'STARTED' && <GameInProgress />}
                {/*Game completed*/}
            </div>
        );
    } else {
        if (intervalID != null) {
            window.clearInterval(intervalID);
            intervalID = null;
        }
        return (<div>
            <div style={{color:'red'}}>{errorMessage}</div>
            <button onClick={() => {
                dispatch(updateGame(null));
            }}>Start new game</button>
        </div>);
    }
}
