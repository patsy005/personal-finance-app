import { useSelector } from 'react-redux'
import { selectPots } from '../../slices/financesSlice'
import PotsItem from './PotsItem'

export default function PotsList() {
	const pots = useSelector(selectPots)

	return (
		<>
			{pots.map((pot, index) => (
				<PotsItem key={index} {...pot} />
			))}
		</>
	)
}
