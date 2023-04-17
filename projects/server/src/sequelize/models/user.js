"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ user_address, transaction, cart, branch }) {
			// define association here
			this.hasMany(user_address, { foreignKey: "user_id" });
			this.hasMany(transaction, { foreignKey: "user_id" });
			this.hasMany(cart, { foreignKey: "user_id" });
			this.hasOne(branch, { foreignKey: "user_id" });
		}
	}
	user.init(
		{
			uid: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: { msg: "Users name must not be empty" },
					notNull: { msg: "User must have a name" },
				},
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: { msg: "Please input a valid email" },
					notEmpty: { msg: "Users password must not be empty" },
					notNull: { msg: "User must have an email" },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: { msg: "Users password must not be empty" },
					notNull: { msg: "User must have a password" },
				},
			},
			gender: DataTypes.STRING,
			birthdate: DataTypes.STRING,
			phone_number: {
				type: DataTypes.STRING,
				allowNull: { msg: "User must have a phone number" },
				validate: {
					notEmpty: { msg: "Users password must not be empty" },
				},
			},
			img: DataTypes.STRING,
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "user",
			},
			status: {
				type: DataTypes.STRING,
				defaultValue: "Unverified",
			},
		},
		{
			sequelize,
			modelName: "user",
			freezeTableName: true,
		}
	);
	return user;
};
