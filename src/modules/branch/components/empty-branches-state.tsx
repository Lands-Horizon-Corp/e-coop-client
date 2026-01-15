import { BranchIcon, PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyBranchesStateProps {
    onCreateBranch: () => void
    isSeeding?: boolean
}

export const EmptyBranchesState = ({
    onCreateBranch,
    isSeeding,
}: EmptyBranchesStateProps) => {
    return (
        <Card className="border-dashed bg-sidebar border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BranchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No branches yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Get started by creating your first branch. Branches help you
                    organize your organization's locations and operations.
                </p>
                <Button disabled={isSeeding} onClick={onCreateBranch} size="lg">
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Create Your First Branch
                </Button>
            </CardContent>
        </Card>
    )
}
