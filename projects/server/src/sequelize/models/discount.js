"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class discount extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ discount_history }) {
			// define association here
			this.hasMany(discount_history, { foreignKey: "discount_id" });
		}
	}
	discount.init(
		{
			name: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "discount",
			freezeTableName: true,
			timestamps: false,
		}
	);
	return discount;
};
