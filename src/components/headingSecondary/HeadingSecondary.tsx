import { DotsIcon } from '../../assets/icons/Icons'
import BoxHeader from '../boxHeader/BoxHeader'
import SelectComponent from '../select/SelectComponent'

type HeadingSecondaryProps = {
	category: string
	theme: string
	selectOptions: { value: string; label: string }[]
	onSelectChangeHandler: (value: string) => void
}

export default function HeadingSecondary({
	theme,
	category,
	selectOptions,
	onSelectChangeHandler,
}: HeadingSecondaryProps) {
	return (
		<div className="heading-secondary__title">
			<div className="heading-secondary__title--circle" style={{ '--theme-color': theme } as React.CSSProperties}></div>
			<BoxHeader title={category}>
				<SelectComponent
					options={selectOptions}
					icon={<DotsIcon />}
					onChangeFn={onSelectChangeHandler}
					className="select-primary select-edit-delete"
				/>
			</BoxHeader>
		</div>
	)
}
