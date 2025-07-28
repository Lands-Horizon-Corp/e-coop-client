import { UserIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'

import { TPermissionResource } from '@/types'

import {
    BankIcon,
    BillIcon,
    CalendarDotsIcon,
    HandWithdrawIcon,
    Users3Icon,
} from '../icons'

export const PERMISSION_RESOURCE_ICON_MAP: Partial<
    Record<TPermissionResource, IconType>
> = {
    User: UserIcon,
    UserOrganization: Users3Icon,
    MemberType: Users3Icon,
    MemberGroup: Users3Icon,
    MemberCenter: Users3Icon,
    MemberGender: Users3Icon,
    MemberOccupation: Users3Icon,
    MemberClassification: Users3Icon,
    MemberProfile: UserIcon,
    Banks: BankIcon,
    Holidays: CalendarDotsIcon,
    BillsAndCoin: BillIcon,
    Loan: HandWithdrawIcon,
    TransactionBatch: BillIcon,
    Timesheet: CalendarDotsIcon,
    Footstep: CalendarDotsIcon,
}
