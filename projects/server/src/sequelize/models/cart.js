"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class cart extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ user, product, branch }) {
			// define association here
			this.belongsTo(user, { foreignKey: "user_id" });
			this.belongsTo(product, { foreignKey: "product_id" });
			this.belongsTo(branch, { foreignKey: "branch_id" });
		}
	}
	cart.init(
		{
			qty: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Product must have a quantity" },
					notEmpty: { msg: "Product quantity cannot be empty" },
					min: {
						args: 1,
						msg: "Product quantity cannot be 0",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "cart",
			freezeTableName: true,
			timestamps: false,
		}
	);
	return cart;
};
