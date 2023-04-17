const db = require("../sequelize/models");

function calcCrow(lat1, lon1, lat2, lon2) {
	const R = 6371;
	const Lat1 = (parseFloat(lat1) * Math.PI) / 180;
	const Lat2 = (parseFloat(lat2) * Math.PI) / 180;
	const dLat = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180;
	const dLon = ((parseFloat(lon2) - parseFloat(lon1)) * Math.PI) / 180;

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(Lat1) * Math.cos(Lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c;
	return d;
}

async function getProximity(userAddressLat, userAddressLng) {
	let proximity = [];
	try {
		const data = await db.branch.findAll();
		data.forEach((value) => {
			proximity.push({
				id: value.id,
				distance: parseFloat(
					calcCrow(
						userAddressLat,
						userAddressLng,
						value.lat,
						value.lng
					).toFixed(1)
				),
			});
		});
		for (let i = 0; i < proximity.length; i++) {
			if (proximity[i + 1] === undefined) break;
			if (proximity[i].distance > proximity[i + 1].distance) {
				let comp = proximity[i];
				proximity[i] = proximity[i + 1];
				proximity[i + 1] = comp;
				i = -1;
			}
		}
	} catch (error) {
		console.log(error);
	}
	return proximity;
}

module.exports = getProximity;
