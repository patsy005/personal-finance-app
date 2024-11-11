import BoxHeader from '../../components/boxHeader/BoxHeader'
import { useSelector } from 'react-redux'
import { selectTransactions } from '../../slices/financesSlice'
import TransactionItem from '../../components/transactionItem/TransactionItem'

export default function TransactionsOverview() {
	const transactions = useSelector(selectTransactions)

	const latestTransactions = transactions.slice(0, 5)

	return (
		<div className="box">
			<BoxHeader title="transactions" text="View All" />

			<div className="transactions__list w-100">
				{latestTransactions.map((transaction, index) => (
					<TransactionItem key={index} transaction={transaction} />
				))}
			</div>
		</div>
	)
}
