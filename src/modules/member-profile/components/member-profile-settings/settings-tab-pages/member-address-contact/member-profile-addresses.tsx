import { useState } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { IMemberAddress } from '@/modules/member-address'
import { MemberAddressCreateUpdateFormModal } from '@/modules/member-address/components/forms/member-address-create-update-form'
import { useDeleteMemberProfileAddress } from '@/modules/member-address/member-address.service'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    BarcodeScanIcon,
    LocationPinIcon,
    MapIcon,
    ParkIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
    TreeCityIcon,
    VillageIcon,
    WoodSignsIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import EmptyListIndicator from '../empty-list-indicator'

const MemberAddressCard = ({ address }: { address: IMemberAddress }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteMemberAddress, isPending: isDeleting } =
        useDeleteMemberProfileAddress({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                }),
            },
        })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberAddressCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Address"
                description="Modify / Update this educational attainment information."
                formProps={{
                    memberProfileId: address.member_profile_id,
                    memberAddressId: address.id,
                    defaultValues: address,
                }}
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <p className="font-bold">{address.label}</p>
                </div>
                <fieldset
                    disabled={isDeleting}
                    className="flex items-center justify-end"
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        hoverVariant="destructive"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        onClick={() => setEdit(true)}
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Educational Attainment',
                                description:
                                    'Are you sure to delete this educational attainment',
                                onConfirm: () =>
                                    deleteMemberAddress({
                                        memberAddressId: address.id,
                                        memberProfileId:
                                            address.member_profile_id,
                                    }),
                            })
                        }
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </fieldset>
            </div>
            <Separator className="!my-2" />
            <div className="space-y-2">
                <LocationPinIcon className="mr-2 inline size-6 text-muted-foreground" />
                {address?.address ?? (
                    <span className="text-sm italic text-muted-foreground/60">
                        No Address <WoodSignsIcon className="ml-1 inline" />
                    </span>
                )}
                <div className="grid grid-cols-2 gap-4 gap-y-2 py-4 text-sm">
                    <span className="text-muted-foreground">
                        <MapIcon className="mr-2 inline text-muted-foreground" />
                        Country
                    </span>
                    <p>{address.country_code}</p>
                    <span className="text-muted-foreground">
                        <WoodSignsIcon className="mr-2 inline font-light text-muted-foreground" />
                        State / Province
                    </span>
                    <p>{address.province_state}</p>
                    <span className="text-muted-foreground">
                        <TreeCityIcon className="mr-2 inline font-light text-muted-foreground" />
                        City
                    </span>
                    <p>{address.city}</p>
                    <span className="text-muted-foreground">
                        <BarcodeScanIcon className="mr-2 inline text-muted-foreground" />
                        Postal Code
                    </span>
                    <p>{address.postal_code}</p>

                    {address.barangay && (
                        <>
                            <span className="text-muted-foreground">
                                <VillageIcon className="mr-2 inline text-muted-foreground" />
                                Barangay
                            </span>
                            <p>{address.barangay}</p>
                        </>
                    )}

                    <span className="text-muted-foreground">
                        <ParkIcon className="mr-2 inline text-muted-foreground" />
                        Landmark
                    </span>
                    <p>{address.landmark}</p>
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberProfileAddress = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberAddressCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Address"
                description="Add new address information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: { member_profile_id: memberProfile.id },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Addresses</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Address <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {memberProfile.member_addresses?.map((address) => (
                    <MemberAddressCard key={address.id} address={address} />
                ))}
                {(!memberProfile.member_addresses ||
                    memberProfile.member_addresses.length === 0) && (
                    <EmptyListIndicator message="Member has empty address record" />
                )}
            </div>
        </div>
    )
}

export default MemberProfileAddress
