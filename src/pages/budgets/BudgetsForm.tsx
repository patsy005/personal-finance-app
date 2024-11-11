/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, selectModalProps } from '../../slices/modalSlice'
import {
	addNewBudget,
	editBudget,
	selectBudgets,
	selectBudgetsError,
	selectTransactions,
} from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Label from '../../components/label/Label'
import SelectComponent from '../../components/select/SelectComponent'
import Input from '../../components/input/Input'
import { CaretDownInon } from '../../assets/icons/Icons'
import Button from '../../components/button/Button'
import { CustomOptions } from '../../components/select/CustomOptions'
import { CustomSingleValue } from '../../components/select/CustomSingleValue'
import { BudgetType } from '../../slices/financesTypes'
import Spinner from '../../components/spinner/Spinner'
import FormErrorMessage from '../../components/formErrorMessage/FormErrorMessage'
import toast from 'react-hot-toast'
import { themeOptions } from '../../utils/utils'
import Form from '../../components/Form/Form'

type FormValues = {
	budgetCategory: string
	maxSpending: number
	theme: string
}

export default function BudgetsForm() {
	const budgetToEdit = useSelector(selectModalProps)
	const transactions = useSelector(selectTransactions)
	const budgets = useSelector(selectBudgets)
	const budgetsError = useSelector(selectBudgetsError)

	const dispatch: AppDispatch = useDispatch()

	const [formTitle, setFormTitle] = useState<string>('Add New Budget')
	const [formInfo, setFormInfo] = useState<string>(
		'Choose a category to set a spending budget. These categories can help you monitor spending.'
	)

	const {
		handleSubmit,
		register,
		setValue,
		control,
		formState: { errors, isLoading },
	} = useForm<FormValues>()

	const handleCloseModal = () => dispatch(closeModal())

	const onSubmit = (data: FormValues) => {
		const newBudget = {
			category: data.budgetCategory,
			maximum: +data.maxSpending,
			theme: data.theme.toUpperCase(),
			id: Math.floor(Math.random() * 1000),
		}

		if (budgetToEdit?.id) {
			dispatch(editBudget({ ...newBudget, id: +budgetToEdit.id }))
				.unwrap()
				.then(() => handleCloseModal())
				.then(() => toast.success('Budget updated successfully'))
		} else {
			dispatch(addNewBudget(newBudget))
				.unwrap()
				.then(() => handleCloseModal())
				.then(() => toast.success('Budget added successfully'))
		}
	}

	useEffect(() => {
		if (budgetToEdit?.id) {
			const budget = budgets.find((budget: BudgetType) => budget.id === +budgetToEdit?.id)
			setFormTitle('Edit Budget')
			setFormInfo('As your budgets change, feel free to update your spending limits.')
			setValue('budgetCategory', budget?.category || '')
			setValue('maxSpending', budget?.maximum || 0)
			setValue('theme', budget?.theme.toLowerCase() || '')
		}
	}, [budgetToEdit]) // eslint-disable-line react-hooks/exhaustive-deps

	const budgetCategoryOptions = () => {
		const categories = transactions.map(t => t.category)
		const uniqueCategories = [...new Set(categories)]

		const notInUse = uniqueCategories.filter(c => !budgets.some(budget => budget.category === c))

		const cat = notInUse.map(c => ({ value: c, label: c }))

		return [...cat].sort((a, b) => a.label.localeCompare(b.label))
	}

	const CustomOptionsComponent = (props: any) => {
		const isThemeInUse = budgets.some(budget => budget.theme === props.data.value.toUpperCase())

		return <CustomOptions props={props} isThemeInUse={isThemeInUse} />
	}

	const CustomSingleValueComponent = (props: any) => {
		return <CustomSingleValue props={props} />
	}

	const Inputs = () => (
		<>
			<div className="form__input-box col-12">
				<Label label="Budget Category" />
				<Controller
					control={control}
					name="budgetCategory"
					rules={{
						required: 'Budget category is required',
						validate: value => value !== '' || 'Please select a category',
					}}
					render={({ field: { onChange, value } }) => (
						<SelectComponent
							id="budgetCategory"
							name="budgetCategory"
							options={budgetCategoryOptions()}
							onChangeFn={onChange}
							value={budgetCategoryOptions().find(option => option.value === value)}
							className="select-form"
							placeholder="Select a category"
							icon={<CaretDownInon />}
						/>
					)}
				/>
				{errors.budgetCategory && <span className="input-error__text">{String(errors.budgetCategory?.message)}</span>}
			</div>

			<div className="form__input-box col-12">
				<Label label="Maximum Spend" />
				<Input
					name="maxSpending"
					type="number"
					step="0.01"
					className="input"
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
					key="maxSpending"
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
				{errors.theme && <span className="input-error__text">{String(errors.theme?.message)}</span>}
			</div>
		</>
	)

	const ErrorComponent = () => {
		if (budgetsError !== null) {
			return <FormErrorMessage errorMessage={budgetsError} />
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
				{!isLoading && (budgetToEdit?.id ? 'Save Changes' : 'Add Budget')}
			</Button>
		</Form>
	)
}
