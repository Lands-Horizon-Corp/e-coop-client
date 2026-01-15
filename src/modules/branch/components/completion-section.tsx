import { LoadingCircleIcon, RocketIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CompletionSectionProps {
    isNoBranches: boolean
    isSeeding: boolean
    onFinishSetup: () => void
}

export const CompletionSection = ({
    isNoBranches,
    isSeeding,
    onFinishSetup,
}: CompletionSectionProps) => {
    if (isNoBranches) {
        return null
    }

    return (
        <Card className="border-primary sticky bottom-2 bg-secondary dark:border-primary dark:!bg-background  drop-shadow-2xl/50 drop-shadow-primary">
            <CardContent className="flex items-center justify-between p-6 ">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-primary rounded-full bg-primary/20 dark:bg-primary/50">
                        <RocketIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold ">
                            Seed branch to complete setup
                        </h3>
                        <p className="text-sm text-primary dark:text-primary-50">
                            Branches must be seeded before use. Creating an
                            organization automatically creates and seeds its
                            initial branch; you can add additional branches to
                            existing organizations.
                        </p>
                    </div>
                </div>
                <Button
                    className="primary"
                    disabled={isSeeding}
                    onClick={onFinishSetup}
                >
                    {isSeeding ? (
                        <>
                            <LoadingCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                            Finishing Setup...
                        </>
                    ) : (
                        <>
                            {/* <CheckFillIcon className="mr-2 h-4 w-4" /> */}
                            Start Seed
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
