const { sequelize } = require("./models");

sequelize
	.authenticate()
	.then(() => {
		sequelize.sync({ alter: true });
	})
	.then(() => {
		console.log("Database Synced");
	})
	.catch((error) => {
		console.log(error);
	});
