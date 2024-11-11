import { useDispatch } from 'react-redux'
import { CloseModalIcon } from '../../assets/icons/Icons'
import { deleteBudget, deletePot } from '../../slices/financesSlice'
import { AppDispatch } from '../../store'
import Button from '../button/Button'
import { closeModal } from '../../slices/modalSlice'
import toast from 'react-hot-toast'
import { BudgetType, PotType } from '../../slices/financesTypes'

type DeleteConfirmationProps = {
	itemToDelete: BudgetType | PotType
}

export default function DeleteConfirmation({ itemToDelete }: DeleteConfirmationProps) {
	const dispatch: AppDispatch = useDispatch()

	const closeModalHadler = () => {
		dispatch(closeModal())
	}

	const deleteItemHandler = () => {
		if ('category' in itemToDelete) {
			dispatch(deleteBudget(itemToDelete.id))
				.unwrap()
				.then(() => closeModalHadler())
		} else {
			dispatch(deletePot(itemToDelete.id)).unwrap().then(() => closeModalHadler()).then(() => toast.success('Successfully deleted'))
		}
	}

	return (
		<div className="box delete-confirmation">
			<div className="delete-confirmation__top">
				<h2 className="delete-confirmation__title">
					Delete '{'category' in itemToDelete ? itemToDelete.category : itemToDelete.name}'
				</h2>
				<button className="delete-confirmation__exit-button" onClick={closeModalHadler}>
					<CloseModalIcon />
				</button>
			</div>
			<p className="delete-confirmation__text">
				Are you sure you want to delete '{'category' in itemToDelete ? itemToDelete.category : itemToDelete.name}'? This action cannot be
				reversed, and all the data inside it will be removed forever.
			</p>
			<div className="delete-confirmation__actions">
				<Button className="destroy" onClick={deleteItemHandler}>
					Yes, Confirm Deletion
				</Button>
				<Button className="tertiary" onClick={closeModalHadler}>
					No, Go Back
				</Button>
			</div>
		</div>
	)
}
