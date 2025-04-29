import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams, useRouter } from '@tanstack/react-router'

import {
    TrashIcon,
    CalendarIcon,
    TelephoneIcon,
    LocationPinIcon,
    PencilOutlineIcon,
} from '@/components/icons'
import MainMapContainer from '@/components/map'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import BranchLogo from '@/pages/admin/components/branch-logo'

import { toReadableDate } from '@/utils'

import { ICompanyResource } from '@/types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { branchLoader, useDeleteBranch } from '@/hooks/api-hooks/use-branch'

const BranchCompanySection = ({ company }: { company: ICompanyResource }) => {
    return (
        <div className="space-y-1 rounded-xl bg-popover">
            <div className="flex items-start justify-between gap-x-2 px-4 pb-4 pt-6">
                <div className="space-y-2">
                    <h2 className="text-2xl">{company.name}</h2>
                    <h4 className="text-sm text-foreground/80">
                        {company.address}
                    </h4>
                    <p className="text-sm text-foreground/80">
                        {company.contactNumber}
                    </p>
                    <p className="w-fit rounded-md bg-secondary px-2 py-0.5 text-sm text-foreground/40">
                        #{company.id}
                    </p>
                </div>
                <div className="relative size-fit">
                    <ImageDisplay
                        fallback="-"
                        className="size-20"
                        src={company.media?.downloadURL ?? ''}
                    />
                </div>
            </div>
        </div>
    )
}

const BranchViewPage = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()

    const { branchId, companyId } = useParams({
        from: '/admin/companies-management/$companyId/branch/$branchId',
    })

    const { data: branch } = useSuspenseQuery(branchLoader(branchId))

    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch({
        onSuccess: () =>
            router.navigate({
                to: '/admin/companies-management/$companyId/branch',
                params: { companyId },
            }),
    })

    return (
        <div className="flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-8">
            <div className="flex w-full max-w-5xl flex-col items-center space-y-4">
                <div className="flex w-full flex-col items-center space-y-4 overflow-clip rounded-xl bg-secondary">
                    <div className="relative w-full flex-col items-center overflow-clip rounded-xl bg-popover">
                        <div className="h-[180px] w-full rounded-md bg-[url('/profile-cover.png')] bg-cover bg-center" />
                        <div className="relative z-10 w-full space-y-2.5">
                            <BranchLogo branch={branch} />
                            <div className="pointer-events-none relative z-10 !my-0 space-y-2.5 px-6 pb-4 pt-8 sm:pb-6">
                                <div className="pointer-events-none absolute right-0 top-0 -z-10 m-0 hidden h-full w-full bg-gradient-to-r from-popover from-[10%] to-transparent sm:block" />
                                <span className="pointer-events-auto z-50 flex items-center gap-x-2">
                                    <h3 className="text-lg font-medium">
                                        {branch.name}
                                    </h3>
                                </span>
                                <span className="pointer-events-auto m-0 inline-flex items-center gap-x-2 text-sm text-foreground/80">
                                    <LocationPinIcon /> {branch.address}
                                </span>
                                <div className="pointer-events-auto flex flex-wrap gap-x-4 text-sm text-foreground/50">
                                    <span className="inline-flex items-center gap-x-2">
                                        <TelephoneIcon />
                                        {branch.contactNumber}
                                    </span>
                                    <span className="inline-flex items-center gap-x-2">
                                        <CalendarIcon />
                                        {toReadableDate(branch.createdAt)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            router.navigate({
                                                to: '/admin/companies-management/$companyId/branch/$branchId/edit',
                                                params: { branchId, companyId },
                                            })
                                        }
                                        className="pointer-events-auto rounded-none text-foreground/80 first:rounded-l-md last:rounded-r-md hover:text-foreground"
                                    >
                                        <PencilOutlineIcon className="mr-2 inline" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={isDeleting}
                                        hoverVariant="destructive"
                                        onClick={() =>
                                            onOpen({
                                                title: 'Delete Branch',
                                                description:
                                                    'Are you sure to delete this branch?',
                                                onConfirm: () =>
                                                    deleteBranch(branchId),
                                            })
                                        }
                                        className="pointer-events-auto rounded-none text-foreground/80 first:rounded-l-md last:rounded-r-md hover:text-foreground"
                                    >
                                        {isDeleting ? (
                                            <LoadingSpinner className="mr-2 inline" />
                                        ) : (
                                            <TrashIcon className="mr-2 inline" />
                                        )}
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            {branch.latitude && branch.longitude && (
                                <div className="right-0 top-0 !-z-10 mt-5 h-[200px] w-full select-none sm:absolute sm:!mt-0 sm:h-full sm:w-[200px] md:w-[500px]">
                                    <MainMapContainer
                                        viewOnly
                                        zoom={13}
                                        hideControls
                                        className="pointer-events-none z-10 rounded-none p-0"
                                        mapContainerClassName="sm:rounded-none"
                                        center={{
                                            lng: branch.longitude,
                                            lat: branch.latitude,
                                        }}
                                        defaultMarkerPins={[
                                            {
                                                lng: branch.longitude,
                                                lat: branch.latitude,
                                            },
                                        ]}
                                    />
                                    <div className="absolute left-0 top-0 z-20 hidden h-full w-full sm:block"></div>
                                    <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-[50%] bg-gradient-to-r from-popover to-transparent sm:block"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="w-full space-y-4">
                    <h3 className="flex items-center gap-x-2 font-medium">
                        Branch&apos;s Description
                    </h3>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                branch.description &&
                                    branch.description.length > 0
                                    ? branch.description
                                    : '<i>No Description</i>'
                            ),
                        }}
                        className="prose !max-w-full rounded-xl bg-secondary p-4 text-sm text-foreground/70 prose-p:text-foreground/80 prose-strong:text-foreground dark:bg-popover sm:text-sm"
                    ></div>
                </div> */}
                <Separator className="w-full" />
                <div className="w-full space-y-4">
                    <h3 className="font-medium">Belongs to Company</h3>
                    {branch.company ? (
                        <BranchCompanySection company={branch.company} />
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <span className="text-sm text-destructive">
                                This branch is not associated with any company.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BranchViewPage
