import { useState } from 'react'

import { TMockCloanInputSchema } from '@/modules/calculator'

import YesNoBadge from '@/components/badges/yes-no-badge'
import { BookOpenIcon, CalculatorIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

import { useModalState } from '@/hooks/use-modal-state'

import {
    IComputationSheet,
    IComputationSheetAmortizationResponse,
} from '../computation-sheet.types'
import ComputationSheetCalculator from './computation-sheet-calculator'
import { ComputationSheetCreateUpdateFormModal } from './forms/computation-sheet-create-update-form'

type Props = {
    computationSheet?: IComputationSheet
}

const ComputationSheetSchemeCard = ({ computationSheet }: Props) => {
    const editModal = useModalState()
    const calculatorModal = useModalState()
    const [recentCalcData, setRecentCalcData] = useState<
        TMockCloanInputSchema | undefined
    >()
    const [recentCalcResult, setRecentCalcResult] = useState<
        IComputationSheetAmortizationResponse | undefined
    >()

    return (
        <div className="w-full relative bg-card rounded-xl p-4 hover:shadow-md transition-shadow">
            <ComputationSheetCreateUpdateFormModal
                {...editModal}
                formProps={{
                    computationSheetId: computationSheet?.id,
                    defaultValues: computationSheet,
                }}
                hideOnSuccess={false}
            />

            <div className="shrink-none space-y-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold truncate pr-2 relative">
                        <BookOpenIcon className="text-muted-foreground inline mr-2" />
                        {computationSheet?.name ? (
                            <span>{computationSheet.name}</span>
                        ) : (
                            <span className="text-muted-foreground">
                                No scheme name
                            </span>
                        )}
                    </CardTitle>

                    <div className="space-x-2">
                        <Sheet {...calculatorModal}>
                            <SheetTrigger asChild>
                                <Button
                                    className="rounded-xl"
                                    variant="outline"
                                >
                                    <CalculatorIcon /> Try in Calculator
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="!max-w-none w-fit rounded-2xl">
                                <SheetHeader>
                                    <SheetTitle>Scheme Calculator</SheetTitle>
                                    <SheetDescription>
                                        Test and compute loan computations based
                                        on this scheme.
                                    </SheetDescription>
                                </SheetHeader>
                                <ComputationSheetCalculator
                                    computationSheetId={computationSheet?.id}
                                    defaultInput={recentCalcData}
                                    defaultResult={recentCalcResult}
                                    onCalculatorResult={setRecentCalcResult}
                                    onSubmitData={setRecentCalcData}
                                />
                            </SheetContent>
                        </Sheet>
                        {computationSheet?.id && (
                            <Button
                                className="size-fit p-2 rounded-xl text-muted-foreground/70 hober:text-foreground"
                                onClick={() => editModal.onOpenChange(true)}
                                variant="outline"
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground/70 line-clamp-2">
                    {computationSheet?.description &&
                    computationSheet?.description.length > 0
                        ? computationSheet.description
                        : 'no description'}
                </p>
            </div>
            <div className="border rounded-xl flex items-center mt-4 p-4 justify-evenly gap-x-4 bg-background/20">
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        {computationSheet?.comaker_account}
                    </span>
                    <p className="text-xs text-muted-foreground">CoMaker</p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge
                            value={!!computationSheet?.deliquent_account}
                        />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Deliquent Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge
                            value={!!computationSheet?.interest_account}
                        />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Interest Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge value={!!computationSheet?.fines_account} />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Fines Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge value={!!computationSheet?.exist_account} />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Exist Account
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ComputationSheetSchemeCard
