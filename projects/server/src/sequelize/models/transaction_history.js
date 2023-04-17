"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class transaction_history extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({}) {
			// define association here
		}
	}
	transaction_history.init(
		{
			status: DataTypes.STRING,
			invoice: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "transaction_history",
			freezeTableName: true,
			timestamps: true,
			updatedAt: false,
		}
	);
	return transaction_history;
};
