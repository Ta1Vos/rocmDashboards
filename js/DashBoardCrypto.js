let accessGranted = localStorage.getItem("accessgranted");
const cryptoLabels = [];
const cryptoValues = [];
const waarde1 = document.querySelector(".waarde1");
const waarde2 = document.querySelector(".waarde2");
const waarde3= document.querySelector(".waarde3");



accessGranted = "true";
if (accessGranted == "true") {
  fetch("https://api.coincap.io/v2/assets")
    .then((response) => response.json())
    .then((json) => createCards(json.data));
}
if (accessGranted == "false") {
  alert("You dont have access to this information please login");
}

function createCards(json) {
  let myArray = [];
  let cardCount = 1;
  for (let i = 0; i < json.length; i++) {
    myArray.push(json[i]);

    if (cardCount == 1 && myArray.length == 5) {
      const firstCard = document.querySelector(".first-card");
      firstCard.innerHTML += createFirstCarousel(myArray, i);
      cardCount = 2;
      myArray = [];
      console.log(firstCard);
    } else if (cardCount == 2 && myArray.length == 5) {
      const secondCard = document.querySelector(".second-card");
      secondCard.innerHTML += createFirstCarousel(myArray, i);
      cardCount = 3;
      myArray = [];
    } else if (cardCount == 3 && myArray.length == 5) {
      const thirdCard = document.querySelector(".third-card");
      thirdCard.innerHTML += createFirstCarousel(myArray, i);
      cardCount = 4;
      myArray = [];
    } else if (cardCount == 4 && myArray.length == 5) {
      const fourthCard = document.querySelector(".fourth-card");
      fourthCard.innerHTML += createFirstCarousel(myArray, i);
      cardCount = 5;
      myArray = [];
      break;
    }
  }

  createChart(json);
  // loopAllCrypto(json);
}

// function loopAllCrypto(array) {
//    console.log(array)
//    const box = document.querySelector('.box-height');
//   array.forEach(crypto => {
//     box.innerHTML += `${crypto.id}<br>`;
//   });
// }

function carouselItem(coin, count) {
  let carouselItem = "";
  if (count == 0) {
    carouselItem += `<div class="carousel-item active">`;
  } else {
    carouselItem += `<div class="carousel-item">`;
  }
  carouselItem += `
            <div
              class="card pt-1"
            >
              <img
                src="/img/${coin.symbol}.svg"
                class="pt-4 imageSize"
              />
              <div class="textBox pb-3">
                <p class="text head">${coin.name}</p>
                <span>Cryptocurrency</span>
                <p class="text price">MarketCapUsd :<br/> $ ${mathRound(
                  coin.marketCapUsd
                )}</p>
              </div>
            </div>
          </div>
  
          `;
  return carouselItem;
}

function createFirstCarousel(coins, count) {
  console.log(coins, count);
  let carousel = `<div id="carouselExample${count}" class="carousel slide">
        <div class="carousel-inner">`;
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    carousel += carouselItem(coin, i);
  }

  carousel += `</div>
        <button
          class="carousel-control-prev button-previous"
          type="button"
          data-bs-target="#carouselExample${count}"
          data-bs-slide="prev"
        >
          <span
            class="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample${count}"
          data-bs-slide="next"
        >
          <span
            class="carousel-control-next-icon button-next"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Next</span>
        </button>
    </div>
    `;
  return carousel;
}

function mathRound(num) {
  return Math.round(num);
}

const canvas = document.querySelector(".myChart");
function createChart(data) {
  for (let i = 0; i < data.length; i++) {
    const coinData = data[i];
    console.log(coinData);

    cryptoLabels.push(coinData.id);
    if (coinData.priceUsd < 200) {
        cryptoValues.push(coinData.priceUsd);
    }
  }
  const highest = getHighest(cryptoValues);
  waarde1.innerHTML = "Highest per coin : $" + highest.toFixed(2);
  
  new Chart(canvas, {
      type: "line",
      data: {
        labels: cryptoLabels,
        datasets: [
          {
            label: "(Per coin) $",
            data: cryptoValues,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x:{
            ticks:{
              color: "white"
            },
          },
          y: {
            beginAtZero: true,
            ticks:{
              color: "white"
            },
          },
        },
      },
    });
  
}


function getHighest(values) {
  let highest = 0;
  for (let i = 0; i < values.length; i++) {
    const value = parseFloat(values[i]);
    
    if ( value > highest) {
      highest = value;
    }

    
  }
  return highest;
}

