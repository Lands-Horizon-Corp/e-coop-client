import { useEffect, useState } from 'react'

import { QrCodeIcon, SearchIcon } from 'lucide-react'

import RefreshButton from '@/components/buttons/refresh-button'
import { OrganizationIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import useDebounce from '@/hooks/use-debounce'

type TJoinOrgSearchProps = {
    setSearchTerm: (term: string) => void
    setOpenJoinWithCodeModal: (value: boolean) => void
    refetch: () => void
}

export const JoinOrgSearch = ({
    setSearchTerm,
    setOpenJoinWithCodeModal,
    refetch,
}: TJoinOrgSearchProps) => {
    const [inputSearch, setInputSearch] = useState('')

    const debouseSearchTerm = useDebounce(inputSearch, 400)

    useEffect(() => {
        setSearchTerm(debouseSearchTerm)
    }, [debouseSearchTerm, setSearchTerm])

    return (
        <div className="flex mt-0 w-full justify-between items-center mx-auto pb-2">
            <div className="font-semibold text-xl flex items-center ">
                <span className="relative mr-5 before:absolute before:left-1/2 before:top-[50%] before:-z-10 before:size-[30px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:opacity-50 before:blur-lg before:content-['']">
                    <OrganizationIcon className="z-50" size={24} />
                </span>
                All Organization List
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-full flex justify-start">
                    <RefreshButton onClick={refetch} />
                </div>
                <div className="relative max-w-md min-w-[16rem]">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10 border-primary"
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder="Search organizations..."
                        value={inputSearch}
                    />
                </div>
                <Button
                    onClick={() => setOpenJoinWithCodeModal(true)}
                    size="sm"
                    variant="outline"
                >
                    <QrCodeIcon className="mr-2 h-4 w-4" />
                    Join with Code
                </Button>
            </div>
        </div>
    )
}
