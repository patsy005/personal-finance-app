import { type ComponentPropsWithoutRef } from 'react'

type LabelProps = {
	label: string
} & ComponentPropsWithoutRef<'label'>

export default function Label({ label, ...props }: LabelProps) {
	return (
		<label className="label" {...props}>
			{label}
		</label>
	)
}
