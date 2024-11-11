/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, selectModalProps } from '../../slices/modalSlice'
import { addNewPot, editPot, selectPots, selectPotsError } from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import { Controller, useForm } from 'react-hook-form'
import Label from '../../components/label/Label'
import Form from '../../components/Form/Form'
import Button from '../../components/button/Button'
import Input from '../../components/input/Input'
import SelectComponent from '../../components/select/SelectComponent'
import { CaretDownInon } from '../../assets/icons/Icons'
import { CustomOptions } from '../../components/select/CustomOptions'
import { CustomSingleValue } from '../../components/select/CustomSingleValue'
import Spinner from '../../components/spinner/Spinner'
import FormErrorMessage from '../../components/formErrorMessage/FormErrorMessage'
import toast from 'react-hot-toast'
import { themeOptions } from '../../utils/utils'

type FormValues = {
	name: string
	target: number
	theme: string
}

export default function PotsAddEditForm() {
	const potToEdit = useSelector(selectModalProps)
	const pots = useSelector(selectPots)
	const potsError = useSelector(selectPotsError)

	const dispatch: AppDispatch = useDispatch()

	const [formTitle, setFormTitle] = useState<string>('Add New Pot')
	const [formInfo, setFormInfo] = useState<string>(
		'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'
	)
	const [nameValue, setNameValue] = useState<string>('')

	const {
		handleSubmit,
		register,
		setValue,
		control,
		watch,
		formState: { errors, isSubmitting: isLoading },
	} = useForm<FormValues>()

	const watchName = watch('name')

	const closeModalHandler = () => dispatch(closeModal())

	const onSubmit = (data: FormValues) => {
		const newPot = {
			name: data.name,
			target: +data.target,
			theme: data.theme.toUpperCase(),
			total: 0,
			id: Math.floor(Math.random() * 1000),
		}

		if (potToEdit?.id) {
			dispatch(editPot({ ...newPot, id: +potToEdit.id, total: +potToEdit.total }))
				.unwrap()
				.then(() => closeModalHandler())
				.then(() => toast.success('Pot updated successfully'))
		} else {
			dispatch(addNewPot(newPot))
				.unwrap()
				.then(() => closeModalHandler())
				.then(() => toast.success('Pot added successfully'))
		}
	}

	useEffect(() => {
		setNameValue(watchName)
	}, [watchName])

	useEffect(() => {
		if (potToEdit?.id) {
			setFormTitle('Edit Pot')
			setFormInfo('If your saving targets change, feel free to update your pots.')

			const pot = pots.find(pot => pot.id === +potToEdit.id)
			setValue('name', pot?.name || '')
			setValue('target', pot?.target || 0)
			setValue('theme', pot?.theme.toLowerCase() || '')
		}
	}, [potToEdit]) // eslint-disable-line react-hooks/exhaustive-deps

	const CustomOptionsComponent = (props: any) => {
		const isThemeInUse = pots.some(pot => pot.theme === props.data.value.toUpperCase())

		return <CustomOptions props={props} isThemeInUse={isThemeInUse} />
	}

	const CustomSingleValueComponent = (props: any) => {
		return <CustomSingleValue props={props} />
	}

	const Inputs = () => (
		<>
			<div className="form__input-box col-12">
				<Label label="Pot name" />
				<Input
					name="name"
					type="string"
					className="input"
					errors={errors}
					register={register}
					validate={value => {
						if (value === '') {
							return 'This field is required'
						}
						if (value.length > 30) {
							return 'Pot name must be 30 characters or less'
						}
					}}
					key="name"
					autoFocus
				/>
				<div className="remaining-characters">
					<p>{30 - nameValue?.length} characters left</p>
				</div>
			</div>

			<div className="form__input-box col-12">
				<Label label="Target" />
				<Input
					name="target"
					type="number"
					step="0.01"
					className="input"
					// placeholder="$"
					errors={errors}
					register={register}
					icon={<span className="input__icon">$</span>}
					validate={value => {
						if (value === '') {
							return 'Please enter a value'
						}
						if (value <= 0) {
							return 'Value must be greater than 0'
						}
						return true
					}}
					key="target"
				/>
			</div>

			<div className="form__input-box col-12">
				<Label label="Theme" />
				<Controller
					control={control}
					name="theme"
					rules={{
						required: 'Theme is required',
						validate: value => value !== '' || 'Please select a theme',
					}}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="theme"
							name="theme"
							options={themeOptions}
							onChangeFn={onChange}
							value={themeOptions.find(option => option.value === value)}
							customOptions={CustomOptionsComponent}
							customSingleValue={CustomSingleValueComponent}
							icon={<CaretDownInon />}
							className="select-form"
							placeholder="Select a theme"
						/>
					)}
				/>
			</div>
		</>
	)

	const ErrorComponent = () => {
		if (potsError !== null) {
			return <FormErrorMessage errorMessage={potsError} />
		}
	}

	return (
		<Form
			title={formTitle}
			onSubmit={handleSubmit(onSubmit)}
			formInfo={formInfo}
			inputs={<Inputs />}
			additionalContent={<ErrorComponent />}>
			<Button className="primary">
				{isLoading && <Spinner className="form" />}
				{!isLoading && (potToEdit?.id ? 'Save Changes' : 'Add Pot')}
			</Button>
		</Form>
	)
}
