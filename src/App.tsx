import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './ui/Layout/Layout'

import Transactions from './pages/transactions/Transactions'
import Budgets from './pages/budgets/Budgets'
import Pots from './pages/pots/Pots'
import RecurringBills from './pages/recurringBills/RecurringBills'
import Overview from './pages/overview/Overview'

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <Overview />,
			},
			{
				path: '/transactions',
				element: <Transactions />,
			},
			{
				path: '/budgets',
				element: <Budgets />,
			},
			{
				path: '/pots',
				element: <Pots />,
			},
			{
				path: '/recurring-bills',
				element: <RecurringBills />,
			},
		],
	},
])

function App() {
	return <RouterProvider router={router}></RouterProvider>
}

export default App
