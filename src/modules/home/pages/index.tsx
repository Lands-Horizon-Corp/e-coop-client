import { Particles } from '@/components/ui/background-particles'

import FaqSection from '../components/home/faq-section'
import FeatureSection from '../components/home/feature-section'
import HeroHome from '../components/home/hero-home'
import IntroSection from '../components/home/intro-section'

export const HomePage = () => {
    return (
        <div className="relative mb-24 md:mb-0">
            <HeroHome />
            <IntroSection />
            <FeatureSection />
            <FaqSection />
            <Particles
                className="absolute inset-0"
                color="#ffffff"
                ease={80}
                quantity={100}
            />
        </div>
    )
}

export default HomePage
