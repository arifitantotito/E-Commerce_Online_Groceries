const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { sequelize } = require("../sequelize/models");

module.exports = {
	getTransaction: async (req, res) => {
		const { uid } = req.uid;
		try {
			const { role, id } = await db.user.findOne({ where: { uid } });
			const branch = await db.branch.findOne({
				where: { user_id: id },
			});

			if (role === "super admin") {
				const data = await db.transaction.findAll({
					attributes: [
						"invoice",
						"status",
						"expired",
						"shipping_cost",
						"courier",
						"payment_proof",
						"createdAt",
						[sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
						[sequelize.fn("COUNT", sequelize.col("product_name")), "total_item"],
					],
					group: [
						"invoice",
						"status",
						"expired",
						"createdAt",
						"shipping_cost",
						"courier",
						"payment_proof",
					],
					order: [["createdAt", "ASC"]],
				});

				res.status(201).send({
					isError: false,
					message: "Get All Transaction Success",
					data,
				});
			} else if (role === "branch admin") {
				const data = await db.transaction.findAll({
					attributes: [
						"invoice",
						"status",
						"expired",
						"courier",
						"shipping_cost",
						"payment_proof",
						"createdAt",
						[sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
						[sequelize.fn("COUNT", sequelize.col("product_name")), "total_item"],
					],
					where: { branch_id: branch.dataValues.id },
					group: [
						"invoice",
						"status",
						"expired",
						"createdAt",
						"shipping_cost",
						"courier",
						"payment_proof",
					],
					order: [["createdAt", "ASC"]],
				});
				res.status(201).send({
					isError: false,
					message: "Get Transaction Success",
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
	cancelTransaction: async (req, res) => {
		const { invoice } = req.body;
		const t1 = await sequelize.transaction();
		try {
			
			const result = await db.transaction.findAll({
				where: { invoice },
			});
			
			result.map(async (value) => {
				const t = await sequelize.transaction();
				try {
					const { stock } = await db.branch_product.findOne({
						where: {
							[Op.and]: [{ branch_id: value.branch_id }, { product_id: value.product_id }],
						},
					});

					await db.branch_product.update(
						{ stock: stock + value.qty },
						{
							where: {
								[Op.and]: [{ branch_id: value.branch_id }, { product_id: value.product_id }],
							},
						},
						{ transaction: t }
					);
					await db.stock_history.create(
						{
							stock: stock + value.qty,
							branch_id: value.branch_id,
							product_id: value.product_id,
						},
						{ transaction: t }
					);
					t.commit();
				} catch (error) {
					t.rollback();
				}
			});
			await db.transaction_history.create({ status: "Canceled", invoice }, { transaction: t1 });
			await db.transaction.update(
				{ status: "Canceled" },
				{ where: { invoice } },
				{ transaction: t1 }
			);
			t1.commit();
			res.status(201).send({
				isError: false,
				message: "Status Update To Canceled",
				data: null,
			});
		} catch (error) {
			t1.rollback();
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	processOrder: async (req, res) => {
		const { invoice } = req.body;
		try {
			const { user_id } = await db.transaction.findOne({
				where: { invoice },
			});

			await db.transaction_history.create({ status: "On Process", invoice });
			await db.transaction.update(
				{ status: "On Process" },
				{ where: { [Op.and]: [{ user_id: user_id }, { invoice }] } }
			);

			res.status(201).send({
				isError: false,
				message: "Status Update To On Process",
				data: null,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	sendOrder: async (req, res) => {
		const { invoice } = req.body;
		try {
			const { user_id } = await db.transaction.findOne({
				where: { invoice },
			});

			await db.transaction_history.create({ status: "Sent", invoice });
			await db.transaction.update(
				{ status: "Sent" },
				{ where: { [Op.and]: [{ user_id: user_id }, { invoice }] } }
			);

			res.status(201).send({
				isError: false,
				message: "Status Update To Sent",
				data: null,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	getDetail: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		try {
			const { role, id } = await db.user.findOne({
				where: { uid },
			});
			const branch = await db.branch.findOne({
				where: { user_id: id },
			});

			if (role === "super admin") {
				const data = await db.transaction.findAll({
					attributes: [
						"product_name",
						"qty",
						"total_price",
						"courier",
						"status",
						"invoice",
						"expired",
						"shipping_cost",
					],
					where: {
						invoice,
					},
					include: [
						{ model: db.product, attributes: ["img", "price"],where:{status:"Active"} },
						{ model: db.user, attributes: ["name"] },
						{
							model: db.discount_history,
							required: false,
							include: [{ model: db.discount, attributes: ["name"] }],
						},
					],
				});

				res.status(201).send({
					isError: false,
					message: "Get Detail Transaction Success",
					data,
				});
			} else if (role === "branch admin") {
				const data = await db.transaction.findAll({
					attributes: [
						"product_name",
						"qty",
						"total_price",
						"courier",
						"status",
						"invoice",
						"expired",
						"shipping_cost",
					],
					where: {
						[Op.and]: [
							{
								invoice,
							},
							{ branch_id: branch.dataValues.id },
						],
					},
					include: [
						{ model: db.product, attributes: ["img", "price"],where:{status:"Active"} },
						{ model: db.user, attributes: ["name"] },
						{
							model: db.discount_history,
							required: false,
							include: [{ model: db.discount, attributes: ["name"] }],
						},
					],
				});
				res.status(201).send({
					isError: false,
					message: "Get Detail Transaction Success",
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
