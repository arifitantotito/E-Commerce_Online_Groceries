const db = require("../models");
const axios = require("axios");
(async () => {
	const ua1 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=kebumen+jawa+tengah&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
	);
	await db.user_address.create({
		address:
			"Watu Pundutan, Jl. Raya Logandu, Tegong, Clapar, Kec. Karanggayam",
		province: "10.Jawa Tengah",
		city: "177.Kebumen",
		receiver_name: "Aswin",
		receiver_phone: "0899922111",
		lat: ua1.data.results[0].geometry.lat,
		lng: ua1.data.results[0].geometry.lng,
		main_address: true,
		user_id: 1,
	});
	const ua2 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=jepara+jawa+tengah&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
	);
	await db.user_address.create({
		address:
			"Jl. Alamanda Perum No.10, Sokanandi, Limbangan, Kec. Banjarnegara",
		province: "10.Jawa Tengah",
		city: "163.Jepara",
		receiver_name: "Ashfi",
		receiver_phone: "0811999213",
		lat: ua2.data.results[0].geometry.lat,
		lng: ua2.data.results[0].geometry.lng,
		main_address: true,
		user_id: 2,
	});
	const ua3 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=jakarta+barat&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
	);
	await db.user_address.create({
		address: "Jl. Bahagia Blok E7/26",
		province: "6.DKI Jakarta",
		city: "151.Jakarta Barat",
		receiver_name: "Nathan",
		receiver_phone: "082246704951",
		lat: ua3.data.results[0].geometry.lat,
		lng: ua3.data.results[0].geometry.lng,
		main_address: true,
		user_id: 3,
	});
	const ua4 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=bantul+yogyakarta&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
	);
	await db.user_address.create({
		address:
			"Jl. Malioboro No.39, Sosromenduran, Gedong Tengen, Kota Yogyakarta",
		province: "5.DI Yogyakarta",
		city: "39.Bantul",
		receiver_name: "Rafli",
		receiver_phone: "08227649501",
		lat: ua4.data.results[0].geometry.lat,
		lng: ua4.data.results[0].geometry.lng,
		main_address: true,
		user_id: 4,
	});
	const ua5 = await axios.get(
		`https://api.opencagedata.com/geocode/v1/json?q=bandung+jawa+barat&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
	);
	await db.user_address.create({
		address: "Jl. Veteran No.32, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung",
		province: "9.Jawa Barat",
		city: "23.Bandung",
		receiver_name: "Tito",
		receiver_phone: "081290884747",
		lat: ua5.data.results[0].geometry.lat,
		lng: ua5.data.results[0].geometry.lng,
		main_address: true,
		user_id: 5,
	});
})();
