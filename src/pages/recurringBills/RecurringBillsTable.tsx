import { useCallback, useEffect, useState } from 'react'
import { recurringBillsSelector } from '../../slices/financesSlice'
import Table from '../../components/table/Table'
import { useSelector } from 'react-redux'
import { useColumns } from './RecurringBillsColumns'
import { RecurringBillType } from '../../slices/financesTypes'

type RecurringBillsTableProps = {
	isSmallScreen: boolean
}

export default function RecurringBillsTable({ isSmallScreen }: RecurringBillsTableProps) {
	const recurringBills = useSelector(recurringBillsSelector)
	const [data, setData] = useState<RecurringBillType[]>(() => recurringBills as RecurringBillType[])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: data.length })

	const setRecurringBillsCallback = useCallback(() => {
		setData(recurringBills)
	}, [recurringBills])

	useEffect(() => {
		setRecurringBillsCallback()
	}, [setRecurringBillsCallback])



	const columns = useColumns(isSmallScreen, recurringBills)

	return (
		<div className="w-100">
			<Table
				data={data}
				columns={columns}
				isSmallScreen={isSmallScreen}
				isPagination={false}
				pagination={pagination}
				setPagination={setPagination}
			/>
		</div>
	)
}
