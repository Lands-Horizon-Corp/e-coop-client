import { ReactNode } from 'react'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { IUserOrganization } from '@/modules/user-organization'

import { IAuditable, IBaseProps, IClassProps } from '@/types'

import { TPermissionAction, TPermissionResource } from '../permission.types'
import { hasPermission } from '../permission.utils'
import PermissionNotAllowedDisplay from './permission-not-allowed-display'

export type NotAllowedDisplayProps = {
    message: string
    permissionName?: string
    resourceName?: string
} & IClassProps

interface Props<TResourceData extends IAuditable = IAuditable>
    extends IBaseProps {
    userOrg?: IUserOrganization
    resourceType: TPermissionResource
    action: TPermissionAction
    resource?: TResourceData
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
                permissionName={rest.action}
                resourceName={rest.resourceType}
            />
        )

    return children
}

export default PermissionGuard
