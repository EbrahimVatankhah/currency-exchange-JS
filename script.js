const API_KEY = '691a613ccf70510c6c79f437'; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const result = document.getElementById('result');
const loader = document.getElementById('loader');

let exchangeRates = {};

// Fetch currencies on load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        
        if(data.result === 'error') {
            throw new Error(data['error-type']);
        }

        exchangeRates = data.conversion_rates;
        populateCurrencies();
        calculateConversion();
    } catch (error) {
        result.textContent = 'Error fetching exchange rates';
        console.error(error);
    }
});

function populateCurrencies() {
    const currencies = Object.keys(exchangeRates);
    
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        
        option1.value = currency;
        option1.textContent = currency;
        option2.value = currency;
        option2.textContent = currency;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });

    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
}

async function calculateConversion() {
    const amount = parseFloat(amountInput.value);
    if(!amount || amount <= 0) {
        result.textContent = 'Please enter a valid amount';
        return;
    }

    loader.style.display = 'block';
    result.textContent = '';

    try {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}`);
        const data = await response.json();
        
        if(data.result === 'error') {
            throw new Error(data['error-type']);
        }

        const rate = data.conversion_rate;
        const convertedAmount = (amount * rate).toFixed(2);
        
        result.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        result.textContent = 'Error converting currency';
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}

function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    calculateConversion();
}

// Event listeners
amountInput.addEventListener('input', calculateConversion);
fromCurrency.addEventListener('change', calculateConversion);
toCurrency.addEventListener('change', calculateConversion);