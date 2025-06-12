import { DebouncedInput } from '@/components/ui/debounced-input'

interface Props {
    value: { from?: number; to?: number }
    onChange: (newValue: { from?: number; to?: number }) => void
}

const NumberRange = ({ value, onChange }: Props) => {
    return (
        <div className="flex items-center gap-x-1">
            <DebouncedInput
                type="number"
                className="max-w-32"
                value={value.from ?? ''}
                onChange={(inpt) =>
                    onChange({
                        ...value,
                        from: inpt as number,
                    })
                }
                placeholder="Min"
            />
            <DebouncedInput
                type="number"
                className="max-w-32"
                value={value.to ?? ''}
                onChange={(inpt) =>
                    onChange({
                        ...value,
                        to: inpt as number,
                    })
                }
                placeholder="Max"
            />
        </div>
    )
}

export default NumberRange
