export const roundValue = (value: number): number => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue;
}

export default {roundValue}