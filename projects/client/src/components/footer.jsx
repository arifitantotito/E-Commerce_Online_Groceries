import React from "react";
import { BiPhoneCall, BiMailSend } from "react-icons/bi";
import { SlEarphonesAlt } from "react-icons/sl";
import { Button } from "flowbite-react";

export default function FooterBar() {
	return (
		<footer className="border-t-8 border-[#0095da] mt-36 mb-5">
			<div className="hidden pt-3 px-64 text-sm lg:grid grid-cols-5">
				<div className="space-y-1">
					<h2 className="font-semibold pb-1">BANTUAN</h2>
					<p>Pembayaran</p>
					<p>Pengiriman</p>
					<p>Status pengiriman</p>
					<p>Pengembalian product</p>
					<p>tokonglomerat ticket rewards</p>
					<p>Cara berbelanja</p>
					<p>Hubungi kami</p>
				</div>
				<div className="space-y-1">
					<h2 className="font-semibold pb-1">CUSTOMER CARE</h2>
					<p>Buka 24 jam setiap hari</p>
					<div className="flex items-center space-x-1">
						<BiPhoneCall />
						<p>0888-888-8888</p>
					</div>
					<div className="flex items-center space-x-1">
						<BiMailSend />
						<p>customer-care@tokonglomerat.com</p>
					</div>
					<Button className="!bg-[#0095da]">Pusat Bantuan</Button>
					<h2 className="font-semibold pb-1 pt-2">
						LAYANAN PENGADUAN KONSUMEN
					</h2>
					<p>Direktorat Jenderal Perlindungan</p>
					<p>Konsumen dan Tertib Niaga</p>
					<p>Kementerian Perdagangan RI</p>
					<div className="flex items-center">
						<BiPhoneCall />
						<p>085311111010</p>
					</div>
				</div>
				<div className="space-y-1">
					<h2 className="font-semibold pb-1">INFO TOKONGLOMERAT</h2>
					<p>Blog tokonglomerat Friends</p>
					<p>Siaran Pers</p>
					<p>Kabar Terbaru</p>
					<p>Karir</p>
					<p>Ketentuan dan kebijakan privasi</p>
					<p>Hak kekayaan intelektual</p>
					<p>Sahabat ibu pintar</p>
					<p>Sahabat perjalananmu</p>
					<p>Sahabat main</p>
					<p>tokonglomerat cinta bumi</p>
				</div>
				<div className="space-y-1">
					<h2 className="font-semibold pb-1">KERJASAMA</h2>
					<p>Affiliate program</p>
					<p>Jual di tokonglomerat</p>
					<p>B2B Program</p>
					<p>Travel for business</p>
					<h2 className="font-semibold pb-1 pt-2">TOKONGLOMERAT FAMILY</h2>
					<img src={require("../support/assets/logo/download.png")} alt="" />
					<img
						src={require("../support/assets/logo/download (1).png")}
						alt=""
					/>
				</div>
				<div className="space-y-1">
					<h2 className="font-semibold pb-1">IKUTI KAMI</h2>
					<div className="flex space-x-1">
						<img
							src={require("../support/assets/logo/download (2).png")}
							alt=""
						/>
						<img
							src={require("../support/assets/logo/download (3).png")}
							alt=""
						/>
						<img
							src={require("../support/assets/logo/download (4).png")}
							alt=""
						/>
						<img
							src={require("../support/assets/logo/download (5).png")}
							alt=""
						/>
					</div>
				</div>
			</div>
			<div className="lg:hidden pt-2 space-y-3">
				<div className="flex items-center space-x-1 justify-center">
					<SlEarphonesAlt />
					<p>Butuh bantuan?</p>
					<p className="text-[#0095da]">Hubungi kami</p>
				</div>
				<div className="px-4">
					<p className="text-xs">
						Blibli, Toko Online Terlengkap & Terpercaya Dengan Beragam Produk
						Pilihan Serta Promo Menarik
					</p>
				</div>
				<div className="bg-gray-200 p-3 flex flex-col justify-center items-center">
					<p className="text-xs">
						tokonglomerat © 2023 | Toko online dengan sensasi belanja ala mall.
					</p>
					<div className="flex space-x-1 text-xs text-[#0095da]">
						<p>Syarat & Ketentuan</p>
						<p>|</p>
						<p>Kebijakan Privasi</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
