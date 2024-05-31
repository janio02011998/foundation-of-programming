function clearSymbols(arrCards) {
  return arrCards.map(item => item.replace(/[^\w\s]/gi, ''));
}

function applyCardOrder(arrCards, rankSystem, cardsWithSuits, symbols){
  const cardsSorted = arrCards.sort((a, b) => {
    let positionA = rankSystem.indexOf(a);
    let positionB = rankSystem.indexOf(b);
    
    return positionA - positionB;
  });

  if (Array.from(new Set(symbols)).length <= 3) {
    let cardsSuit = {};
    
    for (i = 0; i < symbols.length; i++) {
      cardsSuit[symbols[i]] = [];

      for (j = 0; j < cardsSorted.length; j++) {
        if (cardsWithSuits.includes(`${cardsSorted[j]}${symbols[i]}`)) {
            cardsSuit[symbols[i]].push(cardsSorted[j]);
        }
      }
    }
    
   let isFlushRank = {
      valid: false,
      rankFlusk: []
   };
    
    Object.keys(cardsSuit).map(key => {
      if (cardsSuit[key].length === 5) {
        isFlushRank.valid = true;
        isFlushRank.rankFlusk = cardsSuit[key];
      }
    })
    
    if (isFlushRank.valid) {
      return isFlushRank.rankFlusk
    }
  }
  
  let isHigherToLow;
  let test = []
  for (i = 0; i < cardsSorted.length - 1; i++) {
    console.log(rankSystem.indexOf(cardsSorted[i]), rankSystem.indexOf(cardsSorted[i+1]) - 1)
     if(rankSystem.indexOf(cardsSorted[i]) === rankSystem.indexOf(cardsSorted[i+1]) - 1) {
       isHigherToLow = true;
       test.push(cardsSorted[i]);
       if (test.length === 5) break;
     } else {
           console.log("no")

       isHigherToLow = false;
       break;
     }
  }
  if (isHigherToLow) {
  }
  console.log("No", cardsSorted)
  return cardsSorted;
}

function applyOrderToDuplicateCases(sortedCards) {
 let cardsOrder = [];
  
  sortedCards.forEach(sortedCard => {
    if (cardsOrder.some((item) => item.number === sortedCard)) {
     const index = cardsOrder.findIndex(c => c.number === sortedCard);
     const total = cardsOrder.find(c => c.number === sortedCard).order + 1;
      
     cardsOrder.splice(index, 1) 
     cardsOrder.push({
       number: sortedCard, order: total
     })

    } else {
      cardsOrder.push({number: sortedCard, order: 1})
    }
  })
    
  const cardsSortedByOrder = cardsOrder.sort((a, b) => b.order - a.order);
  
  let totalRank = 0;
  let cardsSortedByOrderNumbers = [];

  let i = 0;
  while ( totalRank < 5) {
    cardsSortedByOrderNumbers.push(cardsSortedByOrder[i].number);
    totalRank = totalRank + cardsSortedByOrder[i].order;
    i++;
  } 
  
  return { cardsSortedByOrder: cardsSortedByOrderNumbers.slice(0,5), cardsOrder: cardsOrder.sort((a, b) => b.order - a.order)};
}


function hand(holeCards, communityCards) {
  const rankSystem = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
  
  const symbols = holeCards.concat(communityCards).map(c => c.slice(-1));
  
  const communitCardsWithoutSymbols = clearSymbols(communityCards);
  
  const holeCardsWithoutSymbols = clearSymbols(holeCards);
    
  const rankGroup = communitCardsWithoutSymbols.concat(holeCardsWithoutSymbols);
  
  const { cardsSortedByOrder, cardsOrder } = 
        applyOrderToDuplicateCases(applyCardOrder(rankGroup, rankSystem, communityCards.concat(holeCards), symbols));
  
  const ranks = Array.from(new Set(cardsSortedByOrder));
  
  const types = {
    'nothing': {
      rule: {
        rankTotal: 5,
        holeCardMaximumRecord: 1,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'pair': {
      rule: {
        rankTotal: 4,
        holeCardMaximumRecord: 2,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'two pair': {
      rule: {
        rankTotal: 3,
        holeCardMaximumRecord: 2,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'three-of-a-kind': {
      rule: {
        rankTotal: 3,
        holeCardMaximumRecord: 3,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'straight': {
      rule: {
        rankTotal: 5,
        holeCardMaximumRecord: 1,
        sortValidate:() => {
          let isHigherToLow;
          for (i = 0; i < ranks.length - 1; i++) {
             if(rankSystem.indexOf(ranks[i]) === rankSystem.indexOf(ranks[i+1]) - 1) {
               isHigherToLow = true;
             } else {
               isHigherToLow = false;
               break;
             }
          }
          
          return isHigherToLow;
        },
        sameSuit: () => true
      }
    },
    'flush': {
      rule: {
        rankTotal: 5,
        holeCardMaximumRecord: 1,
        sortValidate: () => true,
        sameSuit: () => {
          return Array.from(new Set(symbols)).length <= 3;
        }
      }
    },
    'full house': {
      rule: {
        rankTotal: 2,
        holeCardMaximumRecord: 3,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'four-of-a-kind': {
      rule: {
        rankTotal: 2,
        holeCardMaximumRecord: 4,
        sortValidate: () => true,
        sameSuit: () => true
      }
    },
    'straight-flush': {
      rule: {
        rankTotal: 5,
        holeCardMaximumRecord: 1,
        sortValidate: () => {
          let isHigherToLow;
          for (i = 0; i < ranks.length - 1; i++) {
             if(rankSystem.indexOf(ranks[i]) === rankSystem.indexOf(ranks[i+1]) - 1) {
               isHigherToLow = true;
             } else {
               isHigherToLow = false;
               break;
             }
          }
          
          return isHigherToLow;
        },
        sameSuit: () => {
          return Array.from(new Set(symbols)).length <= 3;
        }
      }
    },
  }
  
  let currentTypeRank; 
  
  Object.keys(types).forEach((key) => {
    const maximumOcurrenceCard = cardsOrder.sort((a, b) => b.order - a.order)[0].order;
    const isSortedRule = types[key].rule.sortValidate();
    const isSameSuit = types[key].rule.sameSuit();
    
    if (
      types[key].rule.rankTotal === ranks.length && 
      types[key].rule.holeCardMaximumRecord === maximumOcurrenceCard &&
      isSortedRule &&
      isSameSuit 
    ) {
      currentTypeRank = key;
    }
  })
  
  return {type: currentTypeRank, ranks};
}

