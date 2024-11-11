import { useSelector } from 'react-redux'
import { selectPots } from '../../slices/financesSlice'
import Box from '../../components/box/Box'
import BoxHeader from '../../components/boxHeader/BoxHeader'
import { PotIcon } from '../../assets/icons/Icons'
import ThemeBox from '../../components/themeBox/ThemeBox'
import { useMemo } from 'react'

export default function PotsOverview() {
	const pots = useSelector(selectPots)

	const potsOverwiew = useMemo(() => pots?.slice(-4), [pots])

	const totalSaved = useMemo(() => pots.reduce((acc, pot) => acc + pot.total, 0), [pots])

	return (
		<>
			{pots && (
				<Box className="pots-overview">
					<BoxHeader title="pots" text="See Details" />
					<div className="pots-overview__container">
						<div className="pots-overview--sumup">
							<PotIcon />
							<div className="pots-overview--sumup-info">
								<p>Total Saved</p>
								<p className="amount">${totalSaved}</p>
							</div>
						</div>

						<div className="box__details d-flex flex-wrap w-100">
							{potsOverwiew.map((d, index) => (
								<div className="detail-box d-flex col-6" key={index}>
									<ThemeBox theme={d.theme} />
									<div className="detail-box__info">
										{' '}
										<p className="name">{d.name}</p>
										<p className="total">${d.total}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</Box>
			)}
		</>
	)
}
