import { useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams, useRouter } from '@tanstack/react-router'

import {
    StoreIcon,
    TrashIcon,
    CalendarIcon,
    TelephoneIcon,
    LocationPinIcon,
    PencilOutlineIcon,
    BadgeMinusFillIcon,
    BadgeCheckFillIcon,
    BadgeQuestionFillIcon,
    QuestionCircleFillIcon,
    BadgeExclamationFillIcon,
} from '@/components/icons'
import MainMapContainer from '@/components/map'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import CompanyLogo from '@/components/company-profile/company-logo'
import CompanyAcceptBar from '@/pages/admin/components/company-accept-bar'

import { toReadableDate } from '@/utils'
import { IOwnerResource } from '@/server/types'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { companyLoader, useDeleteCompany } from '@/hooks/api-hooks/use-company'
import CompanyBadge from '@/components/company-profile/company-badge'
import CompanyDescription from '@/components/company-profile/company-description'

const CompanyOwnerSection = ({ owner }: { owner: IOwnerResource }) => {
    const AccountBadge = useMemo(() => {
        switch (owner.status) {
            case 'Verified':
                return <BadgeCheckFillIcon className="text-primary" />
            case 'Pending':
                return <BadgeQuestionFillIcon className="text-amber-600" />
            case 'Not Allowed':
                return <BadgeExclamationFillIcon className="text-destructive" />
            default:
                return <BadgeMinusFillIcon className="text-foreground/80" />
        }
    }, [owner.status])

    return (
        <div className="space-y-1 rounded-xl bg-popover">
            <div className="flex items-start justify-between gap-x-2 px-4 pb-4 pt-6">
                <div className="space-y-2">
                    <h2 className="text-2xl">{`${owner.firstName} ${owner.middleName} ${owner.lastName}`}</h2>
                    <h4 className="text-sm text-foreground/80">
                        {`${owner.email}`}{' '}
                    </h4>
                    <p className="w-fit rounded-md bg-secondary px-2 py-0.5 text-sm text-foreground/40">
                        #{owner.id}
                    </p>
                </div>
                <div className="relative size-fit">
                    <ImageDisplay
                        fallback="-"
                        className="size-20"
                        src={owner.media?.downloadURL ?? ''}
                    />
                    <span className="absolute bottom-0 left-0">
                        {AccountBadge}
                    </span>
                </div>
            </div>
            <p className="px-4 pb-4 text-foreground/80">{owner.description}</p>
        </div>
    )
}

const CompanyViewPage = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()

    const { companyId } = useParams({
        from: '/admin/companies-management/$companyId/view',
    })

    const { data: company } = useSuspenseQuery(companyLoader(companyId))

    const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany({
        onSuccess: () => router.navigate({ to: '/admin/companies-management' }),
    })

    return (
        <div className="flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-8">
            <div className="flex w-full max-w-5xl flex-col items-center space-y-4">
                <div className="flex w-full flex-col items-center space-y-4 overflow-clip rounded-xl bg-secondary dark:bg-popover">
                    <div className="relative w-full flex-col items-center overflow-clip">
                        <div className="h-[180px] w-full rounded-md bg-[url('/profile-cover.png')] bg-cover bg-center" />
                        <div className="relative z-10 w-full space-y-2.5">
                            <CompanyLogo
                                className="absolute -top-28 left-4 z-20"
                                company={company}
                            />
                            <div className="pointer-events-none relative z-10 !my-0 space-y-2.5 px-6 pb-4 pt-8 sm:pb-6">
                                <div className="pointer-events-none absolute right-0 top-0 -z-10 m-0 hidden h-full w-full bg-gradient-to-r from-popover from-[10%] to-transparent sm:block" />
                                <span className="pointer-events-auto z-50 flex items-center gap-x-2">
                                    <h3 className="text-lg font-medium">
                                        {company.name}
                                    </h3>
                                    <CompanyBadge company={company} />
                                </span>
                                <span className="pointer-events-auto m-0 inline-flex items-center gap-x-2 text-sm text-foreground/80">
                                    <LocationPinIcon /> {company.address}
                                </span>
                                <div className="pointer-events-auto flex flex-wrap gap-x-4 text-sm text-foreground/50">
                                    <span className="inline-flex items-center gap-x-2">
                                        <TelephoneIcon />
                                        {company.contactNumber}
                                    </span>
                                    <span className="inline-flex items-center gap-x-2">
                                        <CalendarIcon />
                                        {toReadableDate(company.createdAt)}
                                    </span>
                                    <span className="inline-flex items-center gap-x-2">
                                        <StoreIcon />
                                        {company.branches?.length ?? 0} Branch
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            router.navigate({
                                                to: '/admin/companies-management/$companyId/edit',
                                                params: { companyId },
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
                                        onClick={() =>
                                            router.navigate({
                                                to: '/admin/companies-management/$companyId/branch',
                                                params: { companyId },
                                            })
                                        }
                                        className="pointer-events-auto rounded-none text-foreground/80 first:rounded-l-md last:rounded-r-md hover:text-foreground"
                                    >
                                        <StoreIcon className="mr-2 inline" />
                                        Branches
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={isDeleting}
                                        hoverVariant="destructive"
                                        onClick={() =>
                                            onOpen({
                                                title: 'Delete Company',
                                                description:
                                                    'Are you sure to delete this company?',
                                                onConfirm: () =>
                                                    deleteCompany(companyId),
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
                            {company.latitude && company.longitude && (
                                <div className="right-0 top-0 !-z-10 mt-5 h-[200px] w-full select-none sm:absolute sm:!mt-0 sm:h-full sm:w-[200px] md:w-[500px]">
                                    <MainMapContainer
                                        viewOnly
                                        zoom={13}
                                        hideControls
                                        className="pointer-events-nonee pointer-events-none z-10 h-full rounded-none p-0"
                                        mapContainerClassName="sm:rounded-none"
                                        center={{
                                            lng: company.longitude,
                                            lat: company.latitude,
                                        }}
                                        defaultMarkerPins={[
                                            {
                                                lng: company.longitude,
                                                lat: company.latitude,
                                            },
                                        ]}
                                    />
                                    <div className="absolute left-0 top-0 z-20 hidden h-full w-full sm:block"></div>
                                    <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-[50%] bg-gradient-to-r from-secondary to-transparent dark:from-popover sm:block"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {!company.isAdminVerified && (
                    <CompanyAcceptBar company={company} />
                )}
                <div className="w-full space-y-4">
                    <h3 className="flex items-center gap-x-2 font-medium">
                        Company&apos;s Description
                        <QuestionCircleFillIcon className="inline text-foreground/20" />
                    </h3>
                    <CompanyDescription description={company.description} />
                </div>
                <Separator className="w-full" />
                <div className="w-full space-y-4">
                    <h3 className="font-medium">Company Owner</h3>
                    {company.owner ? (
                        <CompanyOwnerSection owner={company.owner} />
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <span className="text-sm text-destructive">
                                Owner is missing or has been deleted.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CompanyViewPage
