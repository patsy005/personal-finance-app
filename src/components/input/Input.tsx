import { type ReactNode, type ComponentPropsWithoutRef } from 'react'
import { FieldErrors, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form'

type InputProps<T extends FieldValues = FieldValues> = {
	name: Path<T>
	register?: UseFormRegister<T>
	isRequired?: boolean
	errors?: FieldErrors<T>
	validate?: RegisterOptions['validate']
	icon?: ReactNode
} & ComponentPropsWithoutRef<'input'>

export default function Input<T extends FieldValues>({
	name,
	register,
	isRequired,
	errors,
	validate,
	icon,
	...rest
}: InputProps<T>) {
	const generateInput = () => (
		<>
			<input
				className={`input ${errors && errors[name] ? 'input-error' : ''}`}
				{...(register
					? register(name, {
							required: isRequired ? 'This field is required' : '',
							validate: validate,
					  })
					: {})}
				{...rest}
			/>
		</>
	)

	return (
		<>
			{icon && (
				<>
					<div className="input input-with-icon">
						{icon}
						{generateInput()}
					</div>
					{errors && errors[name] && <span className="input-error__text">{String(errors[name]?.message)}</span>}
				</>
			)}

			{!icon && (
				<>
					{generateInput()}
					{errors && errors[name] && <span className="input-error__text">{String(errors[name]?.message)}</span>}
				</>
			)}
		</>
	)
}
