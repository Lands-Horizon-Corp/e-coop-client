import { Link } from '@tanstack/react-router'

import EcoopLogo from '@/components/ecoop-logo'

const AuthFooter = () => {
    return (
        <footer className="flex items-center justify-center gap-x-1 py-4 text-sm backdrop-blur-sm">
            <EcoopLogo className="size-5 translate-y-1" />
            <p className="text-xs text-muted-foreground text-center mt-2">
                &copy;{' '}
                <span className=" text-accent-foreground">
                    2025 Lands Horizon
                </span>
                . All rights reserved.{' '}
                <Link
                    className="hover:text-accent-foreground hover:underline"
                    to={`/policy/terms-and-condition` as string}
                >
                    Terms and Conditions
                </Link>
                {', '}
                <Link
                    className="hover:text-accent-foreground hover:underline"
                    to={`/policy/cookie-policy` as string}
                >
                    Cookie Policy
                </Link>
                {', '}
                <Link
                    className="hover:text-accent-foreground hover:underline"
                    to={`/policy/refund-policy` as string}
                >
                    refund policy
                </Link>
                {', '}
                <Link
                    className="hover:text-accent-foreground hover:underline"
                    to={`/policy/use-agreement` as string}
                >
                    use agreement.
                </Link>
            </p>
        </footer>
    )
}

export default AuthFooter
