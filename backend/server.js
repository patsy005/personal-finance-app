import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
	'http://localhost:5173',
	'http://localhost:5000',
	'https://personal-finance-app-lemon.vercel.app',
	'https://personal-finances-hhg3.onrender.com',
]

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				const message = 'The CORS policy for this site does not allow access from the specified Origin.'
				callback(new Error(message), false)
			}
		},
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true, // Włącz, jeśli używasz ciasteczek
	})
)

app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI)

async function connectDB() {
	try {
		await client.connect()
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('Error connecting to MongoDB', error)
	}
}

connectDB()

app.get('/personal-finances', async (req, res) => {
	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')
	const finances = await collection.findOne({})
	res.json(finances)
})

// budgets CRUD
app.post('/personal-finances/budgets', async (req, res) => {
	console.log('Request body', req.body)
	const { category, maximum, theme, id } = req.body
	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const result = await collection.updateOne(
			{},
			{
				$push: {
					budgets: {
						category,
						maximum,
						theme,
						id,
					},
				},
			},
			{ upsert: true }
		)

		if (result.modifiedCount > 0 || result.upsertedCount > 0) {
			const newBudget = {
				category,
				maximum,
				theme,
				id,
			}
			return res.json(newBudget)
		} else {
			res.status(400).json({ message: 'Failed to add budget' })
			res.end()
		}
	} catch (error) {
		console.error('Error adding budget', error)
		res.status(500).json({ message: 'Failed to add budget' })
		res.end()
	}
})

app.delete('/personal-finances/budgets/:id', async (req, res) => {
	const { id } = req.params

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const result = await collection.updateOne(
			{},
			{
				$pull: {
					budgets: {
						id: parseInt(id),
					},
				},
			}
		)

		if (result.modifiedCount > 0) {
			return res.json({ id: parseInt(id) })
		} else {
			res.status(400).json({ message: 'Failed to delete budget' })
			res.end()
		}
	} catch (error) {
		console.error('Error deleting budget', error)
		res.status(500).json({ message: 'Failed to delete budget' })
		res.end()
	}
})

app.patch('/personal-finances/budgets/:id', async (req, res) => {
	const { id } = req.params
	const { category, maximum, theme } = req.body

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const result = await collection.updateOne(
			{ 'budgets.id': parseInt(id) },
			{
				$set: {
					'budgets.$.category': category,
					'budgets.$.maximum': maximum,
					'budgets.$.theme': theme,
				},
			}
		)

		if (result.modifiedCount > 0) {
			const updatedBudget = { id: parseInt(id), category, maximum, theme }
			console.log(updatedBudget)

			return res.json(updatedBudget)
		} else {
			res.status(400).json({ message: 'Failed to update budget' })
			res.end()
		}
	} catch (error) {
		console.error('Error updating budget', error)
		res.status(500).json({ message: 'Failed to update budget' })
		res.end()
	}
})

// pots CRUD

app.post('/personal-finances/pots', async (req, res) => {
	console.log('Request body', req.body)
	const { name, target, theme, total, id } = req.body

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const result = await collection.updateOne(
			{},
			{
				$push: {
					pots: {
						name,
						target,
						theme,
						total,
						id,
					},
				},
			},
			{ upsert: true }
		)

		if (result.modifiedCount > 0 || result.upsertedCount > 0) {
			const newPot = {
				name,
				target,
				theme,
				total,
				id,
			}
			return res.json(newPot)
		} else {
			res.status(400).json({ message: 'Failed to add pot' })
			res.end()
		}
	} catch (error) {
		console.error('Error adding pot', error)
		res.status(500).json({ message: 'Failed to add pot' })
		res.end()
	}
})

app.patch('/personal-finances/pots/:id', async (req, res) => {
	const { id } = req.params
	const { name, target, theme } = req.body

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const result = await collection.updateOne(
			{ 'pots.id': parseInt(id) },
			{
				$set: {
					'pots.$.name': name,
					'pots.$.target': target,
					'pots.$.theme': theme,
				},
			}
		)

		if (result.modifiedCount > 0) {
			const updatedAccount = await collection.findOne({})
			const updatedPot = updatedAccount.pots.find(pot => pot.id === parseInt(id))
			console.log(updatedPot)

			return res.json(updatedPot)
		} else {
			res.status(400).json({ message: 'Failed to update pot' })
			res.end()
		}
	} catch (error) {
		console.error('Error updating pot', error)
		res.status(500).json({ message: 'Failed to update pot' })
		res.end()
	}
})

app.delete('/personal-finances/pots/:id', async (req, res) => {
	const { id } = req.params

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const userAccount = await collection.findOne({})
		const pot = userAccount.pots.find(pot => pot.id === parseInt(id))

		if (pot === -1) res.status(404).json({ message: 'Pot not found' })

		const potTotal = pot.total

		const updatedBalance = userAccount.balance.current + potTotal

		const result = await collection.updateOne(
			{},
			{
				$pull: {
					pots: {
						id: parseInt(id),
					},
				},
				$set: {
					'balance.current': updatedBalance,
				},
			}
		)

		if (result.modifiedCount > 0) {
			return res.json({ id: parseInt(id), balance: updatedBalance })
		} else {
			res.status(400).json({ message: 'Failed to delete pot' })
			res.end()
		}
	} catch (error) {
		console.error('Error deleting pot', error)
		res.status(500).json({ message: 'Failed to delete pot' })
		res.end()
	}
})

app.patch('/personal-finances/pots/:id/deposit-withdraw', async (req, res) => {
	const { id } = req.params
	const { amount, type } = req.body

	const db = client.db('personal-finances-db')
	const collection = db.collection('personal-finances')

	try {
		const userAccount = await collection.findOne({})
		const pot = userAccount.pots.find(pot => pot.id === parseInt(id))
		let updatedBalance, updatedTotal

		if (pot === -1) res.status(404).json({ message: 'Pot not found' })

		if (type === 'withdraw') {
			updatedBalance = userAccount.balance.current + amount
			updatedTotal = pot.total - amount
		}

		if (type === 'deposit') {
			updatedBalance = userAccount.balance.current - amount
			updatedTotal = pot.total + amount
		}

		const result = await collection.updateOne(
			{ 'pots.id': parseInt(id) },
			{
				$set: {
					'pots.$.total': updatedTotal,
					'balance.current': updatedBalance,
				},
			}
		)

		if (result.modifiedCount > 0) {
			const updatedAccount = await collection.findOne({})
			const updatedPot = updatedAccount.pots.find(pot => pot.id === parseInt(id))
			console.log(updatedPot)
			console.log(updatedBalance)

			return res.json({ updatedPot, updatedBalance })
		} else {
			res.status(400).json({ message: 'Failed to update pot' })
			res.end()
		}
	} catch (error) {
		console.error('Error updating pot', error)
		res.status(500).json({ message: 'Failed to update pot' })
		res.end()
	}
})

app.listen(PORT, () => {
	console.log('Server is running on port', PORT)
})
