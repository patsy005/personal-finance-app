import { Toaster } from 'react-hot-toast'

export default function ToasterComponent() {
	return (
		<Toaster
			position="top-center"
			gutter={12}
			containerStyle={{ margin: '10px', borderRadius: '8px' }}
			toastOptions={{
				success: {
					duration: 5000,
					style: {
						backgroundColor: '#277c78',
						border: '1px solid #277c78',
					},
					iconTheme: {
						primary: '#fff',
						secondary: '#277c78',
					},
				},
				style: {
					fontFamily: 'inherit',
					borderRadius: '8px',
					fontSize: '14px',
					maxWidth: '400px',
					padding: '16px',
					color: '#fff',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
					gap: '8px',
				},
			}}
		/>
	)
}
