import React from 'react'

interface EmptyStateProps {
    type: string
    icon: React.ReactNode
}

const EmptyState = ({ type, icon }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">No {type} Found</h3>
        <p className="text-muted-foreground text-center max-w-md">
            Try adjusting your search terms or filters to find{' '}
            {type.toLowerCase()}.
        </p>
    </div>
)

export default EmptyState
