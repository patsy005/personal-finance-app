import { SubmitHandler } from 'react-hook-form'
import { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../slices/modalSlice'
import FormTitle from './FormTitle'
import { CloseModalIcon } from '../../assets/icons/Icons'

type FormProps = {
	title: string
	inputs?: React.ReactNode
	children?: React.ReactNode
	onSubmit: SubmitHandler<any> // eslint-disable-line @typescript-eslint/no-explicit-any
	formInfo?: string
	additionalContent?: React.ReactNode
}

export default function Form({ title, inputs, children, formInfo, additionalContent, onSubmit }: FormProps) {
	const dispatch: AppDispatch = useDispatch()

	const handleSubmit = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
		onSubmit(data)
	}

	const handleCloseModal = () => {
		dispatch(closeModal())
	}

	return (
		<form className="form row box" onSubmit={handleSubmit}>
			<div className="form__top d-flex justify-content-between col-12">
				<FormTitle title={title} />
				<button className="form__exit-button" onClick={handleCloseModal}>
					<CloseModalIcon />
				</button>
			</div>

			<p className="form__info">{formInfo}</p>

			{additionalContent && additionalContent}

			<div className="form__inputs col-12">{inputs}</div>
			<div className="form__actions col-12">{children}</div>
		</form>
	)
}
