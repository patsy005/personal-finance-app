import { useDispatch } from 'react-redux'
import Box from '../../components/box/Box'
import HeadingSecondary from '../../components/headingSecondary/HeadingSecondary'
import { AppDispatch } from '../../store'
import { openModal } from '../../slices/modalSlice'
import ProgressBar from '../../components/progressBar/ProgressBar'
import Button from '../../components/button/Button'

type PotItemProps = {
	id: number
	name: string
	target: number
	total: number
	theme: string
}

export default function PotsItem({ id, name, target, total, theme }: PotItemProps) {
	const dispatch: AppDispatch = useDispatch()

	const percentageSaved = (total / target) * 100

	const selectOptions = [
		{ value: 'edit', label: 'Edit pot' },
		{ value: 'delete', label: 'Delete pot' },
	]

	const onSelectChangeHandler = (value: string) => {
		if (value === 'edit') {
			dispatch(openModal({ id, type: 'editPot' }))
		}
		if (value === 'delete') {
			dispatch(openModal({ id, type: 'deletePot' }))
		}
	}

	const openDepositModal = () => {
		dispatch(openModal({ id, type: 'depositToPot' }))
	}

	const openWithdrawModal = () => {
		dispatch(openModal({ id, type: 'withdrawFromPot' }))
	}

	return (
		<div className="col-12 col-xl-6">
			<Box className="pots__item">
				<HeadingSecondary
					category={name}
					theme={theme}
					selectOptions={selectOptions}
					onSelectChangeHandler={onSelectChangeHandler}
				/>

				<div className="pots__item--info d-flex flex-column">
					<div className="pots__item--info--total-saved d-flex justify-content-between align-items-center">
						<p>Total Saved</p>
						<h4>${total ? total.toFixed(2) : 0}</h4>
					</div>

					<div className="pots__item--info--progress-box">
						<ProgressBar max={target} value={total} theme={theme} />
						<div className="pots__item--info--progress-info d-flex justify-content-between align-items-center">
							<p className="percentage">{percentageSaved.toFixed(2)}%</p>
							<p className="target">Target of ${target}</p>
						</div>
					</div>
				</div>

				<div className="pots__item--actions d-flex justify-content-between align-items-center">
					<Button className="secondary w-50" onClick={openDepositModal}>
						+ Add Money
					</Button>
					<Button className="secondary w-50" onClick={openWithdrawModal}>
						Withdraw
					</Button>
				</div>
			</Box>
		</div>
	)
}
