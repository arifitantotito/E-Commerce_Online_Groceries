"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class discount_history extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ discount, transaction, product, branch }) {
			// define association here
			this.hasMany(transaction, { foreignKey: "discount_history_id" });
			this.belongsTo(discount, { foreignKey: "discount_id" });
			this.belongsTo(product, { foreignKey: "product_id" });
			this.belongsTo(branch, { foreignKey: "branch_id" });
		}
	}
	discount_history.init(
		{
			min_purchase: {
				type: DataTypes.INTEGER,
				validate: {
					min: {
						args: 2,
						msg: "Minimum purchased goods quantity cannot be below 2",
					},
				},
			},
			percent: {
				type: DataTypes.INTEGER,
				validate: {
					min: {
						args: 1,
						msg: "Minimum percentage discount cannot be below 0",
					},
				},
			},
			expired: DataTypes.DATEONLY,
			status: {
				type: DataTypes.STRING,
				defaultValue: "Waiting Approval",
			},
		},
		{
			sequelize,
			modelName: "discount_history",
			freezeTableName: true,
			timestamps: true,
			updatedAt: false,
		}
	);
	return discount_history;
};
