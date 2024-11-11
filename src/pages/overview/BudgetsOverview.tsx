import { useSelector } from 'react-redux'
import BudgetsChart from '../../components/budgetsChart/BudgetsChart'
import Box from '../../components/box/Box'
import BoxHeader from '../../components/boxHeader/BoxHeader'
import { selectBudgets } from '../../slices/financesSlice'
import SpendingDetails from '../budgets/SpendingDetails'

export default function BudgetsOverview() {
	const budgets = useSelector(selectBudgets)

	return (
		<>
			{budgets && (
				<Box className="budgets-overwiew">
					<BoxHeader title="budgets" text="See Details" />

					<div className="budgets-overview__container">
						<BudgetsChart />
						<SpendingDetails type="overview" />
					</div>
				</Box>
			)}
		</>
	)
}
