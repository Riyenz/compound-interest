const parseNumber = n => Number(n.replace(/[^0-9.-]+/g,""));
const encodeNumber = n => new Intl.NumberFormat('en-US').format(n);

const createState = (state) => {
  return new Proxy(state, {
    set(target, property, value) {
      target[property] = value;
      render();
      return true;
}
  });
};

const VARIABLES = {
  baseAmount: '0',
  monthlyDeposit: '5000',
  calculationPeriod: '5',
  interestRate: '7.1'
};

const VARIABLE_KEYS = Object.keys(VARIABLES);

const state = createState(VARIABLES);

const render = () => {
  document.querySelector('[data-binding="resultAmount"]').innerHTML = calculateTotalCompoundInterest(
    parseNumber(state.baseAmount),
    parseNumber(state.interestRate),
    parseNumber(state.calculationPeriod),
    parseNumber(state.monthlyDeposit)
  )

  // document.querySelector('[data-model="baseAmount"]').innerText = state.baseAmount
  // document.querySelector('[data-model="monthlyDeposit"]').innerText = state.monthlyDeposit
  // document.querySelector('[data-model="calculationPeriod"]').innerText = state.calculationPeriod
  // document.querySelector('[data-model="interestRate"]').innerText = state.interestRate
}

const listener = (event) => {
  state[event.target.dataset.model] = event.target.innerHTML;
};

/**
 * Function calculateTotalCompoundInterest()
 * @param {*} P the principal investment amount (the initial deposit or loan amount)
 * @param {*} ar the annual interest rate (decimal)
 * @param {*} t the time (months, years, etc) the money is invested or borrowed for
 * @param {*} PMT the monthly payment
 * @param {*} n the number of times that interest is compounded per unit t
 */
function calculateTotalCompoundInterest(P, ar, t, PMT, n = 12) {
  const r = ar / 100;
  const compoundInterestPrincipal = P * (Math.pow(1 + r/n, n*t));
  const futureValueSeries = PMT * ((Math.pow(1 + r/n, n*t) - 1) / (r/n)) * (1 + r/n)
  const result = (compoundInterestPrincipal + futureValueSeries).toFixed(2)

  return encodeNumber(result);
}

/** Slider Logic */
const sliderListen = (dataModel) => {
  const slider = document.getElementById(dataModel);

  if (!slider) return
  const output = document.querySelector(`[data-model="${dataModel}"]`);
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    state[dataModel] = this.value;
  }
}

VARIABLE_KEYS.forEach(item => {
  document.querySelector(`[data-model="${item}"]`).addEventListener('input', listener);  
  sliderListen(item)
})

render()

