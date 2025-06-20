import SectionTitle from '../section-title'
import { MapMarkedIcon } from '@/components/icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { IMemberAddress } from '@/types'

interface Props extends IClassProps {
    addresses?: IMemberAddress[]
}

const AddressesDisplay = ({ className, addresses }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                title="Address"
                Icon={MapMarkedIcon}
                subTitle="Other address"
            />

            {(!addresses || addresses.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No other contact numbers referenced
                </p>
            )}
            {addresses && (
                <div className="space-y-4">
                    {addresses?.map((address) => (
                        <div
                            className="rounded-xl bg-popover p-4"
                            key={address.id}
                        >
                            <div className="flex flex-wrap gap-x-24 gap-y-2">
                                <div className="space-y-2 text-sm">
                                    <p>{address.label}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Name
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>{address.address}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Province
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>{address.city}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        City
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>{address.barangay}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Barangay
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>{address.postal_code}</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Postal Code
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        {address.created_at
                                            ? toReadableDate(
                                                  address.created_at,
                                                  "MMM dd yyyy 'at' h:mm a"
                                              )
                                            : '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Date Edited
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AddressesDisplay
