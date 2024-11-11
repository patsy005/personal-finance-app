import { CaretDownInon, FilterMobileIcon } from '../../assets/icons/Icons'
import Heading from '../../components/heading/Heading'
import TransactionsTable from './TransactionsTable'
import SelectComponent from '../../components/select/SelectComponent'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterAndSortTransactions, selectTransactionFilter, selectTransactions } from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import TableActions from '../../components/table/TableActions'

export default function Transactions() {
	const dispatch: AppDispatch = useDispatch()

	const transactions = useSelector(selectTransactions)
	const filterBy = useSelector(selectTransactionFilter)

	const mediaQuery = window.matchMedia('(max-width: 768px)')
	const [isSmallScreen, setIsSmallScreen] = useState(mediaQuery.matches)

	useEffect(() => {
		const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches)
		mediaQuery.addEventListener('change', handler)

		return () => mediaQuery.removeEventListener('change', handler)
	}, [mediaQuery, isSmallScreen])


	const categoryOptions = () => {
		const categories = transactions.map(t => t.category)
		const uniqueCategories = [...new Set(categories)]

		const cat = uniqueCategories.map(c => ({ value: c, label: c }))

		return [{ value: 'all', label: 'All transactions' }, ...cat].sort((a, b) => a.label.localeCompare(b.label))
	}

	const onSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		dispatch(filterAndSortTransactions({ value, type: 'search' }))
	}

	const onCategoryChangeHandler = (value: string) => {
		dispatch(filterAndSortTransactions({ value, type: 'filter' }))
	}

	const onSortChangeHandler = (value: string) => {
		dispatch(filterAndSortTransactions({ value, type: 'sort' }))
	}

	return (
		<section className="transactions section">
			<Heading text="Transactions" />

			<div className="box">
				<TableActions
					isSmallScreen={isSmallScreen}
					onSearchHandler={onSearchHandler}
					onSortChangeHandler={onSortChangeHandler}>
					<div className="table__actions--select-box d-flex align-items-center">
						{!isSmallScreen && <p>Category</p>}
						<SelectComponent
							options={categoryOptions()}
							icon={isSmallScreen ? <FilterMobileIcon /> : <CaretDownInon />}
							value={categoryOptions().find(c => c.value === filterBy)}
							onChangeFn={onCategoryChangeHandler}
							className="select-primary"
						/>
					</div>
				</TableActions>
				<TransactionsTable isSmallScreen={isSmallScreen} />
			</div>
		</section>
	)
}
