import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { transactionsSelector } from '../../slices/financesSlice'
import Table from '../../components/table/Table'
import { useColumns } from './TableColumns'
import { TransactionType } from '../../slices/financesTypes'

type TransactionTableProps = {
	isSmallScreen: boolean
}

export default function TransactionsTable({ isSmallScreen }: TransactionTableProps) {
	const transactions = useSelector(transactionsSelector)
	const [data, setData] = useState<TransactionType[]>(() => transactions as TransactionType[])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

	const columns = useColumns(isSmallScreen, transactions)

	const setTransactionsCallback = useCallback(() => {
		setData(transactions)
	}, [transactions])

	useEffect(() => {
		setTransactionsCallback()
	}, [setTransactionsCallback])

	return (
		<div className="w-100">
			<Table
				data={data}
				columns={columns}
				pagination={pagination}
				setPagination={setPagination}
				isSmallScreen={isSmallScreen}
				isPagination={true}
			/>
		</div>
	)
}
