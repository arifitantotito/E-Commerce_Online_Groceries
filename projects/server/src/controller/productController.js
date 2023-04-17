const db = require("../sequelize/models");
const { Op } = require("sequelize");
const HTTPStatus = require("../helper/HTTPStatus");
const { sequelize } = require("../sequelize/models");
const deleteFiles = require("../helper/deleteFiles");
const getProximity = require("../lib/proximity");
const { validateToken } = require("../lib/jwt");

module.exports = {
	editProduct: async (req, res) => {
		const { branch_id, id, name, stock, price, description } = JSON.parse(req.body.data);
		const t = await sequelize.transaction();
		try {
			await db.product.update(
				{
					name,
					price,
					description,
					img: req.files.images[0].path,
				},
				{ where: { id } },
				{ transaction: t }
			);
			await db.branch_product.update(
				{
					stock,
					branch_id,
					product_id: id,
				},
				{ where: { [Op.and]: [{ branch_id }, { product_id: id }] } },
				{ transaction: t }
			);
			await db.stock_history.create(
				{
					stock,
					branch_id: branch_id,
					product_id: id,
				},
				{ transaction: t }
			);
			await t.commit();
			new HTTPStatus(res).success("Product created").send();
		} catch (error) {
			await t.rollback();
			deleteFiles(req.files.images[0].path);
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	editProductNoImg: async (req, res) => {
		const { branch_id, id, name, stock, price, description } = req.body;
		const t = await sequelize.transaction();
		try {
			await db.product.update(
				{
					name,
					price,
					description,
				},
				{ where: { id } },
				{ transaction: t }
			);
			await db.branch_product.update(
				{
					stock,
				},
				{ where: { [Op.and]: [{ branch_id }, { product_id: id }] } },
				{ transaction: t }
			);
			await db.stock_history.create(
				{
					stock,
					branch_id: branch_id,
					product_id: id,
				},
				{ transaction: t }
			);
			await t.commit();
			new HTTPStatus(res).success("Product created").send();
		} catch (error) {
			await t.rollback();
			deleteFiles(req.files.images[0].path);
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	getCategoryEdit: async (req, res) => {
		const { id } = req.query;
		try {
			const data = await db.category.findOne({ where: { id } });
			new HTTPStatus(res, data).success("Get category detail").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getNearestBranchProduct: async (req, res) => {
		const { uid } = req.uid;
		try {
			const user = await db.user.findOne({
				where: { uid },
				include: { model: db.user_address, where: { main_address: true } },
			});
			const proximity = await getProximity(user.user_addresses[0].lat, user.user_addresses[0].lng);
			new HTTPStatus(res, proximity).success("Get nearest branch").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	deleteCategory: async (req, res) => {
		const { id } = req.params;
		try {
			await db.category.update({ status: "deleted" }, { where: { id } });
			new HTTPStatus(res).success("Category deleted").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	deleteProduct: async (req, res) => {
		const { id } = req.params;
		const t = await sequelize.transaction();
		try {
			const data = await db.branch_product.findOne({ where: { id } });
			await db.branch_product.update(
				{
					status: "deleted",
				},
				{ where: { id } },
				{ transaction: t }
			);
			await db.product.update(
				{
					status: "deleted",
				},
				{ where: { id: data.product_id } },
				{ transaction: t }
			);
			await t.commit();
			new HTTPStatus(res).success("Product deleted").send();
		} catch (error) {
			await t.rollback();
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getUnit: async (req, res) => {
		try {
			const data = await db.unit.findAll();
			new HTTPStatus(res, data).success("Get all unit").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	createProduct: async (req, res) => {
		const { uid } = req.uid;
		const { name, price, category_id, stock, unit_id, description } = JSON.parse(req.body.data);
		const t = await sequelize.transaction();
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			const product = await db.product.create(
				{
					name,
					price,
					category_id,
					unit_id,
					description,
					img: req.files.images[0].path,
				},
				{ transaction: t }
			);

			await db.branch_product.create(
				{
					stock,
					branch_id: admin.branch.id,
					product_id: product.id,
				},
				{ transaction: t }
			);
			await db.stock_history.create(
				{
					stock,
					branch_id: admin.branch.id,
					product_id: product.id,
				},
				{ transaction: t }
			);
			await t.commit();
			new HTTPStatus(res).success("Product created").send();
		} catch (error) {
			await t.rollback();
			deleteFiles(req.files.images[0].path);
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	getSuggested: async (req, res) => {
		const user = req.headers;
		let data;
		try {
			if (user.token === undefined) {
				data = await db.transaction.findAll({
					attributes: [[sequelize.fn("COUNT", sequelize.col("product_name")), "total_transaction"]],
					include: [
						{
							model: db.product,
							where: { status: "Active" },
							include: [
								{
									model: db.unit,
								},
								{
									model: db.discount_history,
									where: {
										status: "Active",
									},
									required: false,
								},
							],
						},
						{ model: db.branch, attributes: ["id", "location"] },
					],
					group: ["product.id"],
					order: [[sequelize.fn("COUNT", sequelize.col("product_name")), "DESC"]],
				});
			} else {
				const { uid } = validateToken(user.token);
				const address = await db.user.findOne({
					where: { uid },
					include: { model: db.user_address, where: { main_address: true } },
				});

				const proximity = await getProximity(
					address.user_addresses[0].lat,
					address.user_addresses[0].lng
				);

				data = await db.transaction.findAll({
					where: { branch_id: proximity[0].id },
					attributes: [[sequelize.fn("COUNT", sequelize.col("product_name")), "total_transaction"]],
					include: [
						{
							model: db.product,
							where: { status: "Active" },
							include: [
								{
									model: db.unit,
								},
								{
									model: db.discount_history,
									where: {
										status: "Active",
									},
									required: false,
								},
							],
						},
						{ model: db.branch, attributes: ["id", "location"] },
					],
					group: ["product.id"],
					order: [[sequelize.fn("COUNT", sequelize.col("product_name")), "DESC"]],
				});
			}

			new HTTPStatus(res, data).success("Get best seller product").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	getRandom: async (req, res) => {
		const user = req.headers;
		let data;
		try {
			if (user.token === undefined) {
				data = await db.branch_product.findAll({
					where: { branch_id: 1 },
					include: [
						{
							model: db.product,
							where: { status: "Active" },
							include: {
								model: db.discount_history,
								where: { status: "Active" },
								required: false,
							},
						},
						{ model: db.branch },
					],
					offset: Math.floor(Math.random() * 155),
					limit: 10,
				});
			} else {
				const { uid } = validateToken(user.token);
				const address = await db.user.findOne({
					where: { uid },
					include: { model: db.user_address, where: { main_address: true } },
				});

				const proximity = await getProximity(
					address.user_addresses[0].lat,
					address.user_addresses[0].lng
				);
				data = await db.branch_product.findAll({
					where: { branch_id: proximity[0].id },
					include: [
						{
							model: db.product,
							where: { status: "Active" },
							include: {
								model: db.discount_history,
								where: { status: "Active" },
								required: false,
							},
						},
						{ model: db.branch },
					],
					offset: Math.floor(Math.random() * 155),
					limit: 10,
				});
			}
			// Math.floor(Math.random() * 155)
			res.status(200).send({
				isError: false,
				message: "Get All Product",
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
	totalPage: async (req, res) => {
		const user = req.headers;
		try {
			if (user.token === undefined || !address) {
				const branch = 1;
				const data = await db.branch_product.count({
					where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
				});
				res.status(200).send({
					isError: false,
					message: "Get Total Page",
					data,
				});
			} else {
				const { uid } = validateToken(user.token);
				const address = await db.user.findOne({
					where: {
						uid,
					},
					include: { model: db.user_address, where: { main_address: true } },
				});
				if (!address) {
					const branch = 1;
					const data = await db.branch_product.count({
						where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
					});
					res.status(200).send({
						isError: false,
						message: "Get Total Page",
						data,
					});
				} else {
					if (address.user_addresses[0].lat && address.user_addresses[0].lng) {
						const proximity = await getProximity(
							address.user_addresses[0].lat,
							address.user_addresses[0].lng
						);
						const branch = proximity[0].id;
						const data = await db.branch_product.count({
							where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
						});
						res.status(200).send({
							isError: false,
							message: "Get Total Page",
							data,
						});
					} else {
						const branch = 1;
						const data = await db.branch_product.count({
							where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
						});
						res.status(200).send({
							isError: false,
							message: "Get Total Page",
							data,
						});
					}
				}
			}
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
			const data = await db.category.findAll({
				where: { status: "Active" },
			});
			res.status(200).send({
				isError: false,
				message: "Get All Category",
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
	product_detail: async (req, res) => {
		const { branch, product } = req.query;
		try {
			const data = await db.branch_product.findAll({
				where: {
					[Op.and]: [{ branch_id: branch }, { product_id: product }, { status: "Active" }],
				},
				include: [{ model: db.branch }, { model: db.product, include: { model: db.unit } }],
			});

			res.status(201).send({
				isError: false,
				message: "Get Product Detail",
				data,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	totalPageCategory: async (req, res) => {
		const { category } = req.query;
		const user = req.headers;
		try {
			if (user.token === undefined) {
				const branch = 1;
				const data = await db.branch_product.count({
					where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
					required: false,
					include: {
						model: db.product,
						where: {
							[Op.and]: [{ category_id: category }, { status: "Active" }],
						},
					},
				});
				res.status(201).send({
					isError: false,
					message: "Total Page Category",
					data,
				});
			} else {
				const { uid } = validateToken(user.token);
				const address = await db.user.findOne({
					where: {
						uid,
					},
					include: { model: db.user_address, where: { main_address: true } },
				});
				if (!address) {
					const branch = 1;
					const data = await db.branch_product.count({
						where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
						required: false,
						include: {
							model: db.product,
							where: {
								[Op.and]: [{ category_id: category }, { status: "Active" }],
							},
						},
					});
					res.status(201).send({
						isError: false,
						message: "Total Page Category",
						data,
					});
				} else {
					if (address.user_addresses[0].lat && address.user_addresses[0].lng) {
						const proximity = await getProximity(
							address.user_addresses[0].lat,
							address.user_addresses[0].lng
						);
						const branch = proximity[0].id;
						const data = await db.branch_product.count({
							where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
							required: false,
							include: {
								model: db.product,
								where: {
									[Op.and]: [{ category_id: category }, { status: "Active" }],
								},
							},
						});
						res.status(201).send({
							isError: false,
							message: "Total Page Category",
							data,
						});
					} else {
						const branch = 1;
						const data = await db.branch_product.count({
							where: { [Op.and]: [{ branch_id: branch }, { status: "Active" }] },
							required: false,
							include: {
								model: db.product,
								where: {
									[Op.and]: [{ category_id: category }, { status: "Active" }],
								},
							},
						});
						res.status(201).send({
							isError: false,
							message: "Total Page Category",
							data,
						});
					}
				}
			}
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	sortby: async (req, res) => {
		const { category, page, sortby } = req.query;
		const sort = sortby ? sortby.split("-") : "";
		const user = req.headers;
		try {
			if (user.token === undefined) {
				const branch = 1;
				if (sort[0] === "name") {
					const data = await db.product.findAll({
						where: {
							[Op.and]: [
								{
									category_id: category,
								},
								{ status: "Active" },
							],
						},
						required: false,
						include: [
							{
								model: db.branch_product,
								where: {
									[Op.and]: [{ branch_id: branch }, { status: "Active" }],
								},
								include: {
									model: db.branch,
								},
							},
						],
						order: [["name", sort[1]]],
						offset: page == 1 ? 0 : page * 10 - 10,
						limit: 12,
					});
					res.status(201).send({
						isError: false,
						message: "Get Product by Sort Success",
						data,
					});
				} else if (sort[0] === "price") {
					const data = await db.product.findAll({
						where: {
							[Op.and]: [
								{
									category_id: category,
								},
								{ status: "Active" },
							],
						},
						required: false,
						include: [
							{
								model: db.branch_product,
								where: {
									[Op.and]: [{ branch_id: branch }, { status: "Active" }],
								},
								include: {
									model: db.branch,
								},
							},
						],
						order: [["price", sort[1]]],
						offset: page == 1 ? 0 : page * 10 - 10,
						limit: 12,
					});
					res.status(201).send({
						isError: false,
						message: "Get Product by Sort Success",
						data,
					});
				} else if (sort === "") {
					const data = await db.product.findAll({
						where: {
							category_id: category,
						},
						required: false,
						include: [
							{
								model: db.branch_product,
								where: {
									[Op.and]: [{ branch_id: branch }, { status: "Active" }],
								},
								include: {
									model: db.branch,
								},
							},
						],
						offset: page == 1 ? 0 : page * 10 - 10,
						limit: 12,
					});
					res.status(201).send({
						isError: false,
						message: "Get Product by Sort Success",
						data,
					});
				}
			} else {
				const { uid } = validateToken(user.token);
				const address = await db.user.findOne({
					where: {
						uid,
					},
					include: { model: db.user_address, where: { main_address: true } },
				});
				if (!address) {
					const branch = 1;
					if (sort[0] === "name") {
						const data = await db.product.findAll({
							where: {
								[Op.and]: [
									{
										category_id: category,
									},
									{ status: "Active" },
								],
							},
							required: false,
							include: [
								{
									model: db.branch_product,
									where: {
										[Op.and]: [{ branch_id: branch }, { status: "Active" }],
									},
									include: {
										model: db.branch,
									},
								},
							],
							order: [["name", sort[1]]],
							offset: page == 1 ? 0 : page * 10 - 10,
							limit: 12,
						});
						res.status(201).send({
							isError: false,
							message: "Get Product by Sort Success",
							data,
						});
					} else if (sort[0] === "price") {
						const data = await db.product.findAll({
							where: {
								[Op.and]: [
									{
										category_id: category,
									},
									{ status: "Active" },
								],
							},
							required: false,
							include: [
								{
									model: db.branch_product,
									where: {
										[Op.and]: [{ branch_id: branch }, { status: "Active" }],
									},
									include: {
										model: db.branch,
									},
								},
							],
							order: [["price", sort[1]]],
							offset: page == 1 ? 0 : page * 10 - 10,
							limit: 12,
						});
						res.status(201).send({
							isError: false,
							message: "Get Product by Sort Success",
							data,
						});
					} else if (sort === "") {
						const data = await db.product.findAll({
							where: {
								category_id: category,
							},
							required: false,
							include: [
								{
									model: db.branch_product,
									where: {
										[Op.and]: [{ branch_id: branch }, { status: "Active" }],
									},
									include: {
										model: db.branch,
									},
								},
							],
							offset: page == 1 ? 0 : page * 10 - 10,
							limit: 12,
						});
						res.status(201).send({
							isError: false,
							message: "Get Product by Sort Success",
							data,
						});
					}
				} else {
					if (address.user_addresses[0].lat && address.user_addresses[0].lng) {
						const proximity = await getProximity(
							address.user_addresses[0].lat,
							address.user_addresses[0].lng
						);
						const branch = proximity[0].id;
						if (sort[0] === "name") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								order: [["name", sort[1]]],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						} else if (sort[0] === "price") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								order: [["price", sort[1]]],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						} else if (sort === "") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						}
					} else {
						const branch = 1;
						if (sort[0] === "name") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								order: [["name", sort[1]]],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						} else if (sort[0] === "price") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								order: [["price", sort[1]]],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						} else if (sort === "") {
							const data = await db.product.findAll({
								where: {
									[Op.and]: [
										{
											category_id: category,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [
									{
										model: db.branch_product,
										where: {
											[Op.and]: [{ branch_id: branch }, { status: "Active" }],
										},
										include: {
											model: db.branch,
										},
									},
								],
								offset: page == 1 ? 0 : page * 10 - 10,
								limit: 12,
							});
							res.status(201).send({
								isError: false,
								message: "Get Product by Sort Success",
								data,
							});
						}
					}
				}
			}
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	updateStatusProduct: async (req, res) => {
		let { status, category } = req.body;
		try {
			for (let i = 0; i < category; i++) {
				let data = await db.product.update(
					{ status: status },
					{ where: { category_id: category } }
				);
				res.status(201).send({
					isError: false,
					message: "Update Status Product Success",
					data,
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
