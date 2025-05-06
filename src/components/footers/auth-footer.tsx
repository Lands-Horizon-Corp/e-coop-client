import EcoopLogo from '@/components/ecoop-logo'

const AuthFooter = () => {
    return (
        <footer className="flex items-center justify-center gap-x-1 py-4 text-sm backdrop-blur-sm">
            <EcoopLogo className="size-6" />
            <p className="text-foreground/40">
                e-Coop @ All Rights Reserved 2024
            </p>
        </footer>
    )
}

export default AuthFooter
