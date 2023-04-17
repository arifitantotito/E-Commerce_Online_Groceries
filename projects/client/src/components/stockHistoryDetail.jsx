import { GrNext, GrPrevious, GrEdit } from "react-icons/gr";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import REST_API from "../support/services/RESTApiService";
import { Tabs, Table } from "flowbite-react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

function StockHistoryDetail(props) {
	// var productId = useParams();
	const [data, setData] = useState([]);
	const [activeTab, setActiveTab] = useState(0);
	const [tab, setTab] = useState(1);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [sort, setSort] = useState("");
	const [selectedpage, setselectedpage] = useState(1);
	// const placementChange = (anu) => {
	// 	console.log(anu, "masuk pak ekoo");
	// 	// SetPlacement(e.target.value);
	// };
	// const placementChange1 = (anu) => {
	// 	console.log(anu, "masuk pak COK");
	// 	// SetPlacement(e.target.value);
	// };
	const tabsRef = useRef();
	let idParam = useParams();

	let onGetData = async (page, branchId, filter, sort) => {
		try {
			// console.log(page, "ini page yg masuk");
			let { data } = await REST_API({
				url: `/admin/product-history-detail?page=${page}&ProductId=${idParam.id}&branchId=${branchId}&sort=${sort}&filter=${filter}`,
				method: "GET",
			});
			setselectedpage(page);

			setData(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		onGetData(1, 1, "", "");
	}, []);

	if (props.state.profile.role === "branch admin") {
		return (
			<div>
				<div className="flex gap-5 items-center">
					{data
						? data
								.map((value) => {
									return (
										<>
											<img
												className="h-40 w-40 rounded-full"
												src={value.product.img}
												alt=""
											/>
											<h1>{value.product.name}</h1>
										</>
									);
								})
								.slice(0, 1)
						: null}
				</div>
				<div className="mt-10 md:flex md:justify-between">
					<div className="flex flex-col">
						<RangePicker
							onChange={(date) => {
								setDateFrom(date[0].toISOString().split("T")[0]);
								setDateTo(date[1].toISOString().split("T")[0]);
							}}
						/>
						<select
							onChange={(e) => {
								onGetData(
									selectedpage,
									tab,
									dateFrom === "" && dateTo === ""
										? ""
										: `${dateFrom}/${dateTo}`,
									e.target.value
								);
								setSort(e.target.value);
							}}
							className="w-24 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 md:hidden"
						>
							<option disabled selected>
								sort by
							</option>
							<option value="date-asc">date ascending</option>
							<option value="date-desc">date descending</option>
						</select>
					</div>
					<select
						onChange={(e) => {
							onGetData(
								selectedpage,
								tab,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								e.target.value
							);
							setSort(e.target.value);
						}}
						className="w-24 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hidden md:block"
					>
						<option disabled selected>
							sort by
						</option>
						<option value="date-asc">date ascending</option>
						<option value="date-desc">date descending</option>
					</select>
				</div>
				<div className="mt-8">
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>Product name</Table.HeadCell>
							<Table.HeadCell>Stock</Table.HeadCell>
							<Table.HeadCell>Date</Table.HeadCell>
						</Table.Head>
						{data
							? data.map((value) => {
									return (
										<>
											<Table.Body className="divide-y">
												<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
													<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
														{value.product.name}
													</Table.Cell>
													<Table.Cell>{value.stock}</Table.Cell>
													<Table.Cell>
														{new Date(value.createdAt).toLocaleString("id-ID", {
															timeZone: "Asia/Jakarta",
														})}
													</Table.Cell>
												</Table.Row>
											</Table.Body>
										</>
									);
							  })
							: null}
					</Table>
				</div>
				<div className="mt-24 flex justify-center items-center my-5 pb-10 ">
					<label className="p-1">page</label>
					<button
						className="bg-[#0095DA]  border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
						onClick={() =>
							onGetData(
								selectedpage - 1,
								tab,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								sort
							)
						}
						disabled={parseInt(selectedpage) === 1}
					>
						<GrPrevious />
					</button>
					<input
						type="text"
						value={selectedpage}
						onChange={(e) => {
							onGetData(
								e.target.value,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								sort
							);
							setselectedpage(e.target.value ? parseInt(e.target.value) : 0);
						}}
						className="w-8 p-1 border-0"
					/>
					<button
						className="bg-red-500  border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
						onClick={() =>
							onGetData(
								selectedpage + 1,
								tab,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								sort
							)
						}
						// disabled={parseInt(selectedpage) === parseInt(page)}
					>
						<GrNext />
					</button>
					<label className="p-1" htmlFor="">
						{/* of {page} */}
					</label>
				</div>
			</div>
		);
	}
	return (
		<div>
			<div className="flex gap-5 items-center">
				{data
					? data
							.map((value) => {
								return (
									<>
										<img
											className="h-40 w-40 rounded-full"
											src={value.product.img}
											alt=""
										/>
										<h1>{value.product.name}</h1>
									</>
								);
							})
							.slice(0, 1)
					: null}
			</div>
			<div className="mt-10 md:flex md:justify-between">
				<div className="flex flex-col">
					<RangePicker
						onChange={(date) => {
							setDateFrom(date[0].toISOString().split("T")[0]);
							setDateTo(date[1].toISOString().split("T")[0]);
						}}
					/>
					<select
						onChange={(e) => {
							onGetData(
								selectedpage,
								tab,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								e.target.value
							);
							setSort(e.target.value);
						}}
						className="w-24 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 md:hidden"
					>
						<option disabled selected>
							sort by
						</option>
						<option value="date-asc">date ascending</option>
						<option value="date-desc">date descending</option>
					</select>
				</div>
				<select
					onChange={(e) => {
						onGetData(
							selectedpage,
							tab,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							e.target.value
						);
						setSort(e.target.value);
					}}
					className="w-24 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hidden md:block"
				>
					<option disabled selected>
						sort by
					</option>
					<option value="date-asc">date ascending</option>
					<option value="date-desc">date descending</option>
				</select>
			</div>

			<div className="mt-8 flex gap-4">
				<div className="w-full">
					<Tabs.Group
						aria-label="Default tabs"
						style="underline"
						ref={tabsRef}
						onActiveTabChange={(tab) => {
							onGetData(
								1,
								tab + 1,
								dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
								sort
							);
							setselectedpage(1);
							console.log(selectedpage, "function jalan");
							setTab(tab + 1);
						}}
					>
						<Tabs.Item active title="Jakarta">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
						<Tabs.Item title="Bandung">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
						<Tabs.Item title="Yogyakarta">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
						<Tabs.Item title="Semarang">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
						<Tabs.Item title="Kalimantan">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
						<Tabs.Item title="Sulawesi">
							<Table hoverable={true}>
								<Table.Head>
									<Table.HeadCell>Product name</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell>Date</Table.HeadCell>
								</Table.Head>
								{data
									? data.map((value) => {
											return (
												<>
													<Table.Body className="divide-y">
														<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
															<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
																{value.product.name}
															</Table.Cell>
															<Table.Cell>{value.stock}</Table.Cell>
															<Table.Cell>
																{new Date(value.createdAt).toLocaleString(
																	"id-ID",
																	{
																		timeZone: "Asia/Jakarta",
																	}
																)}
															</Table.Cell>
														</Table.Row>
													</Table.Body>
												</>
											);
									  })
									: null}
							</Table>
						</Tabs.Item>
					</Tabs.Group>
				</div>
			</div>
			<div className="mt-24 flex justify-center items-center my-5 pb-10 ">
				<label className="p-1">page</label>
				<button
					className="bg-[#0095DA]  border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
					onClick={() =>
						onGetData(
							selectedpage - 1,
							tab,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							sort
						)
					}
					disabled={parseInt(selectedpage) === 1}
				>
					<GrPrevious />
				</button>
				<input
					type="text"
					value={selectedpage}
					onChange={(e) => {
						onGetData(
							e.target.value,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							sort
						);
						setselectedpage(e.target.value ? parseInt(e.target.value) : 0);
					}}
					className="w-8 p-1 border-0"
				/>
				<button
					className="bg-[#0095DA] border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
					onClick={() =>
						onGetData(
							selectedpage + 1,
							tab,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							sort
						)
					}
					// disabled={parseInt(selectedpage) === parseInt(page)}
				>
					<GrNext />
				</button>
				<label className="p-1" htmlFor="">
					{/* of {page} */}
				</label>
			</div>
		</div>
	);
}

export default StockHistoryDetail;
