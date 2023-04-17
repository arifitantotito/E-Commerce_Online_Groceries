const db = require("../sequelize/models");
// const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { sequelize } = require("../sequelize/models");
const HTTPStatus = require("../helper/HTTPStatus");

const { hashPassword, matchPassword } = require("../lib/hash");
// Import JWT
const { createToken } = require("../lib/jwt");

module.exports = {
	salesReport: async (req, res) => {
		const token = req.uid;

		const { filter, report, sort, page } = req.query;
		const filterBy = filter ? filter.split("/") : "";
		const sortBy = sort ? sort.split("-") : "";

		let admin_branch_id;
		let data;

		try {
			let admin = await db.user.findOne({
				where: {
					uid: token.uid,
				},
				include: { model: db.branch },
			});

			let role = admin.role;

			if (role === "branch admin") {
				admin_branch_id = admin.branch.id;
			}
			if (role === "super admin") {
				// 1. Report by User
				if (report === "user") {
					// 1.1 report by user using date range filter
					if (filterBy) {
						// 1.1.a report user using date range and make the list asc/ desc
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["createdAt", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.1.b report user using date range and make the list from income asc/desc
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["total_price", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.1.c report by user with date range and without sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								group: ["user_id"],
								include: { model: db.user, attributes: ["name", "id"] },
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					} else {
						// 1.2. report by user without any date range filter
						// 1.2.a report by user without any date range filter but sort with date asc/desc
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["createdAt", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// 1.2.b report by user without any date range filter but sort with income asc/desc
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["total_price", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.2.c report by user without any date range and without sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
					//2. report by transaction
				} else if (report === "transaction") {
					// 2.1 report by user using date range filter
					if (filterBy) {
						//2.1.a transaction sort with date sort (asc/desc)
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									"id",
									"qty",
									"user_id",
									"createdAt",
									"invoice",
									"product_name",

									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},

								group: ["invoice"],
								order: [["createdAt", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.1.b transaction  sort with income (asc/desc)
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"id",
									"qty",
									"user_id",
									"createdAt",
									"invoice",
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
								],
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								group: ["invoice"],
								order: [["total_price", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.1.c
						} else {
							data = await db.transaction.findAll({
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
						//2.2
					} else {
						// 2.2.a atransaction sort with date sort (asc/desc)
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",

									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									status: "Delivered",
								},

								group: ["invoice"],
								order: [["createdAt", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// 2.2.b transaction  sort with income (asc/desc)
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
								],
								where: {
									status: "Delivered",
								},
								group: ["invoice"],
								order: [["total_price", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.2.c
						} else {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
								],
								where: {
									status: "Delivered",
								},
								group: ["invoice"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
					// 3.report by product
				} else if (report === "product") {
					//3.1
					if (filterBy) {
						// 3.1.a product sort by income (asc/desc)
						if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									"createdAt",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								group: ["product_name", "location"],
								order: [["income_money", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// 3.1.b product without any sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									"createdAt",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
								},
								group: ["product_name", "location"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
						// 3.2
					} else {
						// 3.2.a product sort by income (asc/desc)
						if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								group: ["product_name", "location"],
								order: [["income_money", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//3.2.b product without any sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								group: ["product_name", "location"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
				}
			} else if (role === "branch admin") {
				if (report === "user") {
					// 1.1 report by user using date range filter
					if (filterBy) {
						// 1.1.a report user using date range and make the list asc/ desc
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["createdAt", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.1.b report user using date range and make the list from income asc/desc
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["total_price", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.1.c report by user with date range and without sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"createdAt",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								group: ["user_id"],
								include: { model: db.user, attributes: ["name", "id"] },
								where: {
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					} else {
						// 1.2. report by user without any date range filter
						// 1.2.a report by user without any date range filter but sort with date asc/desc
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									branch_id: admin_branch_id,
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["createdAt", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// 1.2.b report by user without any date range filter but sort with income asc/desc
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									branch_id: admin_branch_id,
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								order: [["total_price", sortBy[1]]], //sort nya masuk kesini
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//1.2.c report by user without any date range and without sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"user_id",
									"invoice",
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									branch_id: admin_branch_id,
								},
								group: ["user_id"],
								include: { model: db.user, attributes: ["name"] },
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
					//2. report by transaction
				} else if (report === "transaction") {
					// 2.1 report by user using date range filter
					if (filterBy) {
						//2.1.a transaction sort with date sort (asc/desc)
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",

									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},

								group: ["invoice"],
								order: [["createdAt", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.1.b transaction  sort with income (asc/desc)
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
								],
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								group: ["invoice"],
								order: [["total_price", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.1.c
						} else {
							data = await db.transaction.findAll({
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
						//2.2
					} else {
						// 2.2.a atransaction sort with date sort (asc/desc)
						if (sortBy[0] === "date") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",

									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
								],
								where: {
									status: "Delivered",
									branch_id: admin_branch_id,
								},

								group: ["invoice"],
								order: [["createdAt", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// 2.2.b transaction  sort with income (asc/desc)
						} else if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									["id", "transaction_id"],
									"user_id",
									"createdAt",
									"invoice",
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "total_qty"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"total_price",
									],
								],
								where: {
									status: "Delivered",
									branch_id: admin_branch_id,
								},
								group: ["invoice"],
								order: [["total_price", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							//2.2.c
						} else {
							data = await db.transaction.findAll({
								where: {
									status: "Delivered",
									branch_id: admin_branch_id,
								},
								group: ["invoice"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
					// report by product
				} else if (report === "product") {
					if (filterBy) {
						//  product sort by income (asc/desc)
						if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									"createdAt",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								group: ["product_name"],
								order: [["income_money", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// product without any sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									"createdAt",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],

								include: { model: db.branch, attributes: ["location"] },
								where: {
									status: "Delivered",
									createdAt: {
										[Op.between]: [
											new Date(filterBy[0]),
											new Date(filterBy[1]),
										],
									},
									branch_id: admin_branch_id,
								},
								group: ["product_name"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					} else {
						//  product sort by income (asc/desc)
						if (sortBy[0] === "income") {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],
								where: {
									branch_id: admin_branch_id,
								},
								include: { model: db.branch, attributes: ["location"] },
								group: ["product_name"],
								order: [["income_money", sortBy[1]]],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
							// product without any sort
						} else {
							data = await db.transaction.findAll({
								attributes: [
									"product_name",
									[sequelize.fn("sum", sequelize.col("qty")), "qty_sold"],
									[
										sequelize.fn("sum", sequelize.col("total_price")),
										"income_money",
									],
								],
								where: {
									branch_id: admin_branch_id,
								},

								include: { model: db.branch, attributes: ["location"] },
								group: ["product_name"],
								offset: page == 1 ? 0 : (page - 1) * 5,
								limit: 5,
							});
						}
					}
				}
			}
			new HTTPStatus(res, data).success("Get Sales Report Success").send();
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data,
			});
		}
	},

	salesReportDetail: async (req, res) => {
		try {
			let { invoice } = req.query;
			console.log(invoice);
			const data = await db.transaction.findAll({
				where: {
					invoice: invoice,
				},

				include: [
					{ model: db.branch },
					{ model: db.product, where: { status: "Active" } },
					{ model: db.user },
				],
			});

			return res.status(200).send({
				isError: false,
				message: "Get Data By Invoice Success",
				data: data,
			});
		} catch (error) {
			return res.status(400).send({
				isError: true,
				message: message.error,
				data: data.error,
			});
		}
	},

	adminRegister: async (req, res) => {
		const t = await sequelize.transaction();
		try {
			let { email, password, branch_id } = req.body; // console.log(email, password, branch_id, "test");
			let token = req.uid;

			let admin = await db.user.findOne(
				{
					where: {
						uid: token.uid,
					},
				},
				{ transaction: t }
			);

			let role = admin.role;

			if (role === "super admin") {
				if (!email.length || !password.length) {
					return res.status(404).send({
						isError: true,
						message: "data not found",
						data: null,
					});
				}

				let resFindBranchById = await db.branch.findOne(
					{
						where: {
							id: branch_id,
						},
					},
					{ transaction: t }
				);

				if (resFindBranchById === null)
					throw new Error("Please select an available branch");

				let adminBranchLocation = resFindBranchById.location;

				var resCreateAdmin = await db.user.create(
					{
						name: `branch admin ${adminBranchLocation}`,
						email,
						password: await hashPassword(password),
						role: "branch admin",
						status: "Verified",
					},
					{ transaction: t }
				);

				let userIdUpdate = resCreateAdmin.id;

				await db.branch.update(
					{
						user_id: userIdUpdate,
					},
					{
						where: {
							id: branch_id,
						},
						transaction: t,
					}
				);
			}

			t.commit();

			res.status(201).send({
				isError: false,
				message: "register success",
				data: null,
			});
		} catch (error) {
			t.rollback();
			res.status(404).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	},

	getBranchAdmin: async (req, res) => {
		try {
			let data = await db.branch.findAll({
				where: {
					user_id: null,
				},
			});
			res.status(200).send({
				isError: false,
				message: "get branch success",
				data,
			});
		} catch (error) {}
	},

	adminLogin: async (req, res) => {
		try {
			let { email, password } = req.body;

			if (!email || !password)
				return res.status(404).send({
					isError: true,
					message: "Input must be filled",
					data: null,
				});

			let findEmail = await db.user.findOne({
				where: {
					email: email,
				},
			});

			if (!findEmail.dataValues)
				return res.status(404).send({
					isError: true,
					message: "Email Not Found",
					data: null,
				});

			let hashMatchResult = await matchPassword(
				password,
				findEmail.dataValues.password
			);

			if (hashMatchResult === false)
				return res.status(404).send({
					isError: true,
					message: "Wrong Password or Email",
					data: null,
				});

			const token = createToken({
				uid: findEmail.uid,
			});

			res.status(200).send({
				isError: false,
				message: "Login Success",
				data: {
					token,
					findEmail,
				},
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: "Login Failed",
				data: error.message,
			});
		}
	},

	branchAdminProductList: async (req, res) => {
		const { page, sort } = req.query;
		const token = req.uid;

		try {
			let admin_branch_id;
			let data;
			let totalPage;

			let admin = await db.user.findOne({
				where: {
					uid: token.uid,
				},
				include: { model: db.branch },
			});

			let role = admin.role;
			if (role === "branch admin") {
				admin_branch_id = admin.branch.id;
			}

			if (sort !== "") {
				data = await db.branch_product.findAll({
					where: { branch_id: admin_branch_id, status: "Active" },
					include: [
						{
							model: db.product,
							where: { status: "Active" },
							order: ["name", "ASC"],
						},
						{ model: db.branch },
					],
					offset: page == 1 ? 0 : (page - 1) * 16,
					limit: 16,
					order: [
						[{ model: db.product }, sort.split("-")[0], sort.split("-")[1]],
					],
				});

				totalPage = await db.branch_product.count({
					where: { branch_id: admin_branch_id },
				});
			} else {
				data = await db.branch_product.findAll({
					where: { branch_id: admin_branch_id, status: "Active" },
					include: [
						{
							model: db.product,
							where: { status: "Active" },
						},
						{ model: db.branch },
					],
					offset: page == 1 ? 0 : (page - 1) * 16,
					limit: 16,
				});

				totalPage = await db.branch_product.count({
					where: { branch_id: admin_branch_id },
				});
			}

			res.status(200).send({
				isError: false,
				message: "Get Data Product Success",
				data: { data, totalPage },
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},

	totalPageAdminProduct: async (req, res) => {
		const token = req.uid;
		let admin_branch_id;

		let admin = await db.user.findOne({
			where: {
				uid: token.uid,
			},
			include: { model: db.branch },
		});

		let role = admin.role;
		if (role === "branch admin") {
			admin_branch_id = admin.branch.id;
		}

		try {
			const data = await db.branch_product.count({
				where: { branch_id: admin_branch_id },
			});

			res.status(200).send({
				isError: false,
				message: "Get Total Page Admin",
				data,
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},
	getCategory: async (req, res) => {
		try {
			let data = await db.category.findAll({});
			res.status(200).send({
				isError: false,
				message: "get category success",
				data,
			});
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: "get category success",
				data,
			});
		}
	},
	getProductByCategory: async (req, res) => {
		try {
			const { uid } = req.uid;
			const { page, category, sort } = req.query;
			let data;

			let admin = await db.user.findOne({
				where: {
					uid,
				},
				include: { model: db.branch },
			});

			if (sort !== "") {
				data = await db.branch_product.findAll({
					where: {
						branch_id: admin.branch.id,
					},
					include: [
						{
							model: db.product,
							where: {
								[Op.and]: [{ category_id: category }, { status: "Active" }],
							},
						},
						{ model: db.branch },
					],
					offset: page == 1 ? 0 : (page - 1) * 16,
					limit: 16,
					order: [
						[{ model: db.product }, sort.split("-")[0], sort.split("-")[1]],
					],
				});
			} else {
				data = await db.branch_product.findAll({
					where: {
						branch_id: admin.branch.id,
					},
					include: [
						{
							model: db.product,
							where: {
								[Op.and]: [{ category_id: category }, { status: "Active" }],
							},
						},
						{ model: db.branch },
					],
					offset: page == 1 ? 0 : (page - 1) * 16,
					limit: 16,
				});
			}

			res.status(200).send({
				isError: false,
				message: "Get Data Product Success",
				data,
			});
		} catch (error) {
			res.status(200).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	checkRole: async (req, res) => {
		try {
			const token = req.uid;
			let admin_branch_id;

			let admin = await db.user.findAll({
				where: {
					uid: token.uid,
				},
				// include: { model: db.branch },
			});

			res.status(200).send({
				isError: false,
				message: "Get Role Admin Success",
				data: admin,
			});
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	stockHistory2: async (req, res) => {
		try {
			const { search } = req.query;
			let response;
			const token = req.uid;
			let admin_branch_id;

			let admin = await db.user.findOne({
				where: {
					uid: token.uid,
				},
				include: { model: db.branch },
			});

			let role = admin.role;

			if (role === "branch admin") {
				admin_branch_id = admin.branch.id;
			}

			if (!search) {
				res.status(200).send({
					isError: false,
					message: "Get Data Success",
					data: null,
				});
			}

			const data = await db.product.findAll({
				where: {
					name: {
						[Op.substring]: search,
					},
				},
			});

			res.status(200).send({
				isError: false,
				message: "Get Data Success",
				data: data,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error.data,
			});
		}
	},
	stockHistoryDetail: async (req, res) => {
		try {
			let { filter, sort, page, ProductId, branchId } = req.query;
			console.log(
				filter,
				"ini filter",
				sort,
				"ini sort",
				page,
				"ini page",
				ProductId,
				"ini product id",
				branchId,
				"ini branch"
			);
			const sortBy = sort ? sort.split("-") : "";
			const filterBy = filter ? filter.split("/") : "";
			const token = req.uid;
			let admin_branch_id;
			let data;

			let admin = await db.user.findOne({
				where: {
					uid: token.uid,
				},
				include: { model: db.branch },
			});

			let role = admin.role;

			if (role === "branch admin") {
				admin_branch_id = admin.branch.id;
			}

			if (role === "branch admin") {
				if (filterBy) {
					if (sortBy[0] === "date") {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: admin_branch_id,
								createdAt: {
									[Op.between]: [new Date(filterBy[0]), new Date(filterBy[1])],
								},
							},
							include: [{ model: db.branch }, { model: db.product }],
							order: [["createdAt", sortBy[1]]],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					} else {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: admin_branch_id,
								createdAt: {
									[Op.between]: [new Date(filterBy[0]), new Date(filterBy[1])],
								},
							},
							include: [{ model: db.branch }, { model: db.product }],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					}
				} else {
					if (sortBy[0] === "date") {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: admin_branch_id,
							},
							include: [{ model: db.branch }, { model: db.product }],
							order: [["createdAt", sortBy[1]]],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					} else {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: admin_branch_id,
							},
							include: [{ model: db.branch }, { model: db.product }],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					}
				}
			} else {
				if (filterBy) {
					if (sortBy[0] === "date") {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: branchId,
								createdAt: {
									[Op.between]: [new Date(filterBy[0]), new Date(filterBy[1])],
								},
							},
							include: [{ model: db.branch }, { model: db.product }],
							order: [["createdAt", sortBy[1]]],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					} else {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: branchId,
								createdAt: {
									[Op.between]: [new Date(filterBy[0]), new Date(filterBy[1])],
								},
							},
							include: [{ model: db.branch }, { model: db.product }],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					}
				} else {
					if (sortBy[0] === "date") {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: branchId,
							},
							include: [{ model: db.branch }, { model: db.product }],
							order: [["createdAt", sortBy[1]]],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					} else {
						data = await db.stock_history.findAll({
							where: {
								product_id: ProductId,
								branch_id: branchId,
							},
							include: [{ model: db.branch }, { model: db.product }],
							offset: page == 1 ? 0 : (page - 1) * 5,
							limit: 5,
						});
					}
				}
			}
			// data = await db.stock_history.findAll({
			// 	where: {
			// 		product_id: ProductId,
			// 		branch_id: branchId,
			// 	},
			// 	include: [{ model: db.branch }, { model: db.product }],
			// 	// group: ["branch_id"],
			// });

			res.status(200).send({
				isError: false,
				message: "Get Data Success",
				data: data,
			});
		} catch (error) {
			console.log(error);
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error.data,
			});
		}
	},

	updateCategoryImage: async (req, res) => {
		const { id } = req.params;

		try {
			let { img } = await db.category.findOne({
				where: {
					id,
				},
			});
			await db.category.update(
				{
					img: `Public/images/${req.files.images[0].filename}`,
				},
				{
					where: {
						uid,
					},
				}
			);

			deleteFiles(img);
			new HTTPStatus(res).success("Update Products Success!").send();
		} catch (error) {
			deleteFiles(req.files.images[0].path);
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	updateCategoryData: async (req, res) => {
		const { id, name } = req.body;
		try {
			await db.category.update({ name }, { where: { id } });
			new HTTPStatus(res).success("Category detail updated");
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getProductEdit: async (req, res) => {
		const { id } = req.query;
		const { uid } = req.uid;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			const data = await db.branch_product.findOne({
				where: {
					[Op.and]: [{ branch_id: admin.branch.id }, { product_id: id }],
				},
				include: { model: db.product, where: { status: "Active" } },
			});
			new HTTPStatus(res, data).success("Get product details for edit").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getTransactionPerMonth: async (req, res) => {
		let { year } = req.query;
		let income = [];
		let monthSent = [];
		let token = req.uid;
		let admin_branch_id;
		let total_user;
		let total_transaction;
		let transactionLength;
		let total_branch;
		let count = 0;

		let admin = await db.user.findOne({
			where: {
				uid: token.uid,
			},
			include: { model: db.branch },
		});

		let role = admin.role;

		if (role === "branch admin") {
			admin_branch_id = admin.branch.id;
		}

		try {
			if (role === "super admin") {
				let month = await db.transaction.findAll({
					attributes: [
						[sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
						[sequelize.fn("year", sequelize.col("createdAt")), "year"],
						[sequelize.fn("SUM", sequelize.col("total_price")), "total_income"],
					],
					group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
					where: {
						status: "Delivered",
					},
				});

				total_user = await db.user.count({
					where: {
						status: "Verified",
						role: "user",
					},
				});

				total_branch = await db.branch.count();

				total_transaction = await db.transaction.findAll({
					attributes: [[sequelize.fn("count", sequelize.col("id")), "count"]],
					group: ["invoice"],
					where: {
						status: "Delivered",
					},
				});

				transactionLength = total_transaction.length;

				function getMonthName(monthNumber) {
					const monthNames = [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					];
					return monthNames[monthNumber - 1];
				}
				month.forEach((val) => {
					// console.log(val.dataValues.year, "test");
					if (val.dataValues.year == year) {
						income.push(parseInt(val.dataValues.total_income));
						count += parseInt(val.dataValues.total_income);
						monthSent.push(getMonthName(val.dataValues.month));
					}
				});
			} else if (role === "branch admin") {
				let month = await db.transaction.findAll({
					attributes: [
						[sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
						[sequelize.fn("year", sequelize.col("createdAt")), "year"],
						[sequelize.fn("SUM", sequelize.col("total_price")), "total_income"],
					],
					where: {
						branch_id: admin_branch_id,
						status: "Delivered",
					},
					group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
				});

				total_user = await db.user.count({
					where: {
						status: "Verified",
						role: "user",
					},
				});

				total_branch = await db.branch.count();

				total_transaction = await db.transaction.count({
					where: {
						branch_id: admin_branch_id,
						status: "Delivered",
					},
					group: ["invoice"],
				});

				transactionLength = total_transaction.length;

				function getMonthName(monthNumber) {
					const monthNames = [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					];
					return monthNames[monthNumber - 1];
				}
				month.forEach((val) => {
					// console.log(val.dataValues.year, "test");
					if (val.dataValues.year == year) {
						income.push(parseInt(val.dataValues.total_income));
						count += parseInt(val.dataValues.total_income);
						monthSent.push(getMonthName(val.dataValues.month));
					}
				});
			}
			// let year = await db.transaction.findAll({
			// 	attributes: [
			// 		[sequelize.fn("year", sequelize.col("createdAt")), "year"],
			// 		[sequelize.fn("SUM", sequelize.col("total_price")), "total_income"],
			// 	],
			// 	group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
			// });

			new HTTPStatus(res, {
				income,
				monthSent,
				total_user,
				transactionLength,
				total_branch,
				count,
			})
				.success("Get Transaction Per Month Success")
				.send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
};
