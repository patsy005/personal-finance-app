type FormErrorMessageProps = {
    errorMessage: string
}

export default function FormErrorMessage({errorMessage}: FormErrorMessageProps) {
  return (
    <div className="form__error">
        <p>{errorMessage}</p>
    </div>
  )
}
