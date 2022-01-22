
import { useSelector, useDispatch } from 'react-redux'
import fetch from 'node-fetch';
import canPlayCard from './canPlayCard';
import {useState} from 'react';

function getColor(color) {
    if (color==='red') {
        return '#872a23';
    }
    if (color==='green') {
        return '#3d8033';
    }
    if (color==='yellow') {
        return '#c7a022';
    }
    if (color==='blue') {
        return '#1f41bf';
    }
    return 'black';
}

export default function GameInProgress() {
    const game = useSelector( state => state.game);
    const dispatch = useDispatch();
    const playerName  = game.name;
    const player = game.game.players.find(player => player.name === playerName);
    const playerCards = player.cards;
    const otherPlayers = game.game.players.filter(player => player.name !== playerName).map(player => {
        return {
            name: player.name,
            numberOfCards: player.cards.length
        };
    });
    const [isNewColorRequired, setIsNewColorRequired] = useState(false);
    const [wildTypeDraw4, setWildTypeDraw4] = useState(null);
    const topCard = game.game.discardedCardDeck[game.game.discardedCardDeck.length - 1];
    const currentPlayer = game.game.currentPlayer;
    const isTurn = playerName === currentPlayer
    return <div className='gameArea'>
        <div className = 'otherPlayers' style={{display: 'flex', justifyContent: 'space-around'}}>
            {otherPlayers.map(player => {
                return (
                    <div className={`game-player${currentPlayer === player.name ? ' current-player' : ''}`} key={player.name} >
                        <div style={{display: 'flex', marginBottom: 12}} key={player.name}>
                            <div>&#128100;</div>
                            <div style={{marginLeft: 8, display: 'flex', alignItems: 'center'}}>{player.name}</div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div>&#127183;</div>
                            <div style={{marginLeft: 4, display: 'flex', alignItems: 'center'}}>{player.numberOfCards}</div>
                        </div>
                    </div>
                );
            })}
        </div>
        <div className='discardCardArea' style={{marginTop:'20px'}}>
            <div>
                <div className='card' style={{color: getColor(topCard.color)}}>
                    {topCard.value}
                </div>
                <div style={{color: 'pink', fontSize: '20px'}}>{game.game.direction==='CLOCKWISE' ? '⟳' : '↺'}</div>
            </div>
        </div>
        <div className = 'cards' style={{marginTop:'20px'}}>
               {playerCards.map(card => {
                   const canPlay = canPlayCard(topCard, card);
                   return (
                        <div className='card' style={{color: getColor(card.color), cursor: canPlay ? 'pointer': ''}} onClick={() => {
                            if (!isTurn) {
                                alert('Not your turn');
                            }
                            else if (canPlay) {
                                if(card.value.includes('WILD')) {
                                    setIsNewColorRequired(true);
                                    setWildTypeDraw4(card.value === 'WILD_DRAW4');
                                } else {
                                    fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=${card.color}&value=${card.value}`, {method: 'GET'});
                                }
                            } else {
                                alert('Cannot play this card on top of current card');
                            }
                        }}>
                            {card.value}
                        </div>
                   );
               })}
        </div>
        <div className = 'actionArea' style={{marginTop:'20px'}}>
              {player.allowedToSkip !== true && <div>
                <button disabled={!isTurn} onClick={() => {
                    fetch(`/api/pick?name=${playerName}&gameID=${game.gameID}`, {method: 'GET'});
                }}>Pick A Card</button>
             </div>}
             {player.allowedToSkip == true && <div>
                <button disabled={!isTurn} onClick={() => {
                    fetch(`/api/skip?name=${playerName}&gameID=${game.gameID}`, {method: 'GET'});
                }}>Skip turn</button>
             </div>}
             <div>
                <button disabled={!isNewColorRequired} onClick={() => {
                    fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=red&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                    setWildTypeDraw4(null);
                    setIsNewColorRequired(false);
                }}>Red</button>
             </div>
             <div>
                <button disabled={!isNewColorRequired} onClick={() => {
                    fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=green&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                    setWildTypeDraw4(null);
                    setIsNewColorRequired(false);
                }}>Green</button>
             </div>
             <div>
                <button disabled={!isNewColorRequired} onClick={() => {
                    fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=yellow&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                    setWildTypeDraw4(null);
                    setIsNewColorRequired(false);
                }}>Yellow</button>
             </div>
             <div>
                <button disabled={!isNewColorRequired} onClick={() => {
                    fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=blue&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                    setWildTypeDraw4(null);
                    setIsNewColorRequired(false);
                }}>Blue</button>
             </div>
        </div>
    </div>;

}
