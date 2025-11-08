import { Link } from '@tanstack/react-router'

import { ArrowRightToLineIcon, GitGraphIcon, UserIcon } from 'lucide-react'

import {
    CodeIcon,
    FinanceReportsIcon,
    HistoryIcon,
    MoneyIcon,
    MonitorIcon,
    UserPlusIcon,
    VoteIcon,
    WifiIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'

import { Banking } from '../ui/banking'
import { CreditCard } from '../ui/credit-card'
import { MemberPortal } from '../ui/member-portal'

export default function FeatureSection() {
    return (
        <section className="flex items-center bg-none px-5 my-16">
            <div className="absolute inset-0 -z-10 h-full w-full bg-radial-[ellipse_at_-20%_50%] from-primary/20 via-background/0 to-background/0 to-10%" />

            <div className="container mx-auto px-4">
                <div className="mx-auto w-full max-w-5xl">
                    <h2 className="text-foreground mb-2 text-left text-2xl font-bold md:mb-3 md:text-3xl">
                        Key Features
                    </h2>
                    <p className="text-muted-foreground mb-6 text-left md:mb-8">
                        Core features designed to help cooperatives manage
                        members, finances, and integrations.
                    </p>

                    <div className="space-y-4 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                        <div className="rounded-md overflow-hidden backdrop-blur-2xl bg-background/40">
                            <CreditCard />
                            <div className="py-5 px-3 space-y-6">
                                {/* Header */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        <CodeIcon className="inline mr-2" />{' '}
                                        Enterprise API & Integrations
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Enterprise-grade REST API with OAuth 2.0
                                        authentication, Role-Based Access
                                        Control (RBAC), and SOC 2 compliant
                                        infrastructure for secure integrations.
                                    </p>
                                </div>

                                {/* Core Features Section */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <GitGraphIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    RESTful API Endpoints
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Member data, transactions,
                                                    payments & loans
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <WifiIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    Real-time Webhooks
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Event notifications & live
                                                    updates
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <MonitorIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    Analytics Dashboard
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Real-time operations
                                                    monitoring
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-md overflow-hidden backdrop-blur-2xl bg-background/40">
                            <Banking />
                            <div className="p-4">
                                <h3 className="text-foreground mb-2 min-h-[28px] font-bold md:mb-4">
                                    <CodeIcon className="inline mr-1" />
                                    Digital Cooperative Banking
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Secure online account management for members
                                    and cooperatives. Digital transactions,
                                    savings, loans, and payments. Real-time
                                    balance and transaction history.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <MoneyIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-foreground">
                                                Loans, Fines, Fees, Savings
                                            </span>
                                            <span className="text-muted-foreground block text-xs">
                                                Complete financial product
                                                management
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <UserIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-foreground">
                                                Member Account Management
                                            </span>
                                            <span className="text-muted-foreground block text-xs">
                                                Profile, KYC, and account
                                                operations
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <HistoryIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-foreground">
                                                Real-time Transaction History
                                            </span>
                                            <span className="text-muted-foreground block text-xs">
                                                Live updates and detailed audit
                                                trails
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FinanceReportsIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium text-foreground">
                                                Reports and Analytics
                                            </span>
                                            <span className="text-muted-foreground block text-xs">
                                                Financial insights and
                                                performance metrics
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-md overflow-hidden backdrop-blur-2xl bg-background/40">
                            <MemberPortal />
                            <div className="py-5 px-3 space-y-6">
                                {/* Header */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        <UserIcon className="inline mr-2" />{' '}
                                        Member Portal & Community
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Self-service member portal with digital
                                        voting, instant registration, secure
                                        peer-to-peer transactions, and community
                                        engagement tools for modern cooperative
                                        management.
                                    </p>
                                </div>

                                {/* Core Features Section */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <VoteIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    Digital Voting System
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Secure blockchain-based
                                                    voting for decisions
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <UserPlusIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    Instant Registration
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Quick onboarding with
                                                    digital KYC verification
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <ArrowRightToLineIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    P2P Transactions
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Secure member-to-member
                                                    transfers
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <UserIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-foreground">
                                                    Community Forums
                                                </span>
                                                <span className="text-muted-foreground block text-xs">
                                                    Discussion boards and member
                                                    networking
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button
                            asChild
                            className="h-[42px] w-full md:w-auto"
                            variant="default"
                        >
                            <Link to="/auth/sign-in">Sign in Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
