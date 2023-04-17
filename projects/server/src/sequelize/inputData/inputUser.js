const db = require("../models");

(async () => {
	await db.stock_history.bulkCreate([
		{
			stock: 9870,
			branch_id: 1,
			product_id: 1,
		},
		{
			stock: 9840,
			branch_id: 1,
			product_id: 1,
		},
		{
			stock: 9800,
			branch_id: 1,
			product_id: 1,
		},
		{
			stock: 9900,
			branch_id: 1,
			product_id: 1,
		},
		{
			stock: 9850,
			branch_id: 1,
			product_id: 1,
		},
		{
			stock: 9800,
			branch_id: 1,
			product_id: 1,
		},
		// {
		// 	name: "nathan",
		// 	email: "nathan2@gmail.com",
		// 	password: "asdfasdf12341234",
		// 	phone_number: 123412341,
		// },
		// {
		// 	name: "nathan",
		// 	email: "nathan3@gmail.com",
		// 	password: "asdfasdf12341234",
		// 	phone_number: 123412341,
		// },
		// {
		// 	name: "nathan",
		// 	email: "nathan4@gmail.com",
		// 	password: "asdfasdf12341234",
		// 	phone_number: 123412341,
		// },
	]);
})();
