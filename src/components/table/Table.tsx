import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'
import Pagination from '../../pages/transactions/Pagination'
type TableProps<T> = {
	data: T[]
	columns: ColumnDef<T, unknown>[]
	pagination?: {
		pageIndex: number
		pageSize: number
	}
	setPagination?: React.Dispatch<
		React.SetStateAction<{
			pageIndex: number
			pageSize: number
		}>
	>
} & {
	isSmallScreen?: boolean
	isPagination?: boolean
}

export default function Table<T>({
	data,
	columns,
	pagination,
	setPagination,
	isSmallScreen,
	isPagination,
}: TableProps<T>) {
	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
	})

	return (
		<div className="col-12 overflow-x-scroll mt-5 table-container p-0">
			<table className="table table-hover">
				{!isSmallScreen && (
					<thead>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id} className={`border-bottom`}>
								{headerGroup.headers.map(header => (
									<th key={header.id} className={`table__header`}>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
				)}
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} style={{ textAlign: 'center', color: '#091F42' }}>
								No results found for the provided filters. Please try again with different filters.
							</td>
						</tr>
					) : (
						table.getRowModel().rows.map(row => (
							<tr key={row.id} className="border-bottom">
								{row.getVisibleCells().map(cell => (
									<td className="table__cell " key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
			{isPagination && <Pagination table={table} isSmallScreen={isSmallScreen} />}
		</div>
	)
}
