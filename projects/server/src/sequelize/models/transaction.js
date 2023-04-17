"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class transaction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ branch, discount_history, user, product }) {
			// define association here
			this.belongsTo(branch, { foreignKey: "branch_id" });
			this.belongsTo(discount_history, { foreignKey: "discount_history_id" });
			this.belongsTo(user, { foreignKey: "user_id" });
			this.belongsTo(product, { foreignKey: "product_id" });
		}
	}
	transaction.init(
		{
			product_name: DataTypes.STRING,
			qty: DataTypes.INTEGER,
			total_price: DataTypes.INTEGER,
			shipping_cost: DataTypes.INTEGER,
			user_address: DataTypes.TEXT,
			courier: DataTypes.STRING,
			invoice: DataTypes.STRING,
			status: {
				type: DataTypes.STRING,
				defaultValue: "Waiting Payment",
			},
			payment_proof: DataTypes.STRING,
			invoice: DataTypes.STRING,
			expired: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "transaction",
			freezeTableName: true,
		}
	);
	return transaction;
};
