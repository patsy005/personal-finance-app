import { useSelector } from 'react-redux'
import { selectBudgetsWithSpending } from '../../slices/financesSlice'
import SpendingItem from './SpendingItem'

export default function SpendingList() {
	const budgetsWithSpending = useSelector(selectBudgetsWithSpending)
	return (
		<div className="spending__list">
			{budgetsWithSpending.map((d, index) => (
				<SpendingItem key={index} {...d} />
			))}
		</div>
	)
}
