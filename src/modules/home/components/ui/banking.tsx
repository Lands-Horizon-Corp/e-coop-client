import {
    BankIcon,
    DollarIcon,
    PesoIcon,
    Users3FillIcon,
    WalletIcon,
} from '@/components/icons'
import { ElectricLine } from '@/components/ui/electric-line'

export const Banking = () => {
    return (
        <div className="h-64 w-full backdrop-blur-2xl bg-background">
            <div
                className="
                    w-full h-full border-foreground/40 inset-shadow-xs/20
                    bg-foreground/10 backdrop-blur-sm relative group overflow-hidden
                    bg-radial-[at_bottom_right] from-transparent from-60% to-foreground/30
                "
            >
                <div className="backdrop-blur-sm from-background/20 from-0% to-background">
                    <div className="flex gap-1 p-1 animate-scroll-left opacity-30 group-hover:opacity-50">
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
                    <div className="flex gap-1 p-1 animate-scroll-right opacity-30 group-hover:opacity-50 -translate-x-1/2">
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
                    <div className="flex gap-1 p-1 animate-scroll-left delay-500 opacity-30 group-hover:opacity-50">
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

                <div
                    className="
                        w-65 h-65 
                        bg-radial-[at_50%_100%] from-foreground/20 backdrop-blur-2xl/20 to-background/0 to-65%
                        absolute inset-0 m-auto 
                        rounded-full
                        border-b-2 border-foreground/10
                        group-hover:scale-150 group-hover:border-primary
                        transition-all duration-1000 ease-out
                        group-hover:from-primary/10
                    "
                ></div>
                <div
                    className="
                        w-40 h-40 
                        
                        absolute inset-0 m-auto 
                        rounded-full
                        border-t-2 border-foreground/50
                        bg-radial-[at_50%_0%] from-foreground/30 to-background/0 to-65%
                        group-hover:scale-150 group-hover:border-primary
                        transition-all duration-1000 ease-out
                        group-hover:from-primary/30
                    "
                ></div>
                <div
                    className="
                        w-55 h-55 
                        
                        absolute inset-0 m-auto 
                        rounded-full
                        border-t-2 border-foreground/50
                        group-hover:scale-150 group-hover:border-primary
                        transition-all duration-1000 ease-out
                        group-hover:from-primary/30
                    "
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="group-hover:from-primary group-hover:scale-150 group-hover:border-primary transition-all duration-1000 ease-out h-full w-1 bg-radial-[at_50%_50%] from-foreground to-background/0 to-65%"></div>
                </div>
                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-28 left-30 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    absolute top-30 left-30 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-32 left-30 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    absolute top-28 left-11 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    absolute top-32 left-11 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    absolute top-32 left-55 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    absolute top-32 left-73 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={15}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    absolute top-30 left-73 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={15}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    absolute top-28 left-73 m-auto rotate-180 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={15}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-28 left-40 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={100}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-0 left-40 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={100}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-0 left-45 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={50}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-12 left-45 m-auto rotate-130 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={37}
                    thickness={2}
                />

                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-0 left-35 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={30}
                    thickness={2}
                />
                <ElectricLine
                    className="
                    group-hover:opacity-100 opacity-0
                    absolute top-7 left-35 m-auto rotate-40 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={28}
                    thickness={2}
                />

                <div
                    className="
                        w-25 h-25 bg-background/0
                        absolute inset-0 m-auto 
                        rounded-full shadow-md  
                        bg-radial-[at_50%_50%] 
                        border-1 border-foreground
                        group-hover:border-primary
                        "
                ></div>
                <div
                    className="
                        w-20 h-20 bg-background
                        absolute inset-0 m-auto
                        rounded-full shadow-md  
                        bg-radial-[at_50%_50%] 
                        border-1
                        flex items-center justify-center
                        from-bg-0 to-foreground/20 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <BankIcon className="w-10 h-10 text-foreground group-hover:text-primary" />
                </div>
                <div
                    className="
                        w-15 h-15 bg-background
                        opacity-80
                        absolute inset-0 m-auto ml-10
                        rounded-full
                        bg-radial-[at_50%_50%] 
                        border-1 border-foreground/30
                        flex items-center justify-center
                        
                        from-bg-0 to-foreground/40 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <PesoIcon className="size-6 text-foreground group-hover:text-primary" />
                </div>
                <div
                    className="
                        w-12 h-12 bg-background
                        opacity-60
                        absolute inset-0 m-auto -ml-5
                        rounded-full
                        bg-radial-[at_50%_50%] 
                        border-1 border-foreground/30
                        flex items-center justify-center
                        
                        from-bg-0 to-foreground/40 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <DollarIcon className="size-4 text-foreground group-hover:text-primary" />
                </div>
                <div
                    className="
                        w-15 h-15 bg-background
                        opacity-80
                        absolute inset-0 m-auto mr-10
                        rounded-full
                        bg-radial-[at_50%_50%] 
                        border-1 border-foreground/30
                        flex items-center justify-center
                        
                        from-bg-0 to-foreground/40 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <Users3FillIcon className="size-6 text-foreground group-hover:text-primary" />
                </div>
                <div
                    className="
                        w-12 h-12 bg-background
                        opacity-60
                        absolute inset-0 m-auto -mr-5
                        rounded-full
                        bg-radial-[at_50%_50%] 
                        border-1 border-foreground/30
                        flex items-center justify-center
                        
                        from-bg-0 to-foreground/40 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <WalletIcon className="size-4 text-foreground group-hover:text-primary" />
                </div>
                <div
                    className="
                        w-20 h-20
                        absolute inset-0 m-auto
                        rounded-full shadow-md  
                        bg-radial-[at_50%_50%] 
                        group-hover:animate-[spin_6s_linear_infinite]
                        from-bg-0 to-foreground/30 group-hover:to-primary/50 group-hover:border-primary"
                >
                    <div
                        className="
                        w-5 h-5
                         bg-background backdrop-blur-2xl
                        absolute inset-0 m-auto 
                        top-23
                        rounded-full shadow-md  
                        bg-radial-[at_10%_90%] 
                        from-foreground/20 to-bg/0 group-hover:from-primary/50 group-hover:border-primary
                        flex items-center justify-center"
                    >
                        <div className="bg-foreground group-hover:bg-primary rounded-full size-3"></div>
                    </div>

                    <div
                        className="
                        w-5 h-5
                         bg-background backdrop-blur-2xl
                        absolute inset-0 m-auto 
                        -top-26
                        rounded-full shadow-md  
                        bg-radial-[at_10%_90%] 
                        from-foreground/20 to-bg/0 group-hover:from-primary/50 group-hover:border-primary
                        flex items-center justify-center"
                    >
                        <div className="bg-foreground group-hover:bg-primary rounded-full size-3"></div>
                    </div>
                </div>
                <div
                    className="
                        backdrop-blur-sm 
                        group-hover:from-primary/30 
                        group-hover:border-primary 
                        w-25 h-5 flex items-center gap-x-2 
                        justify-center rounded bg-background 
                        absolute inset-0 mx-auto mt-50 bg-radial-[at_90%_10%] border-t-1 from-foreground/20 to-bg/0"
                >
                    <div className="bg-foreground group-hover:bg-primary w-3/4 rounded-2xl h-1 "></div>
                </div>
            </div>
        </div>
    )
}
