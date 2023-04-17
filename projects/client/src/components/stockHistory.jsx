import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import REST_API from "../support/services/RESTApiService";

function StockHistory() {
	const [data, setData] = useState([]);

	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [selectedDate, setSelectedDate] = useState({
		from: "",
		to: "",
	});

	let inputSearch = useRef();
	let Navigate = useNavigate();

	let onGetDataKey = async (e, value) => {
		if (e.key === "Enter") {
			// let response = await axios.get(
			// 	`http://localhost:8000/admin/history-stock?search=${value}`,
			// 	{
			// 		headers: {
			// 			token: localStorage.getItem("token"),
			// 		},
			// 	}
			// );

			let response = await REST_API({
				url: `/admin/history-stock?search=${value}`,
				method: "GET",
			});

			setData(response.data.data);
		}
	};

	let onGetData = async (value, filter, sort = "") => {
		// let response = await axios.get(
		// 	`http://localhost:8000/admin/history-stock?search=${value}`,
		// 	{
		// 		headers: {
		// 			token: localStorage.getItem("token"),
		// 		},
		// 	}
		// );

		let response = await REST_API({
			url: `/admin/history-stock?search=${value}`,
			method: "GET",
		});
		// console.log(response.data.data);
		setData(response.data.data);
	};

	useEffect(() => {
		onGetData();
	}, []);

	return (
		<div>
			<h1 className="pb-10">STOCK HISTORY</h1>
			<div class="flex items-center ">
				<label for="simple-search" class="sr-only">
					Search
				</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg
							aria-hidden="true"
							class="w-5 h-5 text-gray-500 dark:text-gray-400"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							></path>
						</svg>
					</div>
					<input
						ref={inputSearch}
						type="text"
						onKeyPress={(e) =>
							onGetDataKey(
								e,
								inputSearch.current.value
								// dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`
							)
						}
						id="simple-search"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search Product"
						required
					/>
				</div>
				<button
					onClick={() =>
						onGetData(
							inputSearch.current.value,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`
						)
					}
					class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
					<span class="sr-only">Search Product</span>
				</button>
			</div>
			{/* <div className="flex">
				<select
					onChange={(e) =>
						onGetData(
							inputSearch.current.value,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							e.target.value
						)
					}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option disabled selected>
						sort by
					</option>
					<option value="date-asc">date ascending</option>
					<option value="date-desc">date descending</option>
				</select>
				<DatePicker
					placeholderText="Select Date From"
					showMonthDropdown={true}
					showYearDropdown={true}
					locale="id-ID"
					scrollableYearDropdown={true}
					selected={selectedDate.from === "" ? null : selectedDate.from}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-36"
					onChange={(date) => {
						setDateFrom(date.toISOString().split("T")[0]);
						setSelectedDate({ ...selectedDate, from: date });
					}}
				/>
				{console.log(dateFrom, "ini from")}
				<DatePicker
					placeholderText="Select Date To"
					showMonthDropdown={true}
					showYearDropdown={true}
					locale="id-ID"
					scrollableYearDropdown={true}
					selected={selectedDate.to === "" ? null : selectedDate.to}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-36"
					onChange={(date) => {
						setDateTo(date.toISOString().split("T")[0]);
						setSelectedDate({ ...selectedDate, to: date });
					}}
				/>
				<div className="flex justify-between">
					{console.log(dateTo, "ini to")}
				</div>
			</div> */}
			<div className="grid md:grid-cols-4 grid-cols-2 gap-7 h-auto">
				{data.length !== 0 ? (
					data.map((value, index) => {
						return (
							<div
								key={index}
								className="flex flex-col shadow-md justify-between w-full max-w-sms h-72 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 mt-10 "
							>
								<img
									className="rounded-t-lg h-32"
									src={value.img}
									alt="product"
								/>
								<div className="px-5 pb-5">
									<h5 className="text-xs font-semibold tracking-tight text-gray-900 dark:text-white">
										{value.name}
									</h5>
									{/* <h4 className="text-xs">Jumlah Stok {value.stock}</h4> */}
									<div className="flex items-center justify-between">
										<span className="text-xs font-bold text-gray-900 dark:text-white">
											Rp. {value.price.toLocaleString()}
										</span>
									</div>
								</div>
								<div className="flex justify-end px-2 mb-4">
									<button
										onClick={() =>
											Navigate(`/admin/stock-history-detail/${value.id}`)
										}
										className="bg-blue-700 rounded-xl text-white px-2"
									>
										Check History
									</button>
								</div>
							</div>
						);
					})
				) : (
					<div className="col-span-4 h-[450px] flex items-center justify-center">
						<div>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
							<h1 className="text-center text-red-600">
								YOU MUST SEARCH THE PRODUCT FIRST
							</h1>
						</div>
					</div>
				)}
			</div>
			<div>
				{/* <table className="mx-auto w-full mt-10">
					<thead>
						<tr className="border">
							<th className="px-2">Product Id</th>
							<th className=" px-10 flex justify-center">Product name</th>
							<th className="px-2">Quantity</th>
							<th className="px-2">Branch</th>
							<th className="px-2">Date</th>
						</tr>
					</thead>
					<tbody className=" pt-10 h-100 ">
						{data ? (
							data.map((value) => {
								return (
									<tr>
										<td>{value.product.id}</td>
										<td>{value.product.name}</td>
										<td>{value.stock}</td>
										<td>{value.branch.location}</td>
										<td>{new Date(value.createdAt).toUTCString()}</td>
									</tr>
								);
							})
						) : (
							<tr className=" text-red-700">
								<td colSpan={5} className="text-center">
									{" "}
									Please Find The Product First
								</td>
							</tr>
						)}
					</tbody>
				</table> */}
			</div>
		</div>
	);
}

export default StockHistory;
