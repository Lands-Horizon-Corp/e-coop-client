import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="size-full h-fit flex flex-col items-center text-black p-8 gap-12"></div>
    )
}
