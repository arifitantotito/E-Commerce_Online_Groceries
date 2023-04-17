const db = require("../sequelize/models");
const geoCode = require("../helper/opencage");

module.exports = {
	forward: async (req, res) => {
		const { query, code, proximity } = req.query;
		const data = await geoCode.forward({ query, code, proximity });
		if (data.isError) {
			return res.status(500).send(data);
		}

		res.status(200).send(data);
	},
	backward: async (req, res) => {
		const { lat, long, code, proximity } = req.query;
		const data = await geoCode.backward({lat, long, code, proximity });
		if (data.isError) {
			return res.status(500).send(data);
		}

		res.status(200).send(data);
	},
	distance: async(req,res) => {
		const {lat1, long1, lat2, long2} = req.query

		let mapobj = Map.newDirectionFinder()
		
	}
};
