import { ReactNode } from 'react'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import { IBaseProps, IClassProps } from '@/types'

import { TPermissionAction, TPermissionResource } from '../permission.types'
import {
    IHasPermissionOpts,
    TPermissionLogic,
    hasPermission,
} from '../permission.utils'
import PermissionNotAllowedDisplay from './permission-not-allowed-display'

export type NotAllowedDisplayProps = {
    message: string
    permissionName?: TPermissionAction | TPermissionAction[]
    resourceType?: TPermissionResource
    conditionLogic?: TPermissionLogic
} & IClassProps

interface Props extends IBaseProps, IHasPermissionOpts {
    NotAllowedComponent?: (props: NotAllowedDisplayProps) => ReactNode
    notAllowedComponentProps?: NotAllowedDisplayProps
}

const PermissionGuard = ({
    userOrg,
    children,
    notAllowedComponentProps = { message: 'Not allowed' },
    NotAllowedComponent = PermissionNotAllowedDisplay,
    ...rest
}: Props) => {
    const resolvedUserOrg =
        userOrg || useAuthStore.getState().currentAuth?.user_organization

    const allowed = hasPermission({ userOrg: resolvedUserOrg!, ...rest })

    if (!allowed)
        return (
            <NotAllowedComponent
                {...notAllowedComponentProps}
                conditionLogic={rest.conditionLogic}
                permissionName={rest.action}
                resourceType={rest.resourceType}
            />
        )

    return children
}

export default PermissionGuard
