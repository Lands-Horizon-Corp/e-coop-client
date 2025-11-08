import { DiamondFillIcon, StarIcon } from '@/components/icons'
import { ElectricLine } from '@/components/ui/electric-line'
import { RandomCode } from '@/components/ui/random-code'

export const MemberPortal = () => {
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

                <div className="group-hover:opacity-100 opacity-0 absolute top-8 text-center w-full text-xs overflow-hidden ">
                    <div className="relative h-12">
                        {/* Multiple overlapping code lines for continuous effect */}
                        <RandomCode
                            className="text-primary/70 group-hover:text-primary animate-code-slide absolute top-0 left-1/2 -translate-x-1/2"
                            codeType="hex"
                            length={15}
                            speed={150}
                        />
                        <RandomCode
                            className="text-primary/35 group-hover:text-primary/55 animate-code-slide absolute top-4 left-1/2 -translate-x-1/2"
                            codeType="alphanumeric"
                            length={10}
                            speed={190}
                        />
                    </div>
                </div>

                <ElectricLine
                    className="group-hover:opacity-100 opacity-0 absolute top-0 left-20 m-auto rotate-50 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={40}
                    thickness={2}
                />
                <ElectricLine
                    className="group-hover:opacity-100 opacity-0 absolute top-0 left-27 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={100}
                    thickness={2}
                />
                <ElectricLine
                    className="absolute top-40 left-35 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />
                <ElectricLine
                    className="absolute top-40 left-40 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={20}
                    thickness={2}
                />
                <ElectricLine
                    className="group-hover:opacity-100 opacity-0 absolute top-45 left-30 m-auto rotate-90 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={100}
                    thickness={2}
                />
                <ElectricLine
                    className="group-hover:opacity-100 opacity-0 absolute top-45 left-40 m-auto rotate-130 origin-left text-current group-hover:text-primary"
                    flowSpeed={1.5}
                    length={60}
                    thickness={2}
                />

                <div
                    className="
                        backdrop-blur-sm
                        w-40 h-20 bg-background 
                        absolute inset-0 m-auto 
                        rounded-xl shadow-md  
                        bg-radial-[at_90%_10%] 
                        border-b-2 
                        from-foreground/30 to-bg/0 group-hover:from-primary/50 group-hover:border-primary"
                >
                    <div className="border-1 bg-background/10 w-10 h-5 rounded absolute bottom-3 right-3 group-hover:border-primary"></div>
                    <div className="border-1 border-t w-8 h-3 rounded absolute bottom-4 right-4 group-hover:border-primary"></div>
                    <div className="border-1 border-t w-10 h-2 rounded absolute bottom-5 left-3 bg-foreground group-hover:border-primary group-hover:bg-primary"></div>
                    <div className="border-1 border-t w-5 h-2 rounded absolute bottom-5 left-14 bg-foreground group-hover:border-primary group-hover:bg-primary"></div>
                    <DiamondFillIcon className="absolute top-3 left-4 w-5 h-5 text-foreground group-hover:text-primary" />
                </div>

                <div className="backdrop-blur-sm group-hover:from-primary/30 group-hover:border-primary w-25 h-5 flex items-center gap-x-2 justify-center rounded bg-background absolute inset-0 mx-auto mt-45 bg-radial-[at_90%_10%] border-t-1 from-foreground/20 to-bg/0">
                    <StarIcon className="size-2 group-hover:text-primary" />
                    <StarIcon className="size-2 group-hover:text-primary" />
                    <StarIcon className="w-3 h-3 group-hover:text-primary" />
                    <StarIcon className="w-3 h-3 group-hover:text-primary" />
                </div>
            </div>
        </div>
    )
}
