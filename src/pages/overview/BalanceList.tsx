import { useSelector } from 'react-redux'
import { selectBalance } from '../../slices/financesSlice'
import BalanceItem from './BalanceItem'

export default function BalanceList() {
	const balance = useSelector(selectBalance)

	return (
		<div className="overview__balance-list">
			{balance && Object.entries(balance).map(([key, value]) => <BalanceItem key={key} title={key} amount={value} />)}
		</div>
	)
}
