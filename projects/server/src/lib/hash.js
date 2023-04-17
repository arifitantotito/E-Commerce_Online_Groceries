require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALTROUNDS);

module.exports = {
	hashPassword: async (password) => {
		try {
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			return null;
		}
	},

	matchPassword: async (inputPw, hashedPw) => {
		try {
			return await bcrypt.compare(inputPw, hashedPw);
		} catch (error) {
			return false;
		}
	},
};
