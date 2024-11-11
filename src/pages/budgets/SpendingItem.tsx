import { Link, useNavigate } from 'react-router-dom'
import Box from '../../components/box/Box'
import BoxHeader from '../../components/boxHeader/BoxHeader'
import ProgressBar from '../../components/progressBar/ProgressBar'
import ThemeBox from '../../components/themeBox/ThemeBox'
import { CaretRightIcon } from '../../assets/icons/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { filterAndSortTransactions, selectTransactions } from '../../slices/financesSlice'
import moment from 'moment'
import TransactionItem from '../../components/transactionItem/TransactionItem'
import { AppDispatch } from '../../store'
import { openModal } from '../../slices/modalSlice'
import HeadingSecondary from '../../components/headingSecondary/HeadingSecondary'

type LatestSpendingType = {
	category: string
	maximum: number
	theme: string
	spending: number
	id: number
}

type SpendingItemProps = LatestSpendingType
export default function SpendingItem({ category, maximum, theme, spending, id }: SpendingItemProps) {
	const transactions = useSelector(selectTransactions)

	const dispatch: AppDispatch = useDispatch()
	const navigate = useNavigate()

	const remainingAmount = maximum - spending

	const selectOptions = [
		{ value: 'edit', label: 'Edit budget' },
		{ value: 'delete', label: 'Delete budget' },
	]

	const latestTransactions = [...transactions]
		.filter(t => t.category === category)
		.sort((a, b) => moment(b.date).unix() - moment(a.date).unix())
		.slice(0, 3)

	const navigateToTransactionsWithCategory = () => {
		// navigate to transactions page with category filter
		dispatch(filterAndSortTransactions({ value: category, type: 'filter' }))
		navigate('/transactions', { state: { selectedCategory: category } })
	}

	const onSelectChangeHandler = (value: string) => {
		if (value === 'edit') {
			dispatch(openModal({ id, type: 'editBudget' }))
		}
		if (value === 'delete') {
			dispatch(openModal({ id, type: 'deleteBudget' }))
		}
	}

	return (
		<Box className="spending__item">
			<HeadingSecondary
				category={category}
				theme={theme}
				selectOptions={selectOptions}
				onSelectChangeHandler={onSelectChangeHandler}
			/>

			<p className="spending__maximum">Maximum of ${maximum}</p>

			<ProgressBar max={maximum} value={spending} theme={theme} />

			<div className="spending__details">
				<div className="spending__details--spent col-6">
					<ThemeBox theme={theme} />
					<div className="spending__details--box">
						<p>Spent</p>
						<p>${spending}</p>
					</div>
				</div>

				<div className="spending__details--remaining col-6">
					<ThemeBox theme={'#F8F4F0'} />
					<div className="spending__details--box">
						<p>Remaining</p>
						<p>${remainingAmount < 0 ? '0' : remainingAmount}</p>
					</div>
				</div>
			</div>
			<div className="spending__latest-spending box">
				<BoxHeader title="Latest Spending">
					<Link to={`/transactions`} onClick={navigateToTransactionsWithCategory}>
						See all <CaretRightIcon />
					</Link>
				</BoxHeader>

				<div className="spending__latest-transactions">
					{latestTransactions.map((t, index) => (
						<TransactionItem key={index} transaction={t} />
					))}
				</div>
			</div>
		</Box>
	)
}
