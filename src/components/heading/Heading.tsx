type HeadingProps = {
	text: string
}

export default function Heading({ text }: HeadingProps) {
	return <h1>{text}</h1>
}
