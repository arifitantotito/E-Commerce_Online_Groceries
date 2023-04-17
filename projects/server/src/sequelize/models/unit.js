"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class unit extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ product }) {
			// define association here
			this.hasMany(product, { foreignKey: "unit_id" });
		}
	}
	unit.init(
		{
			name: DataTypes.STRING,
			price_at: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "unit",
			freezeTableName: true,
			timestamps: false,
		}
	);
	return unit;
};
