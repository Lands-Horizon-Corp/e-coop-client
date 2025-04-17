import MainMapContainer from '@/components/map'
import { Outlet } from '@tanstack/react-router'
import { LatLngExpression } from 'leaflet'

const TestLayout = () => {
    const defaultCenter: LatLngExpression = [14.5995, 120.9842]
    const defaultZoom = 13

    // if wanted to use current Position or List of Markers

    return (
        <div className="mx-auto flex h-[500px] w-[80%] flex-col">
            <MainMapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="flex-grow !p-0"
                // onMultipleCoordinatesChange={(coor)=> console.log(coor)}
                viewOnly
                hideControls
                // multiplePins
                // viewOnly
            />
            <Outlet />
        </div>
    )
}

export default TestLayout
