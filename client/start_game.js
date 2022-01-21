import fetch from 'node-fetch';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateGame } from './gameSlice'
import GamePlay from './game';

export default function StartGame() {
  const dispatch = useDispatch();
  const game = useSelector( state => state.game);
  const isGameInitialized = game != null && game.name != null;

  let [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const isErrorState = name.trim() === '';
  const buttonLabel = gameID.trim() === '' ? 'Start Game' : 'Join Game';

  if (!isGameInitialized) {
    return (
      <div>
        <input type='text' placeholder='Player Name' onChange={event => setName(event.target.value || '')}/>
        <br/>
        <br/>
        <input type='text' placeholder="Game ID" onChange={event => setGameID(event.target.value || '')}/>
        <br/>
        <br/>
        <button disabled={isErrorState} onClick={async () => {
          name=name.trim();
          const response = await fetch(`/api/join?name=${name}&gameID=${gameID}`, {method: 'GET'});
          const gameData = await response.json();
          if(gameData.status === 'INVALID_GAME_STATUS') {
            setErrorMessage('You cannot join this game because it has already started or has completed.');
          } else if(gameData.status === 'PLAYER_NAME_USED')  {
            setErrorMessage('Someone else has used that name in this game.');
          } else {
            dispatch(updateGame(gameData));
          }
        }}>{buttonLabel}</button>
        <div style={{color:'red'}}>{errorMessage}</div>
      </div>
    );
  } else {
    return <GamePlay />;
  }
}