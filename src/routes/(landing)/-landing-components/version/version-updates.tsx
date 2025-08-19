import { softwareUpdates } from '@/constants'

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

const VersionUpdates = () => {
    return (
        <div className="space-y-2">
            {softwareUpdates.updates.map((update, index) => (
                <Card className="px-2 py-2" key={index}>
                    <CardTitle className="flex items-center text-sm">
                        {update.Icon}{' '}
                        <span className="pl-2"> {update.updateStatus}</span>
                    </CardTitle>
                    <CardContent className="justify-start px-0 py-2 text-sm">
                        <div></div>
                        {update.text}
                    </CardContent>
                    <CardFooter className="flex justify-between px-0 py-0 text-xs">
                        Release Date:{' '}
                        <span>{softwareUpdates.date.toDateString()}</span>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default VersionUpdates
