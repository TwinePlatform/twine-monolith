export const roundToDecimal = (n: number) => (Math.round(n * 100) / 100);

export const addDecimals = (a: number, b: number) => (a + b).toFixed(2);
