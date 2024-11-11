type ThemeBoxProps = {
	theme: string
}

export default function ThemeBox({ theme }: ThemeBoxProps) {
	const themeBox = () => {
		const themeColor = theme

		return <div className="theme-box" style={{ '--theme-color': themeColor } as React.CSSProperties}></div>
	}

	return <>{themeBox()}</>
}
