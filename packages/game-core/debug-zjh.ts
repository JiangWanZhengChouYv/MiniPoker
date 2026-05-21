
import { Card, Suit, Rank } from './src/Card';
import { ZhaJinHuaHandAnalyzer, ZhaJinHuaHandType } from './src/ZhaJinHua';

console.log('Testing ZhaJinHua compare function...');

const singleCards = [
  new Card(Suit.Hearts, Rank.Three),
  new Card(Suit.Diamonds, Rank.Four),
  new Card(Suit.Clubs, Rank.Five)
];
const singleResult = ZhaJinHuaHandAnalyzer.analyze(singleCards);
console.log('Single cards:', singleCards.map(c => c.toString()));
console.log('Single result:', singleResult);

const pairCards = [
  new Card(Suit.Hearts, Rank.Ten),
  new Card(Suit.Diamonds, Rank.Ten),
  new Card(Suit.Clubs, Rank.King)
];
const pairResult = ZhaJinHuaHandAnalyzer.analyze(pairCards);
console.log('Pair cards:', pairCards.map(c => c.toString()));
console.log('Pair result:', pairResult);

if (singleResult &amp;&amp; pairResult) {
  const result1 = ZhaJinHuaHandAnalyzer.compare(pairResult, singleResult);
  console.log('Compare pair vs single:', result1);
  
  const typeOrder = [
    ZhaJinHuaHandType.Single,
    ZhaJinHuaHandType.Pair,
    ZhaJinHuaHandType.Straight,
    ZhaJinHuaHandType.Flush,
    ZhaJinHuaHandType.FullHouse,
    ZhaJinHuaHandType.FourOfAKind,
    ZhaJinHuaHandType.StraightFlush
  ];
  
  console.log('typeOrder:', typeOrder);
  console.log('pairResult.type:', pairResult.type);
  console.log('singleResult.type:', singleResult.type);
  console.log('pairResult index:', typeOrder.indexOf(pairResult.type));
  console.log('singleResult index:', typeOrder.indexOf(singleResult.type));
}
