import React from 'react'
import { components } from 'react-select'

type CustomSingleValueProps = {
	props: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const CustomSingleValue = ({ props }: CustomSingleValueProps) => {
	return (
		<components.SingleValue {...props}>
			<div className="select__option--theme">
				<div className="theme-circle" style={{ '--theme-color': props.data.value } as React.CSSProperties}></div>
				<p>{props.data.label}</p>
			</div>
		</components.SingleValue>
	)
}
