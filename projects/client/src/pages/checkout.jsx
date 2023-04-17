import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
} from "@chakra-ui/react";
import { Button, Modal, Label, TextInput, Checkbox, Spinner, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import LoadingSpin from "react-loading-spin";
import { useNavigate } from "react-router-dom";
import FooterBar from "../components/footer";
import REST_API from "../support/services/RESTApiService";

export default function Checkout(props) {
	const [data, setdata] = useState();
	const [disable, setdisable] = useState(false);
	const [sum, setsum] = useState(0);
	const [weight, setweight] = useState(0);
	const [origin, setorigin] = useState(0);
	const [destination, setdestination] = useState(0);
	const [costs, setcosts] = useState(0);
	const [JNE, setJNE] = useState();
	const [POS, setPOS] = useState();
	const [TIKI, setTIKI] = useState();
	const [courier, setcourier] = useState();
	const [branch_id, setbranch_id] = useState();
	const [product_name, setproduct_name] = useState();
	const [qty, setqty] = useState();
	const [total_price, settotal_price] = useState();
	const [product_id, setproduct_id] = useState();
	const [discount_history_id, setdiscount_history_id] = useState();
	const [disablePayment, setdisablePayment] = useState();
	const [address, setaddress] = useState();
	const [rakir, setrakir] = useState({
		province: null,
		city: null,
		main_address: false,
	});
	const [show, setshow] = useState({
		changeAddress: false,
		addAddress: false,
	});

	const { register, handleSubmit, setValue } = useForm();

	const Navigate = useNavigate();

	let onGetCart = async () => {
		try {
			let { data } = await REST_API({
				url: "/cart/get",
				method: "GET",
			});
			let total = 0;
			let berat = 0;
			let product_name = [];
			let qty = [];
			let total_price = [];
			let product_id = [];
			let discount_history = [];
			data.data.forEach((value, index) => {
				berat += value.qty * 100;
				product_name.push(value.product.name);
				qty.push(value.qty);
				product_id.push(value.product_id);
				if (value.product.discount_histories[0]) {
					discount_history.push(value.product?.discount_histories[0]?.id);
					if (value.product?.discount_histories[0]?.discount_id === 1) {
						total += value.product.price * (value.qty - Math.floor(value.qty / 2));
						total_price.push(value.product.price * (value.qty - Math.floor(value.qty / 2)));
					} else if (
						value.product?.discount_histories[0]?.discount_id === 2 &&
						value.qty >= value.product?.discount_histories[0]?.min_purchase
					) {
						total +=
							value.total_price -
							value.product.price *
								value.qty *
								(value.product?.discount_histories[0]?.percent / 100);
						total_price.push(
							value.total_price -
								value.product.price *
									value.qty *
									(value.product?.discount_histories[0]?.percent / 100)
						);
					} else if (value.product?.discount_histories[0]?.discount_id === 3) {
						total +=
							value.total_price -
							value.product.price *
								value.qty *
								(value.product?.discount_histories[0]?.percent / 100);
						total_price.push(
							value.total_price -
								value.product.price *
									value.qty *
									(value.product?.discount_histories[0]?.percent / 100)
						);
					} else {
						total += value.total_price;
						total_price.push(value.total_price);
					}
				} else {
					discount_history.push(null);
					total_price.push(value.total_price);
					total += value.total_price;
				}
			});
			setdiscount_history_id(discount_history);
			setbranch_id(data.data[0].branch_id);
			setproduct_name(product_name);
			setqty(qty);
			settotal_price(total_price);
			setproduct_id(product_id);
			setsum(total);
			setweight(berat);
			setdata(data.data);
			setorigin(data.data[0].branch.city_code.split(".")[0]);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	let getCourier = async () => {
		setdisable(true);
		try {
			let jne = await REST_API({
				url: "/courier/costJNE",
				method: "POST",
				data: { origin: origin, destination: destination, weight: weight },
			});
			setJNE(jne.data.data[0].costs);

			let pos = await REST_API({
				url: "/courier/costPOS",
				method: "POST",
				data: { origin: origin, destination: destination, weight: weight },
			});
			setPOS(pos.data.data[0].costs);

			let tiki = await REST_API({
				url: "/courier/costTIKI",
				method: "POST",
				data: { origin: origin, destination: destination, weight: weight },
			});
			setTIKI(tiki.data.data[0].costs);

			setTimeout(() => {
				setdisable(false);
			}, 1000);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	let onSelectedCourier = async (value) => {
		setcosts(Number(value.split("+")[3]));
		setcourier(value);
	};

	const deleteAddress = async (id) => {
		try {
			await REST_API({
				url: `/user/delete-address/${id}`,
				method: "DELETE",
			});
			props.func.getProfile();
			toast.success("Address deleted");
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	const makeDefault = async (id) => {
		try {
			await REST_API({
				url: `/user/main-address/${id}`,
				method: "PATCH",
			});
			props.func.getProfile();
			toast.success("Main address updated");
			setaddress("");
			setdestination(0);
			onGetCart()
			setshow({ ...show, changeAddress: false });
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	const addAddress = async () => {
		setshow({ ...show, addAddress: true, changeAddress: false });
		rakirProvince();
	};
	const rakirProvince = async () => {
		try {
			const { data } = await REST_API({
				url: "/user/rakir-province",
				method: "GET",
			});
			setrakir({ ...rakir, province: data.data });
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};
	const rakirCity = async (province) => {
		try {
			const { data } = await REST_API({
				url: `/user/rakir-city?province=${province}`,
				method: "GET",
			});
			setrakir({ ...rakir, city: data.data });
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};
	const onSubmitAddAddress = async (data) => {
		setshow({ ...show, loading: true });
		try {
			await REST_API.post("/user/add-address", {
				city: data.city,
				province: data.province,
				address: data.address,
				receiver_name: data.receiver_name,
				receiver_phone: data.receiver_phone,
				main_address: rakir.main_address,
			});
			props.func.getProfile();
			toast.success("Address added");
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		} finally {
			setshow({ ...show, loading: false, addAddress: false });
		}
	};

	const selectedAddress = async (value) => {
		setaddress(value);
		let dest = value.city.split(".")[0];
		setdestination(dest);
		setcourier("")
		setcosts(0)
		onGetCart()
		setshow({ ...show, changeAddress: false });
	};

	const selectedMainAddress = async () => {
		setaddress("");
		setdestination(0);
		setcourier("")
		setcosts(0)
		onGetCart()
		setshow({ ...show, changeAddress: false });
	};

	const onSubmit = async () => {
		setdisablePayment(true);
		try {
			const { data } = await REST_API.post("/transaction/add", {
				product_name: product_name,
				qty: qty,
				total_price: total_price,
				user_address: address
					? address.address
					: props.state.profile.address?.main_address[0]?.address,
				courier: courier,
				branch_id: branch_id,
				product_id: product_id,
				shipping_cost: costs,
				discount_history_id: discount_history_id,
			});
			toast.success(data.message);
			setTimeout(() => {
				Navigate("/uploadpayment");
			}, 3000);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
			toast.error(error.response.data.message);
		} finally {
			setdisablePayment(false);
		}
	};

	useEffect(() => {
		onGetCart();
	}, []);

	return (
		<div className=" max-w-screen h-max pb-10 flex justify-center flex-col">
			<div className=" w-screen border-b">
				<div className="mx-auto flex justify-start items-center w-[1120px] h-[60px] font-mandalaFont text-[#0095DA] font-bold text-3xl ">
					<button onClick={() => Navigate("/home")}>tokonglomerat</button>
				</div>
			</div>
			<div className=" mx-auto flex px-5 w-[1120px]">
				<div className=" w-[685px]">
					<div className="mt-10 font-tokpedFont text-[20px] font-bold">Checkout</div>
					<div className="flex justify-start h-[31px] items-start border-b mt-[29px] font-tokpedFont font-semibold text-[14px] w-[685px] ">
						Shipping Address
					</div>
					<div className=" h-fitt py-4 border-b">
						<div className="flex gap-2">
							<p className=" font-semibold font-tokpedFont text-[13px]">
								{address
									? address.receiver_name
									: props.state.profile.address?.main_address[0]?.receiver_name}
							</p>
							{address ? null : (
								<p className=" h-5 w-fitt p-1 text-[10px] flex justify-center items-center rounded-sm font-mandala font-extrabold bg-green-200 text-[#03ac0e]">
									Main Address
								</p>
							)}
						</div>
						<div className=" mt-1 font-tokpedFont font-normal text-[13px]">
							{address
								? address.receiver_phone
								: props.state.profile.address?.main_address[0]?.receiver_phone}
						</div>
						<div className=" mt-1 font-tokpedFont text-slate-500 font-normal text-[13px]">
							{address
								? `${address.address}, ${address.city.split(".")[1]}, ${
										address.province.split(".")[1]
								  }`
								: `${props.state.profile.address?.main_address[0]?.address}, ${
										props.state.profile.address?.main_address[0]?.city.split(".")[1]
								  }, ${props.state.profile.address?.main_address[0]?.province.split(".")[1]}`}
						</div>
					</div>
					<div className=" flex justify-between items-center h-fitt py-4 border-b-4">
						<button
							onClick={() => setshow({ ...show, changeAddress: true })}
							className=" font-semibold text-[14px] bg-[#0095DA] text-white font-tokpedFont flex justify-center px-4 h-10 w-fit border rounded-lg items-center tracking-wide "
						>
							Choose Another Address
						</button>
						<div className=" w-[306px]">
							<Accordion className=" rounded-lg" allowToggle>
								<AccordionItem>
									<AccordionButton
										_hover={"none"}
										bg="#0095DA"
										borderRadius={"md"}
										textColor="white"
										className=" font-tokpedFont"
										disabled={disable}
										onClick={() => getCourier()}
									>
										<Box as="span" flex="1" textAlign="left">
											Select Courier
										</Box>
										<AccordionIcon />
									</AccordionButton>
									<AccordionPanel className=" max-h-[150px] overflow-y-scroll">
										{JNE
											? JNE.map((value, index) => {
													return (
														<AccordionItem>
															<AccordionButton w="258px">
																<button
																	key={index}
																	disabled={disable}
																	value={
																		value.cost[0]
																			? `JNE+${value.service}+${value.cost[0].etd}+${value.cost[0].value}`
																			: null
																	}
																	onClick={(e) => onSelectedCourier(e.target.value)}
																	className=" flex justify-between w-[270px] h-[60px] pt-3"
																>
																	<div className=" text-left ">
																		<p className=" font-bold font-tokpedFont text-[12px]">{`JNE-${value.service}`}</p>
																		<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																			{`Estimasi ${value.cost[0].etd} Hari`}
																		</p>
																	</div>
																	<div>{`Rp. ${value.cost[0]?.value.toLocaleString()}`}</div>
																</button>
															</AccordionButton>
														</AccordionItem>
													);
											  })
											: null}
										{POS
											? POS.map((value, index) => {
													return (
														<AccordionItem>
															<AccordionButton w="258px">
																<button
																	key={index}
																	disabled={disable}
																	value={
																		value.cost[0]
																			? `POS+${value.service}+${value.cost[0].etd}+${value.cost[0].value}`
																			: null
																	}
																	onClick={(e) => onSelectedCourier(e.target.value)}
																	className=" flex justify-between h-[60px] w-[270px] pt-3"
																>
																	<div className=" text-left ">
																		<p className=" font-bold font-tokpedFont text-[12px]">{`POS-${
																			value.service.split(" ")[1]
																		}`}</p>
																		<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																			{`Estimasi ${value.cost[0].etd.split(" ")[0]} Hari`}
																		</p>
																	</div>
																	<div>{`Rp. ${value.cost[0]?.value.toLocaleString()}`}</div>
																</button>
															</AccordionButton>
														</AccordionItem>
													);
											  })
											: null}
										{TIKI ? (
											TIKI.map((value, index) => {
												return (
													<AccordionItem>
														<AccordionButton w="258px">
															<button
																key={index}
																disabled={disable}
																value={
																	value.cost[0]
																		? `TIKI+${value.service}+${value.cost[0].etd}+${value.cost[0].value}`
																		: null
																}
																onClick={(e) => onSelectedCourier(e.target.value)}
																className=" flex justify-between h-[60px] w-[270px] pt-3"
															>
																<div className=" text-left ">
																	<p className=" font-bold font-tokpedFont text-[12px]">{`TIKI-${value.service}`}</p>
																	<p className=" font-tokpedFont text-slate-500 text text-[12px]">
																		{`Estimasi ${value.cost[0].etd} Hari`}
																	</p>
																</div>
																<div>{`Rp. ${value.cost[0]?.value.toLocaleString()}`}</div>
															</button>
														</AccordionButton>
													</AccordionItem>
												);
											})
										) : (
											<div className=" flex justify-center items-center">
												<LoadingSpin
													size={"20px"}
													primaryColor={"#0095DA"}
													secondaryColor={"white"}
												/>
											</div>
										)}
									</AccordionPanel>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
					{data
						? data.map((value, index) => {
								return (
									<>
										{/* ORDER START HERE */}
										<div className=" mt-4 font-tokpedFont font-semibold text-[14px]">
											Order {index + 1}
										</div>
										<div className=" font-tokpedFont h-fit pt-4 border-b-4">
											<div className=" font-semibold text-[14px] h-[46px] flex justify-start items-center ">
												Toko {value.branch.location}
											</div>
											<div className=" h-[156px] flex justify-between flex-row pt-5 border-b">
												<div className=" h-[135px] w-[364px] flex ">
													<img
														alt="Image_Product"
														className=" h-[60px] w-[60px]"
														src={value.product.img}
													/>
													<div className=" h-[93px] my-[7px] ">
														<p className=" pl-[15px] font-tokpedFont text-[14px]">
															{value.product.name}
														</p>
														<p className=" pl-[15px] flex gap-1 font-tokpedFont text-[12px]">
															per{" "}
															<p className=" font-semibold">
																{value.product.unit.price_at} {value.product.unit.name}
															</p>
														</p>
														<p className=" pl-[15px] font-semibold font-tokpedFont text-[14px]">
															Rp. {value.product.price.toLocaleString()}
														</p>

														<p className=" pl-[15px] flex gap-1 font-tokpedFont text-[14px]">
															Quantity :
															<p className=" font-tokpedFont font-semibold text-[14px]">
																{value.qty}
															</p>
														</p>
													</div>
												</div>
												{value.product.discount_histories[0] ? (
													value.qty >= value.product.discount_histories[0].min_purchase ? (
														<div className=" flex gap-2 items-end mb-2">
															<p className=" font-tokpedFont font-semibold text-[14px]">Promo :</p>
															<p className=" font-tokpedFont font-semibold text-[12px] rounded-md bg-green-400 text-white p-1 ">
																{value.product.discount_histories.map((value, index) => {
																	return (
																		<>
																			{value.discount_id === 1
																				? `${value.discount.name}`
																				: value.discount_id === 2
																				? `${value.discount.name} ${value.min_purchase}`
																				: value.discount_id === 3
																				? `${value.discount.name} ${value.percent}%`
																				: null}
																		</>
																	);
																})}
															</p>
														</div>
													) : null
												) : null}
											</div>
											<div className=" h-14 my-[6px] flex justify-between items-center">
												<p className=" font-semibold text-[14px]">Subtotal</p>
												<div className=" flex flex-row gap-2">
													{value.product.discount_histories[0] ? (
														value.qty >= value.product.discount_histories[0].min_purchase ? (
															<>
																{value.product.discount_histories.map((val, idx) => {
																	return val.discount_id === 1 ? (
																		<>
																			<p className=" line-through font-semibold text-[14px]">
																				Rp. {(value.product.price * value.qty).toLocaleString()}{" "}
																			</p>
																			<p className=" font-semibold text-[14px]">
																				Rp.
																				{(
																					value.product.price *
																					(value.qty - Math.floor(value.qty / 2))
																				).toLocaleString()}{" "}
																			</p>
																		</>
																	) : val.discount_id === 2 || val.discount_id === 3 ? (
																		<>
																			<p className=" line-through font-semibold text-[14px]">
																				Rp. {(value.product.price * value.qty).toLocaleString()}{" "}
																			</p>
																			<p className=" font-semibold text-[14px]">
																				Rp.{" "}
																				{(
																					value.total_price -
																					value.product.price * value.qty * (val.percent / 100)
																				).toLocaleString()}{" "}
																			</p>
																		</>
																	) : null;
																})}
															</>
														) : (
															<p className=" font-semibold text-[14px]">
																Rp. {(value.product.price * value.qty).toLocaleString()}{" "}
															</p>
														)
													) : (
														<p className=" font-semibold text-[14px]">
															Rp. {(value.product.price * value.qty).toLocaleString()}{" "}
														</p>
													)}
												</div>
											</div>
										</div>
										{/* ORDER END HERE */}
									</>
								);
						  })
						: null}
				</div>
				<div className=" font-tokpedFont w-[350px] h-fit ml-[45px] mt-[99px] px-4 py-4 rounded-lg border shadow-xl">
					<p className=" font-semibold text-[14px]">Shopping Summary</p>
					<div className=" h-fit my-4 flex justify-between">
						<div>
							<p className=" text-[14px] ">Total price ({data ? data.length : null} Products)</p>
							{costs ? <p className=" mt-2 text-[14px] ">Shipping Cost </p> : null}
						</div>
						<div>
							<p className=" flex gap-1 text-[14px]">Rp. {sum.toLocaleString()} </p>
							{costs  ? <p className=" mt-2 text-[14px]">Rp. {costs.toLocaleString()}</p> : null}
						</div>
					</div>
					<div className=" border-t flex justify-between h-[37px] items-end ">
						<p className=" font-semibold text-[16px] ">Total Bill</p>
						<p className=" font-semibold text-[16px] ">Rp. {(sum + costs).toLocaleString()}</p>
					</div>
					<p className=" mt-4 text-slate-500 text-[11px]">
						Dengan mengaktifkan asuransi, Saya menyetujui{" "}
						<p className=" text-red-700">syarat dan ketentuan yang berlaku.</p>
					</p>
					{!courier ? (
						<p className=" mt-2 text-red-700 text-[12px] font-tokpedFont font-semibold">
							*Please Input Your Courier Methode {" "}
						</p>
					) : null}
					<button
						disabled={!courier ? true : false}
						onClick={() => onSubmit()}
						className=" mt-6 h-12 w-full text-white bg-[#0095DA] rounded-lg "
					>
						{disablePayment ? (
							<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
						) : (
							"Pay Bill"
						)}
					</button>
				</div>
			</div>
			{/* ---------------------------------------------------------MODAL-----------------------------------------------------------------------------------------------------------------------  */}
			<Modal
				show={show.addAddress}
				size="md"
				popup={true}
				onClose={() => setshow({ ...show, addAddress: false, changeAddress: true })}
				id="name modal"
				className="z-50"
			>
				<Modal.Header />
				<Modal.Body>
					<form
						onSubmit={handleSubmit(onSubmitAddAddress)}
						className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
					>
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">Add address</h3>
						<div className="space-y-2">
							<div className="mb-2 block">
								<Label htmlFor="password" value="Select province" />
							</div>
							<select
								name="province"
								className="border-gray-300 rounded-lg bg-gray-50 w-full"
								onChange={(e) => {
									rakirCity(e.target.value.split(".")[0]);
									setValue("province", e.target.value);
								}}
							>
								<option value="selected">Select province</option>
								{rakir.province?.map((value, index) => {
									return (
										<option value={`${value.province_id}.${value.province}`} key={index}>
											{value.province}
										</option>
									);
								})}
							</select>
							<div className="mb-2 block">
								<Label htmlFor="password" value="Select city" />
							</div>
							<select
								name="city"
								className="border-gray-300 rounded-lg bg-gray-50 w-full"
								onChange={(e) => {
									setValue("city", e.target.value);
								}}
							>
								<option value="selected">Select city</option>
								{rakir.city?.map((value, index) => {
									return (
										<option value={`${value.city_id}.${value.city_name}`} key={index}>
											{value.type} {value.city_name}
										</option>
									);
								})}
							</select>
							<div className="mb-2 block">
								<Label htmlFor="address" value="Address details" />
							</div>
							<Textarea rows="4" type="text" {...register("address")} required={true} />
							<div className="mb-2 block">
								<Label htmlFor="conatcts" value="Contact person" />
							</div>
							<TextInput {...register("receiver_name")} />
							<div className="mb-2 block">
								<Label htmlFor="conatcts" value="Phone number" />
							</div>
							<TextInput {...register("receiver_phone")} />
							<div className="flex items-center gap-2">
								<Checkbox
									id="remember"
									onChange={() =>
										setrakir({
											...rakir,
											main_address: rakir.main_address ? false : true,
										})
									}
								/>
								<Label htmlFor="remember">Make main address</Label>
							</div>
						</div>
						<div className="w-full flex justify-end">
							{show.loading ? (
								<button>
									<Spinner aria-label="Default status example" />
								</button>
							) : (
								<Button type="submit">Submit</Button>
							)}
						</div>
					</form>
				</Modal.Body>
			</Modal>
			<Modal
				show={show.changeAddress}
				size="3xl"
				popup={true}
				onClose={() => setshow({ ...show, changeAddress: false })}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<div className="flex justify-between">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								Choose your address
							</h3>
							<button
								className=" rounded-md border-[#0095DA] text-[#0095DA] border p-2 hover:bg-slate-200"
								onClick={() => addAddress()}
							>
								Add Address
							</button>
						</div>
						<div className={`p-3 shadow-md rounded-lg space-y-2 bg-blue-200`}>
							<div className=" flex justify-between">
								<div>
									<p className="text-lg w-full font-semibold">
										{props.state.profile.address?.main_address[0]?.address}
									</p>
									<p className="text-md">
										{props.state.profile.address?.main_address[0]?.receiver_name}
									</p>
									<p className="text-md">
										{props.state.profile.address?.main_address[0]?.receiver_phone}
									</p>
									<div className="right-2 top-2 mt-1">
										<p className="text-sm px-2 bg-green-500 text-white rounded-md w-fit">
											Main Address
										</p>
									</div>
								</div>
								<div className=" flex items-end ">
									<button
										onClick={() => selectedMainAddress()}
										className="  text-white bg-[#0095DA] w-[150px] h-[32px] rounded-lg
											"
									>
										Choose Address
									</button>
								</div>
							</div>
						</div>

						{props.state.profile.address
							? props.state.profile.address.address.map((value, index) => {
									return (
										<div
											className={`p-3 shadow-md rounded-lg space-y-2 ${
												value.main_address ? "bg-blue-200" : null
											}`}
											key={index}
										>
											<p className="text-lg w-full font-semibold">{value.address}</p>
											<p className="text-md">{value.receiver_name}</p>
											<p className="text-md">{value.receiver_phone}</p>
											{value.main_address ? (
												<div className="right-2 top-1">
													<p className="text-sm px-2 bg-green-500 rounded-3xl w-fit">
														Main Address
													</p>
												</div>
											) : null}
											<div className=" flex justify-between">
												<div className="w-full flex space-x-2 pt-2">
													{show.loading ? (
														<button>
															<Spinner aria-label="Default status example" />
														</button>
													) : value.main_address ? null : (
														<>
															<button
																className=" text-[#0095DA] hover:underline underline-offset-4"
																onClick={() => makeDefault(value.id)}
															>
																Make default
															</button>
															<div className=" text-slate-500">|</div>
															<button className=" text-[#0095DA] hover:underline underline-offset-4">
																Edit
															</button>
															<div className=" text-slate-500">|</div>
															<button
																className="text-[#0095DA] hover:underline underline-offset-4"
																onClick={() => deleteAddress(value.id)}
															>
																Delete
															</button>
														</>
													)}
												</div>
												<button
													onClick={() => selectedAddress(value)}
													className=" text-white bg-[#0095DA] w-[200px] h-[32px] rounded-lg 
											"
												>
													Choose Address
												</button>
											</div>
										</div>
									);
							  })
							: null}
					</div>
				</Modal.Body>
			</Modal>
			<Toaster />
			<FooterBar />
		</div>
	);
}
