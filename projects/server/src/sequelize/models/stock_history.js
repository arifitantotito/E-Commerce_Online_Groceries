"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class stock_history extends Model {
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
	stock_history.init(
		{
			stock: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "stock_history",
			freezeTableName: true,
			timestamps: true,
			updatedAt: false,
		}
	);
	return stock_history;
};
