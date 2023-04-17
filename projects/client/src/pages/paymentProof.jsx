import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogFooter,
	Button,
	Box,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterBar from "../components/footer";
import IconMandiri from "../support/assets/icon-mandiri.png";
import REST_API from "../support/services/RESTApiService";
import Moment from "react-moment";
import "moment-timezone";
import { Label, Modal, Spinner } from "flowbite-react";
import { toast, Toaster } from "react-hot-toast";

export default function PaymentProof() {
	const [showDetail, setshowDetail] = useState(false);
	const Navigate = useNavigate();
	const [data, setdata] = useState();
	const [details, setdetails] = useState();
	const [disable, setdisable] = useState(false);
	const [showUpload, setshowUpload] = useState(false);
	const [img, setimg] = useState();
	const [invoice, setinvoice] = useState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();

	const getTransaction = async () => {
		try {
			const { data } = await REST_API({
				url: "/transaction/invoice",
				method: "GET",
			});
			setinvoice(data.data[0].invoice);
			setdata(data.data[0]);
		} catch (error) {}
	};

	const onGetDetails = async (invoice) => {
		try {
			const { data } = await REST_API({
				url: "/transaction/detail",
				method: "POST",
				data: { invoice: invoice },
			});
			setdetails(data.data);
		} catch (error) {
			toast.error(error);
		} finally {
			setshowDetail(true);
		}
	};

	const validateImage = (e) => {
		const err = {
			msg1: "Select 1 Image only!",
			msg2: `${e.target.files[0].name} more than 1MB`,
		};
		try {
			if (e.target.files > 1) throw err.msg1;

			if (e.target.files[0].size > 1000000) throw err.msg2;
			setimg(e.target.files[0]);
		} catch (error) {
			toast.error(error);
		}
	};

	const onSubmitPP = async () => {
		const fd = new FormData();
		setdisable(true);
		try {
			fd.append("images", img);
			fd.append("data", JSON.stringify({ invoice: invoice }));
			const { data } = await REST_API({
				url: "/transaction/uploadPayment",
				method: "PATCH",
				data: fd,
			});
			toast.success(data.message);
			setTimeout(() => {
				Navigate("/home");
			}, 3000);
		} catch (error) {
			toast.error("Upload Payment Failed");
		} finally {
			setdisable(false);
		}
	};
	useEffect(() => {
		getTransaction();
	}, []);
	return (
		<div className=" overflow-hidden">
			<div className=" flex justify-center items-center pt-[50px]">
				<div className=" flex flex-col justify-center items-center w-[1190px] mt-[82px] ">
					<div className="w-[600px] h-[147px] px-4">
						<h1 className=" flex justify-center items-center w-full  mt-4 text-[20px] font-tokpedFont font-extrabold">
							{data?.status}
						</h1>
						<p className=" flex justify-center items-center w-full mt-2 text-[20px] text-red-600 font-tokpedFont font-semibold">
							{data?.status === "Waiting Payment" && data?.expired !== null ? (
								<Moment date={data?.expired} durationFromNow interval={1000} />
							) : null}
						</p>
						<p className=" flex justify-center items-center w-full  mt-4 text-[16px] text-gray-500 font-tokpedFont ">
							Payment Deadline
						</p>
						<p className=" flex justify-center items-center w-full  mt-2 text-[18px] font-tokpedFont font-extrabold ">
							<Moment format="D MMM YYYY HH:mm">{data?.expired}</Moment>
						</p>
					</div>
					<div className=" rounded-lg border w-[600px] mt-[41px] ">
						<div className=" flex px-4 items-center justify-between border-b-[1px] h-[51px]">
							<h1 className=" font-tokpedFont font-semibold text-[16px]">
								Mandiri Virtual Account
							</h1>
							<img
								alt="iconMandiri"
								src={IconMandiri}
								className=" h-[18px] w-[64px]"
							></img>
						</div>
						<div className=" flex items-center justify-between  mx-4 flex-row h-[77px]">
							<div className=" mt-4">
								<p className=" mt-4 text-[14px] font-tokpedFont text-gray-500">
									Virtual Account Number
								</p>
								<p className=" mt-2 text-[18px] font-tokpedFont font-semibold">
									8870887805667895
								</p>
							</div>
							<div className=" flex items-center h-[77px]">
								<button
									onClick={() => setshowUpload(true)}
									className=" mt-4 font-tokpedFont font-semibold text-[16px] text-[#0095DA] "
								>
									Upload Payment
								</button>
							</div>
						</div>
						<div className=" text-left mb-4 mx-4 h-[77px]">
							<p className=" pt-4 text-[14px] font-tokpedFont text-gray-500">
								Total Payment
							</p>
							<div className=" flex justify-between w-full h-[29px]">
								<p className=" mt-2 text-[18px] font-tokpedFont font-semibold">
									Rp.{" "}
									{(
										Number(data?.total_price) + data?.shipping_cost
									).toLocaleString()}
								</p>
								<button
									onClick={() => onGetDetails(data?.invoice)}
									className=" font-tokpedFont font-semibold text-[16px] text-[#0095DA]"
								>
									See Details
								</button>
							</div>
						</div>
					</div>
					<div className=" h-[112px] flex items-center w-[600px] justify-between">
						<button
							onClick={onOpen}
							className=" w-[293px] border border-[#0095DA] rounded-xl outline-[#0095DA] text-[#0095DA] h-10 "
						>
							Cek Payment Status
						</button>
						<button
							onClick={() => Navigate("/home")}
							className=" w-[291px] border bg-[#0095DA] rounded-xl text-white h-10"
						>
							Shop Again
						</button>
					</div>
					<div className=" w-[600px] h-[21px]">
						<p className=" font-tokpedFont font-semibold text-[18px] ">
							Payment Method
						</p>
					</div>
					<div className=" mt-4 w-[600px] px-4 ">
						<p className=" mt-11 h-[13px] font-tokpedFont font-semibold text-[12px]">
							PAYMENT GUIDE
						</p>
						<Accordion mt="19px" defaultIndex={[0]} allowToggle>
							<AccordionItem border={"none"}>
								<h2>
									<AccordionButton _hover={"none"}>
										<Box
											fontWeight={"bold"}
											textColor={"gray.500"}
											fontSize={"14px"}
											as="span"
											flex="1"
											textAlign="left"
										>
											ATM Mandiri
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel
									borderBottom={"1px"}
									borderBottomColor="gray.300"
								>
									<div className=" text-[14px] mt-4 mb-6 pl-3 flex flex-col gap-2 font-tokpedFont ">
										<p>1. Masukkan kartu ATM dan PIN </p>
										<p>2. Pilih menu "Bayar/Beli" </p>
										<p>
											3. Pilih menu "Lainnya", hingga menemukan menu
											"Multipayment"
										</p>
										<p>
											4. Masukkan Kode Biller Tokonglomerat (88708), lalu pilih
											Benar{" "}
										</p>
										<p>
											5. Masukkan "Nomor Virtual Account" Tokonglomerat, lalu
											pilih tombol Benar
										</p>
										<p>
											6. Masukkan Angka "1" untuk memilih tagihan, lalu pilih
											tombol Ya{" "}
										</p>
										<p>
											7. Akan muncul konfirmasi pembayaran, lalu pilih tombol Ya{" "}
										</p>
										<p>8. Simpan struk sebagai bukti pembayaran Anda</p>
									</div>
								</AccordionPanel>
							</AccordionItem>
							<AccordionItem border={"none"}>
								<h2>
									<AccordionButton _hover={"none"}>
										<Box
											fontWeight={"bold"}
											textColor={"gray.500"}
											fontSize={"14px"}
											as="span"
											flex="1"
											textAlign="left"
										>
											Mandiri Internet Banking / Livin' By Mandiri
										</Box>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								<AccordionPanel
									borderBottom={"1px"}
									borderBottomColor="gray.300"
								>
									<div className=" text-[14px] mt-4 pb-[14px] pl-3 flex flex-col border-b-[1px] border-b-black gap-2 font-tokpedFont ">
										<p>
											1. Login Livin' By Mandiri dengan memasukkan Username dan
											Password{" "}
										</p>
										<p>2. Pilih menu "Pembayaran" </p>
										<p>3. Pilih menu "Multipayment"</p>
										<p>4. Pilih penyedia jasa "Tokonglomerat" </p>
										<p>
											5. Masukkan "Nomor Virtual Account" dan "Nominal" yang
											akan dibayarkan, lalu pilih Lanjut
										</p>
										<p>6. Setelah muncul tagihan, pilih Konfirmasi </p>
										<p>7. Masukkan PIN / Challenge Code Token </p>
										<p>8. Transaksi selesai, simpan bukti bayar Anda</p>
									</div>
									<p className="mt-2 text-[14px] font-tokpedFont">
										Jangan gunakan fitur "Simpan Daftar Transfer" untuk
										pembayaran melalui Internet Banking karena dapat mengganggu
										proses pembayaran berikutnya.
									</p>
									<p className="mt-4 text-[14px] font-tokpedFont">
										Untuk menghapus daftar transfer tersimpan ikuti langkah
										berikut:
									</p>
									<div className=" text-[14px] mt-2 pb-6 pl-3 flex flex-col gap-2 font-tokpedFont ">
										<p>1. Login Livin' By Mandiri</p>
										<p>2. Pilih ke menu Pembayaran </p>
										<p>3. Pilih menu Daftar Pembayaran</p>
										<p>
											4. Pilih pada pembayaran yang tersimpan, lalu pilih menu
											untuk hapus{" "}
										</p>
									</div>
								</AccordionPanel>
							</AccordionItem>
						</Accordion>
					</div>
					<AlertDialog
						motionPreset="slideInBottom"
						leastDestructiveRef={cancelRef}
						onClose={onClose}
						isOpen={isOpen}
						isCentered
					>
						<AlertDialogOverlay />

						<AlertDialogContent>
							<AlertDialogHeader className=" font-tokpedFont flex justify-center items-center">
								Leave This Page ?
							</AlertDialogHeader>
							<AlertDialogCloseButton />
							<AlertDialogBody
								className=" font-tokpedFont text-slate-500"
								textAlign={"center"}
							>
								after exiting you will be redirected to the user transaction
								page to check your payment details
							</AlertDialogBody>
							<AlertDialogFooter className=" flex justify-evenly gap-5">
								<Button
									className=" w-full"
									textColor={"#0095DA"}
									outline={"#0095DA"}
									borderColor="#0095DA"
									ref={cancelRef}
									onClick={onClose}
								>
									No
								</Button>
								<Button
									onClick={() => Navigate("/user/transaction")}
									className=" w-full"
									colorScheme={"twitter"}
								>
									Yes
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<Modal
						show={showUpload}
						size="md"
						popup={true}
						onClose={() => setshowUpload(false)}
						id="name modal"
					>
						<Modal.Header />
						<Modal.Body>
							<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
								<h3 className="text-xl font-medium text-gray-900 dark:text-white">
									Upload Your Payment Here
								</h3>
								<div className="space-y-2">
									<div className="mb-2 block">
										<Label htmlFor="password" value="Upload image" />
									</div>
									<input
										type="file"
										name="myImage"
										accept="image/png, image/gif, image/jpeg, image/jpg"
										onChange={(e) => validateImage(e)}
										className="rounded-lg bg-slate-500 text-white"
									/>
									<p className="text-xs">Upload image with .jpg, .png, .jpeg</p>
									<p className="text-xs">Max size 1MB</p>
								</div>
								<div className="w-full flex justify-end">
									{disable ? (
										<button>
											<Spinner aria-label="Default status example" />
										</button>
									) : (
										<Button onClick={() => onSubmitPP()}>Submit</Button>
									)}
								</div>
							</div>
						</Modal.Body>
					</Modal>
					<Modal
						show={showDetail}
						popup={true}
						size="2xl"
						onClose={() => setshowDetail(false)}
						id="Modal Details"
					>
						<Modal.Header />
						<Modal.Body>
							<div className=" ">
								<p className=" font-semibold text-[16px]">Shopping Summary</p>
								<div className=" mt-4 flex justify-between text-[14px] font-tokpedFont border-b-4 items-center h-[37px] ">
									<p className=" text-[14px] ">
										Total price ({details?.length} Products)
									</p>
									<p className=" flex gap-1 text-[14px]">
										Rp. {Number(data?.total_price).toLocaleString()}{" "}
									</p>
								</div>
								<div className=" font-tokpedFont h-fit mb-4 mt-2 flex justify-between">
									<div className=" w-fit">
										{details
											? details.map((val, index) => {
													return (
														<div className=" mt-2 flex flex-row text-[14px] items-center gap-10 justify-between">
															<p className="">
																{index + 1}. {val.product_name}
															</p>
															<p className=" font-semibold">
																quantity: {val.qty}
															</p>
														</div>
													);
											  })
											: null}
									</div>
									<div>
										{details
											? details.map((val, index) => {
													return (
														<p className=" flex mt-2 text-[14px]">
															Rp. {Number(val.total_price).toLocaleString()}{" "}
														</p>
													);
											  })
											: null}
									</div>
								</div>
								<div className=" border-t-4 flex justify-between w-full h-[60px] pt-3">
									<div className=" text-left ">
										<p className=" font-bold font-tokpedFont text-[12px]">{`JNE-${
											details ? details[0].courier.split("+")[1] : null
										}`}</p>
										<p className=" font-tokpedFont text-slate-500 text text-[12px]">
											{`Estimasi ${
												details ? details[0]?.courier.split("+")[2] : null
											} Hari`}
										</p>
									</div>
									<div>{`Rp. ${Number(
										data?.shipping_cost
									).toLocaleString()}`}</div>
								</div>
								<div className=" border-t-4 flex justify-between h-[37px] items-end ">
									<p className=" font-semibold text-[16px] ">Total Payment</p>
									<p className=" font-semibold text-[16px] ">
										Rp.{" "}
										{(
											Number(data?.total_price) + data?.shipping_cost
										).toLocaleString()}
									</p>
								</div>
							</div>
						</Modal.Body>
					</Modal>
				</div>
				<Toaster />
			</div>
			<FooterBar />
		</div>
	);
}
