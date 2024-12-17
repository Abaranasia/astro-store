export class Formatter {
    static currency(value: number, decimals = 2): string {
        return new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: 'eur',
            maximumFractionDigits: decimals,
        }).format(value)
    }
}