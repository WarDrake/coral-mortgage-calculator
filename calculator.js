//Mortgage
const hpSlider = document.getElementById('homePriceSlider');
const dpSlider = document.getElementById('downPaymentSlider');
const irSlider = document.getElementById('interestRateSlider');
const hpValue = document.getElementById('homePriceInput');
const dpValue = document.getElementById('downPaymentInput');
const dppValue = document.getElementById('downPaymentPercentageInput');
const irValue = document.getElementById('interestRateInput');
const ptValue = document.getElementById('propertyTaxInput');
const ipValue = document.getElementById('insuranceInput');
const hoaValue = document.getElementById("hoaInput");
const otherInputs = document.querySelectorAll(".other-inputs input");
const loanTermButtons = document.querySelectorAll(".mortgageyears .calculator-button");

//Mortgage events setup
hpValue.value = "$ 1,800,000";
dpValue.value = "$ 360,000";
dppValue.value = "20%";
irValue.value = "6.875%";
ptValue.value = "1.2";
ipValue.value = ".35";
hoaValue.value = "350";

hpValue.addEventListener('blur', function () { formatCurrency(this) });
dpValue.addEventListener('blur', function () { setCleanedValue(this) });
dppValue.addEventListener('blur', function () { formatPercentage(this) });
dppValue.addEventListener('blur', function () { formatPercentage(this) });
hpValue.addEventListener('focus', function () { setCleanedValue(this) });
dpValue.addEventListener('focus', function () { setCleanedValue(this) });
dppValue.addEventListener('focus', function () { setCleanedValue(this) });
dppValue.addEventListener('focus', function () { setCleanedValue(this) });

//Mortgage Results 
const estMonthly = document.getElementById("estMonthly");
const estPrincipal = document.getElementById("estPrincipal");
const estTaxes = document.getElementById("estTaxes");
const estInsurance = document.getElementById("estInsurance");
const estHOA = document.getElementById("estHOA");
const totalLv = document.getElementById('totalLoanValue');
const totalLv2 = document.getElementById('totalLoanValue2');
const totalP = document.getElementById('purchasePriceValue');
const totalD = document.getElementById('downPaymentValue');

//Mortgage Sliders
hpSlider.addEventListener('input', () => {
    hpValue.value = hpSlider.value;
    dpValue.value = ((hpSlider.value * dppValue.value.replace(/[^0-9.-]+/g, '')) / 100);
    formatCurrency(hpValue);
    formatCurrency(dpValue);
    setLoanTotals();
    calculate();
});

hpValue.addEventListener('input', () => {
    const cleanedValue = hpValue.value.replace(/[^0-9.-]+/g, '');
    hpSlider.value = cleanedValue;
    dpValue.value = ((hpSlider.value * dppValue.value.replace(/[^0-9.-]+/g, '')) / 100);
    formatCurrency(dpValue);
    setLoanTotals();
    calculate();
});

dpSlider.addEventListener('input', () => {
    dpValue.value = dpSlider.value;
    dppValue.value = dpSlider.value;
    dpValue.value = ((hpSlider.value * dppValue.value.replace(/[^0-9.-]+/g, '')) / 100);
    formatCurrency(dpValue);
    formatPercentage(dppValue);
    setLoanTotals();
    calculate();
});

dpValue.addEventListener('input', () => {
    const cleanedValue = dpValue.value.replace(/[^0-9.-]+/g, '');
    dppValue.value = Math.floor((dpValue.value.replace(/[^0-9.-]+/g, '') / hpSlider.value) * 100);
    dpSlider.value = dppValue.value;
    formatPercentage(dppValue);
    setLoanTotals();
    calculate();
});

dppValue.addEventListener('input', () => {
    const cleanedValue = dppValue.value.replace(/[^0-9.-]+/g, '');
    dpSlider.value = cleanedValue;
    dpValue.value = ((hpSlider.value * dppValue.value.replace(/[^0-9.-]+/g, '')) / 100);
    formatCurrency(dpValue);
    setLoanTotals();
    calculate();
});

irSlider.addEventListener('input', () => {
    irValue.value = irSlider.value;
    formatPercentage(irValue);
    calculate();
});

irValue.addEventListener('input', () => {
    const cleanedValue = irValue.value.replace(/[^0-9.-]+/g, '');
    irSlider.value = cleanedValue;
    calculate();
});

//ipValue.addEventListener("input", function () {
//    const value = parseFloat(this.value);
//    this.value = (value < 1 && value >= 0) ? value.toFixed(2).replace(/^(-)?0+/, "$1") : this.value;
//    calculate();
//});

loanTermButtons.forEach(button => {
    button.addEventListener("click", () => {
        loanTermButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        loanTerm = document.querySelector(".mortgageyears .active").getAttribute('value');
        calculate();
    });
});

otherInputs.forEach(input => {
    input.addEventListener("input", () => {
        calculate();
    });
});

function calculate() {
    const totalLoanValue = hpSlider.value.replace(/[^0-9.-]+/g, '') - dpValue.value.replace(/[^0-9.-]+/g, '');
    const loanTerm = document.querySelector(".mortgageyears .active").getAttribute('data-value');
    const propertyTaxPercent = ptValue.value;
    const insurancePercent = ipValue.value;
    const monthlyInterestRate = irSlider.value / 12 / 100;
    const totalPayments = loanTerm * 12;
    const numerator = totalLoanValue * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, totalPayments) - 1;
    const monthlyPayment = numerator / denominator;
    const principalInterest = monthlyPayment * totalPayments;
    const propertyTax = (propertyTaxPercent / 100) * totalLoanValue / 12;
    const insurance = (insurancePercent / 100) * totalLoanValue / 12;

    const format = { style: 'currency', maximumFractionDigits: 0, currency: 'USD', currencyDisplay: 'symbol' }

    estPrincipal.textContent = monthlyPayment.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
    estTaxes.textContent = propertyTax.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
    estInsurance.textContent = insurance.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
    estHOA.textContent = "$ " + hoaValue.value;
    estMonthly.textContent = (+monthlyPayment + +propertyTax + +insurance + +hoaValue.value).toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ') + "/mo";
    setLoanTotals();
}

function setLoanTotals() {
    const format = { style: 'currency', maximumFractionDigits: 0, currency: 'USD', currencyDisplay: 'symbol' }
    const totalLoan = (hpSlider.value - dpValue.value.replace(/[^0-9.-]+/g, ''))
    var totalPV = parseInt(hpSlider.value);
    var totalDV = parseInt(dpValue.value.replace(/[^0-9.-]+/g, ''));
    totalLv.textContent = totalLoan.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
    totalLv2.textContent = totalLv.textContent;
    totalD.textContent = totalDV.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
    totalP.textContent = totalPV.toLocaleString('en-US', format).replace(/^(\D+)/, '$1 ');
}

function setCleanedValue(input) {
    const cleanedValue = input.value.replace(/[^0-9.-]+/g, '');
    input.value = cleanedValue;
}

function roundCurrency(input) {
    dpValue.value = ((hpSlider.value * dppValue.value.replace(/[^0-9.-]+/g, '')) / 100);
    formatCurrency(dpValue);
    setLoanTotals();
}

function formatCurrency(input) {
    const cleanedValue = input.value.replace(/[^0-9.-]+/g, '');
    const numericValue = parseFloat(cleanedValue);
    const formattedValue = numericValue.toLocaleString(undefined, {
        style: 'currency',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currency: 'USD'
    });
    const valueWithSpace = formattedValue.replace(/(\D)(\d)/, '$1 $2');
    input.value = valueWithSpace;
    setLoanTotals();
}

function formatPercentage(input) {
    const cleanedValue = input.value.replace(/[^0-9.-]+/g, '');
    const numericValue = parseFloat(cleanedValue);
    const formattedValue = numericValue + "%";
    input.value = formattedValue;
}

calculate();