const valuta = document.querySelector('.card-valuta');
const currencySelect = document.querySelector('.currency-select');
const valutaChart = document.querySelector('.valuta-chart');
const highValue = document.querySelector('.highest-value');
const middleValue = document.querySelector('.middle-value');
const lowValue = document.querySelector('.lowest-value');

let valutaWeekChart;

currencySelect.addEventListener('change', () => {
    const currencyCode = currencySelect.value;
    fetchCurrency(currencyCode);
    fetchValuta(currencyCode)
});

fetchCurrencyCodes();

function fetchCurrencyCodes() {
    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`)
        .then(response => response.json())
        .then(data => fillSelect(data));
}

function fillSelect(data) {
    console.log(data);
    for (const currencyCode in data) {
        const option = document.createElement('option');
        option.value = currencyCode;
        option.innerText = `${currencyCode} - ${data[currencyCode]}`;
        currencySelect.appendChild(option);
    }
}




function fetchCurrency(currencyCode) {



    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyCode}.json`)
        .then(response => response.json())
        .then(data => showCurrency(data, currencyCode));
}

function showCurrency(data, currencyCode) {
    console.log(data);
    valuta.innerHTML = `
   <div class="col-md-3"></div>
    <div class="col-md-5">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">${currencyCode}</h4>
            <p class="card-text">${data[currencyCode].eur}</p>
        </div>
    </div>
    </div>
    `;
}

// function fetchCurrencyWeek(currencyCode) {
//     fetch(`/json/currency.json`)
//         .then(response => response.json())
//         .then(data => showCurrencyWeek(data, currencyCode));
// }

// function showCurrencyWeek(data, currencyCode) {
//     const label = [];
//     const grapData = [];

//     for (let i = 0; i < data.length; i++) {
//         const element = data[i];
//         label.push(element.date);

//         console.log(element);
    
//     }
//     console.log(label);
// }


function fetchValuta(currencyCode) {
    fetch('/json/currency.json')
        .then(res => res.json())
        .then(data => valutaShow(data, currencyCode));
}

function valutaShow(data, currencyCode) {
    console.log(data);

    let highest;
    let average = 0;
    let count = 0;
    let lowest;

    const labels = [];
    const datarray = [];

    for (let i = 0; i < data.length; i++) {
        const currencyday = data[i];
        labels.push(currencyday.date);

        for (key in currencyday.eur) {
            const amount = currencyday.eur[key];
            console.log(key);
            console.log(currencyday.eur[key]);


            if (key == currencyCode) {
                datarray.push(currencyday.eur[key]);

                if (!highest) {
                    highest = amount;
                } else if (amount > highest) {
                    highest = amount;
                }

                average += amount;
                count++;

                if (!lowest) {
                    lowest = amount;
                } else if (amount < lowest) {
                    lowest = amount;
                }
            }

        }


    }

    console.log({highest, lowest});
    console.log(labels);
    console.log(data);
    if (valutaWeekChart) {
        valutaWeekChart.destroy();
    }

    highValue.innerText = highest.toFixed(4);
    lowValue.innerText = lowest.toFixed(4);

    average = average / count;
    middleValue.innerText = average;
    
   valutaWeekChart = creatChart(valutaChart, labels, datarray);
}




function creatChart(canavasElement, labels, data) {

   return new Chart(canavasElement, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// function calulateAverage






