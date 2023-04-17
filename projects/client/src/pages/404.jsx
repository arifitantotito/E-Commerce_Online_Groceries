import { useNavigate } from "react-router-dom";

function NotFoundPage() {
	let navigate = useNavigate();

	return (
		<div className=" h-screen flex items-center">
			<div className="justify-around flex-row sm:flex items-center mx-auto w-[1000px] h-80">
				<div className="font-mandalaFont">
					<h1 className="font-mandalaFont text-[#0095DA] text-7xl">
						tokonglomerat
					</h1>
					<br className="bg-red-800" />
				</div>
				<div className="flex-row  sm:border-l-2  border-[#C0C0C0]  sm:pl-36">
					<h1 className=" text-9xl text-center">404</h1>
					<h2 className="text-center text-xl">You Seems Lost</h2>

					<h3 className="text-center">
						<button
							onClick={() => navigate(-1)}
							className=" w-20 rounded text-center text-[#0095DA]  hover:text-white hover:bg-[#0095DA]"
						>
							Go Back
						</button>
					</h3>
				</div>
			</div>
		</div>
	);
}

export default NotFoundPage;
