import classNames from 'classnames'
import moment from 'moment'
import { TransactionType } from '../../slices/financesTypes'

type TransactionItemProps = {
	transaction: TransactionType
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
	const isDeposit = transaction.amount > 0

	const amountClassnames = classNames('transactions__item--amount', {
		'transactions__item--amount-deposit': isDeposit,
		'transactions__item--amount-withdrawal': !isDeposit,
	})

	const amount = isDeposit ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`

	// 19 Aug 2024
	const date = moment(transaction.date).format('DD MMM YYYY')

	return (
		<div className="transactions__item d-flex justify-content-between">
			<div className="transactions__item--reciepment d-flex align-items-center">
				<div className="transactions__item--reciepment-avatar">
					<img src={`/avatars/${transaction.avatar}`} alt={transaction.name} />
				</div>
				<p className="transactions__item--reciepment-name">{transaction.name}</p>
			</div>

			<div className="transactions__item--summary d-flex flex-column align-items-end">
				<p className={amountClassnames}>{amount}</p>
				<p className="transactions__item--date">{date}</p>
			</div>
		</div>
	)
}
