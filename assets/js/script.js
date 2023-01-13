/* Objeto com os nomes dos arquivos de imagem das cartas
   criado a partir de um json gerado por
       $ tree assets/images/card_front -J */
const cardFacesDir = {
  type: "directory",
  name: "assets/images/card_faces",
  contents: [
    { type: "file", name: "0db24329c0b525cb883e4f809fbd269a.jpg" },
    { type: "file", name: "26526022247041616a4bb0cca3164ead.jpg" },
    { type: "file", name: "620fc6e9c798ca52968c8e71931b9a98.jpg" },
    { type: "file", name: "68cc1598b0e6ab85e6f419ddfd22b322.jpg" },
    { type: "file", name: "871a89f8dc755be110bfff58a0520138.jpg" },
    { type: "file", name: "af7d25d12b736dbbac7bdb04ba0cab16.jpg" },
    { type: "file", name: "c5c3cee183ecb7105747dc0e5566e9fc.jpg" },
  ],
};

const minCardAmount = 4;
const maxCardAmount = 2 * cardFacesDir.contents.length;
let selectedCards = [];

function isEven(num) {
  // Checa se um número é par
  return num % 2 === 0;
}

function shuffle(array) {
  // Embaralha aleatóriamente um array com Fisher-Yates shuffle
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function createCard(filename) {
  /* Cria uma carta cuja face é dada pela imagem correspondente
     ao nome de arquivo passado como argumento */
  const listItemElement = document.createElement("li");
  listItemElement.classList.add("card");
  listItemElement.innerHTML = `
<div class="card-content">
  <div class="card-back">
    <img src="assets/images/card_back.png"
         alt="Card Face" width="512" height="639">
  </div>
  <div class="card-face">
    <img src="${cardFacesDir.name}/${filename}"
         alt="Card Back" width="512" height="512">
  </div>
</div>`;
  return listItemElement;
}

function populateCardboard(num) {
  // Dada uma quantidade par de cartas, popula o board
  if (checkCardAmount(num) === false) return;
  const cardboard = document.querySelector(".cardboard");
  const images = cardFacesDir.contents.slice(0, num / 2);
  // Duplica os nomes de arquivo e os embaralha
  const shuffledImages = shuffle(images.concat(images));
  for (const image of shuffledImages) {
    const card = createCard(image.name);
    cardboard.appendChild(card);
  }
}

function allEqual(array) {
  /* Retorna true se todos os elementos de um array forem
     iguais. Do contrário, retorna false */
  return array.every((value, _, arr) => value === arr[0]);
}

function compareCards(cardA, cardB) {
  // Compara as cartas usando o src das imagens de suas faces
  const cards = [cardA, cardB];
  const cardsImageSrc = cards.map(
    (card) => card.querySelector(".card-face > img").src
  );
  return allEqual(cardsImageSrc);
}

function getLastSelectedCard() {
  /* Retorna a última carta selecionada sem par, isto é,
     que ainda não foi comparada a nenhuma carta. Nesse
     último caso, retorna null */
  if (isEven(selectedCards.length)) return null;
  return selectedCards.at(-1);
}

function addSelection(card) {
  // Adiciona a carta ao array selectedCards
  card.classList.add("flipped", "selected");
  selectedCards.push(card);
}

function removeSelection(card) {
  // Remove a carta do array selectedCards
  card.classList.remove("selected");
  selectedCards = selectedCards.filter((value) => value !== card);
}

function flipCard() {
  // Função chamada quando uma carta é clicada

  // Se a carta clicada está virada (selecionada ou não), retorne
  if (this.classList.contains("flipped")) return;

  /* Busca a última carta selecionada, 
     antes de selecionar a carta clicada */
  const lastSelectedCard = getLastSelectedCard();
  addSelection(this);

  // Se não ouver carta selecionada, retorne
  if (lastSelectedCard === null) return;

  const cards = [this, lastSelectedCard];
  if (compareCards(this, lastSelectedCard)) {
    cards.forEach((card) => {
      removeSelection(card);
    });
  } else {
    setTimeout(() => {
      cards.forEach((card) => {
        removeSelection(card);
        card.classList.remove("flipped");
      });
    }, 1000);
  }
}

function checkCardAmount(num) {
  /* Retorna true se o inteiro passado for uma quantia
     válida de cartas. Do contrário, retorna false */
  if (!isEven(num)) return false;
  if (num > maxCardAmount) return false;
  if (num < minCardAmount) return false;
  if (num === NaN || num === null || num === undefined) {
    return false;
  }
  return true;
}

function askCardAmount() {
  /* Pede ao usuário uma quantia de cartas. Retorna a primeira
     quantia válida */
  const promptMessage = `Com quantas cartas quer jogar? Insira um valor entre ${minCardAmount} e ${maxCardAmount}`;
  let cardAmount;
  while (!checkCardAmount(cardAmount)) {
    cardAmount = parseInt(prompt(promptMessage));
  }
  return cardAmount;
}

window.onload = () => {
  const cardAmount = askCardAmount();
  populateCardboard(cardAmount);

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
};
