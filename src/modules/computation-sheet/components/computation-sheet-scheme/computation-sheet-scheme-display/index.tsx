import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useGetComputationSheetById } from '@/modules/computation-sheet'
import { IComputationSheet } from '@/modules/computation-sheet/computation-sheet.types'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IClassProps, TEntityId } from '@/types'

import ComputationSheetSchemeCard from '../../computation-sheet-scheme-card'
import ComputationSheetSchemeDeductionEntries from './scheme-deduction-entries'
import NegativeIncludeExclude from './scheme-negative-include-exclude'

interface Props extends IClassProps {
    selectedId?: TEntityId
    defaultData?: IComputationSheet
}

const LoanSchemeDisplay = ({ selectedId, defaultData, className }: Props) => {
    const {
        data: computationSheet,
        error: rawError,
        isPending,
        isFetching,
    } = useGetComputationSheetById({
        id: selectedId as TEntityId,
        options: {
            enabled: selectedId !== undefined,
            initialData: defaultData,
            refetchOnWindowFocus: false,
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    // TODO: Realtime delete listener

    if (error)
        return (
            <div
                className={cn(
                    'flex-1 flex items-center justify-center min-h-full space-y-4',
                    className
                )}
                key={isFetching ? 'yes' : 'no'}
            >
                <p className="text-center text-xs py-8 mx-auto text-muted-foreground">
                    could not display scheme : <span>{error}</span>
                </p>
            </div>
        )

    return (
        <div
            className={cn(
                'flex-1 min-h-full max-w-full min-w-0 space-y-4',
                className
            )}
            key={computationSheet?.id ?? ''}
        >
            {isPending && selectedId !== undefined && (
                <LoadingSpinner className="mx-auto" />
            )}
            {!isPending && selectedId !== undefined && (
                <>
                    <ComputationSheetSchemeCard
                        computationSheet={computationSheet}
                    />
                    <Tabs defaultValue="automatic-loan-deductions">
                        <ScrollArea>
                            <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
                                <TabsTrigger
                                    className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    value="automatic-loan-deductions"
                                >
                                    Automatic Loan Deductions
                                </TabsTrigger>
                                <TabsTrigger
                                    className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    value="negative-excluded-included"
                                >
                                    Negative Accounts / Included / Excluded
                                    Accounts
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent value="automatic-loan-deductions">
                            <ComputationSheetSchemeDeductionEntries
                                className=""
                                computationSheetId={selectedId}
                            />
                        </TabsContent>
                        <TabsContent value="negative-excluded-included">
                            <NegativeIncludeExclude
                                computationSheetId={selectedId}
                            />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    )
}

export default LoanSchemeDisplay
