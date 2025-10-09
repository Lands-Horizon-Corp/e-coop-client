import { useState } from 'react'

import { TMainMapProps } from '@/types/map/map'
import { LatLngExpression, LatLngLiteral } from 'leaflet'

import Map from '@/components/map'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MapPickerProps extends IModalProps {
    className?: string
    onChange?: (coordinates: LatLngLiteral) => void
    mapProps?: TMainMapProps
}

const MapPicker = ({ onChange, mapProps, ...props }: MapPickerProps) => {
    const defaultCenter: LatLngExpression = [14.5995, 120.9842]
    const defaultZoom = 13

    const [coordinates, setCoordinates] = useState<LatLngLiteral>()

    const onCoordinateClick = (coordinates: LatLngLiteral) => {
        setCoordinates(
            Array.isArray(coordinates)
                ? { lat: coordinates[0], lng: coordinates[1] }
                : coordinates
        )
        if (onChange) {
            onChange(coordinates)
        }
    }

    return (
        <div className="w-full">
            <Modal
                {...props}
                description="Click on the map to select coordinates. You can also edit them manually below."
                title="Pick a Location on the Map"
            >
                <Map
                    {...mapProps}
                    center={defaultCenter}
                    className="mb-4 h-[50vh] w-full"
                    onCoordinateClick={onCoordinateClick}
                    zoom={defaultZoom}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-2">
                        <Label>Latitude</Label>
                        <Input
                            onChange={(e) =>
                                setCoordinates((prev) => ({
                                    lat: parseFloat(e.target.value) || 0,
                                    lng: prev?.lng ?? 0,
                                }))
                            }
                            placeholder="Latitude"
                            readOnly
                            type="number"
                            value={coordinates?.lat ?? ''}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Longtitude</Label>
                        <Input
                            onChange={(e) =>
                                setCoordinates((prev) => ({
                                    lat: prev?.lat ?? 0,
                                    lng: parseFloat(e.target.value) || 0,
                                }))
                            }
                            placeholder="Longitude"
                            readOnly
                            value={coordinates?.lng ?? ''}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MapPicker
