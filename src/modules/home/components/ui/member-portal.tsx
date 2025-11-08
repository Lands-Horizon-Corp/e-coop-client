import {
    BankIcon,
    DollarIcon,
    FingerPrintIcon,
    UserIcon,
    WalletIcon,
} from '@/components/icons'
import { ElectricLine } from '@/components/ui/electric-line'

export const MemberPortal = () => {
    return (
        <div className="h-64 w-full backdrop-blur-2xl bg-background">
            <div
                className="
                    w-full h-full border-foreground/20 inset-shadow-xs/20
                    bg-0 backdrop-blur-sm relative group overflow-hidden
                    bg-radial-[at_bottom_right] from-transparent from-60% to-foreground/10
                "
            >
                <div
                    className="
                    w-52 h-52 
                    absolute inset-0 m-auto 
                    rounded-full shadow-md  
                    animate-[spin_6s_linear_infinite]
                    inset-shadow-foreground
                    bg-foreground/10
                  "
                ></div>
                <div className="flex backdrop-blur-sm from-background/20 from-0% to-background">
                    <div className=" gap-1 p-1 animate-scroll-up opacity- group-hover:opacity-50">
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        {/* Duplicate cards for seamless loop */}
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                    </div>
                    <div className=" gap-1 p-1 animate-scroll-up opacity-30 group-hover:opacity-50">
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        {/* Duplicate cards for seamless loop */}
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                    </div>
                    <div className=" gap-1 p-1 animate-scroll-up opacity-30 group-hover:opacity-50">
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        {/* Duplicate cards for seamless loop */}
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                    </div>
                    <div className=" gap-1 p-1 animate-scroll-up opacity group-hover:opacity-50">
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        {/* Duplicate cards for seamless loop */}
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                        <div className="group-hover:border-primary w-20 h-20 bg-background rounded-xl border-1 border-foreground/40 flex-shrink-0"></div>
                    </div>

                    <div className="absolute inset-0 bg-radial from-background/20 from-0% to-background to-90% pointer-events-none"></div>
                </div>

                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-15 left-15 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={40}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-25 left-15 
                    m-auto rotate-20 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={40}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-18 left-10 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={100}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-10 left-70 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={200}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-32 left-65 
                    m-auto rotate-180 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={50}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-10 left-65 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={90}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 
                    opacity-0 
                    absolute 
                    top-10 left-65 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={90}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    absolute 
                    top-45 left-65 
                    m-auto rotate-90 
                    origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={60}
                    thickness={2}
                />

                <div
                    className="
                    flex justify-center items-center 
                    w-32 h-32 bg-background 
                    absolute inset-0 m-auto 
                    rounded-full shadow-md  
                    bg-radial-[at_90%_10%] 
                    border-b-2 
                    from-foreground/10 to-bg/0 group-hover:from-primary/50 group-hover:border-primary"
                >
                    <UserIcon className="size-10 z-10 " />
                </div>
                <div
                    className="
                    w-20 h-20 bg-background 
                    absolute inset-0 m-auto 
                    rounded-full shadow-xl 
                    bg-radial-[at_90%_10%] 
                    border-t-2 
                    from-foreground/20 to-bg/0 group-hover:from-primary/50 group-hover:border-primary"
                ></div>
                <div
                    className="
                    w-20 h-20 bg-background 
                    absolute inset-0 m-auto 
                    rounded-full shadow-muted
                    group-hover:animate-[spin_6s_linear_infinite]
                    inset-shadow-foreground
                  "
                >
                    <div className="w-3 h-0.5 rounded bg-foreground/40 group-hover:bg-primary group-hover:shadow-[0_0_4px_theme(colors.primary),0_0_8px_theme(colors.primary),0_0_12px_theme(colors.primary/50)] rotate-45"></div>
                    <div className="w-3 h-0.5 mt-18 ml-18 rounded bg-foreground/40 group-hover:bg-primary group-hover:shadow-[0_0_4px_theme(colors.primary),0_0_8px_theme(colors.primary),0_0_12px_theme(colors.primary/50)] rotate-45"></div>
                </div>
                <div
                    className="
                    opacity-40
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    top-12 right-12 
                    w-13 h-13 
                    rounded 
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                ></div>
                <div
                    className="
                    opacity-70
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    top-8 right-8 
                    w-15 h-15 
                    rounded 
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                ></div>
                <div
                    className="
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    top-5 right-5 
                    w-16 h-16 
                    rounded 
                    flex items-center justify-center
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                >
                    <WalletIcon className="size-7 text-foreground/40 group-hover:text-primary" />
                </div>
                <div
                    className="
                    opacity-20
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    bottom-13 left-13
                    w-12 h-12 
                    rounded 
                    flex items-center justify-center
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                ></div>
                <div
                    className="
                    opacity-40
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    bottom-9 left-9
                    w-14 h-14 
                    rounded 
                    flex items-center justify-center
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                ></div>
                <div
                    className="
                    absolute bg-gradient-to-t 
                    from-foreground/30 
                    via-foreground/20 
                    to-foreground/5 
                    bottom-5 left-5
                    w-16 h-16 
                    rounded 
                    flex items-center justify-center
                    bg-background
                    border-t-1
                    backdrop-blur-md"
                >
                    <FingerPrintIcon className="size-7 text-foreground/40 group-hover:text-primary" />
                </div>

                <div
                    className="
    opacity-15
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    top-16 left-16
    w-8 h-8 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                ></div>
                <div
                    className="
    opacity-25
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    top-12 left-12
    w-10 h-10 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                ></div>
                <div
                    className="
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    top-8 left-8
    w-12 h-12 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                >
                    <BankIcon className="size-5 text-foreground/40 group-hover:text-primary" />
                </div>

                <div
                    className="
    opacity-15
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    bottom-16 right-16
    w-6 h-6 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                ></div>
                <div
                    className="
    opacity-25
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    bottom-12 right-12
    w-8 h-8 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                ></div>
                <div
                    className="
    absolute bg-gradient-to-t 
    from-foreground/30 
    via-foreground/20 
    to-foreground/5 
    bottom-8 right-8
    w-10 h-10 
    rounded 
    flex items-center justify-center
    bg-background
    border-t-1
    backdrop-blur-md"
                >
                    <DollarIcon className="size-4 text-foreground/40 group-hover:text-primary" />
                </div>
            </div>
        </div>
    )
}
