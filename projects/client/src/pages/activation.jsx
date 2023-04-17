import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import tokonglomerat from "../support/assets/edit_register_new.png";
import REST_API from "../support/services/RESTApiService";

function Activation() {
	const Navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		onSubmit();
	});

	let onSubmit = async () => {
		try {
			 await REST_API({
				url: "/user/activation/uid",
				method: "PATCH",
				data: {
					uid: location.pathname.slice(12),
				},
			});

			setTimeout(() => {
				Navigate("/home");
			}, 3000);
		} catch (error) {
			error.response.data.message ? toast.error(error.response.data.message) : toast.error(error)		
		} finally {
		}
	};

	return (
		<div className=" max-h-screen overflow-hidden ">
			<div className=" mt-[20px] flex content-center justify-center">
				<h1 className=" font-bold text-4xl font-mandalaFont text-[#0095DA] ">tokonglomerat</h1>
			</div>
			<div className=" flex content-center justify-center max-w-sm h-screen xl:max-w-screen-2xl mx-auto">
				<div className=" xl:flex-row xl:block">
					<img
						className=" mt-[50px] h-fit w-[816px]"
						src={tokonglomerat}
						alt="Gambar Tokonglomerat"
					/>

					<p className=" flex items-center justify-center font-tokpedFont mt-[30px] font-bold text-4xl ">
						{" "}
						Activation Succcess
					</p>

					<p className="flex items-center justify-center font-tokpedFont ml-[15px] mt-[13px] text-[#6d7588] text-[13px]">
						Join and feel the convenience of making transactions at Tokonglomerat
					</p>
				</div>
				<Toaster />
			</div>
		</div>
	);
}

export default Activation;
