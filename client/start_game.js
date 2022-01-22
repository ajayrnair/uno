import fetch from 'node-fetch';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateGame } from './gameSlice'
import GamePlay from './game';
import Image from 'next/image'

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
      <div style={{display:'flex',flexDirection: 'column', alignItems: 'center'}}>
        <input type='text' placeholder='Player Name' onChange={event => setName(event.target.value || '')} maxLength={6}/>
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
            setErrorMessage('This game has already started or ended');
          } else if(gameData.status === 'PLAYER_NAME_USED')  {
            setErrorMessage('This name is already used.');
          } else {
            dispatch(updateGame(gameData));
          }
        }}>{buttonLabel}</button>
        <div className='error-message' style={{marginTop: 10}}>{errorMessage}</div>
      </div>
    );
  } else {
    return <GamePlay />;
  }
}
