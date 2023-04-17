require("dotenv").config();
const jwt = require("jsonwebtoken");
const key = process.env.JWT_KEY;

module.exports = {
	createToken: (payload) => {
		return jwt.sign(payload, String(key), {
			expiresIn: "30d",
		});
	},

	validateToken: (token) => {
		return jwt.verify(token, String(key));
	},
};
