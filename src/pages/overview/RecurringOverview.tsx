import { useSelector } from 'react-redux'
import { selectRecurringBills } from '../../slices/financesSlice'
import moment from 'moment'
import Box from '../../components/box/Box'
import BoxHeader from '../../components/boxHeader/BoxHeader'

export default function RecurringOverview() {
	const recurringBills = useSelector(selectRecurringBills)

	// provided api contains transactions within July and August 2024
	const simulateTodaysDate = moment('2024-08-19')

	const calcTotal = () => {
		const paidBills = recurringBills
			.filter(r => r.status === 'paid')
			.reduce((acc, rec) => acc + Math.abs(rec.amount), 0)

		return paidBills.toFixed(2)
	}

	const calcTotalUpcoming = () => {
		const totalUpcoming = recurringBills
			.filter(r => r.status === 'upcoming')
			.reduce((acc, rec) => acc + Math.abs(rec.amount), 0)

		return totalUpcoming.toFixed(2)
	}

	calcTotalUpcoming()

	const calcDueSoon = () => {
		const dueSoon = recurringBills
			.filter(r => r.status === 'dueSoon' && moment(r.date).diff(simulateTodaysDate, 'days') <= 5)
			.reduce((acc, rec) => acc + Math.abs(rec.amount), 0)

		return dueSoon.toFixed(2)
	}

	return (
		<>
			{recurringBills && (
				<Box className="recurring-overview">
					<BoxHeader title="recurring bills" text="See Details" />
					<div className="recurring-overview__container">
						<div className="recurring-overview__sum-up--total-paid recurring-overview__sum-up">
							<p>Paid Bills</p>
							<span>${calcTotal()}</span>
						</div>
						<div className="recurring-overview__sum-up--total-upcoming recurring-overview__sum-up">
							<p>Total Upcoming</p>
							<span>${calcTotalUpcoming()}</span>
						</div>
						<div className="recurring-overview__sum-up--due-soon recurring-overview__sum-up">
							<p>Due Soon</p>
							<span>${calcDueSoon()}</span>
						</div>
					</div>
				</Box>
			)}
		</>
	)
}
