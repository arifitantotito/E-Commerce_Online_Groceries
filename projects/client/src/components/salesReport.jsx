import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { GrNext, GrPrevious } from "react-icons/gr";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Table } from "flowbite-react";
import { Empty, Modal, Button, Divider, Card, DatePicker } from "antd";
import REST_API from "../support/services/RESTApiService";
const { RangePicker } = DatePicker;

function SalesReport() {
	const [selectedpage, setselectedpage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sort, setSort] = useState("");
	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const [transactionDetail, setTransactionDetail] = useState();
	let sum = 0;
	// transaction
	const [dataTransaction, setDataTransaction] = useState([]);

	// User
	const [dataUser, setDataUser] = useState([]);

	// product
	const [dataProduct, setDataProduct] = useState([]);
	// const [date, setDate] = useState({
	// 	from: "",
	// 	to: "",
	// });
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");

	const tabsRef = useRef();

	let onGetData = async (page, filter, sort) => {
		try {
			let responseTransaction = await REST_API({
				url: `/admin/sales-report?report=transaction&page=${page}&filter=${filter}&sort=${sort}`,
				method: "GET",
			});

			let responseProduct = await REST_API({
				url: `/admin/sales-report?report=product&page=${page}&filter=${filter}&sort=${sort}`,
				method: "GET",
			});

			let responseUser = await REST_API({
				url: `/admin/sales-report?report=user&page=${page}&filter=${filter}&sort=${sort}`,
				method: "GET",
			});

			setDataTransaction(responseTransaction.data.data);
			setDataProduct(responseProduct.data.data);
			setDataUser(responseUser.data.data);
			setselectedpage(page);

			console.log(responseTransaction.data.data, "trans");
			console.log(responseProduct.data.data, "");
			console.log(responseUser.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	let onGetDetailTransaction = async (invoiceNumber) => {
		try {
			const { data } = await REST_API({
				url: `/admin/sales-report-detail?invoice=${invoiceNumber}`,
				method: "GET",
			});

			setTransactionDetail(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		onGetData(1, ``, "");
	}, []);

	return (
		<div className="bg-white ">
			<div>
				<div className="flex justify-between  h-12  items-center">
					<div className="flex items-center gap-3">
						<RangePicker
							onChange={(date) => {
								setDateFrom(date[0].toISOString().split("T")[0]);
								setDateTo(date[1].toISOString().split("T")[0]);
							}}
						/>
					</div>
					<div className="flex items-center gap-3">
						<h1>Sort</h1>
						<select
							onChange={(e) => {
								onGetData(
									selectedpage,
									dateFrom === "" && dateTo === ""
										? ""
										: `${dateFrom}/${dateTo}`,
									e.target.value
								);
								setSort(e.target.value);
							}}
							className=" w-24 bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-9	"
						>
							<option selected>sort by</option>
							<option value="date-asc">date ascending</option>
							<option value="date-desc">date descending</option>
							<option value="income-asc">income ascending</option>
							<option value="income-desc">income descending</option>
						</select>
					</div>
				</div>
			</div>
			<div className="mt-10"></div>

			<div>
				<Tabs.Group
					aria-label="Default tabs"
					style="underline"
					ref={tabsRef}
					onActiveTabChange={(tab) => {
						onGetData(
							1,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							""
						);
					}}
				>
					<Tabs.Item active title="Transaction">
						<div className="">
							{dataTransaction ? (
								<Table>
									<Table.Head>
										<Table.HeadCell>ID</Table.HeadCell>
										{/* <Table.HeadCell>Product name</Table.HeadCell> */}
										<Table.HeadCell>Quantity</Table.HeadCell>
										<Table.HeadCell>Invoice</Table.HeadCell>
										<Table.HeadCell>Date</Table.HeadCell>
									</Table.Head>

									{dataTransaction.length !== 0 ? (
										dataTransaction.map((value, index) => {
											return (
												<Table.Body className="divide-y">
													<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
														<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
															{value.id ? value.id : value.transaction_id}
														</Table.Cell>
														{/* <Table.Cell>{value.product_name}</Table.Cell> */}
														<Table.Cell>
															{value.qty ? value.qty : value.total_qty}
														</Table.Cell>
														<Table.Cell>
															<Button
																className="bg-white text-black"
																type="primary"
																onClick={() => {
																	onGetDetailTransaction(value.invoice);
																	showModal();
																}}
															>
																{value.invoice}
															</Button>
														</Table.Cell>
														<Table.Cell>
															{new Date(value.createdAt).toUTCString()}
														</Table.Cell>
													</Table.Row>
												</Table.Body>
											);
										})
									) : (
										<Table.Body className="divide-y">
											<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
												<Table.Cell className="text-center">
													<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
												</Table.Cell>
											</Table.Row>
										</Table.Body>
									)}
								</Table>
							) : null}
						</div>
					</Tabs.Item>
					<Tabs.Item title="User">
						<div>
							{dataUser ? (
								<Table>
									<Table.Head>
										<Table.HeadCell>ID</Table.HeadCell>
										<Table.HeadCell>Username</Table.HeadCell>
										<Table.HeadCell>Total Income</Table.HeadCell>
									</Table.Head>

									{dataUser.length !== 0 ? (
										dataUser.map((value, index) => {
											return (
												<Table.Body className="divide-y">
													<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
														<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
															{value.user_id}
														</Table.Cell>
														<Table.Cell>{value.user.name}</Table.Cell>
														<Table.Cell> {value.total_price}</Table.Cell>
													</Table.Row>
												</Table.Body>
											);
										})
									) : (
										<Table.Body className="divide-y">
											<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
												<Table.Cell className="text-center">
													<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
												</Table.Cell>
											</Table.Row>
										</Table.Body>
									)}
								</Table>
							) : null}
						</div>
					</Tabs.Item>
					<Tabs.Item title="Product">
						<div>
							{dataProduct ? (
								<Table>
									<Table.Head>
										<Table.HeadCell>Product name</Table.HeadCell>
										<Table.HeadCell>Quantity Sold</Table.HeadCell>
										<Table.HeadCell>Total Income</Table.HeadCell>
										<Table.HeadCell>Location</Table.HeadCell>
									</Table.Head>

									{dataProduct.length !== 0 ? (
										dataProduct.map((value, index) => {
											return (
												<Table.Body className="divide-y">
													<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
														<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
															{value.product_name}
														</Table.Cell>
														<Table.Cell>{value.qty_sold}</Table.Cell>
														<Table.Cell> {value.income_money}</Table.Cell>
														<Table.Cell>{value.branch.location}</Table.Cell>
													</Table.Row>
												</Table.Body>
											);
										})
									) : (
										<Table.Body className="divide-y">
											<Table.Row className=" dark:border-gray-700 dark:bg-gray-800 col-span-full w-full">
												<Table.Cell className="text-center  " colSpan="full">
													<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
												</Table.Cell>
											</Table.Row>
										</Table.Body>
									)}
								</Table>
							) : null}
						</div>
					</Tabs.Item>
				</Tabs.Group>
			</div>
			<div className="mt-24 flex justify-center items-center my-5 pb-10 ">
				<label className="p-1">page</label>
				<button
					className="bg-[#0095DA] !text-white border-y-[1px] border-l-[1px] p-2 rounded-l-lg"
					onClick={() =>
						onGetData(
							selectedpage - 1,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							sort
						)
					}
					disabled={parseInt(selectedpage) === 1}
				>
					<GrPrevious className="!text-white" />
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
					className="bg-[#0095DA] !text-white  border-y-[1px] border-r-[1px] p-2 rounded-r-lg"
					onClick={() =>
						onGetData(
							selectedpage + 1,
							dateFrom === "" && dateTo === "" ? "" : `${dateFrom}/${dateTo}`,
							sort
						)
					}
					// disabled={parseInt(selectedpage) === parseInt(page)}
				>
					<GrNext className="!text-white" />
				</button>
				<label className="p-1" htmlFor="">
					{/* of {page} */}
				</label>
			</div>
			<div>
				<Modal
					title="Transaction Detail"
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					width={900}
				>
					{transactionDetail ? (
						<div>
							<div className="">
								<div className="font-bold">Selesai</div>
								<Divider dashed />
								<div className="flex justify-between">
									<div>Invoice Number</div>
									<div className="text-[#0095DA]">
										{transactionDetail[0].invoice}
									</div>
								</div>
								<div className="flex justify-between">
									<div>Tanggal Pembelian</div>
									<div>
										{new Date(transactionDetail[0].createdAt).toLocaleString(
											"id-ID",
											{ timeZone: "Asia/Jakarta" }
										)}
									</div>
								</div>
							</div>
							<Divider />
							<div>
								<div>
									<h1>Detail Product</h1>
								</div>
								<div className="pt-10">
									{transactionDetail.map((value, index) => {
										{
											sum += value.total_price;
										}

										return (
											<Card>
												<div className="flex justify-between">
													<div>
														<img
															className="w-[100px] h-[100px]"
															src={value.product.img}
															alt=""
														/>
													</div>

													<div>
														<h1 className="font-semibold">
															{value.product.name}
														</h1>
														<h1>
															{value.qty} X Rp
															{value.product.price.toLocaleString("id-ID")}
														</h1>
														<h1>
															Total Rp
															{value.total_price.toLocaleString("id-ID")}
														</h1>
													</div>
												</div>
											</Card>
										);
									})}
								</div>
								<div className="flex flex-row justify-end gap-2 text-xl">
									<div>Total Belanja:</div>
									<div>Rp.{sum.toLocaleString("id-ID")}</div>
								</div>
							</div>
						</div>
					) : null}
				</Modal>
			</div>
		</div>
	);
}

export default SalesReport;
