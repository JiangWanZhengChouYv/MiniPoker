import { CardUtil } from '../card';
export class Deck {
    cards;
    constructor(cards) {
        this.cards = [...cards];
    }
    static createStandardDeck(includeJokers = true) {
        return new Deck(CardUtil.createStandardDeck(includeJokers));
    }
    static createGuanDanDeck() {
        return new Deck(CardUtil.createGuanDanDeck());
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    shuffleFisherYates() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal(count) {
        if (count > this.cards.length) {
            throw new Error('Not enough cards in deck');
        }
        return this.cards.splice(0, count);
    }
    dealAll() {
        return this.cards.splice(0, this.cards.length);
    }
    dealToPlayers(playerCount, cardsPerPlayer) {
        const hands = [];
        for (let i = 0; i < playerCount; i++) {
            hands.push(this.deal(cardsPerPlayer));
        }
        return hands;
    }
    getRemainingCount() {
        return this.cards.length;
    }
    getCards() {
        return [...this.cards];
    }
    addCard(card) {
        this.cards.push(card);
    }
    addCards(cards) {
        this.cards.push(...cards);
    }
    reset(cards) {
        this.cards = [...cards];
    }
}
//# sourceMappingURL=index.js.map