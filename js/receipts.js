const resultInfo = document.querySelector('.result-info');
const productList = document.querySelector('.product-list');

const receipts = document.querySelector('.receipts');
const loadReceiptBtn = document.querySelector('.load-receipts');

const graphResults = document.querySelector('.result-graph');
const graphProducts = document.querySelector('.product-graph');

const loadingContainer = document.querySelector('.loading-div');
const loadingText = document.querySelector('.loading-text');
const contentContainer = document.querySelector('.admin-content');

let access = localStorage.getItem("accessgranted");
access = 'true';

let loadedReceiptList = document.querySelectorAll('.product-receipt');

let receipt;
let receiptList;
let loadedReceipts = 0;

//Fetch the information for the receipts.
function fetchInfo() {
    document.body.style.overflow = `hidden`;

    if (access == 'true') {
        loadingText.innerHTML = `Informatie ophalen..`;
    
        fetch('https://mbo-sd.nl/apiv2/basic-cash-register')
            .then(JSONdata => JSONdata.json())
            .then(object => loadPage(object));
    
        setTimeout(() => {
            if (receipt === undefined || receipt === null) {
                loadFailedAlert(`Het laden van de webpagina duurt langer dan verwacht.`);
            }
        }, 8000);
    } else {
        loadingText.innerHTML = `Geen inloggegevens gedetecteerd, log in en probeer opnieuw.`;
    }
}

//In case anything loads wrong or takes too much time, this alert will get launched, prompting the user to reload the page.
function loadFailedAlert(reason) {
    setTimeout(() => {
        const userConfirmation = confirm(`${reason} Wilt u de pagina opnieuw laden?`);

        if (userConfirmation == true) {
            window.location.reload();
        }
    }, 1000);
}

//Create a chart, customizable via arguments
function createChart(chartType, canvasElement, infoObject, indexAxis, width) {
    console.log(infoObject.prices)

    new Chart(canvasElement, {
        type: chartType,
        data: {
            labels: infoObject.names,
            datasets: [{
                backgroundColor: function() {
                    const array = [];

                    infoObject.prices.forEach(element => {
                        if (element >= 0) {
                            array.push('#668A99');
                        } else {
                            array.push('#ff3333');
                        }
                    });

                    return array;
                },
                label: infoObject.label,
                data: infoObject.prices,
                borderWidth: width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            indexAxis: indexAxis
        }
    });
}

//Fired after the fetch has finshed, loads all content dependent on the fetch.
function loadPage(object) {
    console.log(object);
    receiptList = object;

    loadingText.innerHTML = `Producten organiseren..`;
    waitForReturn = countProducts();

    receipt = object;

    setTimeout(() => {
        let waitForReturn;

        loadingText.innerHTML = `Berekenen van de winst..`;
        
        waitForReturn = calculateTotals();

        setTimeout(() => {
            loadingText.innerHTML = `Laden van de kassabonnen...`;
            waitForReturn = loadReceipts(10);
    
            setTimeout(() => {
                loadingText.innerHTML = `Klaar!`;
                setTimeout(() => {
                    loadingContainer.remove();
                    contentContainer.style.display = `block`;
                    document.body.style.overflow = `auto`;
                }, 250);
            }, 500);
        }, 500);
    }, 500);
}

//Round any number to 2 decimals.
function euroRound(amount) {
    return Math.round(amount * 100) / 100;
}

//Calculate the total amount of profit of all products.
function calculateTotals() {
    //Object format required for simple graph
    const chartObject = {
        names: [

        ],
        prices: [

        ],
        label: '# Overzicht Winst & Verlies'
    };
    
    let totalSales = 0;
    let totalLoss = 0;
    let totalTaxLoss = 0;
    let grossProfit = 0;
    let totalProfit = 0;

    //Count all of the products.
    receiptList.products.forEach(element => {
        console.log(element)
        if (element.priceTotal >= 0) {
            totalSales += element.priceTotal;
            totalTaxLoss += element.priceTotal / 100 * element.tax;
        } else {
            totalLoss += element.priceTotal;
        }
    });

    //Round & calculate all of the totals
    totalSales = euroRound(totalSales);
    totalLoss = euroRound(totalLoss);
    totalTaxLoss = euroRound(-totalTaxLoss);
    grossProfit = euroRound(totalSales + totalLoss);
    totalProfit = euroRound(grossProfit + totalTaxLoss);

    const row = createCustomElement('div', ['row', 'py-2', 'd-flex', 'justify-content-center'], ``);

    //Create all divs with the totals
    row.appendChild(mergeDivs('div', ['col-12', 'col-md-5', 'row', 'm-2'], createCustomElement('div', ['col-12', 'bg-white'], `Totale Afzet`), createCustomElement('div', ['col-12', 'bg-lightgray'], `&euro; ${totalSales}`)));
    row.appendChild(mergeDivs('div', ['col-12', 'col-md-5', 'row', 'm-2'], createCustomElement('div', ['col-12', 'bg-white'], `Totaal Statiegeld (retour)`), createCustomElement('div', ['col-12', 'bg-lightgray', 'text-danger'], `&euro; ${totalLoss}`)));
    row.appendChild(mergeDivs('div', ['col-12', 'col-md-5', 'row', 'm-2'], createCustomElement('div', ['col-12', 'bg-white'], `Totale BTW`), createCustomElement('div', ['col-12', 'bg-lightgray', 'text-danger'], `&euro; ${totalTaxLoss}`)));
    row.appendChild(mergeDivs('div', ['col-12', 'col-md-5', 'row', 'm-2'], createCustomElement('div', ['col-12', 'bg-white'], `BrutoWinst`), createCustomElement('div', ['col-12', 'bg-lightgray'], `&euro; ${grossProfit}`)));
    row.appendChild(mergeDivs('div', ['col-12', 'col-md-5', 'row', 'm-2'], createCustomElement('div', ['col-12', 'bg-white'], `NettoWinst`), createCustomElement('div', ['col-12', 'bg-lightgray', 'text-success'], `&euro; ${totalProfit}`)));

    resultInfo.appendChild(row);

    chartObject.names = ['Totale Afzet', 'Statiegeld (retour)', 'BrutoWinst', 'Totale BTW', 'NettoWinst'];
    chartObject.prices = [totalSales, totalLoss, grossProfit, totalTaxLoss, totalProfit];

    createChart('bar', graphResults, chartObject, 'x', 3);

    return true;
}

//Count all stats for the products, put them in a graph & display them in a list.
function countProducts() {
    //Object format required for simple graph
    const chartObject = {
        names: [

        ],
        prices: [

        ],
        label: '# Totale verdiensten aan product'
    };

    let products = receiptList.products;

    //Assigning required values to every product
    for (key in products) {
        const product = products[key];

        product.amount = 0;
        product.priceTotal = 0;
    }

    //All receipts
    receiptList.receipts.forEach(element => {
        //All products in receipt
        element.forEach(element => {
            //Searching up the product's ID and seeing which one it is in the receipt.
            for (key in products) {
                if (products[key].id == element.id) {
                    const product = products[key];
                    const receiptProduct = element;

                    product.amount++;
                    product.priceTotal += receiptProduct.price;
                }
            }
        });
    });

    //Loop through all the products
    for (key in products) {
        const product = products[key];
        let color = ['bg-light'];

        //Making the background color switch inbetween dark and light
        if (key % 2 == 1) {
            color = ['bg-secondary', 'text-light'];
        }

        product.priceTotal = Math.round(product.priceTotal * 100) / 100;

        const row = createCustomElement('div', ['row', 'col-12', color[0], color[1], 'border', 'border-2', 'p-2', 'm-auto', 'my-1'], '');

        //Load in the columns
        row.appendChild(createCustomElement('div', ['col-4'], product.name));
        row.appendChild(createCustomElement('div', ['col-3'], `€${product.priceTotal}`));
        row.appendChild(createCustomElement('div', ['col-1'], product.tax));
        row.appendChild(createCustomElement('div', ['col-2'], `€${Math.round(product.priceTotal / 100 * product.tax * 100) / 100}`));
        row.appendChild(createCustomElement('div', ['col-1'], `€${Math.round(product.priceTotal / product.amount * 100) / 100}`));
        row.appendChild(createCustomElement('div', ['col-1'], `${product.amount}x`));

        productList.appendChild(row);

        //Putting product info into the graph object
        if (product.priceTotal > 0) {
            chartObject.names.push(product.name);
            chartObject.prices.push(product.priceTotal);
        }
    }

    //Create a chart
    createChart('bar', graphProducts, chartObject, 'x', 2);

    return true;
}

//Create a custom element assigning a class and adding content instantly with it! Reminder: Classes have to be in an array!
function createCustomElement(element, classes, content) {
    const ele = document.createElement(element);

    //Class has to be an array in order to add multiple
    classes.forEach(element => {
        ele.classList.add(element);
    });

    ele.innerHTML = content;

    return ele;
}

//Merge 2 divs into 1 div.
function mergeDivs(parentElement, classes, div1, div2) {
    const div = createCustomElement(parentElement, classes, '');

    div.appendChild(div1);
    div.appendChild(div2);

    return div;
}

//Create row that contains information about which col is which in a product list.
function createProductInfoRow() {
    const row = createCustomElement('div', ['row', 'col-12', 'bg-light', 'border', 'border-2', 'p-2', 'm-auto', 'my-1'], '');
    row.appendChild(createCustomElement('div', ['col-4'], `Product`));
    row.appendChild(createCustomElement('div', ['col-4'], `Prijs`));
    row.appendChild(createCustomElement('div', ['col-2'], `Btw (%)`));
    row.appendChild(createCustomElement('div', ['col-2'], `Btw (&euro;)`));

    return row;
}

//Create a row for a product
function createProductRow(object) {
    const row = createCustomElement('div', ['row', 'col-12', 'bg-light', 'border', 'border-2', 'p-2', 'm-auto', 'my-1'], '');

    //All product information
    row.appendChild(createCustomElement('div', ['col-4'], object.name));
    row.appendChild(createCustomElement('div', ['col-4'], `€${object.price}`));
    row.appendChild(createCustomElement('div', ['col-2'], object.tax));
    row.appendChild(createCustomElement('div', ['col-2'], `€${Math.round(object.price / 100 * object.tax * 100) / 100}`));

    return row;
}

//Create a chart that contains the product total of a receipt.
function createReceiptChart(loopObject) {
    const chartObject = {
        names: [],
        prices: [],
        label: '# Totale verdiensten aan product in bon'
    };

    //Count all the totals for a product
    for (key in loopObject) {
        const productObj = loopObject[key];
        const productName = productObj.name;
        const productPrice = productObj.price;

        if (chartObject.names.includes(productName)) {
            chartObject.prices[productObj.id - 1] += Math.round(productPrice * 100) / 100;
        } else {
            chartObject.names[productObj.id - 1] = productName;
            chartObject.prices[productObj.id - 1] = Math.round(productPrice * 100) / 100;
        }
    }

    //Create a canvas for a chart
    const newChart = createCustomElement('canvas', ['receipt-product-graph'], '');

    createChart('bar', newChart, chartObject, 'x', 1);

    return newChart;
}

//Load the content of a receipt.
function loadReceiptContent(fullReceipt) {
    const receiptNumber = Number(fullReceipt.querySelector('.receipt-number').textContent);
    const receiptContent = fullReceipt.querySelector('.receipt-content');

    const currentReceipt = receipt.receipts[receiptNumber - 1];

    //If there is no content it will not load the products, hopefully prevents errors
    if (receiptContent.textContent.length < 2) {
        receiptContent.appendChild(createCustomElement('i', ['bi', 'bi-arrow-down', 'fs-4'], ''));
        receiptContent.appendChild(createReceiptChart(currentReceipt));

        currentReceipt.forEach(product => {
            const row = createProductRow(product);

            receiptContent.appendChild(row);
        });
    }
}

//Load receipts equal to the given amount.
function loadReceipts(amount) {
    //Makes sure there cannot be more receipts loaded in than the limit.
    if (amount + loadedReceipts > receiptList.receipts.length) {
        amount = receiptList.receipts.length - loadedReceipts;

        //Prevent errors if the amount drops below 0 by the remaining amount calculator.
        if (amount <= 0) {
            amount = 0;
        }
    }

    for (let i = loadedReceipts; i < amount + loadedReceipts; i++) {
        const currentReceipt = receipt.receipts[i];

        let totalPrice = 0;
        let receiptTax = 0;

        //Calculate total price and tax for the receipt
        currentReceipt.forEach(product => {
            totalPrice += product.price;
            receiptTax += product.price / 100 * product.tax;
        });

        totalPrice = Math.round(totalPrice * 100) / 100;
        receiptTax = Math.round(receiptTax * 100) / 100;

        //Receipt container
        const row = createCustomElement('div', ['product-receipt', 'bg-light', 'my-3', 'rounded-3', 'clickable'], '');

        //Receipt header
        const h2 = createCustomElement('h2', [], 'Bon ');
        h2.appendChild(createCustomElement('span', ['receipt-number'], i + 1));

        //Info for the products
        const colInfo = createProductInfoRow();

        //Container for the products
        const contentDiv = createCustomElement('div', ['content-container', 'non-clickable'], '');
        contentDiv.appendChild(colInfo);
        contentDiv.appendChild(createCustomElement('div', ['receipt-content'], ''));

        //Put all content into the receipt
        row.appendChild(h2);
        row.appendChild(contentDiv);
        row.appendChild(createCustomElement('h4', [], `Totaal verkocht: &euro; ${totalPrice}<br>Btw: &euro; ${receiptTax}<br> Winst: &euro; ${Math.round((totalPrice - receiptTax) * 100) / 100}`));

        //Put the receipt into the receiptlist
        receipts.appendChild(row);

        //List of all loaded in receipts
        const fullReceipt = document.querySelectorAll('.product-receipt');

        loadReceiptContent(fullReceipt[i]);

        fullReceipt[i].classList.add('display-none');
        fullReceipt[i].querySelector('.content-container').classList.toggle('display-none');
    }

    loadedReceiptList = document.querySelectorAll('.product-receipt');

    //Add click eventlistener to all new receipts, this will put the display to block/none.
    for (let i = loadedReceipts; i < loadedReceiptList.length; i++) {
        const fullReceipt = loadedReceiptList[i];

        //Make the receipts visible at (almost) the same time.
        fullReceipt.classList.remove('display-none');

        fullReceipt.addEventListener('click', function () {
            fullReceipt.querySelector('.content-container').classList.toggle('display-none');
        });
    }

    //Update the total amount of loadedReceipts
    loadedReceipts += amount;

    //Remove the loading button if all the receipts are loaded in!
    if (loadedReceipts >= receiptList.receipts.length) {
        loadReceiptBtn.remove();
    }

    return true;
}

//Loads in more receipts until the limit is reached.
loadReceiptBtn.addEventListener('click', function () {
    loadReceipts(10);
});

fetchInfo();