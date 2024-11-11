import { useDispatch, useSelector } from 'react-redux'
import { closeModal, selectModalProps } from '../../slices/modalSlice'
import { potOperations, selectPots, selectPotsError } from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Label from '../../components/label/Label'
import Input from '../../components/input/Input'
import Form from '../../components/Form/Form'
import Button from '../../components/button/Button'
import ProgressBar from '../../components/progressBar/ProgressBar'
import FormErrorMessage from '../../components/formErrorMessage/FormErrorMessage'
import Spinner from '../../components/spinner/Spinner'
import toast from 'react-hot-toast'
import { PotType } from '../../slices/financesTypes'

type FormValues = {
	amount: number
}

export default function PotsDepositWithdrawForm() {
	const potToEdit = useSelector(selectModalProps)
	const pots = useSelector(selectPots)
	const modalProps = useSelector(selectModalProps)
	const potsError = useSelector(selectPotsError)

	const dispatch: AppDispatch = useDispatch()

	const [formTitle, setFormTitle] = useState<string>('')
	const [formInfo, setFormInfo] = useState<string>(
		'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.'
	)
	const [amountValue, setAmountValue] = useState<number>()

	const {
		handleSubmit,
		register,
		watch,
		formState: { errors, isLoading },
	} = useForm<FormValues>()

	const watchAmount = watch('amount')

	const closeModalHandler = () => dispatch(closeModal())

	const onSubmit = (data: FormValues) => {
		if (potToEdit?.id) {
			if (modalProps?.type === 'withdrawFromPot') {
				dispatch(potOperations({ id: +potToEdit.id, amount: +data.amount, type: 'withdraw' }))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Withdrawal successful'))
			} else {
				dispatch(potOperations({ id: +potToEdit.id, amount: +data.amount, type: 'deposit' }))
					.unwrap()
					.then(() => closeModalHandler())
					.then(() => toast.success('Deposit successful'))
			}
		}
	}

	useEffect(() => {
		setAmountValue(watchAmount)
	}, [watchAmount])

	useEffect(() => {
		if (potToEdit?.id) {
			const potName = pots.find(pot => pot.id === +potToEdit.id)?.name
			if (modalProps?.type === 'withdrawFromPot') {
				const title = `Withdraw from '${potName}'`
				setFormTitle(title)
				setFormInfo(
					'Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.'
				)
			} else {
				const title = `Deposit to '${potName}'`
				setFormTitle(title)
				setFormInfo(
					'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.'
				)
			}
		}
	}, [potToEdit]) // eslint-disable-line react-hooks/exhaustive-deps

	const Inputs = () => (
		<>
			<div className="form__input-box col-12">
				<Label label={modalProps?.type === 'withdrawFromPot' ? 'Amount to Withdraw' : 'Amount to Add'} />
				<Input
					name="amount"
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

						if (value > 0 && modalProps?.type === 'withdrawFromPot' && potToEdit?.id) {
							const pot = pots.find(pot => pot.id === +potToEdit?.id)
							if (pot && +value > pot.total) {
								return 'Value must be less than the total amount in the pot'
							}
						}

						if (value > 0 && modalProps?.type === 'depositToPot' && potToEdit?.id) {
							const pot = pots.find(pot => pot.id === +potToEdit?.id)
							if (pot && +value + pot.total > pot.target) {
								return 'Value must be less than the target amount in the pot'
							}
						}
						return true
					}}
					key="amount"
					autoFocus
				/>
			</div>
		</>
	)

	const calcTotalSaved = (pot: PotType) => {
		if (!watchAmount) return pot.total
		if (modalProps?.type === 'withdrawFromPot') return pot.total - +watchAmount
		return pot.total + +watchAmount
	}

	const ProgressBox = () => {
		if (!potToEdit) return null

		const pot = pots.find(pot => pot.id === +potToEdit.id)

		if (!pot) return null

		const percentageSaved = !watchAmount
			? (pot.total / pot.target) * 100
			: ((pot.total + +watchAmount) / pot.target) * 100

		const plannedProgress = ((pot.total + +watchAmount) / pot.target) * 100

		return (
			<>
				<div className="pots__item--info d-flex flex-column gap-0">
					<div className="pots__item--info--total-saved d-flex justify-content-between align-items-center">
						<p>New amount</p>
						<h4>${calcTotalSaved(pot)}</h4>
					</div>
					<div className="pots__item--info--progress-box">
						<ProgressBar
							max={pot.target}
							value={pot.total}
							theme={modalProps?.type === 'withdrawFromPot' ? '#c94736' : '#277c78'}
							depositValue={amountValue}
							plannedProgress={plannedProgress}
							themeSecondary="#000"
						/>
						<div className="pots__item--info--progress-info d-flex justify-content-between align-items-center">
							<p className="percentage">{percentageSaved.toFixed(2)}%</p>
							<p className="target">Target of ${pot.target}</p>
						</div>
					</div>
				</div>
			</>
		)
	}

	const ErrorComponent = () => {
		if (potsError !== null) {
			return <FormErrorMessage errorMessage={potsError} />
		}
	}

	const AdditionalComponent = () => (
		<>
			<ErrorComponent />
			<ProgressBox />
		</>
	)

	return (
		<Form
			title={formTitle}
			onSubmit={handleSubmit(onSubmit)}
			formInfo={formInfo}
			inputs={<Inputs />}
			additionalContent={<AdditionalComponent />}>
			<Button className="primary">
				{isLoading && <Spinner className="form" />}
				{!isLoading && `Confirm ${modalProps?.type === 'withdrawFromPot' ? 'Withdrawal' : 'Deposit'}`}
			</Button>
		</Form>
	)
}
