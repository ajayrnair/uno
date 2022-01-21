
import { useSelector, useDispatch } from 'react-redux'
import fetch from 'node-fetch';
import { updateGame } from './gameSlice'
import {useState} from 'react';

export default function GameInProgress() {
    const game = useSelector( state => state.game);
    const dispatch = useDispatch();
    const playerName  = game.name;
    const otherPlayers = game.game.players.filter(player => player.name !== playerName).map(player => {
        return {
            name: player.name,
            numberOfCards: player.cards.length
        };
    });
    const currentPlayer = game.game.currentPlayer;
    const isTurn = playerName === currentPlayer
    console.log('playerName: ', playerName);
    console.log('otherPlayers: ', otherPlayers);
    console.log('currentPlayer: ', currentPlayer);
    return '';

}
