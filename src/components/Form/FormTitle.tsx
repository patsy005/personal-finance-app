type FormTitleProps = {
	title: string
}

export default function FormTitle({ title }: FormTitleProps) {
	return <h2 className="form__title mb-0">{title}</h2>
}
