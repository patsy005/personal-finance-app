/* eslint-disable @typescript-eslint/no-explicit-any */
import Select, { components } from 'react-select'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'

type OptionType = {
	value: string
	label: string
}

type OptionsType = OptionType[]

type SelectProps = {
	options: OptionsType
	dispatchFn?: (value: string) => { type: string; payload: string }
	onChangeFn?: (value: string) => void
	icon?: React.ReactNode
	className?: string
	customOptions?: React.ComponentType<any> 
	customSingleValue?: React.ComponentType<any>
} & React.ComponentProps<typeof Select>

export default function SelectComponent({ options, dispatchFn, onChangeFn, icon, className, customOptions, customSingleValue, ...rest }: SelectProps) {
	const dispatch: AppDispatch = useDispatch()

	const CustomDropdownIndicator = (props: any) => {
		return <components.DropdownIndicator {...props}>{icon}</components.DropdownIndicator>
	}

	const onChange = (e: any) => {
		if (dispatchFn) {
			dispatch(dispatchFn(e.value))
		} else {
			if (onChangeFn) {
				onChangeFn(e.value)
			}
		}
	}

	const renderComponents = () => {
		if(customOptions && !customSingleValue){
			return { DropdownIndicator: CustomDropdownIndicator, Option: customOptions as React.ComponentType<any> }
		}
	
		if(customOptions && customSingleValue){
			return { DropdownIndicator: CustomDropdownIndicator, Option: customOptions as React.ComponentType<any>, SingleValue: customSingleValue as React.ComponentType<any> }
		}
	
		return { DropdownIndicator: CustomDropdownIndicator }
	}

	return (
		<Select
			options={options}
			className={`select ${className}`}
			classNamePrefix="select"
			onChange={(e: any) => onChange(e)}
			components={renderComponents()}
			{...rest}
		/>
	)
}