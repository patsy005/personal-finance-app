import { Link } from 'react-router-dom'
import { CaretRightIcon } from '../../assets/icons/Icons'

type BoxHeaderProps = {
	title: string
	text?: string
	children?: React.ReactNode
}

export default function BoxHeader({ title, text, children }: BoxHeaderProps) {
	const newTitle = title === 'recurring bills' ? title.replace(' ', '-') : title
	return (
		<div className="box__header">
			<h3>{title}</h3>
			{text && !children && (
				<Link to={`/${newTitle}`}>
					{text} <CaretRightIcon />
				</Link>
			)}

			{children && children}
		</div>
	)
}
