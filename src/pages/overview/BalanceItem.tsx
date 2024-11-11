type BalanceItemProps = {
	title: string
	amount: number
}
export default function BalanceItem({ title, amount }: BalanceItemProps) {
	return (
		<div className="overview__balance-item">
			<h3>{title === 'current' ? `${title} Balance` : title}</h3>
			<p>${amount.toFixed(2)}</p>
		</div>
	)
}
