require("dotenv").config();
const db = require("../models");
const axios = require("axios");
const { hashPassword } = require("../../lib/hash");

const user = async () => {
	let pass_1 = "Aswin123456";
	let pass_2 = "Ashfi123456";
	let pass_3 = "Nathan123456";
	await db.user.bulkCreate([
		{
			name: "aswin",
			email: "aswin05.aw@gmail.com",
			password: await hashPassword(pass_1),
			phone_number: "087805667895",
			gender: "Male",
			birthdate: "1999-01-01",
			role: "Super Admin",
			status: "Verified",
		},
		{
			name: "ashfi",
			email: "ashfimzk@gmail.com",
			password: await hashPassword(pass_2),
			phone_number: "085156004326",
			gender: "Male",
			birthdate: "1999-01-01",
			role: "Branch Admin",
			status: "Verified",
		},
		{
			name: "nathan",
			email: "veanusnathan.work@gmail.com",
			password: await hashPassword(pass_3),
			phone_number: "082246704951",
			gender: "Male",
			birthdate: "1999-01-01",
			role: "Branch Admin",
			status: "Verified",
		},
		{
			name: "nathan1",
			email: "vn6299@gmail.com",
			password: await hashPassword(pass_3),
			phone_number: "082246704951",
			gender: "Male",
			birthdate: "1999-01-01",
			role: "user",
			status: "Verified",
		},
		{
			name: "nathan2",
			email: "veanusnathan68@gmail.com",
			password: await hashPassword(pass_3),
			phone_number: "082246704951",
			gender: "Male",
			birthdate: "1999-01-01",
			role: "user",
			status: "Verified",
		},
	]);
};

const category = async () => {
	await db.category.bulkCreate([
		{
			name: "Vegetables",
			img: "https://assets.segari.id/categories/v3/new/sayuran_medium.png",
		},
		{
			name: "Fruit",
			img: "https://assets.segari.id/categories/v3/new/buah_medium.png",
		},
		{
			name: "Proteins",
			img: "https://assets.segari.id/categories/v3/new/protein_medium.png",
		},
		{
			name: "Drink",
			img: "https://assets.segari.id/categories/v3/new/minuman_medium.png",
		},
		{
			name: "Groceries",
			img: "https://assets.segari.id/categories/v3/new/sembako_medium.png",
		},
		{
			name: "Kitchenware",
			img: "https://assets.segari.id/categories/v3/new/peralatan_dapur_medium.png",
		},
		{
			name: "Self Care",
			img: "https://assets.segari.id/categories/v3/new/perawatan_diri_medium.png",
		},
		{
			name: "Instant Food",
			img: "https://assets.segari.id/categories/v3/new/makanan_instan_medium.png",
		},
		{
			name: "Healthcare",
			img: "https://assets.segari.id/categories/v3/new/kesehatan_medium.png",
		},
		{
			name: "Snacks",
			img: "https://assets.segari.id/categories/v3/new/makanan_ringan_medium.png",
		},
		{
			name: "Condiments",
			img: "https://assets.segari.id/categories/v3/new/saus_dan_kondimen_medium.png",
		},
		{
			name: "Dairy",
			img: "https://assets.segari.id/categories/v3/new/susu_dan_olahan_susu_medium.png",
		},
		{
			name: "Bakery",
			img: "https://assets.segari.id/categories/v3/new/roti_medium.png",
		},
		{
			name: "Frozen Goods",
			img: "https://assets.segari.id/categories/v3/new/produk_beku_medium.png",
		},
		{
			name: "Spices",
			img: "https://assets.segari.id/categories/v3/new/bumbu_masak_medium.png",
		},
		{
			name: "Breakfast",
			img: "https://assets.segari.id/categories/v3/new/sarapan_medium.png",
		},
		{
			name: "Home Cleaning",
			img: "https://assets.segari.id/categories/v3/new/kebersihan_medium.png",
		},
		{
			name: "Birds",
			img: "https://assets.segari.id/categories/v3/new/unggas_medium.png",
		},
		{
			name: "Meats",
			img: "https://assets.segari.id/categories/v3/new/daging_medium.png",
		},
		{
			name: "Seafoods",
			img: "https://assets.segari.id/categories/v3/new/seafood_medium.png",
		},
	]);
};

const unit = async () => {
	await db.unit.bulkCreate([
		{ name: "Kg", price_at: 1 },
		{ name: "Gram", price_at: 100 },
		{ name: "Dozen", price_at: 1 },
		{ name: "Liter", price_at: 1 },
		{ name: "Pcs", price_at: 1 },
	]);
};

const discount = async () => {
	await db.discount.bulkCreate([
		{ name: "Buy 1 Free 1" },
		{ name: "Minimum item" },
		{ name: "Discount" },
	]);
};

const branch = async () => {
	const branch1 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=kembangan+selatan&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Jakarta",
		address:
			"Jl. Puri Indah Raya, RT.3/RW.2, Kembangan Sel., Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta",
		lat: branch1.data.results[0].geometry.lat,
		lng: branch1.data.results[0].geometry.lng,
		city_code: "151.Jakarta Barat",
	});

	const branch2 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=Sumur+Bandung,+bandung&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Bandung",
		address:
			"Jl. Braga No.99-101, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat",
		lat: branch2.data.results[0].geometry.lat,
		lng: branch2.data.results[0].geometry.lng,
		city_code: "23.Bandung",
	});

	const branch3 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=Suryatmajan&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Yogyakarta",
		address:
			"Jl. Mataram No.31, Suryatmajan, Kec. Danurejan, Kota Yogyakarta, Daerah Istimewa Yogyakarta",
		lat: branch3.data.results[0].geometry.lat,
		lng: branch3.data.results[0].geometry.lng,
		city_code: "501.Yogyakarta",
	});

	const branch4 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=sekayu&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Semarang",
		address:
			"Jl. Pemuda No.118, Sekayu, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah",
		lat: branch4.data.results[0].geometry.lat,
		lng: branch4.data.results[0].geometry.lng,
		city_code: "399.Semarang",
	});

	const branch5 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=karang+asam+ulu&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Kalimantan",
		address:
			"Jl. Untung Suropati No.08, Karang Asam Ulu, Kec. Sungai Kunjang, Kota Samarinda, Kalimantan Timur",
		lat: branch5.data.results[0].geometry.lat,
		lng: branch5.data.results[0].geometry.lng,
		city_code: "387.Samarinda",
	});

	const branch6 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=penambungan&key=${process.env.OPENCAGE_API}&language=en&pretty=1`
	);
	await db.branch.create({
		location: "Sulawesi",
		address:
			"Jl. Metro Tj. Bunga No.2, Panambungan, Kec. Mariso, Kota Makassar, Sulawesi Selatan",
		lat: branch6.data.results[0].geometry.lat,
		lng: branch6.data.results[0].geometry.lng,
		city_code: "254.Makassar",
	});
};

category();
unit();
discount();
branch();
user();
