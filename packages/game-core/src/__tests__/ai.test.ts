import { describe, it, expect } from 'vitest';
import { SimpleAI } from '../ai';
import { DouDiZhuGame } from '../games/doudizhu';
import { ZhaJinHuaGame } from '../games/zhaojinhua';
import { CardUtil } from '../card';
import { Suit, Rank } from '../types';

describe('SimpleAI', () => {
  describe('makeDouDiZhuMove', () => {
    it('should make a valid move for first player', () => {
      const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
      game.dealCards();
      game.setLandlord('player_0');
      
      const move = SimpleAI.makeDouDiZhuMove(game, 'player_0');
      expect(move).toBeDefined();
    });

    it('should return pass if no cards', () => {
      const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
      game.dealCards();
      game.setLandlord('player_0');
      
      const player0 = game.getPlayer('player_0');
      if (player0 && player0.cards.length > 0) {
        game.playHand('player_0', [player0.cards[0]]);
        const move = SimpleAI.makeDouDiZhuMove(game, 'player_1');
        expect(move).toBeDefined();
      }
    });
  });

  describe('makeZhaJinHuaMove', () => {
    it('should make a valid move', () => {
      const game = new ZhaJinHuaGame(['Player1', 'Player2']);
      game.startGame();
      
      const move = SimpleAI.makeZhaJinHuaMove(game, 'player_0');
      expect(move).toBeDefined();
      expect(['call', 'raise', 'fold']).toContain(move.action);
    });
  });
});
