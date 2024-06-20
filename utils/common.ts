export const formatNumber = (number:number,{decimalPoint}:{decimalPoint?:number})=>{
    // Ensure number is rounded to 2 decimal places
    const roundedNumber = decimalPoint===0?Math.ceil(number):Number(number).toFixed(decimalPoint?decimalPoint:2);

    // Convert number to string and add commas for thousands separator
    const parts = roundedNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}