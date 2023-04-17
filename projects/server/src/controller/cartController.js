const db = require("../sequelize/models");
const { Op } = require("sequelize");
const { sequelize } = require("../sequelize/models");

module.exports = {
	addToCart: async (req, res) => {
		const { qty, branch_id, product_id } = req.body;
		const { uid } = req.uid;
		try {
			const { id } = await db.user.findOne({ where: { uid } });

			const findCart = await db.cart.findAll({
				where: {
					[Op.and]: [{ user_id: id }, { product_id: product_id }],
				},
			});

			if (findCart.length > 0) {
				const findBranch = await db.cart.findAll({
					where: { user_id: id },
				});

				if (findBranch[0].dataValues.branch_id != branch_id) {
					throw {
						message: "Cannot Add Product With Diffrent Branch, Please Remove Product in Cart",
					};
				}
			}

			const branch_product = await db.branch_product.findOne({
				where: {
					[Op.and]: [{ branch_id: branch_id }, { product_id: product_id }, {status: "Active"}],
				},
			});

			if (qty > branch_product.stock) {
				throw { message: "Input Quantity More Than Stock" };
			}

			const cart = await db.cart.findAll({
				where: {
					product_id: product_id,
				},
			});

			if (cart.length > 0) {
				const branch = await db.branch_product.findOne({
					where: {
						[Op.and]: [{ branch_id: branch_id }, { product_id: product_id }, {status: "Active"}],
					},
				});

				let updateQty = cart[0].dataValues.qty + qty;
				if (branch.dataValues.stock < updateQty || branch.dataValues.stock < qty) {
					throw { message: "Input Quantity More Than Stock" };
				}
				var data = await db.cart.update(
					{ qty: updateQty },
					{
						where: {
							id: cart[0].dataValues.id,
						},
					}
				);
			} else {
				var data = await db.cart.create({ qty, branch_id, user_id: id, product_id });
			}

			res.status(201).send({
				isError: false,
				message: "Add To Cart Success",
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
	getCart: async (req, res) => {
		const { uid } = req.uid;
		try {
			const { id } = await db.user.findOne({
				where: { uid: uid },
			});

			const cart = await db.cart.findAll({
				where: { user_id: id },
			});

			if (cart.length === 0) {
				return res.status(201).send({
					isError: false,
					message: "Cart Empty",
					data: [],
				});
			}

			const data = await db.cart.findAll({
				attributes: [
					"id",
					"product_id",
					"branch_id",
					"qty",
					[sequelize.literal("price * qty"), "total_price"],
				],
				where: { user_id: id },
				include: [
					{
						model: db.product,
						attributes: ["name", "img", "price"],
						include: [
							{
								model: db.branch_product,
								attributes: ["stock"],
								where: { branch_id: cart[0].branch_id },
							},
							{ model: db.unit, attributes: ["name", "price_at"] },
							{
								model: db.discount_history,
								attributes: ["min_purchase", "percent", "discount_id", "branch_id", "id"],
								where: {
									[Op.and]: [
										{
											branch_id: cart[0].branch_id,
										},
										{ status: "Active" },
									],
								},
								required: false,
								include: [{ model: db.discount }],
							},
						],
					},
					{ model: db.branch, attributes: ["location", "city_code"] },
				],
			});

			res.status(201).send({
				isError: false,
				message: "Get Cart Success",
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
	incrementQuantity: async (req, res) => {
		const { id, quantity } = req.body;
		try {
			const data = await db.cart.update(
				{ qty: quantity + 1 },
				{
					where: {
						id: id,
					},
				}
			);
			console.log(typeof quantity);
			res.status(201).send({
				isError: false,
				message: "Update Quantity Success",
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
	decrementQuantity: async (req, res) => {
		const { id, quantity } = req.body;
		try {
			const data = await db.cart.update(
				{ qty: quantity - 1 },
				{
					where: {
						id: id,
					},
				}
			);
			res.status(201).send({
				isError: false,
				message: "Update Quantity Success",
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
	deleteCart: async (req, res) => {
		const { id } = req.body;
		try {
			const data = await db.cart.destroy({
				where: {
					id: id,
				},
			});
			res.status(201).send({
				isError: false,
				message: "Delete Cart Success",
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
};
