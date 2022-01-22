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
    const adminPlayer = game.game.players.find(player => player.isAdmin === true);
    const isPlayerAdmin = adminPlayer !=null && adminPlayer.name === game.name;

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
                                <div style={{fontSize: 16, marginBottom: 12}}>Copy the link below and share with your friends to play together</div>
                                <input id='copy_url' value={`https://nairuno.vercel.app/?gameID=${game.gameID}`} disabled/> <button style={{fontSize: 12}} onClick={() => {
                                    var copyText = document.getElementById("copy_url");

                                    /* Select the text field */
                                    copyText.select();
                                    copyText.setSelectionRange(0, 99999); /* For mobile devices */

                                     /* Copy the text inside the text field */
                                    navigator.clipboard.writeText(copyText.value);
                                }}>Copy</button>
                            </div>
                            <div className='players' style={{marginTop: 50, marginBottom: 50, display: 'flex', flexDirection: 'column',}}>
                                {game.game.players.map(player => {
                                    return (<div style={{display: 'flex', marginBottom: 16}} key={player.name}>
                                        <div>&#128100;</div>
                                        <div style={{marginLeft: 12}}>{player.name}</div>
                                    </div>);
                                })}
                            </div>
                            {isPlayerAdmin && game.game.players.length >= 2 &&
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
