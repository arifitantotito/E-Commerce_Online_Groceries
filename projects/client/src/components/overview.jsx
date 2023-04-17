import { useEffect, useState } from "react";
import REST_API from "../support/services/RESTApiService";
import Chart from "chart.js/auto";
import { Card, Col, Row, Statistic, formatter } from "antd";
import {
	UserOutlined,
	ShoppingCartOutlined,
	ShopOutlined,
} from "@ant-design/icons";

function Overview(props) {
	const [user, setUser] = useState();
	const [transaction, setTransaction] = useState();
	const [branch, setBranch] = useState();
	const [income, setIncome] = useState();
	// let onGetDataIncome = async (year) => {
	// 	try {
	// 		let response = await REST_API({
	// 			url: `/admin/get-transaction-month?year=${year}`,
	// 			method: "GET",
	// 		});

	// 		setIncome(response.data.data.income);
	// 		setMonth(response.data.data.monthSent);
	// 	} catch (error) {}
	// };

	let onGetData = async () => {
		let response;

		try {
			response = await REST_API({
				url: `/admin/get-transaction-month?year=${new Date()
					.toISOString()
					.toLocaleString("id-ID", {
						timeZone: "Asia/Jakarta",
						year: "numeric",
					})
					.slice(0, 4)}`,
				method: "GET",
			});
			setUser(response.data.data.total_user);
			setTransaction(response.data.data.transactionLength);
			setBranch(response.data.data.total_branch);
			setIncome(response.data.data.count);
			// setIncome(response.data.data.income);
			// setMonth(response.data.data.monthSent);
		} catch (error) {}

		const ctx = document.getElementById("myChart");

		new Chart(ctx, {
			type: "line",
			data: {
				labels: response.data.data.monthSent,
				datasets: [
					{
						label: "",
						data: response.data.data.income,
						borderWidth: 3,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	};

	useEffect(() => {
		onGetData();
	}, []);
	return (
		<div>
			<div>
				<div class="flex flex-col md:flex-row md:flex-wrap md:-mx-4">
					<div class=" px-4 py-6 md:w-1/4 md:px-4 md:py-6 flex justify-center">
						<UserOutlined />
						<Statistic
							title="Active Users"
							value={user}
							className="text-center"
						/>
					</div>
					<div class=" mt-8 md:mt-0 px-4 py-6 md:w-1/4 md:px-4 md:py-6  flex justify-center">
						<ShoppingCartOutlined />
						<Statistic
							title="Total Transaction"
							value={transaction}
							className="text-center"
						/>
					</div>
					<div class=" mt-8 md:mt-0 px-4 py-6 md:w-1/4 md:px-4 md:py-6  flex justify-center ">
						<ShopOutlined />
						<Statistic
							title="Total Branch"
							value={branch}
							className="text-center"
						/>
					</div>
					<div class=" mt-8 md:mt-0 px-4 py-6 md:w-1/4 md:px-4 md:py-6  flex justify-center">
						<Statistic
							title="Total Income This Year (Rupiah)"
							value={income}
							className="text-center"
						/>
					</div>
				</div>

				<div className="flex justify-center  max-[640px]:w-full max-[640px]:h-full">
					<h1 className="text-center text-3xl font-tokpedFont">
						{new Date()
							.toISOString()
							.toLocaleString("id-ID", {
								timeZone: "Asia/Jakarta",
								year: "numeric",
							})
							.slice(0, 4)}
					</h1>
					<h1 className="text-center text-3xl font-tokpedFont ml-2">Income</h1>
				</div>
				<div className="!h-[400px] w-full max-[640px]:w-full max-[640px]:h-full mx-auto bg-slate-50">
					<canvas id="myChart"></canvas>
				</div>
			</div>
			<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
		</div>
	);
}

export default Overview;
