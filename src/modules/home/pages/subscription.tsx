import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { TPricingPlanMode, useGetAll } from '@/modules/subscription-plan'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import PageContainer from '@/components/containers/page-container'
import { PaperPlaneIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { GradientText } from '@/components/ui/gradient-text'

import PlanCard from '../components/subscription/subscription-plan-card'

const SubscriptionPage = () => {
    const [mode, setMode] = useState<TPricingPlanMode>('monthly')
    const {
        data: subscriptionPlans,
        isPending,
        error: responseError,
    } = useGetAll()

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <PageContainer className="py-8 space-y-2 relative min-h-[40vh] bg-background/10 backdrop-blur-sm mb-24 pt-20 pb-16">
            <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_100%_0%] to-100%" />

            <FlickeringGrid
                gridGap={1}
                squareSize={64}
                maxOpacity={0.5}
                flickerChance={0.05}
                className="absolute inset-0 h-full -z-10 opacity-80 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
            />

            <h1 className="text-foreground text-4xl font-extrabold">
                <GradientText
                    variant="primary"
                    size="5xl"
                    animate="shimmer"
                    className="leading-relaxed mr-2"
                    style={{
                        fontFamily: "'Knewave', cursive",
                    }}
                >
                    <h1>E-coop</h1>
                </GradientText>
                Pricing Plans
            </h1>

            <p className="text-muted-foreground text-center mx-auto max-w-2xl text-xl">
                Flexible and transparent pricing designed to fit cooperatives of
                all sizes, pay only for what you need as you grow.
            </p>
            <FormErrorMessage errorMessage={error} className="my-24" />
            {isPending && <LoadingSpinner className="mx-auto my-24" />}
            {subscriptionPlans && (
                <>
                    <div className="p-1 bg-muted rounded-full inline-flex border !mt-9 gap-x-1 border-border">
                        {(['monthly', 'yearly'] as const).map((value) => (
                            <Button
                                key={value}
                                variant="ghost"
                                className={cn(
                                    'rounded-full px-4 cursor-pointer hover:bg-background/70 py-1 text-sm transition-all',
                                    mode === value &&
                                        'bg-background shadow-sm text-foreground'
                                )}
                                onClick={() => setMode(value)}
                            >
                                {value === 'monthly' ? 'Monthly' : 'Yearly'}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 py-8">
                        {subscriptionPlans.map((subscriptionPlan) => (
                            <PlanCard
                                key={subscriptionPlan.id}
                                planMode={mode}
                                subscriptionPlan={subscriptionPlan}
                            />
                        ))}
                    </div>
                    {subscriptionPlans.length === 0 && (
                        <div className="flex items-center min-h-[60vh] w-full justify-center">
                            <p className="text-muted-foreground/80">
                                No available plans yet.
                            </p>
                        </div>
                    )}
                </>
            )}
            <div className="p-4 rounded-2xl border bg-popover items-center flex gap-x-4">
                <div className="space-y-2">
                    <p>Need a custom plan?</p>
                    <p className="text-muted-foreground">
                        Talk to us and we&apos;l happy to discuss and setup
                        something just for you.
                    </p>
                </div>
                <Button size="sm" className="rounded-full px-4" asChild>
                    <Link to="/contact">
                        {' '}
                        Talk to us
                        <PaperPlaneIcon className="ml-2" />
                    </Link>
                </Button>
            </div>
        </PageContainer>
    )
}
export default SubscriptionPage
