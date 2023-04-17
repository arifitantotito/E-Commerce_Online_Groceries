import { BiSearchAlt, BiCart } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Dropdown } from "flowbite-react";

export default function NavigationBar(props) {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
		if (location.pathname === "/") navigate("/home");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<div className="lg:grid grid-cols-12 hidden fixed py-6 px-8 shadow-md max-w-screen w-full bg-[#0095DA] z-50">
				<button
					onClick={() => navigate("/home")}
					className="hidden lg:block col-span-3 font-mandalaFont font-extrabold text-xl text-white xl:text-4xl"
				>
					<p className="drop-shadow-md tracking-wide">tokonglomerat</p>
				</button>
				<div className=" col-span-6 relative flex items-center">
					<input
						type="text"
						className=" pl-10 py-5 h-7 rounded-lg border-gray-300 w-full"
						placeholder="Cari di tokonglomerat"
					/>
					<BiSearchAlt className="text-2xl text-gray-500 absolute top-[10px] left-1" />
				</div>
				<div className="flex justify-center text-white gap-7">
					<button
						onClick={() =>
							localStorage.getItem("token")
								? navigate("/cart")
								: navigate("/login")
						}
					>
						<BiCart className="text-2xl" />
					</button>
				</div>
				{localStorage.getItem("token") ? (
					<>
						<div className="sm:hidden col-span-2 pr-20 lg:flex text-white items-center justify-end space-x-2">
							<button onClick={() => navigate("/user/profile")}>
								<p className="text-lg font-semibold">
									{props.state.profile.name}
								</p>
							</button>
							<button
								className="hidden lg:block"
								onClick={() => props.Func.onLogout()}
							>
								<AiOutlineLogout className="text-md" />
							</button>
						</div>
						<div className="flex items-center justify-center lg:hidden">
							<Dropdown className="!text-[#0095da]" inline={true}>
								<Dropdown.Item
									onClick={() => navigate("/user/profile")}
									className="flex space-x-1"
								>
									<CgProfile />
									<p>Profile</p>
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => props.Func.onLogout()}
									className="flex space-x-1"
								>
									<AiOutlineLogout />
									<p>Log Out</p>
								</Dropdown.Item>
							</Dropdown>
						</div>
					</>
				) : (
					<div className="col-span-2 grid grid-cols-2 gap-4">
						<button
							onClick={() => navigate("/login")}
							className="font-semibold border-[2px] text-white rounded-lg px-2 py-1"
						>
							<p>Login</p>
						</button>
						<button
							onClick={() => navigate("/register")}
							className="font-semibold text-[#0095DA] bg-white rounded-lg px-2 py-1"
						>
							<p>Register</p>
						</button>
					</div>
				)}
			</div>
			<div className="flex lg:hidden fixed py-4 px-8 shadow-md max-w-screen w-full bg-[#0095DA] z-50 space-x-1">
				<div className="relative flex items-center">
					<input
						type="text"
						className=" pl-10 py-5 h-7 rounded-lg border-gray-300 w-full"
						placeholder="Cari di tokonglomerat"
					/>
					<BiSearchAlt className="text-2xl text-gray-500 absolute top-[10px] left-1" />
				</div>
				<div className="flex justify-center text-white">
					<button
						onClick={() =>
							localStorage.getItem("token")
								? navigate("/cart")
								: navigate("/login")
						}
					>
						<BiCart className="text-2xl" />
					</button>
				</div>
				{localStorage.getItem("token") ? (
					<>
						<div className="flex lg:hidden items-center justify-center text-white">
							<p className="text-lg font-semibold">
								{props.state.profile.name}
							</p>
						</div>
						<div className="flex items-center justify-center lg:hidden">
							<Dropdown className="" inline={true}>
								<Dropdown.Item
									onClick={() => navigate("/user/profile")}
									className="flex space-x-1"
								>
									<CgProfile />
									<p>Profile</p>
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => props.Func.onLogout()}
									className="flex space-x-1"
								>
									<AiOutlineLogout />
									<p>Log Out</p>
								</Dropdown.Item>
							</Dropdown>
						</div>
					</>
				) : (
					<div className="col-span-2 grid grid-cols-2 gap-4">
						<button
							onClick={() => navigate("/login")}
							className="font-semibold border-[2px] text-white rounded-lg px-2 py-1"
						>
							<p>Login</p>
						</button>
						<button
							onClick={() => navigate("/register")}
							className="font-semibold text-[#0095DA] bg-white rounded-lg px-2 py-1"
						>
							<p>Register</p>
						</button>
					</div>
				)}
			</div>
			<Outlet />
		</>
	);
}
