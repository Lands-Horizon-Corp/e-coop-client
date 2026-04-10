import { useState } from 'react'

import PageContainer from '@/components/containers/page-container'
import { Button } from '@/components/ui/button'
import { HorizontalCard } from '@/components/ui/horizontal-card'

import { useGetAllArea } from '../../area.service'
import { IArea } from '../../area.types'
import MemberAreaPicker from './area-member-picker'

const MapArea = () => {
    const { data } = useGetAllArea()

    const [selectedArea, setSelectedArea] = useState<IArea | null>(null)

    return (
        <PageContainer>
            <div className="flex flex-wrap gap-4 w-full">
                {data?.map((area) => {
                    return (
                        <HorizontalCard
                            actions={<Button size="sm">View Area</Button>}
                            cardProps={{
                                onClick: () => {
                                    console.log('hello')
                                    setSelectedArea(area)
                                },
                            }}
                            className="w-full max-w-md cursor-pointer"
                            description={
                                area.name ?? 'No description available'
                            }
                            image={area.media.download_url}
                            key={area.id} // important
                            title={area.name ?? 'Unnamed Area'}
                        />
                    )
                })}
                {selectedArea && (
                    <MemberAreaPicker
                        areaId={selectedArea.id}
                        // onChange={(member) => setSelectedArea(member)}
                        onSave={() => {
                            // console.log('Saved:', selected)
                        }}
                        value={selectedArea.id}
                    />
                )}
            </div>
        </PageContainer>
    )
}

export default MapArea
