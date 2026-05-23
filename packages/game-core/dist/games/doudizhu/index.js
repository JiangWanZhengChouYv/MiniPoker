import { HandType } from '../../types';
import { CardUtil } from '../../card';
import { HandUtil } from '../../hand';
export class DouDiZhuGame {
    deck;
    players;
    landlord = null;
    currentPlayerId = null;
    lastPlayedHand = null;
    lastPlayerId = null;
    landlordCards = [];
    passedPlayers = new Set();
    constructor(playerNames) {
        if (playerNames.length !== 3) {
            throw new Error('DouDiZhu requires exactly 3 players');
        }
        this.players = playerNames.map((name, index) => ({
            id: `player_${index}`,
            name,
            cards: [],
            isAI: false
        }));
        this.deck = CardUtil.createStandardDeck(true);
        this.shuffleDeck();
    }
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    dealCards() {
        for (let i = 0; i < 17; i++) {
            for (const player of this.players) {
                player.cards.push(this.deck.pop());
            }
        }
        this.landlordCards = [...this.deck];
        this.deck = [];
        for (const player of this.players) {
            player.cards = CardUtil.sortCards(player.cards, false);
        }
    }
    setLandlord(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            throw new Error('Player not found');
        }
        this.landlord = player;
        player.cards.push(...this.landlordCards);
        player.cards = CardUtil.sortCards(player.cards, false);
        this.currentPlayerId = playerId;
    }
    getPlayers() {
        return [...this.players];
    }
    getPlayer(playerId) {
        return this.players.find(p => p.id === playerId);
    }
    getLandlord() {
        return this.landlord;
    }
    getCurrentPlayerId() {
        return this.currentPlayerId;
    }
    getLastPlayedHand() {
        return this.lastPlayedHand;
    }
    getLandlordCards() {
        return [...this.landlordCards];
    }
    checkHand(cards) {
        if (cards.length === 0) {
            return { type: HandType.SINGLE, mainRank: 0, cards, isValid: false };
        }
        let result = HandUtil.isRocket(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isBomb(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isSingle(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isPair(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isTriple(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isTripleOne(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isTripleTwo(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isStraight(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isStraightPair(cards);
        if (result.isValid)
            return result;
        result = HandUtil.isPlane(cards);
        if (result.isValid)
            return result;
        return { type: HandType.SINGLE, mainRank: 0, cards, isValid: false };
    }
    playHand(playerId, cards) {
        if (this.currentPlayerId !== playerId) {
            return false;
        }
        const player = this.players.find(p => p.id === playerId);
        if (!player) {
            return false;
        }
        const handResult = this.checkHand(cards);
        if (!handResult.isValid) {
            return false;
        }
        if (this.lastPlayedHand && this.lastPlayerId !== playerId) {
            if (HandUtil.compareHand(handResult, this.lastPlayedHand) <= 0) {
                return false;
            }
        }
        for (const card of cards) {
            const index = player.cards.findIndex(c => c.id === card.id);
            if (index === -1) {
                return false;
            }
            player.cards.splice(index, 1);
        }
        this.lastPlayedHand = handResult;
        this.lastPlayerId = playerId;
        this.passedPlayers.clear();
        this.nextPlayer();
        return true;
    }
    pass(playerId) {
        if (this.currentPlayerId !== playerId) {
            return false;
        }
        if (!this.lastPlayedHand) {
            return false;
        }
        this.passedPlayers.add(playerId);
        if (this.passedPlayers.size >= 2) {
            this.lastPlayedHand = null;
            this.lastPlayerId = null;
            this.passedPlayers.clear();
        }
        this.nextPlayer();
        return true;
    }
    nextPlayer() {
        const currentIndex = this.players.findIndex(p => p.id === this.currentPlayerId);
        const nextIndex = (currentIndex + 1) % this.players.length;
        this.currentPlayerId = this.players[nextIndex].id;
    }
    isGameOver() {
        return this.players.some(p => p.cards.length === 0);
    }
    getWinner() {
        if (!this.isGameOver()) {
            return null;
        }
        return this.players.find(p => p.cards.length === 0) || null;
    }
    getPassedPlayers() {
        return new Set(this.passedPlayers);
    }
}
//# sourceMappingURL=index.js.map