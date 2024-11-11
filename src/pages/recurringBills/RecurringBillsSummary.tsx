import { RecurringBillsIcon } from '../../assets/icons/Icons'
import { useSelector } from 'react-redux'
import { selectRecurringBills } from '../../slices/financesSlice'
import moment from 'moment'

export default function RecurringBillsSummary() {
	const recurringBills = useSelector(selectRecurringBills)

	const simulateTodaysDate = moment('2024-08-19')

	const calcPaidBills = (): { paidBillsAmount: number; paidBillsCount: number } => {
		const paidBillsAmount = recurringBills.filter(r => r.status === 'paid').reduce((acc, rec) => acc + Math.abs(rec.amount), 0).toFixed(2)
		const paidBillsCount = recurringBills.filter(r => r.status === 'paid').length
		return { paidBillsAmount: +paidBillsAmount, paidBillsCount: paidBillsCount }
	}

	const calcTotalUpcoming = (): { upcomingBillsAmount: number; upcomingBillsCount: number } => {
		const upcomingBillsAmount = recurringBills.filter(r => r.status === 'upcoming').reduce((acc, rec) => acc + Math.abs(rec.amount), 0).toFixed(2)
		const upcomingBillsCount = recurringBills.filter(r => r.status === 'upcoming').length
		return { upcomingBillsAmount: +upcomingBillsAmount, upcomingBillsCount: upcomingBillsCount }
	}

	const calcDueSoon = (): { dueSoonAmount: number; dueSoonCount: number } => {
		const dueSoonAmount = recurringBills.filter(r => r.status === 'dueSoon' && moment(r.date).diff(simulateTodaysDate, 'days') <= 5).reduce((acc, rec) => acc + Math.abs(rec.amount), 0).toFixed(2)

		const dueSoonCount = recurringBills.filter(r => r.status === 'dueSoon' && moment(r.date).diff(simulateTodaysDate, 'days') <= 5).length

		return { dueSoonAmount: +dueSoonAmount, dueSoonCount: dueSoonCount }
	}

	const calcTotalBills = () => {
		if (!recurringBills) return 0

		const totalBills = calcPaidBills().paidBillsAmount + calcTotalUpcoming().upcomingBillsAmount

		return totalBills.toFixed(2)
	}

	return (
		<div className="recurring-bills__details">
			<div className="recurring-bills__total-bills">
				<RecurringBillsIcon />
				<div className="recurring-bills__total-bills--info">
					<h6>Total bills</h6>
					<h3>${calcTotalBills()}</h3>
				</div>
			</div>

			<div className="recurring-bills__summary">
				<h3>Summary</h3>

				<div className="recurring-bills__summary--details">
					<div className="recurring-bills__summary--details--paid recurring-bills__summary--details--box">
						<h6>Paid bills</h6>
						<p>
							{calcPaidBills().paidBillsCount} (${calcPaidBills().paidBillsAmount})
						</p>
					</div>

					<div className="recurring-bills__summary--details--upcoming recurring-bills__summary--details--box">
						<h6>Total upcoming</h6>
						<p>
							{calcTotalUpcoming().upcomingBillsCount} (${calcTotalUpcoming().upcomingBillsAmount})
						</p>
					</div>

					<div className="recurring-bills__summary--details--due-soon recurring-bills__summary--details--box">
						<h6>Due soon</h6>
						<p>
							{calcDueSoon().dueSoonCount} (${calcDueSoon().dueSoonAmount})
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
