import Image from "next/image"
import {Loader2} from "lucide-react"

interface AuthLoadingProps {
    message?: string
    subMessage?: string
    logoSrc?: string
    brandName?: string
}

export default function AuthLoading({
                                        message = "Authenticating...",
                                        subMessage,
                                        logoSrc,
                                        brandName = "TicketHUB",
                                    }: AuthLoadingProps) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background min-h-screen p-4">
            <div className="w-full max-w-md flex flex-col items-center text-center">
                {/* Logo Section */}
                {(logoSrc || brandName) && (
                    <div className="mb-8">
                        {logoSrc && (
                            <Image
                                src={logoSrc || "/placeholder.svg"}
                                alt={`${brandName || "Brand"} logo`}
                                width={48}
                                height={48}
                                className="h-12 w-auto mb-2"
                            />
                        )}
                        {brandName && <h1 className="text-2xl font-bold">{brandName}</h1>}
                    </div>
                )}

                {/* Loading Animation */}
                <div className="relative">
                    <div
                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur opacity-30"/>
                    <div className="relative bg-background rounded-full p-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin"/>
                    </div>
                </div>

                {/* Messages */}
                <div className="mt-8 space-y-2">
                    <h2 className="text-xl font-semibold">{message}</h2>
                    {subMessage && <p className="text-muted-foreground">{subMessage}</p>}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-xs text-muted-foreground">
                © {new Date().getFullYear()} {brandName || "Your Company"}. All rights reserved.
            </div>
        </div>
    )
}

