const forms = document.querySelectorAll('form');
const btnReset = document.querySelector('.btn-reset');
const priceOneDay = document.querySelector('.price-oneday');
const priceOneWeek = document.querySelector('.price-oneweek');
const priceOneMonth = document.querySelector('.price-onemonth');
const price200days = document.querySelector('.price-200days');
const inputRange = document.querySelector('.range input');
const ethValue = document.querySelector('.eth-value');
const priceOneETH = document.querySelector('.price-eth-current');
const priceOneETHVar = document.querySelector('.price-eth-var');
const priceOneETH24hValue = document.querySelector('.price-eth-24h-value');

const [formETH, formEUR] = forms;

// Fonctions de conversion

const convertETHToEUR = (rate, value) => {
    return Number((value * rate)).toFixed(2);
}
const convertEURToETH = (rate, value) => {
    return Number((value / rate)).toFixed(4);
}

const getCurrencies = async () => {

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);

        // Récupération taux de l'ETH en Euro

        const ethRateInEUR = response.data.market_data.current_price.eur;

        // Affichage prix d'1 ETH (par défaut)

        const valueInEUR = convertETHToEUR(ethRateInEUR, 1);
        formEUR.children[1].value = valueInEUR;

        // Valeur d'un ETH

        priceOneETH.innerText = `€ ${response.data.market_data.current_price.eur.toFixed(2)}`;

        // Variation du prix sur 24h

        const variationPercentOneDay = response.data.market_data.price_change_percentage_24h_in_currency.eur.toFixed(2);

        priceOneETHVar.innerText = `${variationPercentOneDay > 0 ? "+" : ""}${variationPercentOneDay} %`;
        priceOneETHVar.style.backgroundColor = variationPercentOneDay > 0 ? "green" : "red";

        priceOneETH24hValue.innerText = `Variation / 24h - Valeur : € ${(response.data.market_data.current_price.eur - response.data.market_data.price_change_24h_in_currency.eur).toFixed(2)}`;

        // Variation du prix sur 7, 30 et 200 jours

        priceOneWeek.innerHTML = `€ ${((response.data.market_data.current_price.eur * 100) / (100 + response.data.market_data.price_change_percentage_7d_in_currency.eur)).toFixed(2)} <span>${response.data.market_data.price_change_percentage_7d_in_currency.eur.toFixed(2)}%</span>`;

        priceOneMonth.innerHTML = `€ ${((response.data.market_data.current_price.eur * 100) / (100 + response.data.market_data.price_change_percentage_30d_in_currency.eur)).toFixed(2)} <span>${response.data.market_data.price_change_percentage_30d_in_currency.eur.toFixed(2)}%</span>`;

        price200days.innerHTML = `€ ${((response.data.market_data.current_price.eur * 100) / (100 + response.data.market_data.price_change_percentage_200d_in_currency.eur)).toFixed(2)} <span>${response.data.market_data.price_change_percentage_200d_in_currency.eur.toFixed(2)}%</span>`;

        // Gestion des entrées des formulaires

        forms.forEach(form => {
            form.addEventListener('input', e => {
                const currency = e.target.getAttribute('name');

                let inputValue = e.target.value;

                if(inputValue.includes(',')) {
                    inputValue = inputValue.replace(',','.');
                }

                if (currency === 'eth') {
                    inputRange.value = inputValue;
                    let valueInEUR = convertETHToEUR(ethRateInEUR, inputValue);
                    if(isNaN(valueInEUR)) {
                        valueInEUR = 0;
                    }
                    if (valueInEUR >= 10000) {
                        valueInEUR = parseInt(valueInEUR);
                    }
                    formEUR.children[1].value = valueInEUR.toLocaleString();
                    
                } else {
                    let valueInETH = convertEURToETH(ethRateInEUR, inputValue);
                    if(isNaN(valueInETH)) {
                        valueInETH = 0;
                    }
                    if (valueInETH >= 10000) {
                        valueInETH = parseInt(valueInETH);
                    }
                    formETH.children[1].value = valueInETH.toLocaleString();
                }
            });
        });

        // Gestion du curseur

        inputRange.addEventListener('input', e => {
            formETH.children[1].value = Number(e.target.value).toFixed(4);
            ethValue.innerHTML = `${Number(e.target.value).toFixed(2)} <span>ETH</span>`;

            let valueInEUR = convertETHToEUR(ethRateInEUR, e.target.value);
            if (valueInEUR >= 10000) {
                valueInEUR = parseInt(valueInEUR);
            }
            formEUR.children[1].value = valueInEUR.toLocaleString();
        })


    } catch (error) {
        console.log(error)
    }

}

getCurrencies();