import { useRef, useState } from "react";
import tokonglomerat from "../support/assets/new_login.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpin from "react-loading-spin";
import { toast, Toaster } from "react-hot-toast";
import REST_API from "../support/services/RESTApiService";
function UpdatePassword() {
	const [showPassword, setshowPassword] = useState(false);
	const [showconfPass, setshowconfPass] = useState(false);
	const [message, setmessage] = useState();
	const [disable, setdisable] = useState(false);
	const [msg, setmsg] = useState();

	const Navigate = useNavigate();

	const pass = useRef();
	const confPass = useRef();

	const location = useLocation();

	let onSubmit = async () => {
		try {
			setdisable(true);
			const { data } = await REST_API({
				url: "/user/reset-password/uid",
				method: "PATCH",
				data: {
					uid: location.pathname.slice(16),
					password: pass.current.value,
					confPassword: confPass.current.value,
				},
			});

			toast.success(data.message);
			pass.current.value = "";
			confPass.current.value = "";

			setTimeout(() => {
				Navigate("/login");
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setdisable(false);
		}
	};
	let onValidatePassword = (value) => {
		if (value === "") {
			setmessage("Please input your new password");
		} else if (value.length < 8) {
			setmessage("Password less than 8 character, please input more");
		} else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value)) {
			setmessage("Password must contain number and capital");
		} else {
			setmessage("");
		}
	};
	let onValidateConfPassword = (value) => {
		if (value === "") {
			setmsg("Please input your confirm password");
		} else if (value.length < 8) {
			setmsg("Password less than 8 character, please input more");
		} else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value)) {
			setmsg("Password must contain number and capital");
		} else {
			setmsg("");
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
					className=" hidden xl:block w-[816px] h-full"
					src={tokonglomerat}
				/>
				<div className=" absolute inset-0 xl:h-fit flex justify-center content-center   ">
					<div
						autoComplete="off"
						className="w-full xl:my-[50px] max-w-[400px] p-[41px] bg-white rounded-lg drop-shadow-2xl "
						aria-label="Login"
					>
						<h1 className="text-[22px] text-[#40444e] mb-7 font-extrabold text-center font-tokpedFont">
							Update Password
						</h1>

						<div className="flex flex-col relative my-5 items-start gap-y-3">
							<label htmlFor="password" className="text-sm font-medium cursor-pointer">
								New Password
							</label>

							<input
								onChange={(e) => onValidatePassword(e.target.value)}
								ref={pass}
								type={showPassword ? "text" : "password"}
								className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
								placeholder="Enter your new password"
							/>
							<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
								{message ? message : null}
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
						<div className="flex flex-col relative items-start gap-y-3">
							<label htmlFor="password" className="text-sm font-medium cursor-pointer">
								Confirm Password
							</label>

							<input
								onChange={(e) => onValidateConfPassword(e.target.value)}
								ref={confPass}
								type={showconfPass ? "text" : "password"}
								className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
								placeholder="Confirm your new password"
							/>
							<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
								{msg ? msg : null}
							</div>
							<div className=" text-2xl absolute right-5 top-12">
								{showconfPass ? (
									<AiFillEye onClick={() => setshowconfPass((showconfPass) => !showconfPass)} />
								) : (
									<AiFillEyeInvisible
										onClick={() => setshowconfPass((showconfPassword) => !showconfPassword)}
									/>
								)}
							</div>
						</div>

						<button
							onClick={() => onSubmit()}
							disabled={disable}
							type="submit"
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white bg-[#0095DA] rounded-lg h-[60px]"
						>
							{disable ? (
								<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
							) : (
								"Submit"
							)}
						</button>
						<Toaster />
					</div>
				</div>
			</div>
		</div>
	);
}

export default UpdatePassword;
