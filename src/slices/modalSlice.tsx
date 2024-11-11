import { createSlice } from '@reduxjs/toolkit'

export type ModalType = {
	isOpen: boolean
	modalProps?: Record<string, string>
}

const initialState: ModalType = {
	isOpen: false,
	modalProps: {},
}

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action) => {
			state.isOpen = true
			state.modalProps = action.payload
		},
		closeModal: state => {
			state.isOpen = false
			state.modalProps = {}
		},
	},
})

export const selectIsModalOpen = (state: { modal: ModalType }) => state.modal.isOpen
export const selectModalProps = (state: { modal: ModalType }) => state.modal.modalProps

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
