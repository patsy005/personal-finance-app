import { CaretLeftIcon, CaretRightIcon } from '../../assets/icons/Icons'

type PaginationProps = {
	table: {
		getPageCount: () => number
		getRowModel: () => { rowsById: Record<string, unknown> }
		previousPage: () => void
		nextPage: () => void
		getCanPreviousPage: () => boolean
		getCanNextPage: () => boolean
		setPageIndex: (index: number) => void
		getState: () => { pagination: { pageIndex: number } }
	}
	isSmallScreen?: boolean
}

export default function Pagination({ table, isSmallScreen }: PaginationProps) {
	const generatePageNumbers = () => {
		if (isSmallScreen) {
			if (table.getPageCount() <= 3) return Array.from({ length: table.getPageCount() }, (_, i) => i + 1)

			return [1, 2, '...', table.getPageCount()]
		}

		return Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
	}

	return (
		<>
			{Object.keys(table.getRowModel().rowsById).length > 10 && (
				<div className="pagination-row">
					<div className="pagination-btns d-flex justify-content-between">
						<div className="pagination-btns__next-prev">
							<button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="d-flex align-items-center justify-content-between">
								<CaretLeftIcon />
								{!isSmallScreen && <span>Prev</span>}
							</button>
						</div>
						<div className="pagination-btns__numbers d-flex">
							{generatePageNumbers().map((pageNumber, index) => (
								<button
									key={index}
									onClick={() => table.setPageIndex(index)}
									disabled={pageNumber === '...' || table.getState().pagination.pageIndex + 1 === +pageNumber}
									className={table.getState().pagination.pageIndex + 1 === +pageNumber ? 'active' : ''}>
									<span>{pageNumber}</span>
								</button>
							))}
						</div>
						<div className="pagination-btns__next-prev">
							<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
								{!isSmallScreen && <span>Next</span>}
								<CaretRightIcon />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
