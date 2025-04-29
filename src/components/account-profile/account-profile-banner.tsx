import { format } from 'date-fns'

import {
    EmailIcon,
    CalendarIcon,
    DotMediumIcon,
    PhoneOutlineIcon,
    CalendarCheckIcon,
} from '@/components/icons'
import AccountQr from './account-qr'
import UserProfilePicture from './profile-picture'

import { IUserData } from '@/types'

const AccountProfileBanner = ({
    currentUser,
    updateUserData,
}: {
    currentUser: IUserData
    updateUserData: (newUserData: IUserData) => void
}) => {
    return (
        <div className="overflow-clip rounded-2xl bg-secondary shadow-md">
            <div className="h-[180px] bg-[url('/profile-cover.png')] bg-cover bg-center" />
            <div className="relative p-3 sm:p-5">
                <UserProfilePicture
                    userData={currentUser}
                    onUploadSuccess={updateUserData}
                    className="absolute -top-28 left-4 z-0 size-32"
                />
                <p className="text-2xl font-medium">{currentUser.username}</p>
                <AccountQr
                    fileName={`${currentUser.id}-${currentUser.firstName}-${currentUser.lastName}-profile-qr-${new Date().toISOString()}`}
                />
                <span className="text-sm text-foreground/80">
                    {currentUser.firstName} {currentUser.lastName}
                </span>
                <div className="mt-2 flex flex-row flex-wrap gap-x-2 gap-y-1 text-xs text-foreground/60 sm:items-center">
                    <span>
                        <EmailIcon className="inline" /> {currentUser.email}
                    </span>
                    <DotMediumIcon className="hidden lg:block" />
                    <span>
                        <PhoneOutlineIcon className="inline" />{' '}
                        {currentUser.contactNumber}
                    </span>
                    <DotMediumIcon className="hidden lg:block" />
                    <span>
                        <CalendarIcon className="inline" /> Joined Since{' '}
                        {format(currentUser.createdAt, 'MMM dd yyyy')}
                    </span>
                    <DotMediumIcon className="hidden lg:block" />
                    {currentUser.updatedAt && (
                        <span>
                            <CalendarCheckIcon className="inline" /> Update at{' '}
                            {format(currentUser.updatedAt, 'MMM dd yyyy')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountProfileBanner
