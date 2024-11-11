import React from 'react'

type BoxProps = {
	children: React.ReactNode
	className: string
}

export default function Box({ children, className }: BoxProps) {
	return <div className={`box ${className}`}>{children}</div>
}
