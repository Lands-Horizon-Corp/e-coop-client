import RandomDots from '@/components/backgrounds/random-dots'
import { ClockIcon } from '@/components/icons'
import ImageMatch from '@/components/image-match'
import { GradientText } from '@/components/ui/gradient-text'

function SidePanelPoster() {
    return (
        <div className="hidden sm:flex sm:flex-col sm:w-1/3 sm:h-screen relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20">
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-8">
                {/* Header text - desktop only */}
                <div className="text-center mb-12 z-20 relative">
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                        Setup your Cooperative Bank
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <GradientText
                            animate="shimmer"
                            className="text-xl font-semibold"
                        >
                            In Seconds
                        </GradientText>
                        <ClockIcon className="w-5 h-5 text-primary/80" />
                    </div>
                </div>

                <ImageMatch
                    alt="Cooperative community working together"
                    containerClassName="overflow-hidden rounded-3xl max-w-xs transform group-hover:scale-105 transition-transform duration-300"
                    src="/pictures/go-up.png"
                />

                <RandomDots count={50} />
            </div>
        </div>
    )
}

export default SidePanelPoster
