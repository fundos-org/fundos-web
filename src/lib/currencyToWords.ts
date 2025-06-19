export function convertToCrores(num: number): string {
  if (num === 0) return '0 Rupees';
  const crores = num / 10000000;
  return crores.toFixed(2).replace(/\.00$/, '') + ' Cr.';
}

export function numberToIndianRupeesWords(num: number): string {
  if (num === 0) return '0 Rupees';

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const unitsPart = num;

  let result = '';
  if (crores > 0) {
    if (result) result += ' ';
    result += crores + 'Crore';
  }
  if (lakhs > 0) {
    if (result) result += ' ';
    result += lakhs + 'Lakh';
  }
  if (thousands > 0) {
    if (result) result += ' ';
    result += thousands + 'Thousand';
  }
  if (unitsPart > 0) {
    if (result) result += ' ';
    result += unitsPart;
  }

  return result + ' Rupees';
}

export function numberToInrShortcut(num: number): string {
  if (num === 0) return '0 Rupees';

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const unitsPart = num;

  let result = '';
  if (crores > 0) {
    if (result) result += ' ';
    result += crores + 'Cr';
  }
  if (lakhs > 0) {
    if (result) result += ' ';
    result += lakhs + 'Lac';
  }
  if (thousands > 0) {
    if (result) result += ' ';
    result += thousands + 'Th';
  }
  if (unitsPart > 0) {
    if (result) result += ' ';
    result += unitsPart;
  }

  return '₹' + result;
}
