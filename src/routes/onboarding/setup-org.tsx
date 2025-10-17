import { createFileRoute } from '@tanstack/react-router'

import { OrganizationForm } from '@/modules/organization'

import { OrganizationIcon } from '@/components/icons'

export const Route = createFileRoute('/onboarding/setup-org')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-full w-full flex-col items-center">
            <h1 className="inline-flex gap-x-2 items-center mb-3 text-2xl font-extrabold">
                <span className="relative before:absolute before:left-1/2 before:top-[50%] before:-z-10 before:size-[30px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:opacity-50 before:blur-lg before:content-['']">
                    <OrganizationIcon className="z-50" size={24} />
                </span>
                <span>Set up your Organization</span>
            </h1>
            <OrganizationForm />
        </div>
    )
}
