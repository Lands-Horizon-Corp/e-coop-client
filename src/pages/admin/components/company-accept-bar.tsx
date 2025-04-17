import { Button } from '@/components/ui/button'

import { ICompanyResource } from '@/server'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useApproveCompany } from '@/hooks/api-hooks/use-company'
import LoadingSpinner from '@/components/spinners/loading-spinner'

interface Props {
    company: ICompanyResource
}

const CompanyAcceptBar = ({ company }: Props) => {
    const { onOpen } = useConfirmModalStore()

    const { mutate: approve, isPending: isApproving } = useApproveCompany({})

    return (
        <div className="flex w-full items-center justify-between gap-x-4 rounded-xl border px-4 py-2.5">
            <span className="text-xs text-amber-600 dark:text-amber-400/80">
                This company is awaiting approval. It must be approved before it
                can operate.
            </span>
            <div className="flex">
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={isApproving}
                    onClick={() =>
                        onOpen({
                            title: 'Approve Company',
                            confirmString: 'Approve',
                            content:
                                "Are you sure you want to approve this company? This will enable them to start using E-Coop and start their company's operation.",
                            onConfirm: () => approve(company.id),
                        })
                    }
                    className="h-fit py-2 text-xs hover:text-primary"
                >
                    {isApproving && <LoadingSpinner />}
                    Approve
                </Button>
            </div>
        </div>
    )
}

export default CompanyAcceptBar
