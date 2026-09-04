// Dansk formatering af valuta, km og forbrug

export function formatCurrency(amount, includeSuffix = true) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 kr.';
  const formatted = Math.round(amount).toLocaleString('da-DK');
  return includeSuffix ? `${formatted} kr.` : formatted;
}

export function formatNumber(num, decimals = 1) {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return Number(num).toLocaleString('da-DK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatKm(km) {
  if (isNaN(km) || km === null || km === undefined) return '0 km';
  return `${Math.round(km).toLocaleString('da-DK')} km`;
}

export function formatPricePerKm(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0,00 kr./km';
  return `${Number(amount).toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./km`;
}

export function formatPricePerKwh(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0,00 kr./kWh';
  return `${Number(amount).toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./kWh`;
}

export function formatPricePerLitre(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0,00 kr./l';
  return `${Number(amount).toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr./l`;
}
