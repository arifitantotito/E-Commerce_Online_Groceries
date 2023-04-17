import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpin from "react-loading-spin";
import { useNavigate } from "react-router-dom";
import tokonglomerat from "../support/assets/new_login.png";
import REST_API from "../support/services/RESTApiService";

function ForgotPass() {
	const [disable, setdisable] = useState(false);
	const [message, setmessage] = useState();

	const email = useRef();
	const Navigate = useNavigate();

	let onForgotPass = async () => {
		try {
			setdisable(true);
			const { data } = await REST_API({
				url: "/user/forgot-password",
				method: "POST",
				data: {
					email: email.current.value,
				},
			});
			toast.success(data.message);
			email.current.value = "";
			setTimeout(() => {
				Navigate("/login");
			}, 3000);
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			setdisable(false);
		}
	};
	let onValidateEmail = (value) => {
		if (value === "") {
			setmessage("Please input your email");
		} else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value)) {
			setmessage("Format Email Invalid");
		} else {
			setmessage("");
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
							Forgot Password
						</h1>

						<div className="flex flex-col items-start mb-5 gap-y-3">
							<label htmlFor="email" className="text-sm font-medium cursor-pointer">
								Email
							</label>
							<input
								onChange={(e) => onValidateEmail(e.target.value)}
								ref={email}
								type={"email"}
								className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-red-700"
								placeholder="Enter your email address"
							/>
							<div className=" text-red-700 font-tokpedFont text-sm font-semibold ">
								{message ? message : null}
							</div>
						</div>

						<button
							onClick={() => onForgotPass()}
							type="submit"
							disabled={disable}
							className="inline-flex w-full items-center justify-center mt-8 px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white bg-[#0095DA] rounded-lg h-[60px]"
						>
							{disable ? (
								<LoadingSpin size={"30px"} primaryColor={"#38ADE3"} secondaryColor={"gray"} />
							) : (
								"Submit"
							)}
						</button>
					</div>
					<Toaster />
				</div>
			</div>
		</div>
	);
}

export default ForgotPass;
