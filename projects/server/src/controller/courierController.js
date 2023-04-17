const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { default: axios } = require("axios");

module.exports = {
	getJNE: async (req, res) => {
		let { origin, destination, weight } = req.body;
		let { uid } = req.uid;
		let key = "537ce8cebdded54aa4c17d563f8a5ea2";
		try {
			if (destination === 0) {
				let { user_addresses } = await db.user.findOne({
					where: { uid },
					include: { model: db.user_address, where: { main_address: true } },
				});
				destination = user_addresses[0].dataValues.city.split(".")[0];
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "jne" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By JNE Success",
					data: data.rajaongkir.results,
				});
			} else {
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "jne" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By JNE Success",
					data: data.rajaongkir.results,
				});
			}
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	getPOS: async (req, res) => {
		let { origin, destination, weight } = req.body;
		const { uid } = req.uid;
		let key = "537ce8cebdded54aa4c17d563f8a5ea2";
		try {
			if (destination === 0) {
				let { user_addresses } = await db.user.findOne({
					where: { uid },
					include: { model: db.user_address, where: { main_address: true } },
				});
				destination = user_addresses[0].dataValues.city.split(".")[0];
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "pos" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By POS Success",
					data: data.rajaongkir.results,
				});
			} else {
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "pos" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By POS Success",
					data: data.rajaongkir.results,
				});
			}
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	getTIKI: async (req, res) => {
		let { origin, destination, weight } = req.body;
		const { uid } = req.uid;
		let key = "537ce8cebdded54aa4c17d563f8a5ea2";
		try {
			if (destination === 0) {
				let { user_addresses } = await db.user.findOne({
					where: { uid },
					include: { model: db.user_address, where: { main_address: true } },
				});
				destination = user_addresses[0].dataValues.city.split(".")[0];
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "tiki" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By TIKI Success",
					data: data.rajaongkir.results,
				});
			} else {
				const { data } = await axios.post(
					"https://api.rajaongkir.com/starter/cost",
					{ origin, destination, weight, courier: "tiki" },
					{ headers: { key: key } }
				);
				res.status(201).send({
					isError: false,
					message: "Get Shipping Cost By TIKI Success",
					data: data.rajaongkir.results,
				});
			}
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
};
