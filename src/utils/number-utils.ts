export const formatNumber = (
    value: number,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
) => {
    if (isNaN(value)) return '...'
    return value.toLocaleString('en-US', {
        useGrouping: true,
        minimumFractionDigits,
        maximumFractionDigits,
    })
}
