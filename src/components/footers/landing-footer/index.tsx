import { Link } from '@tanstack/react-router'

const Footer = () => {
    return (
        <div className="flex justify-center bg-[#F7F7F7] dark:bg-black">
            <div className="w-full max-w-[1200px]">
                <div className="flex w-full flex-col justify-between gap-5 px-4 py-4 md:flex-row md:py-[72px] lg:px-[10px]">
                    <div className="font-medium">
                        <h1 className="text-[min(54px,2.5rem)] md:h-[103px]">
                            ECoop
                        </h1>
                        <p>Empowering communities, fulfilling dreams.</p>
                    </div>
                    <div className="flex flex-col gap-2 font-semibold">
                        <h1 className="">Explore</h1>
                        <Link className="footer-link" to="/">
                            Home
                        </Link>
                        <Link className="footer-link" to="/about">
                            About
                        </Link>
                        <Link className="footer-link" to=".">
                            Product and Services
                        </Link>
                        <Link className="footer-link" to=".">
                            Membership
                        </Link>
                        <Link className="footer-link" to=".">
                            Privileges
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 font-semibold">
                        <h1>Contact Us</h1>
                        <p className="footer-link">(+63) 912-345-6789</p>
                        <p className="footer-link">info@luzonprimecoop.ph</p>
                    </div>
                    <div className="flex flex-col gap-2 font-semibold">
                        <h1>Follow Us</h1>
                        <Link className="footer-link" to="/">
                            Ecoop.facebook.com
                        </Link>
                        <Link className="footer-link" to="/">
                            Ecoop.youtube.com
                        </Link>
                    </div>
                </div>
                <div className="flex w-full items-center justify-center py-4 text-[min(14px,2.6vw)] font-medium leading-5 md:h-[60px]">
                    <p> Copy Right © 2024-2025 ECoop. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
