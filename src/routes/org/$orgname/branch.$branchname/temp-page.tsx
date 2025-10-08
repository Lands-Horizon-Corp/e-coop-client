import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

// import LoanView from '@/modules/loan-transaction/components/loan-view'

import PageContainer from '@/components/containers/page-container'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/temp-page'
)({
    component: RouteComponent,
})

function RouteComponent() {
    // Mock async function for promise example
    const mockAsyncOperation = (): Promise<{ message: string; id: number }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.3 // 70% success rate
                if (success) {
                    resolve({ message: 'Operation completed', id: 12345 })
                } else {
                    reject(new Error('Operation failed'))
                }
            }, 24000) // 2 second delay
        })
    }

    return (
        <PageContainer>
            {/* Toast Test Buttons */}
            <div className="flex gap-2 mb-4 p-4">
                <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                        toast.info('Info! Operation completed successfully.')
                    }
                >
                    Info
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                        toast.success(
                            'Success! Operation completed successfully.'
                        )
                    }
                >
                    Success
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => toast.error('Error! Something went wrong.')}
                >
                    Error
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                        toast.warning('Warning! Please check your input.')
                    }
                >
                    Warning
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        toast('Custom toast message', {
                            description:
                                'This is a custom toast with description',
                            action: {
                                label: 'Action',
                                onClick: () => console.log('Action clicked!'),
                            },
                        })
                    }
                >
                    Custom
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        toast.promise(mockAsyncOperation(), {
                            loading: 'Processing request...',
                            success: (data) =>
                                `Success! ID: ${data.id} - ${data.message}`,
                            error: (err) => `Failed: ${err.message}`,
                        })
                    }
                >
                    Promise
                </Button>
            </div>

            {/* <LoanView
                loanTransactionId={'87ee9c32-1faa-4285-b5d7-07fe4fab4ee2'}
            /> */}
        </PageContainer>
    )
}
