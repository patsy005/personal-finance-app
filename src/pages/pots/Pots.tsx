import { useDispatch, useSelector } from 'react-redux'
import { openModal, selectIsModalOpen, selectModalProps } from '../../slices/modalSlice'
import { selectPots } from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import Modal from '../../components/modal/Modal'
import Heading from '../../components/heading/Heading'
import Button from '../../components/button/Button'
import PotsList from './PotsList'
import PotsAddEditForm from './PotsAddEditForm'
import DeleteConfirmation from '../../components/deleteConfirmation/DeleteConfirmation'
import PotsDepositWithdrawForm from './PotsDepositWithdrawForm'

export default function Pots() {
	const isOpen = useSelector(selectIsModalOpen)
	const modalProps = useSelector(selectModalProps)
	const pots = useSelector(selectPots)
	const dispatch: AppDispatch = useDispatch()

	const openAddPotModal = () => {
		dispatch(openModal({ type: 'addPot' }))
	}

	const generateModalContent = () => {
		if (modalProps) {
			if (modalProps.type === 'addPot' || modalProps.type === 'editPot') {
				return <PotsAddEditForm />
			}

			if (modalProps.type === 'deletePot') {
				const itemToDelete = pots.find(pot => pot.id === +modalProps.id)
				return itemToDelete ? <DeleteConfirmation itemToDelete={itemToDelete} /> : null
			}

			if(modalProps.type === 'depositToPot' || modalProps.type === 'withdrawFromPot') {
				return <PotsDepositWithdrawForm />
			}

		}
	}
	return (
		<>
			<Modal isOpen={isOpen}>{generateModalContent()}</Modal>
			<section className="section pots">
				<div className="pots__heading d-flex justify-content-between align-items-center">
					<Heading text="pots" />
					<Button className="primary" onClick={openAddPotModal}>
						+ Add New Pot
					</Button>
				</div>

				<div className="d-flex flex-column panel pots__panel row">
					<PotsList />
				</div>
			</section>
		</>
	)
}
