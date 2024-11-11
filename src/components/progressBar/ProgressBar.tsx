type ProgressBarProps = {
	max: number
	value: number
	depositValue?: number
	plannedProgress?: number
	theme?: string
	themeSecondary?: string
}

export default function ProgressBar({
	max,
	value,
	theme,
	plannedProgress,
	depositValue,
	themeSecondary,
}: ProgressBarProps) {
	const currentProgress = Math.min((value / max) * 100, 100)

	return (
		<div className="progress-bar">
			<div
				className={`progress-bar__progress`}
				style={
					{
						width: `${currentProgress}%`,
						'--theme-color': themeSecondary ? themeSecondary : theme,
					} as React.CSSProperties
				}></div>
			{depositValue && (
				<div
					className={`progress-bar__planned-progress`}
					style={{ width: `${plannedProgress}%`, '--theme-color': theme } as React.CSSProperties}></div>
			)}
		</div>
	)
}
