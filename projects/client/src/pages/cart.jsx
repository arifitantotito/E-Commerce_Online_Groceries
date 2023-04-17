import { VscTrash } from "react-icons/vsc";
import { RxMinusCircled } from "react-icons/rx";
import { RxPlusCircled } from "react-icons/rx";
import { useEffect, useState } from "react";
import REST_API from "../support/services/RESTApiService";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import keranjang_empty from "../support/assets/KeranjangKosong.jpg";
import FooterBar from "../components/footer";
import LoadingSpin from "react-loading-spin";

export default function Cart(props) {
	const [data, setdata] = useState([]);
	const [sum, setsum] = useState(0);
	const [disable, setdisable] = useState(false);
	const [disableCheckout, setdisableCheckout] = useState();
	const Navigate = useNavigate();

	let onGetCart = async () => {
		try {
			let { data } = await REST_API({
				url: "/cart/get",
				method: "GET",
			});
			let total = 0;
			data.data.forEach((value, index) => {
				total += value.total_price;
			});
			setsum(total);
			setdata(data.data);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	let onDelCart = async (value) => {
		try {
			let { data } = await REST_API({
				url: "/cart/del",
				method: "DELETE",
				data: {
					id: value,
				},
			});
			toast.success(data.message);
			onGetCart();
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		}
	};

	let updateQuantity = async (value, operation, quantity) => {
		try {
			setdisable(true);
			if (operation === "+") {
				const { data } = await REST_API({
					url: "/cart/inc",
					method: "POST",
					data: {
						id: value,
						quantity: quantity,
					},
				});
				toast.success(data.message);
				onGetCart();
			} else if (operation === "-") {
				const { data } = await REST_API({
					url: "/cart/dec",
					method: "POST",
					data: {
						id: value,
						quantity: quantity,
					},
				});
				toast.success(data.message);
				onGetCart();
			}
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		} finally {
			setTimeout(() => {
				setdisable(false);
			}, 1500);
		}
	};

	let checkStatus = async () => {
		try {
			setdisableCheckout(true);
			if (props.state.profile.status === "Verified") {
				toast.success("Redirect To Checkout page...");
				setTimeout(() => {
					Navigate("/checkout");
				}, 1500);
			} else if(props.state.profile.address === null){
				toast.error("Please Add Main Address First")
				setTimeout(() => {
					Navigate("/profile")
				})
			} else {
				toast.error("Please Check Your Email and Activate Your Account");
			}
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		;
		} finally {
			setdisableCheckout(false);
		}
	};
	useEffect(() => {
		onGetCart();
	}, []);
	return (
		<div className=" mb-24">
			<div className=" pt-[64px] max-w-[1120px] mx-auto ">
				<div className=" pl-5 flex items-end h-[66px] border-b-4 font-bold ">Cart</div>
				<div className="flex px-5">
					{data.length > 0 ? (
						<div className=" w-[685px]">
							{data
								? data.map((value, index) => {
										return (
											<>
												{/* ORDER START HERE */}
												<div
													key={index}
													className=" mt-4 font-tokpedFont font-semibold text-[14px]"
												>
													Order {index + 1}
												</div>
												<div className=" font-tokpedFont h-[288px] pt-4 border-b-4">
													<div className=" font-semibold text-[14px] h-[46px] flex justify-start items-center ">
														Toko {value.branch.location}
													</div>
													<div className=" h-[156px] flex flex-row pt-5 border-b">
														<div className=" h-[135px] w-[364px] flex ">
															<img
																alt="product_image"
																className=" h-[60px] w-[60px]"
																src={value.product.img}
															/>
															<div className=" h-[93px] my-[7px] ">
																<p className=" pl-[15px] font-tokpedFont text-[14px]">
																	{value.product.name}
																</p>
																<p className=" flex gap-1 pl-[15px] font-tokpedFont text-[12px]">
																	per
																	<p className=" font-semibold">
																		{value.product.unit.price_at} {value.product.unit.name}
																	</p>
																</p>
																<p className=" pl-[15px] font-semibold font-tokpedFont text-[14px]">
																	Rp. {value.product.price.toLocaleString()}
																</p>
															</div>
														</div>
													</div>
													<div className=" h-14 my-[6px] flex justify-end items-center">
														<div className=" h-6 justify-between flex items-center w-[331px]">
															<button
																onClick={() => onDelCart(value.id)}
																className=" flex items-center pt-4 "
															>
																<VscTrash
																	size={25}
																	className=" text-slate-500 hover:text-red-500"
																/>
															</button>
															{value.product.branch_products.stock === 0 ? (
																<p className="pt-4 text-red-700 font-tokpedFont font-semibold ">
																	Stock Habis
																</p>
															) : null}
															<div className=" flex items-center pt-4 gap-1">
																<button
																	className=" disabled:text-slate-500 enabled:text-green-500"
																	disabled={disable || value.qty <= 1 ? true : false}
																	onClick={() =>
																		setTimeout(() => {
																			updateQuantity(value.id, "-", value.qty);
																		}, 1000)
																	}
																>
																	<RxMinusCircled size={20} />
																</button>
																<input
																	className=" max-w-[55px] h-5 text-center border-b"
																	value={value.qty}
																/>
																<button
																	className=" disabled:text-slate-500 enabled:text-green-500"
																	disabled={
																		disable || value.qty >= value.product.branch_products.stock
																			? true
																			: false
																	}
																	onClick={() =>
																		setTimeout(() => {
																			updateQuantity(value.id, "+", value.qty);
																		}, 1000)
																	}
																>
																	<RxPlusCircled size={20} />
																</button>
															</div>
														</div>
													</div>
												</div>
												{/* ORDER END HERE */}
											</>
										);
								  })
								: null}
						</div>
					) : null}
					{data.length > 0 ? (
						<div className=" font-tokpedFont w-[350px] h-fit ml-[45px] mt-[80px] px-4 py-4 rounded-lg border shadow-xl">
							<p className=" font-semibold text-[14px]">Shopping Summary</p>
							<div className=" h-fit my-4 flex justify-between">
								<div>
									<p className=" text-[14px] ">
										Total price ({data ? data.length : null} Products)
									</p>
								</div>
								<div>
									<p className=" flex gap-1 text-[14px]">Rp. {sum.toLocaleString()} </p>
								</div>
							</div>
							<div className=" border-t flex justify-between h-[37px] items-end ">
								<p className=" font-semibold text-[16px] ">Total Price</p>
								<p className=" font-semibold text-[16px] ">Rp. {sum.toLocaleString()} </p>
							</div>
							<button
								onClick={() => checkStatus()}
								className=" mt-6 h-12 w-full text-white bg-[#0095DA] rounded-lg "
							>
								{disableCheckout ? (
									<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
								) : (
									"Checkout"
								)}
							</button>
						</div>
					) : null}
					{data.length > 0 ? null : (
						<div className="mt-[71px] h-fit flex flex-col justify-center items-center w-full">
							<img alt="Keranjang Kosong" className=" h-[141px] w-[200px]" src={keranjang_empty} />
							<h1 className=" font-tokpedFont font-semibold text-[24px] mt-5  ">
								Wow, your shopping cart is empty
							</h1>
							<p className=" text-slate-400 font-tokpedFont text-[14px] mt-2 ">
								Come on, fill it with your dream items!
							</p>
							<button
								onClick={() => Navigate("/home")}
								className=" bg-[#0095DA] text-white font-semibold rounded-md h-10 w-[200px] mt-4 "
							>
								Shope Now
							</button>
						</div>
					)}
				</div>
				<Toaster />
			</div>
			<FooterBar />
		</div>
	);
}
