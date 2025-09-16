import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberQrScannerModal } from '@/modules/member-profile/components/member-qr-scanner'
import {
    Activity,
    Building2,
    MessagesSquare,
    RefreshCw,
    Settings,
    Users,
} from 'lucide-react'

import { ScanQrIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { useGetHeartbeat } from '../../heartbeat.service'

const Heartbeat = () => {
    const modalState = useModalState()
    const qrScannerModal = useModalState()

    const { data, isLoading, error: rawError, refetch } = useGetHeartbeat()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    useSubscribe(`user_organization.status.branch.${branch_id}`, refetch)

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-48">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading dashboard...
                </div>
            </div>
        )

    const error = serverRequestErrExtractor({ error: rawError })

    if (error)
        return (
            <div className="flex items-center justify-center h-48 text-destructive">
                Error loading dashboard: {error}
            </div>
        )

    return (
        <div className="space-y-6 p-6 bg-background">
            {/* Header */}
            <MemberQrScannerModal
                className="!w-fit !min-w-fit"
                {...qrScannerModal}
                scannerProps={{
                    hideButton: true,
                    onSelectMemberProfile: (memberProfile) => {
                        toast.success(
                            `Selected member: ${memberProfile.full_name}`
                        )
                    },
                }}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">
                            Organization Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time activity and member status
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                        <div className="w-2 h-2  dark:bg-primary rounded-full"></div>
                        Online ({data?.online_users_count || 0})
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {data && (
                <>
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                            <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                            Total Members
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {data.total_members.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            +
                                            {(
                                                (data.online_members /
                                                    data.total_members) *
                                                100
                                            ).toFixed(0)}
                                            % online now
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                            <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full"></div>
                                            Online Now
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {data.online_users_count}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Peak:{' '}
                                            {Math.max(
                                                data.online_users_count,
                                                data.online_members
                                            )}{' '}
                                            today
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                            <Building2 className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                            Active Employees
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {data.total_active_employees}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {data.online_employees} online now
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-1 text-foreground">
                                        Quick Actions
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Manage your organization and members
                                        efficiently
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-border hover:bg-accent hover:"
                                    >
                                        <Users className="h-4 w-4" />
                                        Online ({data.online_members})
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-border hover:bg-accent hover:"
                                    >
                                        <MessagesSquare className="h-4 w-4" />
                                        New Message
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-border hover:bg-accent hover:"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-border hover:bg-accent hover:"
                                    >
                                        <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full"></div>
                                        System Online
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            // modalState.onOpenChange(true)
                                            qrScannerModal.onOpenChange(true)
                                        }
                                        className="gap-2 border-border hover:bg-accent hover:"
                                    >
                                        <ScanQrIcon />
                                        Quick Search Member
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <div className="text-xs text-muted-foreground">
                        Click the "Online" button to see the beautiful member
                        list with avatars, status indicators, and role badges.
                    </div>

                    {/* Modals */}
                    <Modal
                        {...modalState}
                        className="size-fit"
                        titleClassName="hidden"
                        descriptionClassName="hidden"
                    >
                        {/* <MemberQuickSearch /> */}
                        {/* TODO: Add member quick search */}
                    </Modal>
                </>
            )}
        </div>
    )
}

export default Heartbeat
