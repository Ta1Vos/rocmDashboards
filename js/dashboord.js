const geolocationApiUrl = "https://geocode.maps.co/search?q=Rotterdam";
const weatherApiUrl = "  https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${latitude}&hourly=temperature_2m,rain,weathercode,visibility&daily=weathercode,temperature_2m_max,sunrise,sunset,uv_index_max,windspeed_10m_max&current_weather=true&timezone=auto";

// querySelector
const cityInput = document.querySelector(".city-input");
const currentDate = document.querySelector(".current-date");
const currentTemp = document.querySelector(".current-temp");
const currentWindspeed = document.querySelector(".current-windspeed");
const currentUvIndex = document.querySelector(".current-uv-");
let access = localStorage.getItem("accessgranted");
access = 'true'

const mondayCard = document.querySelector(".monday-card");
const tuesdayCard = document.querySelector(".tuesday-card");
const wednesdayCard = document.querySelector(".wednesday-card");
const thursdayCard = document.querySelector(".thursday-card");
const fridayCard = document.querySelector(".friday-card");
const saturdayCard = document.querySelector(".saturday-card");
const sundayCard = document.querySelector(".sunday-card");
const highChart = document.querySelector(".high-class");

const dayCards = document.querySelector(".day-card");
const lowChart = document.querySelector(".low-class");




// random quote generator
const quotes = [
    'Hier vind je de meest recente en nauwkeurige weersinformatie om je dag te plannen.',
    'Hier vind je alles, van lokale temperatuur tot weersveranderingen. Neem een kijkje en ontdek wat de dag voor jou in petto heeft.',
    'De ideale bron voor het weerbericht. Of je nu zonneschijn of regen verwacht, wij hebben alle informatie die je nodig hebt.', 
    'Met ons weerdashboard kun je de temperatuur, weersomstandigheden en voorspellingen voor elke gewenste locatie eenvoudig in de gaten houden.',
    'Ontdek de meest recente weersvoorspellingen, temperatuurupdates en neerslaggegevens voor jouw locatie.',
    'Hier krijg je direct toegang tot de meest actuele weersinformatie voor jouw locatie.',
    'We verwelkomen je op ons gebruiksvriendelijke weerdashboard, ontworpen om je te helpen bij het plannen van je activiteiten.',
];

if (access == 'false ') {
  alert('Welcome Back!! user2')

  cityInput.addEventListener("keydown", function (e) { //  Event listener die checkt of er een key is ingedrukt.
    if (e.key === "Enter") { //if statement die checkt of de enter key is ingedrukt.
    
      console.log(cityInput.value); // logt the waarde van de input field.
      getWeather(cityInput.value); // roept de getWeather function aan.
    }
  });
}

if (access == 'false') {
    alert('You need to login first No information will be loaded')
    // window.location.href = "login.html";
}


function getWeather(city) {
  // city is the city name from the input field
  fetch(`https://geocode.maps.co/search?q=${city}`) // fetch the geolocation API
    .then((myData) => myData.json()) // zet de data om naar json
    .then((myJsonData) => fetchWeatherData(myJsonData)); // roept de fetchWeatherData function aan
}

function fetchWeatherData(myJsonData) {   // myJsonData is the data from the geolocation API

//   console.log(myJsonData);
  const latitude = myJsonData[0].lat; // latitude and longitude are the coordinates of the city
  const longitude = myJsonData[0].lon;
  fetch(`  https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,weathercode,visibility&daily=weathercode,temperature_2m_max,sunrise,sunset,uv_index_max,windspeed_10m_max&current_weather=true&timezone=auto
  `)
    .then((myData) => myData.json())
    .then((myJsonData) => showWeatherData(myJsonData));
}

function showWeatherData(data) { // deze funtion toont de data in de browser via innerHTML
    
    console.log(dayCards);
    for (let i = 0; i < data.daily.time.length; i++) {
      const time = data.daily.time[i];
      console.log(time);
      const card = createCard(time,data.daily.temperature_2m_max[i], data.daily.windspeed_10m_max[i], data.daily.uv_index_max[i] );
      dayCards.innerHTML+= card;

    }
    createChart(highChart, data.daily.time, data.daily.temperature_2m_max);

}
function createCard (time,temp, wind, uv ) {
  const card = `   <div class="col-sm">
  <div class="card monday-card">
    <div class="card-body">
      <h4 class="card-title">${time}</h4>
      <p class="card-text">
        <p class="current-temp">Tempratuur:${temp}°</p>
        <p class="current-wind">Windspeed: ${wind} </p>
        <p class="current-uv"> Uv-Index: ${uv}</p>
      </p>
    </div>
  </div>
</div>`;
return card;
}

// Random Quote Generator

function generateRandomMsg (){
    //kiest willekeuring een quote uit de array
    const randomIndex = (Math.floor(Math.random() * quotes.length)); //
    const randomQuote = quotes[randomIndex]; 
    console.log(randomQuote);
    // Toont de quote in de browser
    const quoteElement = document.querySelector(".display-msg");
    quoteElement.innerHTML = randomQuote
}
window.addEventListener("load", generateRandomMsg);

function createChart(canvasElement, date, temp, ) {
  return new Chart(canvasElement, {
      type: 'line',
      data: {
          labels: date,
          datasets: [{
              backgroundColor: ['red','blue','green','yellow','orange','purple','pink'],
              label: temp,
              data: temp,
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',

          scales: {
              x: {
                  ticks: {
                      color: 'white'
                  },

              },
              y: {
                  ticks: {
                      color: 'white'
                  },

                  beginAtZero: true
              }
          }
      }
  });
}

function createChart(canvasElement, date, temp, ) {
  return new Chart(canvasElement, {
      type: 'line',
      data: {
          labels: date,
          datasets: [{
              backgroundColor: ['red','blue','green','yellow','orange','purple','pink'],
              label: temp,
              data: temp,
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',

          scales: {
              x: {
                  ticks: {
                      color: 'white'
                  },

              },
              y: {
                  ticks: {
                      color: 'white'
                  },

                  beginAtZero: true
              }
          }
      }
  });
}

