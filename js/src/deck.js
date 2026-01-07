import { Card } from "./card.js";

export class Deck {
  constructor() {
    this.deck = createDefaultDeck();
  }
  createDefaultDeck() {
    this.deck = [];
    addDefaultBricksCards(this.deck);
    addDefaultWeaponsCards(this.deck);
    addDefaultCrystalsCards(this.deck);
    this.shuffleDeck();
  }
  shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
  }
}

function addDefaultBricksCards(deck) {
  const cardType = CARD_TYPES.BRICKS;
  const resourceName = "Bricks";
  const wallCards = 3;
  for (let i = 0; i < wallCards; i++) {
    deck.push(
      new Card(
        "Wall",
        { resource: resourceName, amount: 1 },
        {
          self: [{ resource: "Fence", amount: 3 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const baseCards = 3;
  for (let i = 0; i < baseCards; i++) {
    deck.push(
      new Card(
        "Base",
        { resource: resourceName, amount: 1 },
        {
          self: [{ resource: "Castle", amount: 2 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const defenceCards = 3;
  for (let i = 0; i < defenceCards; i++) {
    deck.push(
      new Card(
        "Defence",
        { resource: resourceName, amount: 3 },
        {
          self: [{ resource: "Fence", amount: 6 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const reserveCards = 3;
  for (let i = 0; i < reserveCards; i++) {
    deck.push(
      new Card(
        "Reserve",
        { resource: resourceName, amount: 3 },
        {
          self: [
            { resource: "Fence", amount: -4 },
            { resource: "Castle", amount: 8 },
          ],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const towerCards = 3;
  for (let i = 0; i < towerCards; i++) {
    deck.push(
      new Card(
        "Tower",
        { resource: resourceName, amount: 6 },
        {
          self: [{ resource: "Castle", amount: 5 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const schoolCards = 3;
  for (let i = 0; i < schoolCards; i++) {
    deck.push(
      new Card(
        "School",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Builders", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const wainCards = 2;
  for (let i = 0; i < wainCards; i++) {
    deck.push(
      new Card(
        "Wain",
        { resource: resourceName, amount: 10 },
        {
          self: [{ resource: "Castle", amount: 8 }],
          enemy: [{ resource: "Castle", amount: 4 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const fenceCards = 2;
  for (let i = 0; i < fenceCards; i++) {
    deck.push(
      new Card(
        "Fence",
        { resource: resourceName, amount: 12 },
        {
          self: [{ resource: "Fence", amount: 22 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const fortCards = 2;
  for (let i = 0; i < fortCards; i++) {
    deck.push(
      new Card(
        "Fort",
        { resource: resourceName, amount: 18 },
        {
          self: [{ resource: "Castle", amount: 20 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const babylonCards = 2;
  for (let i = 0; i < babylonCards; i++) {
    deck.push(
      new Card(
        "Babylon",
        { resource: resourceName, amount: 39 },
        {
          self: [{ resource: "Castle", amount: 32 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
}

function addDefaultWeaponsCards(deck) {
  const cardType = CARD_TYPES.WEAPONS;
  const resourceName = "Weapons";
  const archerCards = 3;
  for (let i = 0; i < archerCards; i++) {
    deck.push(
      new Card(
        "Archer",
        { resource: resourceName, amount: 1 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 2 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const knightCards = 3;
  for (let i = 0; i < knightCards; i++) {
    deck.push(
      new Card(
        "Knight",
        { resource: resourceName, amount: 1 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 3 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const riderCards = 3;
  for (let i = 0; i < riderCards; i++) {
    deck.push(
      new Card(
        "Rider",
        { resource: resourceName, amount: 2 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 4 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const platoonCards = 3;
  for (let i = 0; i < platoonCards; i++) {
    deck.push(
      new Card(
        "Platoon",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 6 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const recruitCards = 3;
  for (let i = 0; i < recruitCards; i++) {
    deck.push(
      new Card(
        "Recruit",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Soldiers", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const attackCards = 2;
  for (let i = 0; i < attackCards; i++) {
    deck.push(
      new Card(
        "Attack",
        { resource: resourceName, amount: 10 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 12 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const saboteurCards = 2;
  for (let i = 0; i < saboteurCards; i++) {
    deck.push(
      new Card(
        "Saboteur",
        { resource: resourceName, amount: 12 },
        {
          self: [],
          enemy: [
            { resource: "Bricks", amount: 4 },
            { resource: "Crystals", amount: 4 },
            { resoucre: "Weapons", amount: 4 },
          ],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const thiefCards = 2;
  for (let i = 0; i < thiefCards; i++) {
    deck.push(
      new Card(
        "Thief",
        { resource: resourceName, amount: 15 },
        {
          self: [],
          enemy: [],
          transfer: [
            { resource: "Bricks", amount: 5 },
            { resource: "Crystals", amount: 5 },
            { resource: "Weapons", amount: 5 },
          ],
        },
        cardType,
      ),
    );
  }
  const swatCards = 2;
  for (let i = 0; i < swatCards; i++) {
    deck.push(
      new Card(
        "Swat",
        { resource: resourceName, amount: 18 },
        {
          self: [],
          enemy: [{ resource: "Castle", amount: 10 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const bansheeCards = 2;
  for (let i = 0; i < bansheeCards; i++) {
    deck.push(
      new Card(
        "Banshee",
        { resource: resourceName, amount: 28 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 32 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
}

function addDefaultCrystalsCards(deck) {
  const cardType = CARD_TYPES.CRYSTALS;
  const resourceName = "Crystals";
  const conjureBricksCards = 3;
  for (let i = 0; i < conjureBricksCards; i++) {
    deck.push(
      new Card(
        "Conjure bricks",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Bricks", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const conjureCrystalsCards = 3;
  for (let i = 0; i < conjureCrystalsCards; i++) {
    deck.push(
      new Card(
        "Conjure crystals",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Crystals", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const conjureWeaponsCards = 3;
  for (let i = 0; i < conjureWeaponsCards; i++) {
    deck.push(
      new Card(
        "Conjure weapons",
        { resource: resourceName, amount: 4 },
        {
          self: [{ resource: "Weapons", amount: 8 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushBricksCards = 3;
  for (let i = 0; i < crushBricksCards; i++) {
    deck.push(
      new Card(
        "Crush bricks",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Bricks", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushCrystalsCards = 3;
  for (let i = 0; i < crushCrystalsCards; i++) {
    deck.push(
      new Card(
        "Crush crystals",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Crystals", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const crushWeaponsCards = 3;
  for (let i = 0; i < crushWeaponsCards; i++) {
    deck.push(
      new Card(
        "Crush weapons",
        { resource: resourceName, amount: 4 },
        {
          self: [],
          enemy: [{ resource: "Weapons", amount: 8 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const sorcererCards = 3;
  for (let i = 0; i < sorcererCards; i++) {
    deck.push(
      new Card(
        "Sorcerer",
        { resource: resourceName, amount: 8 },
        {
          self: [{ resource: "Magic", amount: 1 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const dragonCards = 2;
  for (let i = 0; i < dragonCards; i++) {
    deck.push(
      new Card(
        "Dragon",
        { resource: resourceName, amount: 21 },
        {
          self: [],
          enemy: [{ resource: "Health", amount: 25 }],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const pixiesCards = 2;
  for (let i = 0; i < pixiesCards; i++) {
    deck.push(
      new Card(
        "Pixies",
        { resource: resourceName, amount: 22 },
        {
          self: [{ resource: "Castle", amount: 22 }],
          enemy: [],
          transfer: [],
        },
        cardType,
      ),
    );
  }
  const curseCard = 2;
  for (let i = 0; i < curseCard; i++) {
    deck.push(
      new Card(
        "Curse",
        { resource: resourceName, amount: 45 },
        {
          self: [],
          enemy: [],
          transfer: [
            { resource: "Builders", amount: 1 },
            { resource: "Bricks", amount: 1 },
            { resource: "Soldiers", amount: 1 },
            { resource: "Weapons", amount: 1 },
            { resource: "Crystals", amount: 1 },
            { resource: "Magic", amount: 1 },
            { resource: "Castle", amount: 1 },
            { resource: "Fence", amount: 1 },
          ],
        },
        cardType,
      ),
    );
  }
}
