import { forwardRef } from 'react'

import { cn } from '@/helpers'
import { toDateTimeFormatFile } from '@/helpers/date-utils'

import CopyTextButton from '@/components/copy-text-button'
import {
    DetailsIcon,
    HandCoinsIcon,
    PieChartIcon,
    QrCodeIcon,
    RenderIcon,
    TIcon,
    UserTagIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { QrCodeDownloadable } from '@/components/qr-code'
import TextRenderer from '@/components/text-renderer'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile } from '../..'
import { useGetMemberProfileById } from '../../member-profile.service'
import OrganizationBranchDisplay from './banners/company-branch-display'
import JointAccountsDisplay from './displays/joint-accounts-display'
import MemberRecruitsDisplay from './displays/member-recruits-display'
import RelativeAccountsDisplay from './displays/relative-accounts-display'
import SectionTitle from './section-title'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberGeneralMembershipInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <SectionTitle
                    title="Membership Information"
                    Icon={UserTagIcon}
                />
                <div className="flex items-center justify-between">
                    <OrganizationBranchDisplay
                        organization={data?.organization}
                        branch={data?.branch}
                    />
                    {data?.qr_code ? (
                        <QrCodeDownloadable
                            className="size-24"
                            value={JSON.stringify(data.qr_code)}
                            fileName={`member-profile-${data.passbook ?? 'nopb'}-${toDateTimeFormatFile(new Date())}`}
                        />
                    ) : (
                        <div className="text-muted-foreground/60">
                            <QrCodeIcon
                                strokeWidth={1.2}
                                className="mx-auto size-24"
                            />
                            <p className="mx-auto text-center text-xs">
                                QR Unavailable
                            </p>
                        </div>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <p className="truncate text-sm">{data?.id ?? '-'} </p>
                        <p className="text-xs text-muted-foreground/70">
                            Member Profile ID
                            {data?.id && (
                                <CopyTextButton
                                    className="ml-2"
                                    successText="Profile ID coppied"
                                    textContent={data.id}
                                />
                            )}
                        </p>
                    </div>
                    <div className="flex max-w-full items-end gap-x-2">
                        <PreviewMediaWrapper
                            media={
                                data?.member_verified_by_employee_user?.media
                            }
                        >
                            <ImageDisplay
                                src={
                                    data?.member_verified_by_employee_user
                                        ?.media?.download_url
                                }
                                className="size-16 rounded-xl"
                                fallbackClassName="rounded-xl"
                            />
                        </PreviewMediaWrapper>
                        <div className="flex-1 space-y-2">
                            {data?.member_verified_by_employee_user ? (
                                <>
                                    <p className="truncate text-sm">
                                        {
                                            data
                                                .member_verified_by_employee_user
                                                .full_name
                                        }
                                    </p>
                                    <p className="max-w-full truncate text-xs text-muted-foreground/60">
                                        ID:{' '}
                                        {
                                            data
                                                .member_verified_by_employee_user
                                                .id
                                        }{' '}
                                    </p>
                                </>
                            ) : (
                                '-'
                            )}
                            <p className="text-xs text-muted-foreground/70">
                                Verified By Employee{' '}
                                {data?.member_verified_by_employee_user && (
                                    <CopyTextButton
                                        className="ml-1"
                                        successText="Employee ID coppied"
                                        textContent={
                                            data
                                                .member_verified_by_employee_user
                                                .id
                                        }
                                    />
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="grid gap-x-2 md:grid-cols-4">
                        <div className="space-y-2">
                            <p>{data ? `${data.first_name}` : '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                First Name
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data ? `${data.middle_name}` : '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Middle Name
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data ? `${data.last_name}` : '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Last Name
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.suffix ?? 'N/A'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Suffix
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <p>{data ? `${data.passbook}` : '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Passbook Number
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.member_type?.name ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Member Type
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.old_reference_id ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Old Reference ID
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.status ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Status{' '}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.member_type?.name ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Membership Type
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.member_classification?.name ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Membership Classification
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>{data?.member_center?.name ?? '-'}</p>
                            <p className="text-xs text-muted-foreground/70">
                                Membership Center
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="inline-flex items-center gap-x-2">
                                {data?.member_department?.icon && (
                                    <div className="inline-flex p-1 text-muted-foreground size-fit items-center justify-center rounded-full border bg-muted">
                                        <RenderIcon
                                            icon={
                                                data?.member_department
                                                    ?.icon as TIcon
                                            }
                                            className="size-4"
                                        />
                                    </div>
                                )}{' '}
                                {data?.member_department?.name ?? '-'}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                Member Department
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-x-2 md:grid-cols-2">
                        <div
                            className={cn(
                                'flex gap-x-4 rounded-xl border bg-popover/40 p-4 text-muted-foreground/60',
                                data?.is_mutual_fund_member &&
                                    'border-primary/60 bg-gradient-to-bl from-transparent to-primary/50 text-foreground'
                            )}
                        >
                            <div className="size-fit rounded-full bg-secondary p-2">
                                <PieChartIcon />
                            </div>
                            <div className="space-y-1">
                                <p>Mutual Fund Member</p>
                                <p className="text-sm text-muted-foreground/70">
                                    Contributes to a pooled investment (mutual
                                    fund).
                                </p>
                            </div>
                        </div>
                        <div
                            className={cn(
                                'flex gap-x-4 rounded-xl border bg-popover/40 p-4 text-muted-foreground/60',
                                data?.is_micro_finance_member &&
                                    'border-primary/60 bg-gradient-to-bl from-transparent to-primary/50 text-foreground'
                            )}
                        >
                            <div className="size-fit rounded-full bg-secondary p-2">
                                <HandCoinsIcon />
                            </div>
                            <div className="space-y-1">
                                <p>Microfinance Member</p>
                                <p className="text-sm text-muted-foreground/90">
                                    Participates in small-scale financial
                                    services.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    <div className="space-y-4">
                        <SectionTitle
                            Icon={DetailsIcon}
                            title="Description"
                            subTitle="Bio/Short description about member"
                        />
                        <TextRenderer
                            className="rounded-xl bg-popover p-4"
                            content={data?.description ?? '-'}
                        />
                    </div>

                    <Separator />
                    <JointAccountsDisplay
                        jointAccounts={data?.member_joint_accounts}
                    />

                    <RelativeAccountsDisplay
                        relativeAccounts={data?.member_relative_accounts}
                    />

                    <MemberRecruitsDisplay recruits={data?.recruited_members} />
                </div>
            </div>
        )
    }
)

MemberGeneralMembershipInfo.displayName = 'MemberGeneralMembershipInfo'

export default MemberGeneralMembershipInfo
