export type TORBuilderOptions = {
    currentOr: number
    useReceiptPrefix?: boolean // only for payment
    itiration?: number // only for payment

    padding?: number
    paddingChar?: string

    prefix?: string
}

export const buildOR = ({
    currentOr,
    padding,
    paddingChar = '0',
    prefix = '',
}: TORBuilderOptions) => {
    const constructedPadStart = padding
        ? currentOr.toString().padStart(padding, paddingChar)
        : currentOr

    const finalOr = `${prefix}${constructedPadStart}`

    return finalOr
}
