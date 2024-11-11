import { Outlet } from 'react-router-dom'
import SideBar from '../../components/sideBar/SideBar'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFinances, selectIsLoading, selectStateError } from '../../slices/financesSlice'
import Spinner from '../../components/spinner/Spinner'
import { AppDispatch } from '../../store'
import ErrorMessage from '../../components/errorMessage/ErrorMessage'
import ToasterComponent from '../../components/toaster/Toaster'

export default function Layout() {
	// const isLoading = true
	const isLoading = useSelector(selectIsLoading)
	const stateError = useSelector(selectStateError)
	const dispatch: AppDispatch = useDispatch()

	const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

	useEffect(() => {
		dispatch(fetchFinances())
	}, [dispatch])

	const toggleSidebar = () => {
		setIsSidebarMinimized(prevState => !prevState)
	}

	const sidebarColumnClasses = classNames('col-12 order-2 order-xl-1 sidebar-container', {
		'col-xl-2': !isSidebarMinimized,
		'col-xl-1': isSidebarMinimized,
	})

	const mainColumnClasses = classNames('col-12 order-1 order-xl-2', {
		'col-xl-11': isSidebarMinimized,
		'col-xl-10': !isSidebarMinimized,
	})

	return (
		<>
			{isLoading && !stateError && <Spinner className="page" />}
			{!isLoading && !stateError && (
				<div className="d-flex layout flex-column">
					<div className={sidebarColumnClasses}>
						<SideBar isSidebarMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
					</div>
					<main className={mainColumnClasses}>
						<ToasterComponent />
						<Outlet />
					</main>
				</div>
			)}
			{!isLoading && stateError && <ErrorMessage message={stateError} />}
		</>
	)
}
