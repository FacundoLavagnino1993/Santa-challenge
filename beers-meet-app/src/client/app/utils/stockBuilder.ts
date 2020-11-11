const rules = [{
  temp_min: -10,
  temp_max: 19.9,
  quantity: 0.75,
  extra_per_person: 1
}, {
  temp_min: 20,
  temp_max: 24,
  quantity: 1,
  extra_per_person: 1
}, {
  temp_min: 24.1,
  temp_max: 50,
  quantity: 3,
  extra_per_person: 2
}]

const beersPerBox = 6;
const extraBox = 1;
const zero = 0;

export function calculatePurchaseBeers(usersQuantity, temp) {
  const result = rules.find(rule => rule.temp_min <= temp && rule.temp_max >= temp);
  let minBeers = 0;
  if (result) {
    minBeers = result.quantity * usersQuantity + result.extra_per_person * usersQuantity;
  }
  let box = Math.floor(minBeers/beersPerBox);
  box += (minBeers % beersPerBox) > zero ? extraBox : zero;
  return box;
}

