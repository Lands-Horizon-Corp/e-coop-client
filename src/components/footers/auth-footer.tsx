import { Link } from '@tanstack/react-router'
import EcoopLogo from '@/components/ecoop-logo'

const AuthFooter = () => {
    return (
        <footer className="mt-8 flex flex-col items-center gap-y-3 bg-background/90 py-8 text-sm backdrop-blur-sm">
            <EcoopLogo className="size-16" />
            <p className="text-foreground/40">
                e-Coop @ All Rights Reserved 2024
            </p>
            <div className="flex w-full justify-center gap-x-3 font-inter text-green-400">
                <Link to="/contact">Contact Us</Link>
                <span>・</span>
                <p>Terms of Use</p>
                <span>・</span>
                <p>Privacy Policy</p>
            </div>
        </footer>
    )
}

export default AuthFooter
