let canClick = false;
let fields = 25;
let score = 1.0;
let multiplier = 1.0;
let clicked = {};
let mines = [];
let gameStatus = false;

const setClass = (selector, removeClass, addClass) => {
  $(selector).removeClass(removeClass).addClass(addClass);
};

const updateElement = (isMine, element) => {
  const icon = isMine ? "fa-bomb bomb" : "fa-crown crown";
  const fieldClass = isMine ? "field-bomb" : "field-diamond";
  const text = isMine ? "0.0 x" : `${score} x`;

  $(element).removeClass("field-normal").addClass(fieldClass).html(`
    <i class="fa-solid ${icon}"></i>
  `);
  $("#multiplier").text(text);
  if (isMine) {
    $(".mines-button").text("Przegrana");
    makeRed();
    setTimeout(endGame, 5000);
  } else {
    canClick = true;
  }
};

const makeGreen = () => {
  setClass("#multiplier, .mines-button", "color-red", "color-green");
};

const makeRed = () => {
  setClass("#multiplier, .mines-button", "color-green", "color-red");
};

$(".mines-grid").on("click", ".field-normal", function () {
  let index = $(this).attr("index");
  if (canClick && !clicked[index] && gameStatus) {
    canClick = false;
    clicked[index] = true;
    let isMine = mines.includes(parseInt(index));
    if (isMine) {
      gameStatus = false;
      updateElement(true, this);
    } else {
      score = (score * multiplier).toFixed(2);
      updateElement(false, this);
    }
  }
});

$(".mines-container").on("click", ".mines-button", function () {
  if (gameStatus) {
    endGame();
  }
});

const endGame = () => {
  $(".mines-container").hide();
  fetch(`https://${GetParentResourceName()}/endGame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      status: gameStatus,
      score: score,
    }),
  }).then((resp) => (canClick = true));
};

const createFields = () => {
  for (let i = 1; i <= fields; i++) {
    $(".mines-grid").append(`
      <div class="mines-field field-normal" index=${i}>
        <i class="fa-solid fa-question"></i>
      </div>
    `);
  }
};

const generateMines = (count) => {
  mines = [];
  while (mines.length < count) {
    let number = Math.floor(Math.random() * fields) + 1;
    if (!mines.includes(number)) {
      mines.push(number);
    }
  }
};

const startGame = (minesCount, multi) => {
  gameStatus = true;
  clicked = {};
  multiplier = multi;
  score = 1.0;
  $("#multiplier").text(`${score.toFixed(1)} x`);
  makeGreen();
  $(".mines-button").text("Wypłata");
  $(".mines-grid").empty();
  createFields();
  generateMines(minesCount);
  canClick = true;
  $(".mines-container").show();
};

window.addEventListener("message", (event) => {
  let data = event.data;
  if (data.action == "startGame") {
    startGame(data.mines, data.multiplier);
  }
});
