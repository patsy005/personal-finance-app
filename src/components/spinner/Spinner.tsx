type SpinnerProps = {
	className: string
}
export default function Spinner({ className }: SpinnerProps) {
	return (
		<div className={`spinnerContainer spinnerContainer__${className}`}>
			<div className={`spinner spinner__${className}`}></div>
		</div>
	)
}