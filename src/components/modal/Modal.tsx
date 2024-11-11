import { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom'
import { useLocation } from 'react-router-dom'

type ModalProps = {
	isOpen: boolean
	children: React.ReactNode
} & ComponentPropsWithoutRef<'div'>

export default function Modal({ isOpen, children, ...props }: ModalProps) {
	const location = useLocation()

	const modalClassName = location.pathname.replace('/', '')

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div className={`modal__overlay modal__overlay--${modalClassName}`} {...props}>
			<div className="modal__content">{children}</div>
		</div>,
		document.body
	)
}
