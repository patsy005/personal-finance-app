import {
	LogoLargeIcon,
	LogoSmallIcon,
	MinimizeMenuIcon,
	NavBudgetsIcon,
	NavOverviewIcon,
	NavPotsIcon,
	NavRecurringBillsIcon,
	NavTransactionsIcon,
} from '../../assets/icons/Icons'
import SideBarLink from './SideBarLink'

type SideBarProps = {
	isSidebarMinimized: boolean
	toggleSidebar: () => void
}

export default function SideBar({ isSidebarMinimized, toggleSidebar }: SideBarProps) {
	return (
		<div className={`sidebar ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
			<div className="sidebar__box">
				<div>
					<div className="sidebar__logo d-none d-xl-block">
						{isSidebarMinimized ? <LogoSmallIcon /> : <LogoLargeIcon />}
					</div>
					<ul className="sidebar__list d-flex justify-content-between align-items-center">
						<SideBarLink to="/" icon={<NavOverviewIcon />} />
						<SideBarLink to="/transactions" icon={<NavTransactionsIcon />} />
						<SideBarLink to="/budgets" icon={<NavBudgetsIcon />} />
						<SideBarLink to="/pots" icon={<NavPotsIcon />} />
						<SideBarLink to="/recurring-bills" icon={<NavRecurringBillsIcon />} />
					</ul>
				</div>
				<div className="sidebar__minimize d-none d-xl-flex" onClick={toggleSidebar}>
					<MinimizeMenuIcon />
					{!isSidebarMinimized && <p>Minimize menu</p>}
				</div>
			</div>
		</div>
	)
}
