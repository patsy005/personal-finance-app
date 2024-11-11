import { type ComponentPropsWithoutRef } from 'react'

type ButtonProps = {
	className: string
	children: React.ReactNode
} & ComponentPropsWithoutRef<'button'>

export default function Button({ className, children, ...props }: ButtonProps) {
	return (
		<button className={`button button__${className}`} {...props}>
			{children}
		</button>
	)
}
