export default function currencyFilter(value, currency = 'UAH') {
    return new Intl.NumberFormat('en-Us', {
        style: 'currency',
        currency,
    }).format(value);
}