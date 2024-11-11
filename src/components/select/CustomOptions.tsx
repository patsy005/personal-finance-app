import React from 'react'
import { components } from 'react-select'

type  CustomOptionsProps = {
	props: any // eslint-disable-line @typescript-eslint/no-explicit-any
	isThemeInUse: boolean
}

export const CustomOptions = ({ props, isThemeInUse }: CustomOptionsProps) => {
	return (
		<components.Option {...props} isDisabled={isThemeInUse}>
			<div className={`select__option--theme-box ${isThemeInUse ? 'select__option--theme-box-in-use' : ''}`}>
				<div className="select__option--theme">
					<div className="theme-circle" style={{ '--theme-color': props.data.value } as React.CSSProperties}></div>
					<p>{props.data.label}</p>
				</div>
				{isThemeInUse && <p>Already used</p>}
			</div>
		</components.Option>
	)
}
