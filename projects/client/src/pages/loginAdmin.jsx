import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Tokonglomerat from "../support/assets/new_login.png";
import { toast, Toaster } from "react-hot-toast";
import LoadingSpin from "react-loading-spin";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginAdmin(props) {
	const [showPassword, setshowPassword] = useState(false);
	const [errEmail, seterrEmail] = useState();
	const [errPass, seterrPass] = useState();
	const [disable, setdisable] = useState();

	const email = useRef();
	const password = useRef();

	const Navigate = useNavigate();

	// const Navigate = useNavigate();

	let onLogin = async () => {
		try {
			setdisable(true);

			let { data } = await axios.post("http://localhost:8000/admin/login", {
				email: email.current.value,
				password: password.current.value,
			});

			localStorage.setItem("token", `${data.data.token}`);
			toast.success(data.message);
			email.current.value = "";
			password.current.value = "";
			setTimeout(() => {
				Navigate("/admin");
			}, 1000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setdisable(false);
		}
	};

	let onValidateEmail = (value) => {
		if (value === "") {
			seterrEmail("Please input your email");
		} else if (
			!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value)
		) {
			seterrEmail("Format Email Invalid");
		} else {
			seterrEmail("");
		}
	};
	let onValidatePassword = (value) => {
		if (value === "") {
			seterrPass("Please input your password");
		} else if (value.length < 8) {
			seterrPass("Password less than 8 character, please input more");
		} else if (
			!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(
				value
			)
		) {
			seterrPass("Password must contain number and capital");
		} else {
			seterrPass("");
		}
	};

	return (
		<div className="  max-h-screen overflow-hidden ">
			<div className="  flex justify-center content-center mt-[32px] font-bold text-4xl font-mandalaFont text-[#0095DA] ">
				<button onClick={() => Navigate("/home")}>tokonglomerat</button>
			</div>
			<div className=" flex flex-col xl:max-w-[816px] h-screen xl:h-[612px] mt-8 xl:mt-[42px] mx-auto relative ">
				<img
					alt="Gambar Tokped"
					className=" mx-auto xl:block w-[816px] h-full "
					src={Tokonglomerat}
				/>
				<div className=" absolute inset-0 xl:h-fit flex justify-center content-center   ">
					<div
						autoComplete="off"
						className="w-full xl:my-[50px] max-w-[400px] p-[41px] bg-white rounded-lg drop-shadow-2xl "
						aria-label="Login"
					>
						<h1 className="text-[22px] text-[#40444e] font-extrabold text-center font-tokpedFont">
							Admin Login
						</h1>

						<div className="flex flex-col items-start mb-5 gap-y-3">
							<label
								htmlFor="email"
								className="text-sm font-medium cursor-pointer"
							>
								Email
							</label>
							<input
								ref={email}
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
						<div className="flex flex-col relative items-start gap-y-3">
							<label
								htmlFor="password"
								className="text-sm font-medium cursor-pointer"
							>
								Password
							</label>

							<input
								ref={password}
								type={showPassword ? "text" : "password"}
								onChange={(e) => onValidatePassword(e.target.value)}
								className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
								placeholder="Enter your password"
								required
							/>
							<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
								{errPass ? errPass : null}
							</div>
							<div className=" text-2xl absolute right-5 top-12">
								{showPassword ? (
									<AiFillEye
										onClick={() =>
											setshowPassword((showPassword) => !showPassword)
										}
									/>
								) : (
									<AiFillEyeInvisible
										onClick={() =>
											setshowPassword((showPassword) => !showPassword)
										}
									/>
								)}
							</div>
						</div>

						<button
							onClick={() =>
								props.Func.onLoginAdmin(
									email.current.value,
									password.current.value
								)
							}
							disabled={disable}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white  bg-[#0095DA] rounded-lg h-[60px]"
						>
							{disable ? (
								<LoadingSpin
									size={"30px"}
									primaryColor={"red"}
									secondaryColor={"gray"}
								/>
							) : (
								"Login"
							)}
						</button>

						<div className=" mt-[15px] flex items-center justify-center text-slate-400 text-[12px] "></div>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	);
}

export default LoginAdmin;
