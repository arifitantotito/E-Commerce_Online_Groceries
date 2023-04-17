"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class branch extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ discount_history, transaction, cart, branch_product, stock_history, user }) {
			// define association here
			this.hasMany(transaction, { foreignKey: "branch_id" });
			this.hasMany(stock_history, { foreignKey: "branch_id" });
			this.hasMany(branch_product, { foreignKey: "branch_id" });
			this.hasMany(discount_history, { foreignKey: "branch_id" });
			this.hasMany(cart, { foreignKey: "branch_id" });
			this.belongsTo(user, { foreignKey: "user_id" });
		}
	}
	branch.init(
		{
			location: DataTypes.STRING,
			address: DataTypes.TEXT,
			lat: DataTypes.STRING,
			lng: DataTypes.STRING,
			city_code: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "branch",
			freezeTableName: true,
		}
	);
	return branch;
};
