import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PAPER_SIZES } from '../../generated-reports.constants'

export type PaperSizeName = keyof typeof PAPER_SIZES
export type TPaperSizeUnit = 'mm' | 'in' | 'pt'

export interface PaperSize {
    name: string
    width: number
    height: number
    unit: TPaperSizeUnit
}

const PaperSizeSelector = ({
    currentValue,
    onSelect,
    disabled,
}: {
    currentValue?: string
    onSelect: (sizeName: PaperSizeName | undefined) => void
    disabled?: boolean
}) => {
    return (
        <RadioGroup
            className="flex flex-col gap-2"
            disabled={disabled}
            onValueChange={(value) => {
                if (value === 'custom') {
                    onSelect(undefined)
                } else {
                    onSelect(value as PaperSizeName)
                }
            }}
            value={currentValue || 'custom'}
        >
            {/* Custom/None Option */}
            <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                <RadioGroupItem
                    className="order-1 after:absolute after:inset-0"
                    id="paper-size-custom"
                    value="custom"
                />
                <div className="flex grow items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <Label
                            className="font-semibold"
                            htmlFor="paper-size-custom"
                        >
                            🛠️ Custom Size
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            Define your own dimensions
                        </span>
                    </div>
                </div>
            </div>

            {Object.entries(PAPER_SIZES).map(([key, data]) => {
                return (
                    <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                        <RadioGroupItem
                            className="order-1 after:absolute after:inset-0"
                            id={`paper-size-${key}`}
                            value={key}
                        />
                        <div className="flex grow items-center gap-3">
                            {/* Visual paper representation */}

                            <div className="flex flex-col gap-1">
                                <Label
                                    className="font-semibold"
                                    htmlFor={`paper-size-${key}`}
                                >
                                    {data.name}
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {data.width}×{data.height} {data.unit}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </RadioGroup>
    )
}

export default PaperSizeSelector
