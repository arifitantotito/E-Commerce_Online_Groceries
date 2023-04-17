"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({
			cart,
			category,
			stock_history,
			branch_product,
			discount_history,
			unit,
			transaction,
		}) {
			// define association here
			this.belongsTo(category, { foreignKey: "category_id" });
			this.belongsTo(unit, { foreignKey: "unit_id" });
			this.hasMany(cart, { foreignKey: "product_id" });
			this.hasMany(stock_history, { foreignKey: "product_id" });
			this.hasMany(branch_product, { foreignKey: "product_id" });
			this.hasMany(discount_history, { foreignKey: "product_id" });
			this.hasMany(transaction, { foreignKey: "product_id" });
		}
	}
	product.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: { msg: "Product name must not be empty" },
					notNull: { msg: "Product must have a name" },
				},
			},
			img: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: { msg: "Product image must not be empty" },
					notNull: { msg: "Product must have an image" },
				},
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: { msg: "Product price must not be empty" },
					notNull: { msg: "Product must have a price" },
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},

			status: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "product",
			freezeTableName: true,
		}
	);
	return product;
};
