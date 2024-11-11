export type BalanceType = {
	current: number
	expenses: number
	income: number
}

export type BudgetType = {
	category: string
	maximum: number
	theme: string
	id: number
}

export type PotType = {
	name: string
	target: number
	theme: string
	total: number
	id: number
}

export type TransactionType = {
	amount: number
	avatar: string
	category: string
	date: string
	name: string
	recurring: boolean
	id: number
}

export type TransactionActions = {
	searchQuery: string
	sortBy: string
	filterBy: string
}

export type APIStateType = {
	isLoading: boolean
	error: string | null
}

export type FinanceStateType = {
	balance: BalanceType
	budgets: {budgets: BudgetType[], error: string | null}
	pots: {pots: PotType[], error: string | null}
	transactions: { transactions: TransactionType[]; actions: TransactionActions }
	recurringBills: { recurringBills: RecurringBillType[]; actions: RecurringBillsActions }
	searchQuery?: string
	sortBy?: string
	filterBy?: string
} & APIStateType

export type RecurringBillType = {
	amount: number
	avatar: string
	category: string
	date: string
	name: string
	recurring: boolean
	id: number
	status: RecurringBillStatus
}

export type RecurringBillStatus = 'paid' | 'upcoming' | 'dueSoon'

export type RecurringBillsActions = {
	searchQuery: string
	sortBy: string
}