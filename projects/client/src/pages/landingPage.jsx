import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate, useParams } from "react-router-dom";
import { Badge, Modal } from "flowbite-react";
import Carousel from "react-multi-carousel";
import FooterBar from "../components/footer";
import { SlClose } from "react-icons/sl";
import LoadingSpin from "react-loading-spin";
import "react-multi-carousel/lib/styles.css";
import REST_API from "../support/services/RESTApiService";
import banner1 from "../support/assets/banner/UFS-Long-revamp-1200x320.png";
import banner2 from "../support/assets/banner/LeeKumKee-blm-24feb-Banner-A-600x250.png";
import banner3 from "../support/assets/banner/TG-7mar-blm-bannerA.png";
import car1 from "../support/assets/carousell/Beras-Raja-blm-07maret-C1.jpg";
import car2 from "../support/assets/carousell/cloud9-mar23-blm-c1.jpg";
import car3 from "../support/assets/carousell/kbaby-blm-feb23-c1.jpg";
import car4 from "../support/assets/carousell/KILAU-RAMBUT-mar-2023-c1-lk.jpg";
import car5 from "../support/assets/carousell/oreo-blackpink-mar23-blm-c1-1.jpg";
import car6 from "../support/assets/carousell/Pasar-Murah-blm-28feb-C1.jpg";
import car7 from "../support/assets/carousell/pcmp-blm-mar09-c1p-.jpg";
import car8 from "../support/assets/carousell/SEAFOOD-BLM-mar2-c1.jpg";
import car9 from "../support/assets/carousell/Sesa-blm-06maret-C1.jpg";
import car10 from "../support/assets/carousell/SoKlin-liquid-blm-10mar-C1.jpg";
import car11 from "../support/assets/carousell/Sparkle-blm-27feb-C1.jpg";
import car12 from "../support/assets/carousell/telur-blm-mar09-c1.jpg";
export default function LandingPage() {
	// const params = useParams();
	const Navigate = useNavigate();
	const [product, setproduct] = useState();
	const [random, setrandom] = useState();
	const [category, setcategory] = useState();
	const [detail, setdetail] = useState();
	const [show, setshow] = useState(false);
	// const [unit, setunit] = useState();
	const [disable, setdisable] = useState(false);

	const [quantity, setquantity] = useState(1);
	const [profile, setprofile] = useState({
		uid: "",
		id: "",
		name: "",
		birthdate: "",
		gender: "",
		email: "",
		phone_number: "",
		profile_picture: "",
		address: "",
	});

	const navigate = useNavigate();
	const responsive = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1200,
			},
			items: 1,
			partialVisibilityGutter: 50,
		},
		mobile: {
			breakpoint: {
				max: 900,
				min: 0,
			},
			items: 1,
			partialVisibilityGutter: 0,
		},
	};
	const responsiveProduct = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1024,
			},
			items: 6,
		},
		mobile: {
			breakpoint: {
				max: 640,
				min: 0,
			},
			items: 3,
		},
	};
	const getProfile = async () => {
		const { data } = await REST_API({
			url: "/user/profile",
			method: "GET",
		});
		setprofile({
			...profile,
			uid: data.data.uid,
			id: data.data.id,
			name: data.data.name,
			birthdate: data.data.birthdate,
			gender: data.data.gender,
			email: data.data.email,
			phone_number: data.data.phone_number,
			profile_picture: data.data.img,
			address: data.data.user_addresses,
		});
	};

	let onSubmit = async () => {
		try {
			if (localStorage.getItem("token")) {
				setdisable(true);
				const { data } = await REST_API({
					url: "/cart/add",
					method: "POST",
					data: {
						qty: quantity,
						user_id: profile.id,
						branch_id: detail.branch_id,
						product_id: detail.product_id,
					},
				});
				toast.success(data.message);
			} else {
				toast("Redirecting to Login...");

				setTimeout(() => {
					Navigate("/login");
				}, 3000);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setdisable(false);
		}
	};

	const getCategory = async () => {
		const { data } = await REST_API({
			url: "/product/category",
			method: "GET",
		});
		setcategory(data.data);
	};
	const getSuggested = async () => {
		try {
			const { data } = await REST_API({
				url: `/product/suggested`,
				method: "GET",
			});
			setproduct(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const forYou = async () => {
		try {
			const { data } = await REST_API({
				url: `/product/foryou`,
				method: "GET",
			});
			setrandom(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	let onGetDetail = async (branch, products) => {
		setshow(true);
		try {
			const { data } = await REST_API({
				url: `product/detail?branch=${branch}&product=${products}`,
				method: "GET",
			});
			setdetail(data.data[0]);
			setquantity(1);
			setshow(true);
		} catch (error) {
			console.log(error);
		}
	};
	// let onGetUnit = async () => {
	// 	try {
	// 		const { data } = await REST_API({
	// 			url: `product/getallproduct?category=${params.product
	// 				.split("&")[0]
	// 				.slice(-1)}`,
	// 			method: "GET",
	// 		});
	// 		setunit(data.data[0]);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	useEffect(() => {
		getSuggested();
		getCategory();
		forYou();
		// onGetUnit();
		getProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<div className="pt-24 max-w-screen-xl mx-auto font-tokpedFont px-2">
				<div className="flex justify-center mt-5">
					<div className="h-fit lg:h-56 sm:h-64 xl:h-64 w-full">
						<Carousel
							additionalTransfrom={0}
							arrows={false}
							autoPlay={true}
							autoPlaySpeed={2500}
							centerMode
							className="rounded-lg"
							containerClass="container shadow"
							infinite={true}
							renderDotsOutside={false}
							responsive={responsive}
							rewind={false}
							rewindWithAnimation={false}
							rtl={false}
							showDots={false}
							slidesToSlide={1}
						>
							<img src={car1} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car2} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car3} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car4} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car5} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car6} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car7} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car8} alt="carousel" className="rounded-lg shadow-md" />
							<img src={car9} alt="carousel" className="rounded-lg shadow-md" />
							<img
								src={car10}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
							<img
								src={car11}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
							<img
								src={car12}
								alt="carousel"
								className="rounded-lg shadow-md"
							/>
						</Carousel>
					</div>
				</div>
				<div className="grid lg:grid-cols-10 grid-cols-5 gap-1 lg:gap-5 py-10">
					{category
						? category.map((value, index) => {
								return (
									<button key={index} className="space-y-2 h-max">
										<div
											onClick={() => navigate(`/category/category=${value.id}`)}
											className="flex flex-col justify-center items-center space-y-1"
										>
											<img
												src={value.img}
												alt={value.name}
												className="w-11/12 rounded-full overflow-visible"
											/>
											<p className=" font-medium font-tokpedFont lg:text-sm text-xs">
												{value.name}
											</p>
										</div>
									</button>
								);
						  })
						: null}
				</div>
				<div>
					<h2 className="text-xl font-semibold pb-3">Best Seller</h2>
				</div>
				<div className="h-56 sm:h-64 xl:h-64 w-full">
					<Carousel
						additionalTransfrom={0}
						arrows
						className="rounded-lg py-5 px-3"
						renderDotsOutside={false}
						responsive={responsiveProduct}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						showDots={false}
						slidesToSlide={1}
					>
						{product ? (
							product.map((value, index) => {
								return (
									<button
										key={index}
										onClick={(e) => {
											onGetDetail(value.branch.id, value.product.id);
										}}
										className="flex flex-col shadow-md lg:w-48 w-28 lg:h-80 h-60 bg-white border border-gray-200 rounded-lg"
									>
										<img
											className="rounded-t-lg lg:h-44 h-36 object-cover mb-3"
											src={value.product.img}
											alt="product"
										/>
										<div className="px-5 pb-5 flex flex-col justify-start items-start">
											<h5 className="lg:text-sm text-xs tracking-tight text-gray-900">
												{value.product.name.slice(0, 17)}...
											</h5>
											{value.product.discount_histories.length === 1 ? (
												value.product.discount_histories[0].discount_id ===
												3 ? (
													<div className="flex flex-col justify-start items-start space-y-1 relative">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp.{" "}
															{(
																value.product.price -
																(value.product.price *
																	value.product.discount_histories[0].percent) /
																	100
															).toLocaleString()}
														</p>
														<div className="flex items-center space-x-2">
															<p className="text-[10px] font-bold text-gray-900 line-through">
																Rp. {value.product.price.toLocaleString()}
															</p>
															<Badge className="text-[9px]">
																{value.product.discount_histories[0].percent}%
															</Badge>
														</div>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : value.product.discount_histories[0].discount_id ===
												  2 ? (
													<div className="flex flex-col justify-start items-start space-y-1 relative">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp.{" "}
															{(
																value.product.price -
																(value.product.price *
																	value.product.discount_histories[0].percent) /
																	100
															).toLocaleString()}
														</p>
														<div className="flex items-center space-x-2">
															<p className="text-[10px] font-bold text-gray-900 line-through">
																Rp. {value.product.price.toLocaleString()}
															</p>
															<Badge className="text-[9px]">
																{value.product.discount_histories[0].percent}%
															</Badge>
														</div>
														<p className="text-[10px] text-red-700">
															Minimum{" "}
															{value.product.discount_histories[0].min_purchase}{" "}
															item
														</p>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : value.product.discount_histories[0].discount_id ===
												  1 ? (
													<div className="flex flex-col justify-start items-start space-y-1">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp. {value.product.price.toLocaleString()}
														</p>
														<p className="text-[10px] text-red-700">
															BUY 1 FREE 1
														</p>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : null
											) : (
												<div className="flex flex-col justify-start items-start space-y-1">
													<span className="text-md font-bold text-gray-900">
														Rp. {value.product.price.toLocaleString()}
													</span>
													<h4 className="text-xs font-thin">
														Toko {value.branch.location}
													</h4>
												</div>
											)}
										</div>
									</button>
								);
							})
						) : (
							<div>Loading</div>
						)}
					</Carousel>
				</div>
				<div className="mt-24">
					<img src={banner1} alt="banner 2" className="mx-auto" />
				</div>
				<div className="flex">
					<img
						src={banner2}
						alt="banner 3"
						className="overflow-hidden mx-auto"
					/>
					<img
						src={banner3}
						alt="banner 4"
						className="overflow-hidden mx-auto"
					/>
				</div>
				<div>
					<h2 className="text-xl font-semibold py-3">For you</h2>
				</div>
				<div className="h-56 sm:h-64 xl:h-64 w-full">
					<Carousel
						additionalTransfrom={0}
						arrows
						className="rounded-lg py-5 px-3"
						renderDotsOutside={false}
						responsive={responsiveProduct}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						showDots={false}
						slidesToSlide={1}
					>
						{random ? (
							random.map((value, index) => {
								return (
									<button
										onClick={(e) => {
											onGetDetail(value.branch_id, value.product_id);
										}}
										key={index}
										className="flex flex-col shadow-md lg:w-48 w-28 lg:h-80 h-60 bg-white border border-gray-200 rounded-lg"
									>
										<img
											className="rounded-t-lg h-44 object-cover mb-3"
											src={value.product.img}
											alt="product"
										/>
										<div className="lg:px-5 lg:pb-5 pl-1 flex flex-col justify-start items-start space-y-1">
											<h5 className="text-sm tracking-tight text-gray-900">
												{value.product.name.slice(0, 17)}...
											</h5>
											{value.product.discount_histories.length === 1 ? (
												value.product.discount_histories[0].discount_id ===
												3 ? (
													<div className="flex flex-col justify-start items-start space-y-1 relative">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp.{" "}
															{(
																value.product.price -
																(value.product.price *
																	value.product.discount_histories[0].percent) /
																	100
															).toLocaleString()}
														</p>
														<div className="flex items-center space-x-2">
															<p className="text-[10px] font-bold text-gray-900 line-through">
																Rp. {value.product.price.toLocaleString()}
															</p>
															<Badge className="text-[9px]">
																{value.product.discount_histories[0].percent}%
															</Badge>
														</div>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : value.product.discount_histories[0].discount_id ===
												  2 ? (
													<div className="flex flex-col justify-start items-start space-y-1 relative">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp.{" "}
															{(
																value.product.price -
																(value.product.price *
																	value.product.discount_histories[0].percent) /
																	100
															).toLocaleString()}
														</p>
														<div className="flex items-center space-x-2">
															<p className="text-[10px] font-bold text-gray-900 line-through">
																Rp. {value.product.price.toLocaleString()}
															</p>
															<Badge className="text-[9px]">
																{value.product.discount_histories[0].percent}%
															</Badge>
														</div>
														<p className="text-[10px] text-red-700">
															Minimum{" "}
															{value.product.discount_histories[0].min_purchase}{" "}
															item
														</p>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : value.product.discount_histories[0].discount_id ===
												  1 ? (
													<div className="flex flex-col justify-start items-start space-y-1">
														<p className="lg:text-md text-xs font-bold text-gray-900">
															Rp. {value.product.price.toLocaleString()}
														</p>
														<p className="text-[10px] text-red-700">
															BUY 1 FREE 1
														</p>
														<h4 className="text-xs font-thin">
															Toko {value.branch.location}
														</h4>
													</div>
												) : null
											) : (
												<div className="flex flex-col justify-start items-start space-y-1">
													<span className="text-md font-bold text-gray-900">
														Rp. {value.product.price.toLocaleString()}
													</span>
													<h4 className="text-xs font-thin">
														Toko {value.branch.location}
													</h4>
												</div>
											)}
										</div>
									</button>
								);
							})
						) : (
							<div>Loading</div>
						)}
					</Carousel>
				</div>
			</div>
			<Modal show={show} size="md" popup={true} onClose={() => setshow(false)}>
				{/* <Modal.Header/> */}
				<div>
					<img
						src={`${detail ? detail.product.img : null}`}
						alt="product"
						className=" z-10 rounded-t-lg h-full w-full"
					/>
				</div>
				<div className=" mx-8 mt-6 font-tokpedFont max-w-[500px]">
					<h1 className=" text-[20px] font-bold  text-orange-700">
						Rp. {detail ? detail.product.price.toLocaleString() : null}
					</h1>
					<h2 className=" mt-1 text-[16px] font-semibold">
						{detail ? detail.product.name : null}
					</h2>
					<p className=" mt-1 text-[12px] text-slate-400 ">
						{" "}
						{/* per {unit ? unit.unit.name : null} */}
					</p>
					<h2 className=" mt-1 text-[16px] font-semibold">Description</h2>
					<p className=" text-[12px] mt-2 text-slate-400">
						{detail ? detail.product.description : null}
					</p>
					<div className=" flex justify-between">
						<div className="mt-2.5 mb-2.5 flex items-center">
							<svg
								className="h-5 w-5 text-yellow-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<svg
								className="h-5 w-5 text-yellow-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<svg
								className="h-5 w-5 text-yellow-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<svg
								className="h-5 w-5 text-yellow-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<svg
								className="h-5 w-5 text-yellow-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span className="mr-2 ml-3 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
								5.0
							</span>
						</div>
						<div className=" flex items-center font-tokpedFont font-semibold">
							Toko {detail ? detail.branch.location : null}
						</div>
					</div>

					<div className="flex">
						<div className=" flex justify-center gap-2 border  my-4 rounded-lg w-[102px] font-medium text-sm h-[32px]">
							<button
								value={"-"}
								disabled={quantity <= 1 ? true : false}
								onClick={() => setquantity(quantity - 1)}
								className="font-bold"
							>
								-
							</button>
							<input
								className=" outline-none text-center max-w-[46px]"
								defaultValue={1}
								value={quantity}
								onChange={(e) => setquantity(e.target.value)}
							/>
							<button
								value={"+"}
								disabled={
									quantity >= (detail ? detail.stock : null) ? true : false
								}
								onClick={() => setquantity(quantity + 1)}
								className=" text-green-500 font-bold"
							>
								+
							</button>
						</div>
						{detail && detail.stock <= 5 ? (
							<div className=" flex justify-center items-center ml-4 font-semibold">
								Stock:{" "}
								<p className="text-orange-700  px-2">{detail.stock} left</p>
							</div>
						) : null}
					</div>

					<div className="flex mt-5 pb-4">
						<button
							type="submit"
							disabled={disable}
							onClick={() => onSubmit()}
							className="font-medium w-full text-sm px-5 py-2.5 rounded-lg text-white bg-[#0095da] hover:bg-blue-800 "
						>
							{disable ? (
								<LoadingSpin
									size={"30px"}
									primaryColor={"red"}
									secondaryColor={"gray"}
								/>
							) : (
								"Add to cart"
							)}
						</button>
					</div>
				</div>
				<div className=" flex justify-center pb-5">
					<button>
						<SlClose size={25} onClick={() => setshow(false)} />
					</button>
				</div>
			</Modal>
			<FooterBar />
			<Toaster />
		</>
	);
}
