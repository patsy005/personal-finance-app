import { CaretDownInon, SearchIcon, SortMobileIcon } from '../../assets/icons/Icons'
import Input from '../input/Input'
import SelectComponent from '../select/SelectComponent'

type TableActionsProps = {
	isSmallScreen: boolean
	onSearchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
	onSortChangeHandler: (value: string) => void
	children?: React.ReactNode
}

export default function TableActions({
	isSmallScreen,
	onSearchHandler,
	onSortChangeHandler,
	children,
}: TableActionsProps) {
    
	const sortByOptions = [
		{ value: 'latest', label: 'Latest' },
		{ value: 'oldest', label: 'Oldest' },
		{ value: 'asc', label: 'A to Z' },
		{ value: 'desc', label: 'Z to A' },
		{ value: 'highest', label: 'Highest' },
		{ value: 'lowest', label: 'Lowest' },
	]

	return (
		<div className="table__actions">
			<Input placeholder="Search" icon={<SearchIcon />} name="search" onChange={onSearchHandler} />
			<div className="table__actions--selects d-flex">
				<div className="table__actions--select-box d-flex align-items-center">
					{!isSmallScreen && <p>Sort by</p>}
					<SelectComponent
						options={sortByOptions}
						icon={isSmallScreen ? <SortMobileIcon /> : <CaretDownInon />}
						defaultValue={sortByOptions[0]}
						onChangeFn={onSortChangeHandler}
						className="select-primary"
					/>
				</div>

				{children && children}
			</div>
		</div>
	)
}
