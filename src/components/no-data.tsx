"use client"

import type {ReactNode} from "react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"

interface NoDataMessageProps {
    title?: string
    description?: string
    icon?: ReactNode
    actionLabel?: string
    onAction?: () => void
    className?: string
}

export function NoDataMessage({
                                  title = "No data available",
                                  description = "There are no items to display at the moment.",
                                  icon,
                                  actionLabel,
                                  onAction,
                                  className,
                              }: NoDataMessageProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {icon || (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-muted-foreground"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="M3 9h18"/>
                        <path d="M9 21V9"/>
                    </svg>
                )}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-md text-center text-muted-foreground">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-6">
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
