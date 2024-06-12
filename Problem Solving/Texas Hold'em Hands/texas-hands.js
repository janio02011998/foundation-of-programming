const RANKS    = '2 3 4 5 6 7 8 9 10 J Q K A'.split(' ').reverse();
const COLORS   = [...'♠♦♣♥'];
const CARD2IDX = RANKS.reduce( (o,c,i)=>(o[c]=i,o), {});

const highestCardFirst             = (c,d) => CARD2IDX[c]-CARD2IDX[d];
const mostFrequentThenHighestFirst = (a,b) => b[1]-a[1] || CARD2IDX[a[0]]-CARD2IDX[b[0]];

const findStraight=cards=>{
    let cntS=1;
    for(let i=1;i<cards.length;i++){
        cntS = 1 === CARD2IDX[cards[i]] - CARD2IDX[cards[i-1]] ? cntS+1:1;
        if(cntS===5) return cards.slice(i-4,i+1);
    }
    return false;
}
const orderHandCards=(main,cnts)=>{
    let nothings = cnts.orderedCardsSet.filter(c=>!main.includes(c));
    return main.concat(nothings);
}
const counter=cards=>{
    let cnts = COLORS.reduce((o,k)=> (o[k]={cards:[], straight:0}, o), {});
    cnts.all = {cards:{}, byCounts:{}, straight:0};
    cnts.orderedCardsSet = [];
    
    cards.forEach( c => { let color=c.slice(-1), value=c.slice(0,-1);
                          cnts[color].cards.push(value);
                          cnts.all.cards[value] = cnts.all.cards[value]+1||1;
                        });
    
    cnts.orderedCardsSet = [...Object.keys(cnts.all.cards)].sort(highestCardFirst);
    cnts.all.straight    = findStraight(cnts.orderedCardsSet);
    COLORS.forEach(col=> cnts[col].straight = findStraight(cnts[col].cards.sort(highestCardFirst)) );
    
    let sortedEntries = [...Object.entries(cnts.all.cards)].sort(mostFrequentThenHighestFirst);
    for(let [c,n] of sortedEntries){
        ( cnts.all.byCounts[n] = cnts.all.byCounts[n]||[] ).push(c);
    }
    return cnts;
}

const RANKINGS = [
    ['straight-flush', cnts => { return COLORS.map(col=>cnts[col].straight).find(v=>v) }],
                            
    ['four-of-a-kind', cnts => { let four = cnts.all.byCounts[4]
                                 return four && orderHandCards(four,cnts).slice(0,2); }],
                                             
    ['full house',     cnts => { let three = cnts.all.byCounts[3];
                                 let full  = (three||[]).concat(cnts.all.byCounts[2]||[]).slice(0,2);
                                 return three && full.length==2 && full; }],
                            
    ['flush',          cnts => { let flush = COLORS.map(col=>cnts[col].cards).find(a=>a.length>=5);
                                 return flush && flush.slice(0,5); }],
                            
    ['straight',       cnts => { return cnts.all.straight }],
                            
    ['three-of-a-kind',cnts => { let three = cnts.all.byCounts[3];
                                 return three && orderHandCards(three,cnts).slice(0,3); }],
                            
    ['two pair',       cnts => { let pair = cnts.all.byCounts[2];
                                 return pair && pair.length>1 && orderHandCards(pair.slice(0,2),cnts).slice(0,3); }],
                            
    ['pair',           cnts => { let pair = cnts.all.byCounts[2];
                                 return pair && orderHandCards(pair,cnts).slice(0,4); }],
                            
    ['nothing',        cnts => { return cnts.orderedCardsSet.slice(0,5) }],
];


function hand(holeCards, comCards) {
  let cnts = counter(holeCards.concat(comCards));
  for(let [name,rule] of RANKINGS){
      let out = rule(cnts);
      if(out && out.length) return {type:name, ranks: out};
  }
}