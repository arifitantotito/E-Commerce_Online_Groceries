const { Op } = require("sequelize");
const HTTPStatus = require("../helper/HTTPStatus");
const db = require("../sequelize/models");

module.exports = {
	approveDiscount: async (req, res) => {
		const { id } = req.body;
		try {
			await db.discount_history.update({ status: "Active" }, { where: { id } });
			new HTTPStatus(res).success("Discount Active").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	declineDiscount: async (req, res) => {
		const { id } = req.body;
		try {
			await db.discount_history.update(
				{ status: "Declined" },
				{ where: { id } }
			);
			new HTTPStatus(res).success("Discount Declined").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	discountListSort: async (req, res) => {
		const { uid } = req.uid;
		const { sort, name, status } = req.query;
		let where;

		let data;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});
			if (admin.role === "super admin") {
				if (status == 0) where = { id: { [Op.gte]: 0 } };
				if (status == 1) where = { status: "Waiting Approval" };
				if (status == 2) where = { status: "Active" };
				if (status == 3) where = { status: "Declined" };
				if (name !== "") {
					data = await db.discount_history.findAll({
						where,
						include: { model: db.product },
						order: [[{ model: db.product }, "name", sort]],
					});
				} else {
					data = await db.discount_history.findAll({
						where,
						include: { model: db.product },
						order: [[sort.split("-")[0], sort.split("-")[1]]],
					});
				}
			} else {
				if (status == 0) where = { branch_id: admin.branch.id };
				if (status == 1)
					where = {
						[Op.and]: [
							{ branch_id: admin.branch.id },
							{ status: "Waiting Approval" },
						],
					};
				if (status == 2)
					where = where = {
						[Op.and]: [{ branch_id: admin.branch.id }, { status: "Active" }],
					};
				if (status == 3)
					where = where = {
						[Op.and]: [{ branch_id: admin.branch.id }, { status: "Declined" }],
					};
				if (name !== "") {
					data = await db.discount_history.findAll({
						where,
						include: { model: db.product },
						order: [[{ model: db.product }, "name", sort]],
					});
				} else {
					data = await db.discount_history.findAll({
						where,
						include: { model: db.product },
						order: [[sort.split("-")[0], sort.split("-")[1]]],
					});
				}
			}
			new HTTPStatus(res, data).success(`Discount list sort by ${sort}`).send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	discountList: async (req, res) => {
		const { uid } = req.uid;
		const { status } = req.query;
		try {
			let data;
			let where;
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch, required: false },
			});
			if (admin.role == "super admin") {
				if (status == 0)
					data = await db.discount_history.findAll({
						include: [{ model: db.product }, { model: db.branch }],
					});
				if (status == 1)
					data = await db.discount_history.findAll({
						where: { status: "Waiting Approval" },
						include: [{ model: db.product }, { model: db.branch }],
					});
				if (status == 2)
					data = await db.discount_history.findAll({
						where: { status: "Active" },
						include: [{ model: db.product }, { model: db.branch }],
					});
				if (status == 3)
					data = await db.discount_history.findAll({
						where: { status: "Declined" },
						include: [{ model: db.product }, { model: db.branch }],
					});
				new HTTPStatus(res, data).success("Discount list").send();
			} else {
				if (status == 0) where = { branch_id: admin.branch.id };
				if (status == 1)
					where = {
						[Op.and]: [
							{ branch_id: admin.branch.id },
							{ status: "Waiting Approval" },
						],
					};
				if (status == 2)
					where = where = {
						[Op.and]: [{ branch_id: admin.branch.id }, { status: "Active" }],
					};
				if (status == 3)
					where = where = {
						[Op.and]: [{ branch_id: admin.branch.id }, { status: "Declined" }],
					};
				data = await db.discount_history.findAll({
					where,
					include: { model: db.product },
				});
				new HTTPStatus(res, data).success("Discount list").send();
			}
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	getDiscount: async (req, res) => {
		try {
			const data = await db.discount.findAll();
			new HTTPStatus(res, data).success("Get discount type").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	searchProduct: async (req, res) => {
		const { name } = req.query;
		const { page } = req.query;
		try {
			const totalPage = await db.product.count({
				where: {
					[Op.and]: [{ name: { [Op.substring]: name } }, { status: "Active" }],
				},
			});
			const data = await db.product.findAll({
				where: {
					[Op.and]: [{ name: { [Op.substring]: name } }, { status: "Active" }],
				},
				offset: page == 1 ? 0 : (page - 1) * 12,
				limit: 12,
			});
			new HTTPStatus(res, { product: data, page: Math.ceil(totalPage / 12) })
				.success("Search Product")
				.send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	createDiscount: async (req, res) => {
		const { uid } = req.uid;
		const { min_purchase, percent, expired, discount_id, product_id } =
			req.body;
		try {
			const admin = await db.user.findOne({
				where: { uid },
				include: { model: db.branch },
			});

			if (discount_id == 1) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success("BUY 1 GET 1 created, Contact super admin for approval")
					.send();
			}
			if (discount_id == 2) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						min_purchase,
						percent,
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success(
						"MINIMUM PURCHASE DISCOUNT created, Contact super admin for approval"
					)
					.send();
			}
			if (discount_id == 3) {
				product_id.map(async (value) => {
					await db.discount_history.create({
						percent,
						expired,
						branch_id: admin.branch.id,
						discount_id,
						product_id: value,
					});
				});
				new HTTPStatus(res)
					.success(
						`${percent}% DISCOUNT created, Contact super admin for approval`
					)
					.send();
			}
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
};
