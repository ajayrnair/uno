import fetch from 'node-fetch';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateGame } from './gameSlice'
import GamePlay from './game';

let buttonLabel = 'Create Game';

setTimeout(() => {
  var queryDict = {};
  window.location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
  if (queryDict.gameID != null) {
    document.getElementById('create_button').innerHTML = 'Join Game';
  }
},1000);

export default function StartGame() {
  const dispatch = useDispatch();
  const game = useSelector( state => state.game);
  const isGameInitialized = game != null && game.name != null;

  let [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const isErrorState = name.trim() === '';

  if (!isGameInitialized) {
    return (
      <div style={{display:'flex',flexDirection: 'column', alignItems: 'center'}}>
        <input type='text' placeholder='Player Name' onChange={event => setName(event.target.value || '')} maxLength={6}/>
        <br/>
        <button id='create_button' disabled={isErrorState} onClick={async () => {
          name=name.trim();
          var queryDict = {};
          window.location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
          const gameSessionID = queryDict.gameID == null ? Math.random().toString(36).slice(3) : queryDict.gameID;
          const response = await fetch(`/api/join?name=${name}&gameID=${gameSessionID}`, {method: 'GET'});
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
