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
                <div className='start-area'>
                    {gameStatus === 'NOT_STARTED' && <div style={{textAlign: 'center'}}>
                        <div>
                            <div className='start-area-game-id'>
                                Game ID: <span>{game.gameID} &#128203;</span>
                            </div>
                            <div className='players' style={{marginTop: 50, marginBottom: 50, display: 'flex', flexDirection: 'column',}}>
                                {game.game.players.map(player => {
                                    return (<div style={{display: 'flex', marginBottom: 16}} key={player.name}>
                                        <div>&#128100;</div>
                                        <div style={{marginLeft: 12}}>{player.name}</div>
                                    </div>);
                                })}
                            </div>
                            {game.game.players.length >= 2 &&
                                <div>
                                    <div>
                                        <button  onClick={() => {
                                            fetch(`/api/start?name=${game.name}&gameID=${game.gameID}`, {method: 'GET'});
                                        }}>Start Game</button>
                                    </div>
                                    <div className='info-message' style={{marginTop: 8}}>Start after everyone joins</div>
                                </div>
                            }
                        </div>
                    </div>}

                    {gameStatus === 'STARTED' && <GameInProgress />}
                    {gameStatus === 'COMPLETED' && <div>{game.game.winner} won the game!</div>}
                </div>
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
