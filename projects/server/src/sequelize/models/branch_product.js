"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class branch_product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ product, branch }) {
			// define association here
			this.belongsTo(product, { foreignKey: "product_id" });
			this.belongsTo(branch, { foreignKey: "branch_id" });
		}
	}
	branch_product.init(
		{
			stock: DataTypes.INTEGER,
			status: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "branch_product",
			freezeTableName: true,
		}
	);
	return branch_product;
};
