import { createFileRoute } from '@tanstack/react-router'

import OrganizationForm from '@/components/forms/onboarding-forms/organization-forms'

export const Route = createFileRoute('/onboarding/setup-org')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-full w-full flex-col items-center">
            <h1 className="mb-3 text-2xl font-extrabold">
                Set up your Organization
            </h1>
            <OrganizationForm />
        </div>
    )
}
