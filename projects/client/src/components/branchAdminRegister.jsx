import { useEffect, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";

import LoadingSpin from "react-loading-spin";
import axios from "axios";
import REST_API from "../support/services/RESTApiService";

function BranchAdminRegister() {
	const [showPassword, setshowPassword] = useState();
	const [disable, setdisable] = useState(false);
	const [errEmail, seterrEmail] = useState();
	const [errPassword, seterrPassword] = useState();
	const [branch, setBranch] = useState([]);

	const inputEmail = useRef();
	const inputPassword = useRef();
	const inputBranch = useRef();

	let getBranchAvailable = async () => {
		try {
			// let response = await axios.get(
			// 	`http://localhost:8000/admin/branch-admin-available`,
			// 	{
			// 		headers: {
			// 			token: localStorage.getItem("token"),
			// 		},
			// 	}
			// );

			let response = await REST_API({
				url: "/admin/branch-admin-available",
				method: "GET",
			});

			console.log(response.data.data);
			setBranch(response.data.data);
		} catch (error) {}
	};

	useEffect(() => {
		getBranchAvailable();
	}, []);

	let onSubmit = async () => {
		try {
			setdisable(true);
			// let { data } = await axios.post(
			// 	"http://localhost:8000/admin/register",
			// 	{
			// 		email: inputEmail.current.value,
			// 		password: inputPassword.current.value,
			// 		branch_id: inputBranch.current.value,
			// 	},
			// 	{
			// 		headers: {
			// 			token: localStorage.getItem("token"),
			// 		},
			// 	}
			// );

			let { data } = await REST_API({
				url: "/admin/register",
				method: "POST",
				data: {
					email: inputEmail.current.value,
					password: inputPassword.current.value,
					branch_id: inputBranch.current.value,
				},
			});

			console.log(data);
			toast.success(data.message);

			inputEmail.current.value = "";
			inputPassword.current.value = "";

			setTimeout(() => {
				window.location.href =
					"https://jcwd230202.purwadhikabootcamp.com/admin/branch-admin-register";
			}, 2500);
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
			seterrPassword("Please input your password");
		} else if (value.length < 8) {
			seterrPassword("Password less than 8 character, please input more");
		} else if (
			!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(
				value
			)
		) {
			seterrPassword("Password must contain number and capital");
		} else {
			seterrPassword("");
		}
	};

	return (
		<div className=" px-4 flex justify-center overflow-hidden ">
			<form
				autoComplete="off"
				className="w-full max-w-[400px] xl:h-fit p-10 bg-white rounded-lg "
				aria-label="register now"
			>
				<h1 className="text-[22px] text-[#40444e] font-extrabold text-center font-tokpedFont">
					Register Branch Admin
				</h1>

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
					<label
						htmlFor="password"
						className="text-sm font-medium cursor-pointer"
					>
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
							<AiFillEye
								onClick={() => setshowPassword((showPassword) => !showPassword)}
							/>
						) : (
							<AiFillEyeInvisible
								onClick={() => setshowPassword((showPassword) => !showPassword)}
							/>
						)}
					</div>
					<div className="flex flex-col items-start mb-5 gap-y-3">
						<label
							htmlFor="email"
							className="text-sm font-medium cursor-pointer"
						>
							Select Branch
						</label>
						<select
							// onChange={(e) => onGetData(e.target.value)}
							ref={inputBranch}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						>
							<option disabled selected>
								Select Location Available
							</option>
							{branch
								? branch.map((value, index) => {
										return <option value={value.id}>{value.location}</option>;
								  })
								: null}
						</select>
					</div>
				</div>

				<button
					type="submit"
					className="inline-flex w-full items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide hover:bg-gray-300 text-white bg-[#0095DA]  rounded-lg h-[60px]"
					disabled={disable}
					onClick={() => onSubmit()}
				>
					{disable ? (
						<LoadingSpin
							size={"30px"}
							primaryColor={"red"}
							secondaryColor={"gray"}
						/>
					) : (
						"Create an Admin Branch account"
					)}
				</button>
				<Toaster />
			</form>
		</div>
	);
}
export default BranchAdminRegister;
