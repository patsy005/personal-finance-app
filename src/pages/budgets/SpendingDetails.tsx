import { useSelector } from 'react-redux'
import ThemeBox from '../../components/themeBox/ThemeBox'
import { selectBudgets, selectBudgetsWithSpending } from '../../slices/financesSlice'

type BudgetsDetailsProps = {
	type: string
}

export default function SpendingDetails({ type }: BudgetsDetailsProps) {
	const budgets = useSelector(selectBudgets)
	const budgetsWithSpending = useSelector(selectBudgetsWithSpending)

	const renderBudgetsOverview = () => (
		<div className="box__details d-flex flex-wrap">
			{budgets.map((d, index) => (
				<div className="detail-box d-flex col-6" key={index}>
					<ThemeBox theme={d.theme} />
					<div className="detail-box__info">
						<p className="name">{d.category}</p>
						<p className="total">${d.maximum}</p>
					</div>
				</div>
			))}
		</div>
	)

	const renderBudgetsSummary = () => (
		<div className="box__details d-flex flex-wrap">
			{budgetsWithSpending.map((d, index) => (
				<div className="detail-box d-flex col-6" key={index}>
					<div className='d-flex'>
						<ThemeBox theme={d.theme} />
						<p className="name">{d.category}</p>
					</div>
					<div className="detail-box__info">
						<p className="total total-spending">
							${d.spending}
						</p>
						<p className="total-of">
							of ${d.maximum}
						</p>
					</div>
				</div>
			))}
		</div>
	)

	return (
		<>
			{type === 'overview' && renderBudgetsOverview()}
			{type === 'summary' && renderBudgetsSummary()}
		</>
	)
}
