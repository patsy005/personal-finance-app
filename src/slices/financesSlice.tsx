import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { BudgetType, FinanceStateType, PotType, RecurringBillStatus } from './financesTypes'

const API_URL = import.meta.env.VITE_API_URL

const initialState: FinanceStateType = {
	balance: {
		current: 0,
		expenses: 0,
		income: 0,
	},
	budgets: { budgets: [], error: null },
	pots: { pots: [], error: null },
	transactions: { transactions: [], actions: { searchQuery: '', sortBy: 'latest', filterBy: 'all' } },
	recurringBills: { recurringBills: [], actions: { searchQuery: '', sortBy: 'latest' } },
	isLoading: false,
	error: null,
	searchQuery: '',
	sortBy: '',
	filterBy: '',
}

export const fetchFinances = createAsyncThunk('finances/fetchFinances', async (_, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances`)

	if (!res.ok) {
		return rejectWithValue({message: 'Error fetching finances'})
	}
	const data = await res.json()
	return data
})

export const addNewBudget = createAsyncThunk(
	'finances/addNewBudget',
	async (budget: BudgetType, { rejectWithValue }) => {
		const res = await fetch(`${API_URL}/personal-finances/budgets`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(budget),
		})

		if (!res.ok) {
			return rejectWithValue({ message: 'Error adding a budget' })
		}
		const data = await res.json()
		return data
	}
)

export const deleteBudget = createAsyncThunk('finances/deleteBudget', async (id: number, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances/budgets/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		return rejectWithValue({message: 'Error deleting budget'})
	}
	const data = await res.json()
	return data
})

export const editBudget = createAsyncThunk('finances/editBudget', async (budget: BudgetType, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances/budgets/${budget.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(budget),
	})

	if (!res.ok) {
		return rejectWithValue({message: 'Error editing budget'})
	}
	const data = await res.json()
	return data
})

export const addNewPot = createAsyncThunk('finances/addNewPot', async (pot: PotType, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances/pots`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(pot),
	})

	if (!res.ok) {
		return rejectWithValue({message: 'Error adding a pot'})
	}

	const data = await res.json()
	return data
})

export const editPot = createAsyncThunk('finances/editPot', async (pot: PotType, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances/pots/${pot.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(pot),
	})

	if (!res.ok) {
		return rejectWithValue({message: 'Error editing a pot'})
	}

	const data = await res.json()
	return data
})

export const deletePot = createAsyncThunk('finances/deletePot', async (id: number, {rejectWithValue}) => {
	const res = await fetch(`${API_URL}/personal-finances/pots/${id}`, {
		method: 'DELETE',
	})

	if (!res.ok) {
		return rejectWithValue({message: 'Error deleting pot'})
	}
	const data = await res.json()
	return data
})

export const potOperations = createAsyncThunk(
	'finances/potOperations',
	async (data: { id: number; amount: number; type: string }, {rejectWithValue}) => {
		const res = await fetch(`${API_URL}/personal-finances/pots/${data.id}/deposit-withdraw`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!res.ok) {
			return rejectWithValue({message: 'Error updating pot'})
		}
		const response = await res.json()
		return response
	}
)

export const financesSlice = createSlice({
	name: 'finances',
	initialState,
	reducers: {
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload
		},

		filterAndSortTransactions: (state, action) => {
			const { value, type } = action.payload

			if (type === 'search') {
				state.transactions.actions.searchQuery = value
			}

			if (type === 'sort') {
				state.transactions.actions.sortBy = value
			}

			if (type === 'filter') {
				state.transactions.actions.filterBy = value
			}
		},
		updateRecurringBills: state => {
			const recurringBills = state.transactions.transactions.filter(t => t.recurring === true)
			const simulateTodaysDate = moment('2024-08-19')

			const paidBills = recurringBills
				.filter(
					r => moment(r.date) <= simulateTodaysDate && moment(r.date).get('month') === simulateTodaysDate.get('month')
				)
				.map(r => ({ ...r, status: 'paid' }))

			const upcomingBills = recurringBills
				.filter(r => moment(r.date).date() > simulateTodaysDate.date())
				.map(r => ({ ...r, status: 'upcoming' }))

			const dueBills = recurringBills
				.filter(r => {
					const billDate = moment(r.date)
					const daysDiff = billDate.date() - simulateTodaysDate.date()

					return daysDiff > 0 && daysDiff <= 5
				})
				.map(r => ({ ...r, status: 'dueSoon' }))

			state.recurringBills.recurringBills = [
				...paidBills.map(bill => ({ ...bill, status: 'paid' as RecurringBillStatus })),
				...upcomingBills.map(bill => ({ ...bill, status: 'upcoming' as RecurringBillStatus })),
				...dueBills.map(bill => ({ ...bill, status: 'dueSoon' as RecurringBillStatus })),
			]
		},
		searchAndSortRecurringBills: (state, action) => {
			if (action.payload.type === 'search') {
				state.recurringBills.actions.searchQuery = action.payload.value
			}

			if (action.payload.type === 'sort') {
				state.recurringBills.actions.sortBy = action.payload.value
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchFinances.fulfilled, (state, action) => {
				state.balance = action.payload.balance
				state.budgets.budgets = action.payload.budgets
				state.pots.pots = action.payload.pots
				state.transactions.transactions = action.payload.transactions
				financesSlice.caseReducers.updateRecurringBills(state)

				state.isLoading = false
				state.error = ''
			})
			.addCase(fetchFinances.pending, state => {
				state.isLoading = true
			})
			.addCase(fetchFinances.rejected, (state, action) => {
				state.error = (action.payload as { message: string }).message
				state.isLoading = false
			})
			.addCase(addNewBudget.fulfilled, (state, action) => {
				state.budgets.budgets = [action.payload, ...state.budgets.budgets]
			})
			.addCase(addNewBudget.rejected, (state, action) => {
				state.budgets.error = (action.payload as { message: string }).message
			})
			.addCase(deleteBudget.fulfilled, (state, action) => {
				state.budgets.budgets = [...state.budgets.budgets].filter(b => b.id !== action.payload.id)
			})
			.addCase(deleteBudget.rejected, (state, action) => {
				state.budgets.error = (action.payload as { message: string }).message
			})
			.addCase(editBudget.fulfilled, (state, action) => {
				const index = state.budgets.budgets.findIndex(b => b.id === action.payload.id)
				state.budgets.budgets[index] = action.payload
			})
			.addCase(editBudget.rejected, (state, action) => {
				state.budgets.error = (action.payload as { message: string }).message
			})
			.addCase(addNewPot.fulfilled, (state, action) => {
				state.pots.pots = [action.payload, ...state.pots.pots]
			})
			.addCase(addNewPot.rejected, (state, action) => {
				state.pots.error = (action.payload as { message: string }).message
			})
			.addCase(editPot.fulfilled, (state, action) => {
				const index = state.pots.pots.findIndex(p => p.id === action.payload.id)
				state.pots.pots[index] = action.payload
			})
			.addCase(editPot.rejected, (state, action) => {
				state.pots.error = (action.payload as { message: string }).message
			})
			.addCase(deletePot.fulfilled, (state, action) => {
				state.pots.pots = [...state.pots.pots].filter(p => p.id !== action.payload.id)
				state.balance = { ...state.balance, current: action.payload.balance }
			})
			.addCase(deletePot.rejected, (state, action) => {
				state.pots.error = (action.payload as { message: string }).message
			})
			.addCase(potOperations.fulfilled, (state, action) => {
				const { updatedPot, updatedBalance } = action.payload
				const index = state.pots.pots.findIndex(p => p.id === updatedPot.id)
				state.pots.pots[index] = updatedPot
				state.balance = { ...state.balance, current: updatedBalance }
			})
			.addCase(potOperations.rejected, (state, action) => {
				state.pots.error = (action.payload as { message: string }).message
			})
	},
})

export const selectBalance = (state: { finances: FinanceStateType }) => state.finances.balance
export const selectPots = (state: { finances: FinanceStateType }) => state.finances.pots.pots
export const selectIsLoading = (state: { finances: FinanceStateType }) => state.finances.isLoading
export const selectTransactions = (state: { finances: FinanceStateType }) => state.finances.transactions.transactions
export const selectBudgets = (state: { finances: FinanceStateType }) => state.finances.budgets.budgets
export const selectSearchQuery = (state: { finances: FinanceStateType }) => state.finances.searchQuery
export const selectTransactionAction = (state: { finances: FinanceStateType }) => state.finances.transactions.actions
export const selectTransactionFilter = (state: { finances: FinanceStateType }) =>
	state.finances.transactions.actions.filterBy
export const selectRecurringBills = (state: { finances: FinanceStateType }) =>
	state.finances.recurringBills.recurringBills
export const selectRecurringBillsAction = (state: { finances: FinanceStateType }) =>
	state.finances.recurringBills.actions
export const selectBudgetsError = (state: { finances: FinanceStateType }) => state.finances.budgets.error
export const selectPotsError = (state: { finances: FinanceStateType }) => state.finances.pots.error
export const selectStateError = (state: { finances: FinanceStateType }) => state.finances.error

export const selectBudgetsWithSpending = createSelector(selectBudgets, selectTransactions, (budgets, transactions) => {
	let budgetsWithSpending = []

	budgetsWithSpending = [...budgets].map(b => {
		const spending = transactions
			.filter(
				t =>
					b.category === t.category &&
					t.amount < 0 &&
					moment(t.date).month() === moment.updateLocale('en', {}).monthsShort().indexOf('Aug')
			)
			.reduce((sum, t) => sum + t.amount, 0)
		return {
			...b,
			spending: Math.abs(spending),
		}
	})

	return budgetsWithSpending
})

export const recurringBillsSelector = createSelector(
	[selectRecurringBills, selectRecurringBillsAction],
	(recurringBills, actions) => {
		let newRecurringBills = [...recurringBills]

		if (actions.searchQuery) {
			newRecurringBills = newRecurringBills.filter(r =>
				r.name.toLowerCase().includes(actions.searchQuery.toLowerCase())
			)
		}

		if (actions.sortBy) {
			newRecurringBills = newRecurringBills.sort((a, b) => {
				if (actions.sortBy === 'latest') {
					const dayA = moment(a.date).date()
					const dayB = moment(b.date).date()
					return dayA - dayB
				} else if (actions.sortBy === 'oldest') {
					const dayA = moment(a.date).date()
					const dayB = moment(b.date).date()
					return dayB - dayA
				} else if (actions.sortBy === 'asc') {
					return a.name.localeCompare(b.name)
				} else if (actions.sortBy === 'desc') {
					return b.name.localeCompare(a.name)
				} else if (actions.sortBy === 'highest') {
					return a.amount - b.amount
				} else if (actions.sortBy === 'lowest') {
					return b.amount - a.amount
				}
				return 0
			})
		}

		return newRecurringBills
	}
)

export const transactionsSelector = createSelector(
	[selectTransactions, selectTransactionAction],
	(transactions, actions) => {
		let newTransactions = [...transactions]

		if (actions.searchQuery) {
			newTransactions = newTransactions.filter(t => t.name.toLowerCase().includes(actions.searchQuery.toLowerCase()))
		}

		if (actions.filterBy && actions.filterBy !== 'all') {
			newTransactions = newTransactions.filter(t => t.category === actions.filterBy)
		}

		if (actions.sortBy) {
			newTransactions = newTransactions.sort((a, b) => {
				if (actions.sortBy === 'latest') {
					return new Date(b.date).getTime() - new Date(a.date).getTime()
				} else if (actions.sortBy === 'oldest') {
					return new Date(a.date).getTime() - new Date(b.date).getTime()
				} else if (actions.sortBy === 'asc') {
					return a.name.localeCompare(b.name)
				} else if (actions.sortBy === 'desc') {
					return b.name.localeCompare(a.name)
				} else if (actions.sortBy === 'highest') {
					return b.amount - a.amount
				} else if (actions.sortBy === 'lowest') {
					return a.amount - b.amount
				}
				return 0
			})
		}

		return newTransactions
	}
)

export const { setSearchQuery, filterAndSortTransactions, updateRecurringBills, searchAndSortRecurringBills } =
	financesSlice.actions
export default financesSlice.reducer
