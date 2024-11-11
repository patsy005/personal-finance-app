import { useSelector } from 'react-redux'
import { selectBudgetsWithSpending } from '../../slices/financesSlice'
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'
import { useMemo } from 'react'

export default function BudgetsChart() {
	const budgetsWithSpending = useSelector(selectBudgetsWithSpending)

	const chartOptions: ApexCharts.ApexOptions = useMemo(() => {
		return {
			chart: {
				type: 'donut' as const,
				width: '240px',
				height: '240px',
			},
			tooltip: {
				enabled: true,
				custom: function (options) {
					const index = options.seriesIndex
					const value = budgetsWithSpending[index].category
					const style = `font-family: 'Public Sans', sans-serif; font-size: 14px; background-color: ${budgetsWithSpending[index].theme}; padding: 10px;`
					return `<div class="apexcharts-tooltip-value" style="${style}">${value}</div>`
				},
				style: {
					fontFamily: 'Public Sans, sans-serif',
					fontSize: '14px',
				},
			},
			labels: budgetsWithSpending.map(b => '$ '.concat(b.spending.toString())),
			colors: budgetsWithSpending.map(b => b.theme),
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: false,
			},
			plotOptions: {
				pie: {
					donut: {
						size: '80%',
						labels: {
							show: true,
							value: {
								color: '#696868',
								fontFamily: 'Public Sans, sans-serif',
								formatter: val => {
									return `of $${val} limit`
								},
								fontSize: '12px',
								fontWeight: '400',
							},
							total: {
								show: true,
								fontSize: '32px',
								color: '#201F24',
								label: `$ ${budgetsWithSpending.reduce((sum, b) => sum + b.spending, 0).toString()}`,
								fontFamily: 'Public Sans, sans-serif',
								formatter: () => {
									return `of $ ${budgetsWithSpending.reduce((sum, b) => sum + b.maximum, 0).toString()} limit`
								},
								fontWeight: '700',
							},
						},
					},
				},
			},
			states: {
				hover: {
					filter: {
						type: 'darken',
						value: 0.5,
					},
				},
				active: {
					allowMultipleDataPointsSelection: false,
					filter: {
						type: 'darken',
						value: 0.5,
					},
				},
			},
			stroke: {
				show: false,
			},
		}
	}, [budgetsWithSpending])

	const series: ApexCharts.ApexOptions['series'] = useMemo(
		() => budgetsWithSpending.map(b => b.maximum),
		[budgetsWithSpending]
	)

	return (
		<div className="chart-wrapper">
			<Chart options={chartOptions} series={series} type="donut" width="240px" height="240px" />
		</div>
	)
}
