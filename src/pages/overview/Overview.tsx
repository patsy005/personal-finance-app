import Heading from '../../components/heading/Heading'
import BalanceList from './BalanceList'
import BudgetsOverview from './BudgetsOverview'
import PotsOverview from './PotsOverview'
import RecurringOverview from './RecurringOverview'
import TransactionsOverview from './TransactionsOverview'

export default function Overview() {
	return (
		<section className="overview section">
			<Heading text="overview" />

			<BalanceList />

			<div className="d-flex flex-column panel overview__panel row">
				<div className="col-12 col-xl-6 col-xxl-7 d-flex left-column">
					<PotsOverview />
					<TransactionsOverview />
				</div>
				<div className="col-12 col-xl-6 col-xxl-5 right-column">
					<BudgetsOverview />
					<RecurringOverview />
				</div>
			</div>
		</section>
	)
}
