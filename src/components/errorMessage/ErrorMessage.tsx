type ErrorMessageProps = {
    message: string
}
export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className='error-message'>
        <p>{message}</p>
    </div>
  )
}
