import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/button/Button'
import Heading from '../../components/heading/Heading'
import Modal from '../../components/modal/Modal'
import SpendingList from './SpendingList'
import SpendingSummary from './SpendingSummary'
import { openModal, selectIsModalOpen, selectModalProps } from '../../slices/modalSlice'
import { AppDispatch } from '../../store'
import BudgetsForm from './BudgetsForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import { selectBudgets } from '../../slices/financesSlice'

export default function Budgets() {
	const isOpen = useSelector(selectIsModalOpen)
	const modalProps = useSelector(selectModalProps)
	const budgets = useSelector(selectBudgets)
	const dispatch: AppDispatch = useDispatch()

	const openAddBudgetModal = () => {
		dispatch(openModal({ type: 'addBudget' }))
	}

	const generateModalContent = () => {
		if (modalProps) {
			if (modalProps.type === 'addBudget' || modalProps.type === 'editBudget') {
				return <BudgetsForm />
			}

			if (modalProps.type === 'deleteBudget') {
				const itemToDelete = budgets.find(b => b.id === +modalProps?.id)
				return itemToDelete ? <DeleteConfirmation itemToDelete={itemToDelete} /> : null
			}
		}
	}

	return (
		<>
			<Modal isOpen={isOpen}>{generateModalContent()}</Modal>
			<section className="budgets section">
				<div className="budgets__heading d-flex justify-content-between align-items-center">
					<Heading text="budgets" />
					<Button className="primary" onClick={openAddBudgetModal}>
						+ Add New Budget
					</Button>
				</div>

				<div className="d-flex flex-column panel budgets__panel row">
					<div className="col-12 col-xl-5 left-column">
						<SpendingSummary />
					</div>
					<div className="col-12 col-xl-7 d-flex right-column">
						<SpendingList />
					</div>
				</div>
			</section>
		</>
	)
}
