import { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import tokonglomerat from "../support/assets/new_login.png";
import {  Toaster } from "react-hot-toast";
import LoadingSpin from "react-loading-spin";
import { useNavigate } from "react-router-dom";

function Login(props) {
	const [showPassword, setshowPassword] = useState(false);
	const [errEmail, seterrEmail] = useState();
	const [errPass, seterrPass] = useState();
	const Navigate = useNavigate()
	
	const email = useRef();
	const password = useRef();

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
			seterrPass("Please input your password");
		} else if (value.length < 8) {
			seterrPass("Password less than 8 character, please input more");
		} else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value)) {
			seterrPass("Password must contain number and capital");
		} else {
			seterrPass("");
		}
	};
	return (
		<div className=" max-h-screen overflow-hidden ">
			<div className=" flex justify-center content-center mt-[32px] font-bold text-4xl font-mandalaFont text-[#0095DA] ">
				<button onClick={() => Navigate("/home")}>tokonglomerat</button>
			</div>
			<div className=" flex flex-col xl:max-w-[816px] h-screen xl:h-[612px] mt-8 xl:mt-[42px] mx-auto relative ">
				<img
					alt="Gambar Tokped"
					className=" hidden xl:block w-[816px] h-full "
					src={tokonglomerat}
				/>
				<div className=" absolute inset-0 xl:h-fit flex justify-center content-center md:h-fit">
					<div
						autoComplete="off"
						className="w-full xl:my-[50px] max-w-[400px] p-[41px] bg-white rounded-lg drop-shadow-2xl "
						aria-label="Login"
					>
						<h1 className="text-[22px] text-[#40444e] font-extrabold text-center font-tokpedFont">
							Login
						</h1>

						<div className="flex flex-col items-start mb-5 gap-y-3">
							<label htmlFor="email" className="text-sm font-medium cursor-pointer">
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
							<label htmlFor="password" className="text-sm font-medium cursor-pointer">
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
									<AiFillEye onClick={() => setshowPassword((showPassword) => !showPassword)} />
								) : (
									<AiFillEyeInvisible
										onClick={() => setshowPassword((showPassword) => !showPassword)}
									/>
								)}
							</div>
						</div>
						<a
							className=" text-[#0095DA] flex justify-end content-end mt-[18px] "
							href="/forgotpassword"
						>
							Forgot Password?
						</a>
						<button
							onClick={() => props.MyFunc.onLogin(email.current.value, password.current.value)}
							disabled={props.isDisable.disable}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white bg-[#0095DA] rounded-lg h-[60px]"
						>
							{props.isDisable.disable ? (
								<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
							) : (
								"Login"
							)}
						</button>

						{/* <a
							className=" justify-center underline text-[14px] text-[#0095DA] flex mt-[12px] "
							href="/loginadmin"
						>
							Log in as admin
						</a> */}

						<div className=" mt-[15px] flex items-center justify-center text-slate-400 text-[12px] ">
							<p>Don't have an account Tokonglomerat?</p>
							<a href="/register" className=" text-[#0095DA] underline">
								Register now
							</a>
							<Toaster />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
