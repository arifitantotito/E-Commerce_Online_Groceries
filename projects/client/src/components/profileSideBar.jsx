import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Modal, Label, Button, Spinner } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import REST_API from "../support/services/RESTApiService";
import FooterBar from "../components/footer";

export default function ProfileSideBar(props) {
	const navigate = useNavigate();
	const [img, setimg] = useState();
	const [show, setshow] = useState(false);
	const onSubmitPP = async () => {
		const fd = new FormData();
		try {
			fd.append("images", img);
			await REST_API({
				url: "/user/profile/picture",
				method: "PATCH",
				data: fd,
			});
			toast("Profile picture updated");
			props.func.getProfile();
			setshow({ ...show, changeProfilePic: false });
		} catch (error) {
			toast.error("Upload image failed");
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

	return (
		<>
			<div className="pt-28 max-w-screen-xl mx-auto grid grid-cols-5">
				<div className="hidden lg:block">
					<img
						src={
							props.state.profile.profile_picture
								? `https://jcwd230202.purwadhikabootcamp.com/${props.state.profile.profile_picture}`
								: ""
						}
						alt="Profile"
						className="h-64 w-80 shadow-md object-cover rounded-full"
					/>
					<div className="pt-3 flex flex-col items-center justify-center">
						<h3>{props.state.profile.name}</h3>
						<button onClick={() => setshow(true)} className="text-[#0095da]">
							Change profile picture
						</button>
					</div>
					<div className="flex items-start justify-center">
						<button
							id="profile"
							onClick={() => {
								navigate("/user/profile");
							}}
							className={`py-3 border-b-[1px] w-full ${
								props.state.selected === "profile"
									? "border-l-[#0095da] border-l-8"
									: null
							}`}
						>
							Profile
						</button>
					</div>
					<div className="flex items-start justify-center">
						<button
							onClick={() => {
								navigate("/user/transaction");
							}}
							className={`py-3 border-b-[1px] w-full focus:border-l-8 focus:border-l-[#0095da] ${
								props.state.selected === "transaction"
									? "border-l-[#0095da] border-l-8"
									: null
							}`}
						>
							Transaction
						</button>
					</div>
				</div>
				<div className="col-span-4">
					<Outlet />
				</div>
			</div>
			<FooterBar />
			<Modal
				show={show}
				size="md"
				popup={true}
				onClose={() => setshow(false)}
				id="name modal"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Change your profile picture
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
							{show.loading ? (
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
			<Toaster />
		</>
	);
}
