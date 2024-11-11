import Box from '../../components/box/Box'
import BoxHeader from '../../components/boxHeader/BoxHeader'
import BudgetsChart from '../../components/budgetsChart/BudgetsChart'
import SpendingDetails from './SpendingDetails'

export default function SpendingSummary() {
	return (
		<Box className="spending-summary">
			<div className="spending-summary__container">
				<BudgetsChart />

				<div className="spending-summary__details">
					<BoxHeader title="spending summary" />

					<SpendingDetails type="summary" />
				</div>
			</div>
		</Box>
	)
}
