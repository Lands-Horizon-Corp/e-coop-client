'use client'

import ContactForm from '@/modules/contact-us/components/forms/contact-us-create-form'
import { Mail, MapPin, Phone } from 'lucide-react'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'

const ContactPage = () => {
    return (
        <div className="px-4 pt-20 pb-16 sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_100%_0%] from-primary/50 via-background/0 to-background/0 to-100%" />
            <div className="absolute inset-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] from-primary/20 via-background/0 to-background/0 to-100%" />

            <FlickeringGrid
                gridGap={1}
                squareSize={64}
                maxOpacity={0.5}
                flickerChance={0.05}
                className="absolute inset-0 -bottom-1/2 -z-10 h-screen w-full opacity-20 dark:opacity-10
    [mask-image:linear-gradient(to_bottom,transparent_0%,white_0%,white_0%,transparent_100%)]
    [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,white_0%,white_0%,transparent_100%)]
    [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]
    [mask-size:100%_100%] [-webkit-mask-size:100%_100%]"
            />

            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-foreground mb-4 text-4xl font-bold">
                        Get in{' '}
                        <GradientText
                            variant="primary"
                            size="4xl"
                            animate="shimmer"
                            className="leading-relaxed ml-1"
                            style={{
                                fontFamily: "'Knewave', cursive",
                            }}
                        >
                            <h1>Touch</h1>
                        </GradientText>
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                        Have questions about our cooperative platform?
                        We&apos;re here to help you succeed.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-foreground mb-6 text-2xl font-semibold">
                                Contact Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <Mail className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">
                                            Email
                                        </h3>
                                        <p className="text-muted-foreground">
                                            lands.horizon.corp@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <Phone className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">
                                            Phone
                                        </h3>
                                        <p className="text-muted-foreground">
                                            +63 991 617 1081
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 rounded-lg p-3">
                                        <MapPin className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-semibold">
                                            Address
                                        </h3>
                                        <p className="text-muted-foreground">
                                            San Jose Del Monte, Bulacan
                                            <br />
                                            Region III (Central Luzon)
                                            <br />
                                            Philippines
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="mb-3 text-lg font-semibold">
                                    Ready to Transform Your Cooperative?
                                </h3>
                                <p className="mb-4 e">
                                    Join our platform and empower your community
                                    with cutting-edge digital tools.
                                </p>
                                <Button className="ml-auto" variant="default">
                                    Join us Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-card/50 border-border/50 shadow-soft backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-foreground">
                                Send us a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-foreground mb-8 text-center text-2xl font-semibold">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {[
                            {
                                question: 'How secure is the platform?',
                                answer: 'We use bank-level encryption and security protocols to protect all cooperative and member data. Our platform is regularly audited and complies with international financial security standards.',
                            },
                            {
                                question:
                                    'Can we integrate with existing systems?',
                                answer: 'Yes! Our API allows seamless integration with your existing cooperative management systems, accounting software, and other third-party applications.',
                            },
                            {
                                question: 'What support do you provide?',
                                answer: 'We offer comprehensive support including training sessions, dedicated customer support, help documentation, and ongoing technical assistance for all our cooperative partners.',
                            },
                            {
                                question: 'How much does it cost?',
                                answer: 'Our pricing is designed to be affordable for cooperatives of all sizes. Contact us for a customized quote based on your specific needs and member count.',
                            },
                        ].map((faq, index) => (
                            <Card
                                className="bg-card/50 border-border/50 backdrop-blur-sm"
                                key={index}
                            >
                                <CardContent className="p-6">
                                    <h3 className="text-foreground mb-2 font-semibold">
                                        {faq.question}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {faq.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage
