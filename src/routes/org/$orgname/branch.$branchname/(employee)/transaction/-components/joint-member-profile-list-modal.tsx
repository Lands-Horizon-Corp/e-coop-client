import { HandShakeHeartIcon } from '@/components/icons'
import SectionTitle from '@/components/member-infos/section-title'
import Modal, { IModalProps } from '@/components/modals/modal'

import { IMemberJointAccount } from '@/types'

import JointAccountCardView from './joint-account-card-view'

interface jointMemberProfileListModalProps extends IModalProps {
    jointAccounts: IMemberJointAccount[]
}

const JointMemberProfileListModal = ({
    jointAccounts,
    ...props
}: jointMemberProfileListModalProps) => {
    return (
        <Modal {...props} className="max-w-[1200px]">
            <SectionTitle
                title="Joint Accounts"
                subTitle="Co-owners of this account that have the access and share
                financial responsibility of this account "
                Icon={HandShakeHeartIcon}
            />
            {(!jointAccounts || jointAccounts.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    no joint accounts
                </p>
            )}
            <div className="grid grid-cols-1 gap-3 overflow-y-auto lg:grid-cols-2">
                {jointAccounts.map((jointAccounts) => {
                    return (
                        <JointAccountCardView jointAccounts={jointAccounts} />
                    )
                })}
            </div>
        </Modal>
    )
}

export default JointMemberProfileListModal
