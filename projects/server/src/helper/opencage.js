const openCage = require("opencage-api-client");
const API_KEY = "940b065121b049f09ed5ba0d61d45250";

module.exports = {
	forward: async ({ query, limit = 1, code, proximity }) => {
		try {
			const props = { key: API_KEY, q: query, limit };
			if (code) {
				props.code = code;
			}
			if (proximity) {
				props.proximity = proximity;
			}
			const data = await openCage.geocode(props);
			if (data?.status?.code != 200) {
				throw new Error("Fetch Open Cage Failed");
			}

			return { isError: false, message: "Fetch OpenCage Success", data };
		} catch (error) {
			return { isError: true, message: error.message, data: null };
		}
	},
	backward: async ({ lat, long, limit = 1, code, proximity }) => {
		try {
			const query = String(lat) + String(long);
			const props = { key: API_KEY, q: query, limit };
			if (code) {
				props.code = code;
			}
			if (proximity) {
				props.proximity = proximity;
			}
			const data = await openCage.geocode(props);
			if (data?.status?.code != 200) {
				throw new Error("Fetch Open Cage Failed");
			}

			return { isError: false, message: "Fetch OpenCage Success", data };
		} catch (error) {
			return { isError: true, message: error.message, data: null };
		}
	},
};
