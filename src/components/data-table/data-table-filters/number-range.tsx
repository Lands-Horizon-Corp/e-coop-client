import { DebouncedInput } from '@/components/ui/debounced-input'

interface Props {
    value: { from?: number; to?: number }
    onChange: (newValue: { from?: number; to?: number }) => void
}

const NumberRange = ({ value, onChange }: Props) => {
    return (
        <div className="flex items-center gap-x-1">
            <DebouncedInput
                className="max-w-32"
                onChange={(inpt) =>
                    onChange({
                        ...value,
                        from: inpt as number,
                    })
                }
                placeholder="Min"
                type="number"
                value={value.from ?? ''}
            />
            <DebouncedInput
                className="max-w-32"
                onChange={(inpt) =>
                    onChange({
                        ...value,
                        to: inpt as number,
                    })
                }
                placeholder="Max"
                type="number"
                value={value.to ?? ''}
            />
        </div>
    )
}

export default NumberRange
