const db = require("../models");

const branch_product = async () => {
	const product = await db.product.findAll();
	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 1,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 1,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 1,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 1,
				product_id: element.id,
			});
		}
	});

	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 2,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 2,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 2,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 2,
				product_id: element.id,
			});
		}
	});
	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 3,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 3,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 3,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 3,
				product_id: element.id,
			});
		}
	});
	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 4,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 4,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 4,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 4,
				product_id: element.id,
			});
		}
	});
	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 5,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 5,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 5,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 5,
				product_id: element.id,
			});
		}
	});
	product.forEach(async (element) => {
		if (
			element.unit_id === 1 ||
			element.unit_id === 4 ||
			element.unit_id === 5
		) {
			await db.branch_product.create({
				stock: 100,
				branch_id: 6,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100,
				branch_id: 6,
				product_id: element.id,
			});
		} else if (element.unit_id === 2) {
			await db.branch_product.create({
				stock: 100000,
				branch_id: 6,
				product_id: element.id,
				status: "Active",
			});
			await db.stock_history.create({
				stock: 100000,
				branch_id: 6,
				product_id: element.id,
			});
		}
	});
};

branch_product();
