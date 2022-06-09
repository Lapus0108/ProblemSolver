import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Table, Card, Tag } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import GoalWidget from 'components/shared-components/GoalWidget';
import { withRouter, useHistory } from 'react-router-dom';
import axios from "axios";

const countersRes = [
	{
		title: 'Total new students',
		value: '14',
		status: '-20%',
		subtitle: `Compared to last month (May 2022)`
	},
	{
		title: 'Total solutions',
		value: '213',
		status: '45%',
		subtitle: `Compared to last month (May 2022)`
	},
	{
		title: 'Total problems',
		value: '45',
		status: '16%',
		subtitle: `Compared to last month (May 2022)`
	}
]

const performersRes = [
	{
		id: '#5331',
		name: 'Clayton Bates',
		last_solution_date: '8 May 2020',
		problems: '15',
		percentage: "64",
		rank: 'Guru',
	},
	{
		id: '#5332',
		name: 'Gabriel Frazier',
		last_solution_date: '6 May 2020',
		problems: '14',
		percentage: "77",
		rank: 'Guru',
	},
	{
		id: '#5333',
		name: 'Debra Hamilton',
		last_solution_date: '1 May 2020',
		problems: '14',
		percentage: "100",
		rank: 'Master',
	},
	{
		id: '#5334',
		name: 'Stacey Ward',
		last_solution_date: '28 April 2020',
		problems: '10',
		percentage: "85",
		rank: 'Mentor',
	},
	{
		id: '#5335',
		name: 'Troy Alexander',
		last_solution_date: '28 April 2020',
		problems: '7',
		percentage: "63",
		rank: 'Mentor',
	},
];


const Home = () => {
	const [counters, setCounters] = useState([]);
	const [solvePercentage, setSolvePercentage] = useState(100);
	const [performers, setPerformers] = useState([])
	const history = useHistory();

	useEffect(() => {
		// axios.get("https://URL/statistics").then((res) =>{
		// 	setCounters(res.data.counters);
		// 	setPerformers(res.data.performers);
		// }).catch(err => console.log(err))
		setSolvePercentage(64);
		setCounters(countersRes);
		setPerformers(performersRes);
	}, [])


	const tableColumns = [
		{
			title: 'Student',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Problems solved',
			dataIndex: 'problems',
			key: 'problems',
			render: (text, record) => (
				<div className="d-flex align-items-center">
					<span className="ml-2">{record.problems + " (" + record.percentage + "%)"}</span>
				</div>
			),
		},
		{
			title: 'Last solution',
			dataIndex: 'last_solution_date',
			key: 'last_solution_date',
		},
		{
			title: () => <div className="text-right">Rank title</div>,
			key: 'status',
			render: (_, record) => (
				<div className="text-right">
					<Tag className="mr-0" color={record.rank === 'Guru' ? 'cyan' : record.rank === 'Master' ? 'blue' : 'yellow'}>{record.rank}</Tag>
				</div>
			),
		},
	];

	return (
		<div>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={18}>
					<Row gutter={16}>
						{
							counters.map((elm, i) => (
								<Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
									<StatisticWidget
										title={elm.title}
										value={elm.value}
										status={elm.status}
										subtitle={elm.subtitle}
									/>
								</Col>
							))
						}
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Card title="Top performers">
								<Table
									className="no-border-last"
									columns={tableColumns}
									dataSource={performers}
									rowKey='id'
									pagination={false}
								/>
							</Card>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={24} md={24} lg={6}>
					<GoalWidget
						title="Your correct solutions"
						value={solvePercentage}
						subtitle="You need a bit more effort to increase your score"
						extra={<Button type="primary" onClick={() => history.push("/app/problems")}>Problems list</Button>}
					/>
				</Col>
			</Row>
		</div>
	)
}

export default withRouter(Home)
