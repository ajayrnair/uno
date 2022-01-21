export default function canPlayCard(currentTopCard, cardToPlay) {
    return (cardToPlay.color === currentTopCard.color || currentTopCard.value === cardToPlay.value | cardToPlay.value.includes('WILD'));
}
