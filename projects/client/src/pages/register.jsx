import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import tokonglomerat from "../support/assets/edit_register_new.png";
import LoadingSpin from "react-loading-spin";
import { useNavigate } from "react-router-dom";
import REST_API from "../support/services/RESTApiService";

function Register() {
	const [showPassword, setshowPassword] = useState();
	const [disable, setdisable] = useState(false);
	const [errName, seterrName] = useState();
	const [errEmail, seterrEmail] = useState();
	const [errPassword, seterrPassword] = useState();
	const [errPhoneNumber, seterrPhoneNumber] = useState();

	const inputName = useRef();
	const inputEmail = useRef();
	const inputPassword = useRef();
	const inputPhoneNumber = useRef();

	const Navigate = useNavigate();

	let onSubmit = async () => {
		try {
			setdisable(true);
			const { data } = await REST_API({
				url: "/user/register",
				method: "POST",
				data: {
					name: inputName.current.value,
					email: inputEmail.current.value,
					password: inputPassword.current.value,
					phone_number: inputPhoneNumber.current.value,
				},
			});

			toast.success(data.message);
			inputName.current.value = "";
			inputEmail.current.value = "";
			inputPassword.current.value = "";
			inputPhoneNumber.current.value = "";
			setTimeout(() => {
				Navigate("/login");
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setdisable(false);
		}
	};
	let onValidateName = (value) => {
		if (value === "") {
			seterrName("Please input your name");
		} else if (value.length <= 4) {
			seterrName("Name to short, less than 4 character");
		} else if (value.length > 20) {
			seterrName("Name to long, more than 20 character");
		} else {
			seterrName("");
		}
	};
	let onValidateEmail = (value) => {
		if (value === "") {
			seterrEmail("Please input your email");
		} else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value)) {
			seterrEmail("Format Email Invalid");
		} else {
			seterrEmail("");
		}
	};
	let onValidatePassword = (value) => {
		if (value === "") {
			seterrPassword("Please input your password");
		} else if (value.length < 8) {
			seterrPassword("Password less than 8 character, please input more");
		} else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value)) {
			seterrPassword("Password must contain number and capital");
		} else {
			seterrPassword("");
		}
	};
	let onValidatePhone = (value) => {
		if (value === "") {
			seterrPhoneNumber("Please input your phone number");
		} else if (isNaN(value)) {
			seterrPhoneNumber("Phone number must be number");
		} else if (value.length < 8) {
			seterrPhoneNumber("Input phone number less than 8 digit");
		} else if (value.length > 12) {
			seterrPhoneNumber("Input phone number more than 12 digit");
		} else {
			seterrPhoneNumber("");
		}
	};

	return (
		<div className=" max-h-screen xl:overflow-hidden md:overflow-auto h-screen">
			<div className=" mt-[20px] mb-[25px] flex content-center justify-center">
				<h1 className=" font-bold text-4xl font-mandalaFont text-[#0095DA] ">
					<button onClick={() => Navigate("/home")}>tokonglomerat</button>
				</h1>
			</div>
			<div className="  flex content-center justify-center max-w-sm h-screen xl:max-w-screen-2xl mx-auto">
				<div className=" hidden xl:flex-row xl:block">
					<img
						className=" mt-[173px] h-[303px] w-[360px] mr-[149px] "
						src={tokonglomerat}
						alt="Gambar Tokonglomerat"
					/>
					<p className=" font-tokpedFont mr-[130px] mt-[30px] font-bold text-[22px] ">
						{" "}
						Easy Buying and Selling Only at Tokonglomerat
					</p>
					<p className=" font-tokpedFont ml-[15px] mt-[13px] text-[#6d7588] text-[13px]">
						Join and feel the convenience of making transactions at Tokonglomerat
					</p>
				</div>

				<form
					autoComplete="off"
					className="w-full max-w-[400px] xl:h-fit p-10 bg-white rounded-lg shadow-2xl md:h-fit sm: h-max"
					aria-label="register now"
				>
					<h1 className="text-[22px] text-[#40444e] font-extrabold text-center font-tokpedFont">
						Register Now
					</h1>

					<div className="flex flex-col items-start mt-[32px] mb-5 gap-y-3">
						<label htmlFor="name" className="text-sm font-medium cursor-pointer">
							Name
						</label>
						<input
							ref={inputName}
							onChange={(e) => onValidateName(e.target.value)}
							type={"text"}
							className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
							placeholder="Enter your name"
							required
						/>
						<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
							{errName ? errName : null}
						</div>
					</div>
					<div className="flex flex-col items-start mb-5 gap-y-3">
						<label htmlFor="email" className="text-sm font-medium cursor-pointer">
							Email
						</label>
						<input
							ref={inputEmail}
							type={"email"}
							onChange={(e) => onValidateEmail(e.target.value)}
							className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
							placeholder="Enter your email address"
							required
						/>{" "}
						<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
							{errEmail ? errEmail : null}
						</div>
					</div>
					<div className="flex flex-col relative items-start mb-5 gap-y-3">
						<label htmlFor="password" className="text-sm font-medium cursor-pointer">
							Password
						</label>

						<input
							ref={inputPassword}
							type={showPassword ? "text" : "password"}
							onChange={(e) => onValidatePassword(e.target.value)}
							className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
							placeholder="Enter your password"
							required
						/>
						<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
							{errPassword ? errPassword : null}
						</div>
						<div className=" text-2xl absolute right-5 top-12">
							{showPassword ? (
								<AiFillEye onClick={() => setshowPassword((showPassword) => !showPassword)} />
							) : (
								<AiFillEyeInvisible
									onClick={() => setshowPassword((showPassword) => !showPassword)}
								/>
							)}
						</div>
					</div>
					<div className="flex flex-col items-start mb-5 gap-y-3">
						<label htmlFor="phone_number" className="text-sm font-medium cursor-pointer">
							Phone Number
						</label>
						<input
							ref={inputPhoneNumber}
							type={"text"}
							onChange={(e) => onValidatePhone(e.target.value)}
							className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
							placeholder="Enter your phone number"
							required
						/>{" "}
						<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
							{errPhoneNumber ? errPhoneNumber : null}
						</div>
					</div>
					<div className=" mb-5 flex items-center justify-center text-slate-400 text-[14px] ">
						<p>Already have an account Tokonglomerat?</p>
						<a href="/login" className=" text-[#0095DA] underline">
							Login
						</a>
					</div>
					<button
						type="submit"
						className="inline-flex w-full items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white bg-[#0095DA] rounded-lg h-[60px]"
						disabled={disable}
						onClick={() => onSubmit()}
					>
						{disable ? (
							<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
						) : (
							"Create an account"
						)}
					</button>
					<Toaster />
				</form>
			</div>
		</div>
	);
}

export default Register;
