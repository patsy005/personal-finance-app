import { ComponentPropsWithoutRef, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type SideBarLinkProps = {
	to: string
	icon: ReactNode
} & ComponentPropsWithoutRef<'a'>

export default function SideBarLink({ to, icon }: SideBarLinkProps) {
	const linkText = to === '/' ? 'Overview' : to.split('/')[1]

	return (
		<>
			<NavLink to={to} className="sidebar__item">
				{icon} <span className="d-none d-md-block">{linkText}</span>
			</NavLink>
		</>
	)
}
