import { useDispatch } from 'react-redux'
import Heading from '../../components/heading/Heading'
import { AppDispatch } from '../../store'
import RecurringBillsSummary from './RecurringBillsSummary'
import { searchAndSortRecurringBills } from '../../slices/financesSlice'
import React, { useEffect, useState } from 'react'
import TableActions from '../../components/table/TableActions'
import RecurringBillsTable from './RecurringBillsTable'

export default function RecurringBills() {
	const dispatch: AppDispatch = useDispatch()

	const mediaQuery = window.matchMedia('(max-width: 768px)')
	const [isSmallScreen, setIsSmallScreen] = useState(mediaQuery.matches)

	useEffect(() => {
		const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches)
		mediaQuery.addEventListener('change', handler)

		return () => mediaQuery.removeEventListener('change', handler)
	}, [mediaQuery, isSmallScreen])

	const onSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		dispatch(searchAndSortRecurringBills({ type: 'search', value }))
	}

	const onSortChangeHandler = (value: string) => {
		dispatch(searchAndSortRecurringBills({ type: 'sort', value }))
	}

	return (
		<section className="recurring-bills section">
			<Heading text="recurring bills" />

			<div className="d-flex flex-column panel recurring-bills__panel row">
				<div className="col-12 col-xl-6 col-xxl-4 d-flex left-column">
					<RecurringBillsSummary />
				</div>
				<div className="col-12 col-xl-6 col-xxl-8 right-column">
					<div className="box">
						<TableActions
							isSmallScreen={isSmallScreen}
							onSearchHandler={onSearchHandler}
							onSortChangeHandler={onSortChangeHandler}
						/>
						<RecurringBillsTable isSmallScreen={isSmallScreen} />
					</div>
				</div>
			</div>
		</section>
	)
}
