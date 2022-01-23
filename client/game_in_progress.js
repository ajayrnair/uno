import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import fetch from 'node-fetch';
import canPlayCard from './canPlayCard';
import {useState} from 'react';

function getColor(color) {
    if (color==='red') {
        return '#D72600';
    }
    if (color==='green') {
        return '#379711';
    }
    if (color==='yellow') {
        return '#ECD407';
    }
    if (color==='blue') {
        return '#0956BF';
    }
    return '#1f1f1f';
}

function getDisplayValue(value) {
    if(value==='DRAW_2') {
        return '2+';
    }
    if(value==='WILD') {
        return 'W';
    }
    if(value==='WILD_DRAW4') {
        return '4+';
    }
    if(value==='SKIP') {
        return <Image
            src="/images/skip.png" // Route of the image file
            height={20} // Desired size with correct aspect ratio
            width={20} // Desired size with correct aspect ratio
            alt="skip"
        />;
    }
    if(value==='REVERSE') {
        return <Image
            src="/images/reverse.png" // Route of the image file
            height={20} // Desired size with correct aspect ratio
            width={20} // Desired size with correct aspect ratio
            alt="reverse"
        />;
    }
    return value;


}

export default function GameInProgress() {
    const game = useSelector( state => state.game);
    const dispatch = useDispatch();
    const playerName  = game.name;
    const player = game.game.players.find(player => player.name === playerName);
    const playerCards = player.cards;
    const otherPlayers = game.game.players.map(player => {
        return {
            name: player.name,
            numberOfCards: player.cards.length,
            unoStatus: player.unoStatus
        };
    });
    const [isNewColorRequired, setIsNewColorRequired] = useState(false);
    const [wildTypeDraw4, setWildTypeDraw4] = useState(null);
    const topCard = game.game.discardedCardDeck[game.game.discardedCardDeck.length - 1];
    const currentPlayer = game.game.currentPlayer;
    const isTurn = playerName === currentPlayer
    return <div className='gameArea'>
        {game.game.direction === 'CLOCKWISE' && <div style={{textAlign: 'center', fontSize: 24, marginBottom: 8}}>&#8594;  &#8594;  &#8594;</div>}
        {game.game.direction !== 'CLOCKWISE' && <div style={{textAlign: 'center', fontSize: 24, marginBottom: 8}}>&#x2190;  &#x2190;  &#x2190;</div>}
        <div className = 'otherPlayers' style={{display: 'flex', justifyContent: 'space-around', flexWrap:'wrap'}}>
            {otherPlayers.map(player => {
                const thisPlayer = game.game.players.find(player => player.name === playerName);
                return (
                    <div>
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
                        {player.name !== thisPlayer.name && currentPlayer != player.name && player.numberOfCards < 2 && player.unoStatus !== 'UNO_CALLED' && player.unoStatus !== 'PENALIZED' && <div style={{fontSize: '12px', textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#C02F1D'}}>
                            <a onClick={() => {

                            }}>&#128110; Catch UNO</a>
                        </div>}
                        {player.name !== thisPlayer.name && player.numberOfCards < 2 && player.unoStatus === 'UNO_CALLED' && <div style={{fontSize: '12px', textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#C02F1D'}}>
                        &#128526; Shouted UNO!
                        </div>}
                    </div>
                );
            })}
        </div>

        <div className='discardCardArea' style={{marginTop:'48px', display: 'flex', justifyContent:'center'}}>
            <div>
                <div className='card' style={{backgroundColor: getColor(topCard.color), textAlign:'center'}}>
                    {getDisplayValue(topCard.value)}
                </div>
            </div>
        </div>

        {isNewColorRequired && <div style={{margin: '32px 0 12px 0', display:'flex', justifyContent: 'space-around', border: '1px solid #aeaeae', borderRadius: '10px', backgroundColor: '#3C6478', padding: '10px'}}>
                <div>
                    <button style={{color: 'white', backgroundColor:`${getColor('red')}`}} disabled={!isNewColorRequired} onClick={() => {
                        fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=red&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                        setWildTypeDraw4(null);
                        setIsNewColorRequired(false);
                    }}>Red</button>
                </div>
                <div>
                    <button  style={{color: 'white',backgroundColor:`${getColor('green')}`}} disabled={!isNewColorRequired} onClick={() => {
                        fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=green&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                        setWildTypeDraw4(null);
                        setIsNewColorRequired(false);
                    }}>Green</button>
                </div>
                <div>
                    <button style={{color: 'white',backgroundColor:`${getColor('yellow')}`}} disabled={!isNewColorRequired} onClick={() => {
                        fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=yellow&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                        setWildTypeDraw4(null);
                        setIsNewColorRequired(false);
                    }}>Yellow</button>
                </div>
                <div>
                    <button disabled={!isNewColorRequired} style={{color: 'white', backgroundColor:`${getColor('blue')}`}} onClick={() => {
                        fetch(`/api/play?name=${playerName}&gameID=${game.gameID}&color=blue&value=${wildTypeDraw4 === true ? 'WILD_DRAW4' : 'WILD'}`, {method: 'GET'});
                        setWildTypeDraw4(null);
                        setIsNewColorRequired(false);
                    }}>Blue</button>
                </div>
             </div>}

        <div className = 'cards' style={{display: 'flex', justifyContent: 'center', flexWrap:'wrap', marginTop: 48}}>
               {playerCards.map((card, index) => {
                   const canPlay = canPlayCard(topCard, card);
                   return (
                        <div className='card' style={{textAlign:'center', backgroundColor: getColor(card.color), cursor: canPlay ? 'pointer': ''}} key={index}  onClick={() => {
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
                            {getDisplayValue(card.value)}
                        </div>
                   );
               })}
        </div>
        <div className = 'actionArea' style={{marginTop:'20px', display: 'flex', justifyContent:'center', marginTop: '48px', flexDirection: 'column'}}>
              {player.allowedToSkip !== true && <div style={{display:'flex', justifyContent:'center'}}>
                <button disabled={!isTurn} onClick={() => {
                    fetch(`/api/pick?name=${playerName}&gameID=${game.gameID}`, {method: 'GET'});
                }}>Pick A Card</button>
             </div>}
             {player.allowedToSkip == true && <div style={{display:'flex', justifyContent:'center'}}>
                <button disabled={!isTurn} onClick={() => {
                    fetch(`/api/skip?name=${playerName}&gameID=${game.gameID}`, {method: 'GET'});
                }}>Skip turn</button>
             </div>}
             {playerCards.length <= 2 && player.unoStatus !== 'UNO_CALLED' &&
                <div style={{display:'flex', justifyContent:'center', marginTop: '10px'}}>
                    <button onClick={() => {
                        fetch(`/api/calluno?name=${playerName}&gameID=${game.gameID}`, {method: 'GET'});
                    }}>Shout UNO</button>
                </div>
             }
        </div>
    </div>;

}
