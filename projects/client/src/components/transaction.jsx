import { Card, Modal, Table } from "flowbite-react";
import {
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tab,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogCloseButton,
	AlertDialogFooter,
	Button,
} from "@chakra-ui/react";
import { SlClose } from "react-icons/sl";
import { useEffect, useState } from "react";
import REST_API from "../support/services/RESTApiService";
import keranjang_empty from "../support/assets/KeranjangKosong.jpg";
import { Toaster, toast } from "react-hot-toast";
import NoImage from "../support/assets/no_image.png";

export default function TransactionAdmin(props) {
	const [show, setShow] = useState(false);
	const [data, setdata] = useState();
	const [detail, setdetail] = useState();
	const [showAlert, setshowAlert] = useState(false);
	const [cancelAlert, setcancelAlert] = useState(false);
	const [sentAlert, setsentAlert] = useState(false);
	const [paymentProof, setpaymentProof] = useState();
	const [inv, setinv] = useState();

	const getTransaction = async () => {
		try {
			const { data } = await REST_API({
				url: "/adminTransaction/get",
				method: "GET",
			});
			const invoice = [];
			data.data.forEach((value, index) => {
				invoice.push(value.invoice);
			});
			setdata(data.data);
			getDetail(invoice);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error);
		}
	};

	const onProcess = async (invoice, payment_proof) => {
		setShow(true);
		setinv(invoice);
		setpaymentProof(payment_proof);
	};

	const onSent = async (invoice) => {
		setsentAlert(true);
		setinv(invoice);
	};

	const getSent = async () => {
		setsentAlert(false);
		try {
			const { data } = await REST_API({
				url: "/adminTransaction/sent",
				method: "PATCH",
				data: { invoice: inv },
			});
			toast.success(data.message);
			getTransaction();
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error);
		}
	};

	const getCanceled = async () => {
		setShow(false);
		setcancelAlert(false);
		setsentAlert(false);
		try {
			const { data } = await REST_API({
				url: "/adminTransaction/cancel",
				method: "PATCH",
				data: { invoice: inv },
			});
			toast.success(data.message);
			getTransaction();
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error);
		}
	};

	const getProcess = async () => {
		setShow(false);
		setshowAlert(false);

		try {
			const { data } = await REST_API({
				url: "/adminTransaction/process",
				method: "PATCH",
				data: { invoice: inv },
			});
			toast.success(data.message);
			getTransaction();
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error);
		}
	};

	const getDetail = async (inv) => {
		try {
			const { data } = await REST_API({
				url: "/adminTransaction/details",
				method: "POST",
				data: { invoice: inv },
			});

			setdetail(data.data);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error);
		}
	};

	useEffect(() => {
		getTransaction();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className=" py-10 h-fit px-8 mr-8">
			<div>
				<div className="mb-4 flex items-center justify-between">
					<h5 className="text-xl font-semibold font-tokpedFont">Transaction List</h5>
				</div>
				{data ? (
					<Tabs>
						<TabList
							display="flex"
							justifyContent="space-around"
							fontWeight={"semibold"}
							color={"#0095DA"}
						>
							<Tab fontSize={"20px"}>Waiting</Tab>
							<Tab fontSize={"20px"}>Process</Tab>
							<Tab fontSize={"20px"}>Done</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								{/* WAITING TAB START HERE */}
								<Tabs>
									<TabList fontWeight="semibold" color={"#38ADE3"} gap={5}>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Payment
										</Tab>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Approve
										</Tab>
									</TabList>
									<TabPanels>
										{/* WAITING PAYMENT START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "Waiting Payment" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" w-full h-[279px] overflow-y-auto">
																				<Table className="text-center">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "Waiting Payment" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className="pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-orange-400 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								{value.status}
																							</p>
																						</div>
																					</div>
																					<div className=" mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.{" "}
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* WAITING PAYMENT END HERE */}
										{/* WAITING APPROVE START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "Waiting Approval" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" h-[375px] w-full overflow-y-auto">
																				<Table className="text-center w-full">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "Waiting Approval" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>{" "}
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className=" pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-yellow-400 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								{value.status}
																							</p>
																						</div>
																					</div>
																					<div className="mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																						<div className=" mt-6">
																							{props.state.profile?.role ===
																							"super admin" ? null : (
																								<button
																									onClick={() =>
																										onProcess(value.invoice, value.payment_proof)
																									}
																									className=" hover:bg-gray-300 text-center w-full bg-yellow-400 rounded-full text-white font-tokpedFont font-semibold p-3"
																								>
																									Check Payment
																								</button>
																							)}
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* WAITING APPROVE END HERE */}
									</TabPanels>
								</Tabs>
								{/* WAITING TAB END HERE */}
							</TabPanel>
							<TabPanel>
								{/* PROCESS TAB START HERE */}
								<Tabs>
									<TabList fontWeight="semibold" color={"#38ADE3"} gap={5}>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Packing
										</Tab>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Sending
										</Tab>
									</TabList>
									<TabPanels>
										{/* PACKING ORDER START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "On Process" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" h-[375px] w-full overflow-y-auto">
																				<Table className="text-center">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "On Process" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>{" "}
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className=" pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-blue-400 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								Packing Orders
																							</p>
																						</div>
																					</div>
																					<div className="mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																						<div className=" mt-6">
																							{props.state.profile?.role ===
																							"super admin" ? null : (
																								<button
																									onClick={() => onSent(value.invoice)}
																									className=" hover:bg-gray-300 text-center w-full bg-blue-400 rounded-full text-white font-tokpedFont font-semibold p-3"
																								>
																									Send Order
																								</button>
																							)}
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* PACKING ORDER END HERE */}
										{/* SENDING ORDER START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "Sent" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" w-full h-[279px] overflow-y-auto">
																				<Table className="text-center">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "Sent" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className="pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-cyan-600 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								Sending Orders
																							</p>
																						</div>
																					</div>
																					<div className=" mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.{" "}
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* SENDING ORDER END HERE */}
									</TabPanels>
								</Tabs>
								{/* PROCESS TAB END HERE */}
							</TabPanel>
							<TabPanel>
								{/* DONE TAB START HERE */}
								<Tabs>
									<TabList fontWeight="semibold" color={"#38ADE3"} gap={5}>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Delivered
										</Tab>
										<Tab
											mb={2}
											_selected={{ bg: "#38ADE3", color: "white", borderRadius: "md" }}
											fontSize={"16px"}
										>
											Canceled
										</Tab>
									</TabList>
									<TabPanels>
										{/* DELIVERED START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "Delivered" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" w-full h-[279px] overflow-y-auto">
																				<Table className="text-center">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "Delivered" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className="pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-green-600 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								{value.status}
																							</p>
																						</div>
																					</div>
																					<div className=" mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* DELIVERED END HERE */}
										{/* CANCELED START HERE */}
										<TabPanel>
											{data?.map((value, index) => {
												return (
													<>
														{value.status === "Canceled" ? (
															<>
																<div className=" border-b-8 pb-5 mb-5">
																	<Card>
																		<div className=" font-tokpedFont gap-10 flex justify-between pb-8 border-b">
																			<div className=" w-full h-[279px] overflow-y-auto">
																				<Table className="text-center">
																					<Table.Head>
																						<Table.HeadCell>Product Name</Table.HeadCell>
																						<Table.HeadCell>Quantity</Table.HeadCell>
																						<Table.HeadCell>Price</Table.HeadCell>
																						<Table.HeadCell>Total Price</Table.HeadCell>
																						<Table.HeadCell>Discount</Table.HeadCell>
																					</Table.Head>
																					<Table.Body>
																						{detail?.map((val, idx) => {
																							return (
																								<>
																									{val.invoice === value.invoice &&
																									value.status === "Canceled" ? (
																										<Table.Row>
																											<Table.Cell className=" flex flex-row gap-3 justify-start items-center">
																												<img
																													alt="product_image"
																													src={val.product.img}
																													className=" h-[60px] w-[60px] rounded-full"
																												/>
																												<p>{val.product_name}</p>{" "}
																											</Table.Cell>
																											<Table.Cell>{val.qty}</Table.Cell>
																											<Table.Cell>
																												Rp. {val.product.price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												Rp. {val.total_price.toLocaleString()}
																											</Table.Cell>
																											<Table.Cell>
																												{val.discount_history === null
																													? "-"
																													: val.discount_history.discount.name}
																											</Table.Cell>
																										</Table.Row>
																									) : null}
																								</>
																							);
																						})}
																					</Table.Body>
																				</Table>
																			</div>
																			<div className="">
																				<div className="pt-2 font-tokpedFont font-semibold">
																					<div className="">
																						<p className=" font-semibold font-tokpedFont text-[14px]">
																							{value.invoice}
																						</p>
																						<div className=" flex gap-2 items-center">
																							<p className="font-tokpedFont font-semibold text-[14px]">
																								Status :
																							</p>{" "}
																							<p className="  text-white bg-red-600 font-tokpedFont rounded-full text-[12px] font-semibold p-1">
																								{value.status}
																							</p>
																						</div>
																					</div>
																					<div className=" mt-4">
																						<p>Courier</p>
																						<div className=" flex justify-between mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																							<div className=" text-left ">
																								<p className=" font-bold font-tokpedFont text-[12px]">
																									{value.courier.split("+")[0]} -{" "}
																									{value.courier.split("+")[1]}
																								</p>
																								<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																									Estimasi{" "}
																									{value.courier.split("+")[0] === "POS"
																										? value.courier.split("+")[2].split(" ")[0]
																										: value.courier.split("+")[2]}{" "}
																									Hari
																								</p>
																							</div>
																							<p className=" text-[14px] font-semibold font-tokpedFont">
																								Rp. {value.shipping_cost.toLocaleString()}
																							</p>
																						</div>
																						<div className=" mt-4">
																							<p>Total Payment</p>
																							<div className=" text-right flex mt-3 w-[270px] h-[60px] px-[15px] py-3 items-center border rounded-lg">
																								<p className=" font-tokpedFont font-semibold text-[18px]">
																									Rp.
																									{(
																										Number(value.total_price) + value.shipping_cost
																									).toLocaleString()}
																								</p>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Card>
																</div>
															</>
														) : null}
													</>
												);
											})}
										</TabPanel>
										{/* CANCELED END HERE */}
									</TabPanels>
								</Tabs>
								{/* DONE TAB END HERE */}
							</TabPanel>
						</TabPanels>
					</Tabs>
				) : (
					<div className="mt-[71px] h-fit flex flex-col justify-center items-center w-full">
						<img alt="Keranjang Kosong" className=" h-[141px] w-[200px]" src={keranjang_empty} />
						<h1 className=" font-tokpedFont font-semibold text-[24px] mt-5  ">
							Wow, your Transaction is empty
						</h1>
						<p className=" text-slate-400 font-tokpedFont text-[14px] mt-2 ">
							Let's Make a Promo Discount and Steal Attention User!
						</p>
					</div>
				)}
				<Modal show={show} size="md" popup={true} onClose={() => setShow(false)}>
					<div className=" flex justify-center items-center p-5">
						{paymentProof === null ? (
							<img alt="NoImage" src={NoImage} />
						) : (
							<img alt="Payment Proof" src={`http://jcwd230202.purwadhikabootcamp.com/${paymentProof}`} />
						)}
					</div>
					<div className=" flex justify-center pb-5 gap-4">
						<button
							onClick={() => setshowAlert(true)}
							className=" border rounded-full p-2 bg-green-400 text-white font-tokpedFont font-semibold hover:bg-gray-300"
						>
							Accept Order
						</button>
						<button
							onClick={() => setcancelAlert(true)}
							className=" border rounded-full p-2 bg-red-400 text-white font-tokpedFont font-semibold hover:bg-gray-300"
						>
							Cancel Order
						</button>
					</div>
					<div className=" flex justify-center pb-5">
						<button>
							<SlClose size={25} onClick={() => setShow(false)} />
						</button>
					</div>
				</Modal>
				{/* ACCEPT ORDER ALERT */}
				<AlertDialog
					motionPreset="slideBottom"
					onClose={() => setshowAlert(false)}
					isOpen={showAlert}
					isCentered
				>
					<AlertDialogOverlay />
					<AlertDialogContent>
						<AlertDialogHeader>Are You Sure To Process This Order ?</AlertDialogHeader>
						<AlertDialogCloseButton />
						<AlertDialogFooter className=" flex justify-evenly gap-5">
							<Button
								className=" w-full"
								textColor={"#0095DA"}
								borderColor="#0095DA"
								onClick={() => setshowAlert(false)}
							>
								No
							</Button>
							<Button className=" w-full" colorScheme={"twitter"} onClick={() => getProcess()}>
								Yes
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				{/* ACCEPT ORDER ALERT */}
				{/* CANCEL ORDER ALERT */}
				<AlertDialog
					motionPreset="slideBottom"
					onClose={() => setcancelAlert(false)}
					isOpen={cancelAlert}
					isCentered
				>
					<AlertDialogOverlay />
					<AlertDialogContent>
						<AlertDialogHeader>Are You Sure To Cancel This Order ?</AlertDialogHeader>
						<AlertDialogCloseButton />
						<AlertDialogFooter className=" flex justify-evenly gap-5">
							<Button
								className=" w-full"
								textColor={"#0095DA"}
								borderColor="#0095DA"
								onClick={() => setcancelAlert(false)}
							>
								No
							</Button>
							<Button className=" w-full" colorScheme={"twitter"} onClick={() => getCanceled()}>
								Yes
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				{/* CANCEL ORDER ALERT */}
				{/* SEND ORDER ALERT */}
				<AlertDialog
					motionPreset="slideBottom"
					onClose={() => setsentAlert(false)}
					isOpen={sentAlert}
					isCentered
				>
					<AlertDialogOverlay />
					<AlertDialogContent>
						<AlertDialogHeader>Are You Sure To Send This Order ?</AlertDialogHeader>
						<AlertDialogCloseButton />
						<AlertDialogFooter className=" flex justify-evenly gap-5">
							<Button
								className=" w-full"
								textColor={"#0095DA"}
								borderColor="#0095DA"
								onClick={() => setcancelAlert(true)}
							>
								Cancel Order
							</Button>
							<Button className=" w-full" colorScheme={"twitter"} onClick={() => getSent()}>
								Send Order
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				{/* SEND ORDER ALERT */}
			</div>
			<Toaster />
		</div>
	);
}
