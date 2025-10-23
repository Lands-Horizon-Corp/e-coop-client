import { MagnifyingGlassIcon as SearchIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'

type ExploreHeaderProps = {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

const ExploreHeader = ({ searchTerm, setSearchTerm }: ExploreHeaderProps) => {
    return (
        <>
            <div className="text-start flex items-center mx-auto !mt-20">
                <div className="flex flex-col flex-2 justify-start mb-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                        Explore
                    </h1>
                    <p className="text-md">
                        Discover organizations and branches that match your
                        interests
                    </p>
                </div>
                <div className="relative flex-1 max-w-2xl mx-auto">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search organizations, branches, or locations..."
                        value={searchTerm}
                    />
                </div>
            </div>
        </>
    )
}

export default ExploreHeader
