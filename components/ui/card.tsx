// src/components/ui/card.tsx
import React from 'react'

export function Card({
    children,
    className = '',
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`rounded-lg border shadow-sm ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardHeader({
    children,
    className = '',
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`border-b p-4 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({
    children,
    className = '',
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={`text-lg font-medium ${className}`} {...props}>
            {children}
        </h3>
    )
}

export function CardContent({
    children,
    className = '',
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    )
}
