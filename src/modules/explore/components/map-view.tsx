import { MapIcon } from '@/components/icons'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const MapView = () => {
    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Map View
                </CardTitle>
                <CardDescription>
                    Interactive map showing organizations and branches
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                            Map integration coming soon
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MapView
