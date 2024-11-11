import { useMemo } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { TransactionType } from '../../slices/financesTypes'

export const useColumns = (isSmallScreen: boolean, transactions: TransactionType[]) => {

	const amountStylesHandler = (row: { original: TransactionType }) => {
		const isDeposit = row.original.amount > 0

		const amountClassnames = classNames('transactions__item--amount', {
			'transactions__item--amount-deposit': isDeposit,
			'transactions__item--amount-withdrawal': !isDeposit,
		})

		const amount = isDeposit ? `+$${row.original.amount}` : `-$${Math.abs(row.original.amount)}`

		return { amountClassnames, amount }
	}

	return useMemo(() => {
		if (isSmallScreen) {
			return [
				{
					header: '',
					accessorKey: 'recipient/sender',
					cell: ({ row }: { row: { original: TransactionType } }) => {
						return (
							<div className="transactions__item--reciepment d-flex align-items-center">
								<div className="transactions__item--reciepment-avatar">
									<img src={`/avatars/${row.original.avatar}`} alt={row.original.name} />
								</div>
								<div className="d-flex flex-column">
									<p className="transactions__item--reciepment-name">{row.original.name}</p>
									<p className="transactions__item--category">{row.original.category}</p>
								</div>
							</div>
						)
					},
				},
				{
					header: '',
					accessorKey: 'transaction',
					cell: ({ row }: { row: { original: TransactionType } }) => {
						const date = moment(row.original.date).format('DD MMM YYYY')

						const { amountClassnames, amount } = amountStylesHandler(row)

						return (
							<div className="transactions__item--summary d-flex flex-column align-items-end">
								<p className={amountClassnames}>{amount}</p>
								<p className="transactions__item--date">{date}</p>
							</div>
						)
					},
				},
			]
		}
		return [
			{
				header: 'Recipient / Sender',
				accessorKey: 'recipient/sender',
				cell: ({ row }: { row: { original: TransactionType } }) => {
					return (
						<div className="transactions__item--reciepment d-flex align-items-center">
							<div className="transactions__item--reciepment-avatar">
								<img src={`/avatars/${row.original.avatar}`} alt={row.original.name} />
							</div>
							<p className="transactions__item--reciepment-name">{row.original.name}</p>
						</div>
					)
				},
			},
			{
				header: 'Category',
				accessorKey: 'category',
				cell: ({ row }: { row: { original: TransactionType } }) => {
					return <p className="transactions__item--category">{row.original.category}</p>
				},
			},
			{
				header: 'Transaction Date',
				accessorKey: 'date',
				cell: ({ row }: { row: { original: TransactionType } }) => {
					const date = moment(row.original.date).format('DD MMM YYYY')
					return <p className="transactions__item--date">{date}</p>
				},
			},
			{
				header: 'Amount',
				accessorKey: 'amount',
				cell: ({ row }: { row: { original: TransactionType } }) => {
					const { amountClassnames, amount } = amountStylesHandler(row)

					return <p className={amountClassnames}>{amount}</p>
				},
			},
		]
	}, [isSmallScreen, transactions]) // eslint-disable-line
}
