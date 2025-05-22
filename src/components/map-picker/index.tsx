import { LatLngExpression, LatLngLiteral } from 'leaflet'
import Map from '../map'
import Modal, { IModalProps } from '../modals/modal'
import { TMainMapProps } from '@/types'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

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
                title="Pick a Location on the Map"
                description="Click on the map to select coordinates. You can also edit them manually below."
            >
                <Map
                    {...mapProps}
                    center={defaultCenter}
                    zoom={defaultZoom}
                    className="mb-4 h-[50vh] w-full"
                    onCoordinateClick={onCoordinateClick}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-2">
                        <Label>Latitude</Label>
                        <Input
                            type="number"
                            readOnly
                            value={coordinates?.lat ?? ''}
                            onChange={(e) =>
                                setCoordinates((prev) => ({
                                    lat: parseFloat(e.target.value) || 0,
                                    lng: prev?.lng ?? 0,
                                }))
                            }
                            placeholder="Latitude"
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Longtitude</Label>
                        <Input
                            readOnly
                            value={coordinates?.lng ?? ''}
                            onChange={(e) =>
                                setCoordinates((prev) => ({
                                    lat: prev?.lat ?? 0,
                                    lng: parseFloat(e.target.value) || 0,
                                }))
                            }
                            placeholder="Longitude"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MapPicker
