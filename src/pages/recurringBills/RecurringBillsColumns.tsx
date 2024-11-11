import { useMemo } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { BillDueIcon, BillPaidIcon } from '../../assets/icons/Icons'
import { RecurringBillType } from '../../slices/financesTypes'

export const useColumns = (isSmallScreen: boolean, recurringBills: RecurringBillType[]) => {
	const amountStylesHandler = (row: { original: RecurringBillType }) => {
		const isDueSoon = row.original.status === 'dueSoon'

		const amountClassnames = classNames('transactions__item--amount', {
			'transactions__item--amount-due-soon': isDueSoon,
		})

		const amount = `$${Math.abs(row.original.amount)}`

		return { amountClassnames, amount }
	}

	const formatDay = (row: { original: RecurringBillType }) => {
		const day = moment(row.original.date).format('D')

		if (day === '1') {
			return `${day}st`
		}
		if (day === '2') {
			return `${day}nd`
		}
		if (day === '3') {
			return `${day}rd`
		}

		return `${day}th`
	}

	return useMemo(() => {
		if (isSmallScreen) {
			return [
				{
					header: '',
					accessorKey: 'recipient/sender',
					cell: ({ row }: { row: { original: RecurringBillType } }) => {
						return (
							<div className="transactions__item--reciepment d-flex align-items-center">
								<div className="transactions__item--reciepment-avatar">
									<img src={`/avatars/${row.original.avatar}`} alt={row.original.name} />
								</div>
								<div className="d-flex flex-column">
									<p className="transactions__item--reciepment-name">{row.original.name}</p>
									<div className="transactions__item--due-date">
										<p>Monthly - {formatDay(row)}</p>
										{row.original.status === 'paid' && <BillPaidIcon />}
										{row.original.status === 'dueSoon' && <BillDueIcon />}
									</div>
								</div>
							</div>
						)
					},
				},

				{
					header: 'Amount',
					accessorKey: 'amount',
					cell: ({ row }: { row: { original: RecurringBillType } }) => {
						const { amountClassnames, amount } = amountStylesHandler(row)

						return <p className={amountClassnames}>{amount}</p>
					},
				},
			]
		}
		return [
			{
				header: '',
				accessorKey: 'recipient/sender',
				cell: ({ row }: { row: { original: RecurringBillType } }) => {
					return (
						<div className="transactions__item--reciepment d-flex align-items-center">
							<div className="transactions__item--reciepment-avatar">
								<img src={`/avatars/${row.original.avatar}`} alt={row.original.name} />
							</div>
							<div className="d-flex flex-column">
								<p className="transactions__item--reciepment-name">{row.original.name}</p>
							</div>
						</div>
					)
				},
			},

			{
				header: 'Due date',
				accessorKey: 'date',
				cell: ({ row }: { row: { original: RecurringBillType } }) => {
					return (
						<div className="transactions__item--due-date">
							<p>Monthly - {formatDay(row)}</p>
							{row.original.status === 'paid' && <BillPaidIcon />}
							{row.original.status === 'dueSoon' && <BillDueIcon />}
						</div>
					)
				},
			},

			{
				header: 'Amount',
				accessorKey: 'amount',
				cell: ({ row }: { row: { original: RecurringBillType } }) => {
					const { amountClassnames, amount } = amountStylesHandler(row)

					return <p className={amountClassnames}>{amount}</p>
				},
			},
		]
	}, [isSmallScreen, recurringBills]) // eslint-disable-line react-hooks/exhaustive-deps
}
