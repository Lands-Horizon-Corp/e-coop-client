import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    TPricingPlanMode,
    useGetAllSubscriptionPlans,
} from '@/modules/subscription-plan'

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
    } = useGetAllSubscriptionPlans({
        mode: 'timezone',
    })

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <PageContainer className="relative min-h-screen bg-background">
            {/* Dark background with subtle grid pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
            {/* Header Section */}
            <div className="relative z-10 pt-24 pb-2 text-center space-y-6">
                <div className="space-y-10">
                    <GradientText
                        animate="shimmer"
                        className="text-6xl font-bold tracking-tight"
                        style={{
                            fontFamily: "'Knewave', cursive",
                        }}
                        variant="primary"
                    >
                        E-coop
                    </GradientText>
                </div>

                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                    Choose the perfect plan for your cooperative. Flexible
                    pricing that grows with your organization.
                </p>
            </div>
            {/* Error and Loading States */}
            <div className="relative z-10">
                <FormErrorMessage
                    className="text-center mb-8"
                    errorMessage={error}
                />
                {isPending && <LoadingSpinner className="mx-auto mb-8" />}
            </div>

            {subscriptionPlans && (
                <div className="relative z-10 space-y-8">
                    {/* Pricing Toggle */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50">
                            {(['monthly', 'yearly'] as const).map((value) => (
                                <Button
                                    className={cn(
                                        'rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/50',
                                        mode === value
                                            ? 'bg-background shadow-md text-foreground border border-border/20'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                    key={value}
                                    onClick={() => setMode(value)}
                                    variant="ghost"
                                >
                                    {value === 'monthly' ? 'Monthly' : 'Yearly'}
                                    {value === 'yearly' && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            Save 20%
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Cards Grid */}
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {subscriptionPlans.map((subscriptionPlan, _) => (
                                <PlanCard
                                    className={cn(
                                        'transform transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                                        subscriptionPlan.is_recommended &&
                                            'ring-2 ring-primary/80 shadow-lg bg-gradient-to-tr from-primary/20 to-transparent'
                                    )}
                                    key={subscriptionPlan.id}
                                    planMode={mode}
                                    subscriptionPlan={subscriptionPlan}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    {subscriptionPlans.length === 0 && (
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="text-center space-y-3">
                                <p className="text-muted-foreground text-lg">
                                    No subscription plans available yet.
                                </p>
                                <p className="text-muted-foreground/70 text-sm">
                                    Check back soon for our pricing options.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Custom Plan CTA */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 mt-16">
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-semibold text-foreground">
                                Need a custom plan?
                            </h3>
                            <p className="text-muted-foreground">
                                Talk to us and we&apos;ll be happy to discuss
                                and setup something just for you.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            size="sm"
                        >
                            <Link to="/contact">
                                Talk to us
                                <PaperPlaneIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
export default SubscriptionPage
