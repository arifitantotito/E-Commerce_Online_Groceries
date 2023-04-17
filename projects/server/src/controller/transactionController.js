const db = require("../sequelize/models");
const HTTPStatus = require("../helper/HTTPStatus");
const { Op } = require("sequelize");
const { sequelize } = require("../sequelize/models");
const moment = require("moment");

module.exports = {
	tryEventScheduler: async (req, res) => {
		const { uid } = req.uid;
		let query = "";

		try {
			const transaction = await db.transaction.bulkCreate([
				{
					product_name: "Pakcoy",
					qty: 200,
					total_price: 8000,
					shipping_cost: 1000,
					user_address: "Jl. Jalan",
					courier: "JNE",
					invoice: `INV/${uid.slice(-12)}/${Date.now()}`,
					status: "Waiting Payment",
					branch_id: 1,
					user_id: 21,
					product_id: 1,
				},
				{
					product_name: "Labu Siam Besar",
					qty: 300,
					total_price: 13500,
					shipping_cost: 1000,
					user_address: "Jl. Jalan",
					courier: "JNE",
					invoice: `INV/${uid.slice(-12)}/${Date.now()}`,
					status: "Waiting Payment",
					branch_id: 1,
					user_id: 21,
					product_id: 1,
				},
			]);

			for (let i = 0; i < transaction.length; i++) {
				const { stock } = await db.branch_product.findOne({
					where: {
						[Op.and]: [
							{ branch_id: transaction[i].branch_id },
							{ product_id: transaction[i].product_id },
						],
					},
				});
				query += `INSERT INTO toko.stock_history(stock,createdAt,branch_id,product_id) VALUES(${
					stock + transaction[i].qty
				},NOW(),${transaction[i].branch_id},${transaction[i].product_id});
				UPDATE toko.branch_product SET stock = ${
					stock + transaction[i].qty
				} WHERE branch_id = ${transaction[i].branch_id} AND product_id = ${
					transaction[i].product_id
				};`;
			}

			// await sequelize.query(`
			// CREATE EVENT trx_${
			// 				transaction[transaction.length - 1].id
			// 			} ON SCHEDULE AT NOW() + INTERVAL 2 HOUR
			// DO BEGIN
			// UPDATE toko.transaction SET status = "Expired" WHERE invoice = ${
			// 				transaction[0].invoice
			// 			};
			// INSERT INTO toko.transaction_history(status,invoice,createdAt)
			// SELECT "Expired", "${transaction[0].invoice}",NOW() FROM DUAL
			// WHERE EXISTS(SELECT 1 FROM toko.transactions WHERE invoice="${
			// 				transaction[0].invoice
			// 			}" AND payment_proof IS NULL);
			// ${query}

			// END;`);

			sequelize.query(
				`CREATE EVENT trx_${
					transaction[transaction.length - 1].id
				} ON SCHEDULE AT NOW() + INTERVAL 2 HOUR
				DO BEGIN
				UPDATE toko.transaction SET status = "Expired" WHERE invoice = ${
					transaction[0].invoice
				};
				INSERT INTO toko.transaction_history(status,invoice,createdAt) VALUES("Expired",${
					transaction[0].invoice
				},NOW());
				${query}
				END;`
			);
			new HTTPStatus(res).success("Event Created").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getTransaction: async (req, res) => {
		const { uid } = req.uid;
		const { status } = req.query;
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			let where;
			if (status == 0) where = { user_id: id };
			if (status == 1) where = { [Op.and]: [{ user_id: id }, { status: "Waiting Payment" }] };
			if (status == 2)
				where = {
					[Op.and]: [
						{ user_id: id },
						{
							[Op.or]: [
								{ status: "Waiting Approval" },
								{ status: "On Process" },
								{ status: "Sent" },
							],
						},
					],
				};
			if (status == 3) where = { [Op.and]: [{ user_id: id }, { status: "Delivered" }] };
			if (status == 4) where = { [Op.and]: [{ user_id: id }, { status: "Canceled" }] };

			const data = await db.transaction.findAll({
				attributes: [
					"invoice",
					"createdAt",
					"status",
					"product_name",
					[sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
					[sequelize.fn("COUNT", sequelize.col("product_name")), "total_item"],
				],
				where,
				include: [{ model: db.branch }, { model: db.product }],
				group: ["invoice","createdAt","status", "product_name","branch_id","product_id"],
				order: [["createdAt", "ASC"]],
			});
			new HTTPStatus(res, data).success("Get all transaction").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	findTransaction: async (req, res) => {
		const { invoice } = req.query;
		try {
			const data = await db.transaction.findAll({
				where: { invoice },
				include: [
					{ model: db.product, include: { model: db.unit } },
					{ model: db.user, attributes: ["name"] },
				],
			});
			new HTTPStatus(res, data).success("Find transaction by invoice").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	cancel: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		const t1 = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			const result = await db.transaction.findAll({
				where: { invoice },
			});

			await db.transaction.update(
				{
					status: "Canceled",
				},
				{
					where: {
						invoice,
					},
				}
			);

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
				{ where: { [Op.and]: [{ user_id: id }, { invoice }] } },
				{ transaction: t1 }
			);
			t1.commit();
			new HTTPStatus(res).success("Status changed to canceled").send();
		} catch (error) {
			t1.rollback();
			new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},
	received: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		const t = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });

			await db.transaction_history.create({ status: "Delivered", invoice }, { transaction: t });
			await db.transaction.update(
				{ status: "Delivered" },
				{ where: { [Op.and]: [{ user_id: id }, { invoice }] } },
				{ transaction: t }
			);
			t.commit();
			const httpStatus = new HTTPStatus(res).success("Status changed to delivered").send();
		} catch (error) {
			t.rollback();
			const httpStatus = new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},

	sent: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		const t = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });

			await db.transaction_history.create({ status: "sent", invoice }, { transaction: t });
			await db.transaction.update({ status: "sent" }, { where: { invoice } }, { transaction: t });
			t.commit();
			const httpStatus = new HTTPStatus(res).success("Status changed to received").send();
		} catch (error) {
			t.rollback();
			const httpStatus = new HTTPStatus(res, error).error(error.message, 400).send();
		}
	},

	addTransaction: async (req, res) => {
		const { uid } = req.uid;
		const {
			product_name,
			qty,
			total_price,
			user_address,
			courier,
			branch_id,
			product_id,
			shipping_cost,
			discount_history_id,
		} = req.body;
		const t = await sequelize.transaction();
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			for (let i = 0; i < qty.length; i++) {
				try {
					const t1 = await sequelize.transaction();
					const { stock } = await db.branch_product.findOne({
						where: {
							[Op.and]: [{ branch_id: branch_id }, { product_id: product_id[i] }],
						},
					});
					await db.branch_product.update(
						{ stock: stock - qty[i] },
						{
							where: {
								[Op.and]: [{ branch_id: branch_id }, { product_id: product_id[i] }],
							},
						},
						{ transaction: t1 }
					);
					await db.stock_history.create(
						{
							stock: stock - qty[i],
							branch_id: branch_id,
							product_id: product_id[i],
						},
						{ transaction: t1 }
					);
					t1.commit();
				} catch (error) {
					t1.rollback();
				}
			}

			let dataToSend = [];
			const invoice = `INV/${uid.slice(-12)}/${Date.now()}`;
			let status = "Waiting Payment";
			for (let i = 0; i < product_name.length; i++) {
				dataToSend.push({
					product_name: product_name[i],
					qty: qty[i],
					total_price: total_price[i],
					user_address: user_address,
					courier: courier,
					branch_id: branch_id,
					product_id: product_id[i],
					invoice: invoice,
					user_id: id,
					status: status,
					shipping_cost: shipping_cost,
					discount_history_id: discount_history_id[i],
					expired: moment().add(1, "hour").toDate(),
				});
			}

			let data = await db.transaction.bulkCreate(dataToSend, {
				transaction: t,
			});
			await db.transaction_history.create({ status: status, invoice: invoice }, { transaction: t });
			await db.cart.destroy({
				where: { user_id: id },
			});

			let Loader = "";
			for (let i = 0; i < qty.length; i++) {
				const { stock } = await db.branch_product.findOne({
					where: {
						[Op.and]: [{ branch_id: branch_id }, { product_id: product_id[i] }],
					},
				});

				Loader += `INSERT INTO stock_history (stock, createdAt, branch_id, product_id) VALUES(${
					stock + qty[i]
				},NOW(),${branch_id},${product_id[i]}); 
				UPDATE branch_product SET stock = ${
					stock + qty[i]
				} WHERE branch_id = ${branch_id} AND product_id = ${product_id[i]};`;
			}

			await sequelize.query(`CREATE EVENT expired_${
				invoice.split("/")[2]
			} ON SCHEDULE AT NOW() + INTERVAL 60 MINUTE 
			DO BEGIN
			UPDATE transaction SET status = "Canceled" WHERE invoice = '${invoice}' AND payment_proof IS NULL;
			INSERT INTO transaction_history (status,invoice,createdAt) VALUES ("Canceled",${invoice},NOW());
			${Loader}
			END;`);

			t.commit();
			res.status(201).send({
				isError: false,
				message: "Add Transaction Success",
				data: data,
			});
		} catch (error) {
			t.rollback();
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	getInvoice: async (req, res) => {
		const { uid } = req.uid;
		try {
			const { id } = await db.user.findOne({ where: { uid } });

			const data = await db.transaction.findAll({
				attributes: [
					"invoice",
					"status",
					"expired",
					"shipping_cost",
					"createdAt",
					[sequelize.fn("SUM", sequelize.col("total_price")), "total_price"],
					[sequelize.fn("COUNT", sequelize.col("product_name")), "total_item"],
				],
				where: { user_id: id },
				group: ["invoice", "status", "expired", "createdAt", "shipping_cost"],
				order: [["createdAt", "DESC"]],
			});
			res.status(201).send({
				isError: false,
				message: "Get Transaction Succes",
				data,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},

	getDetails: async (req, res) => {
		const { uid } = req.uid;
		const { invoice } = req.body;
		try {
			const { id } = await db.user.findOne({
				where: { uid },
			});
			const data = await db.transaction.findAll({
				attributes: [
					"product_name",
					"qty",
					"total_price",
					"courier",
					"status",
					"invoice",
					"expired",
				],
				where: {
					[Op.and]: [
						{
							invoice,
						},
						{ user_id: id },
					],
				},
			});
			res.status(201).send({
				isError: false,
				message: "Get Detail Transaction Success",
				data,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},

	uploadPayment: async (req, res) => {
		const t = await sequelize.transaction();
		try {
			const {invoice }= JSON.parse(req.body.data);
			await db.transaction.update(
				{
					payment_proof: req.files.images[0].path,
					status: "Waiting Approval",
				},
				{
					where: {
						invoice: invoice,
					},
				},
				{ transaction: t }
			);

			await db.transaction_history.create({status: "Waiting Approval", invoice: invoice}), {transaction: t}
			await t.commit();
			res.status(201).send({
				isError: false,
				message: "Upload Payment Proof Success",
				data: null,
			});
		} catch (error) {
			await t.rollback();
			res.status(500).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},

	// getTransactionAdmin:(req,res)=>{
	// 	const transaction = await db.transaction.findAll({group:"invoice"})
	// 	transaction.forEach(async(value,index)=>{
	// 		const detail = await db.transaction.findAll({where:{invoice:value.invoice}})
	// 		transaction[index].append(detail)
	// 	})
	// 	new HTTPStatus(res,transaction).success("Get all transaction admin").send()
	// }
};
