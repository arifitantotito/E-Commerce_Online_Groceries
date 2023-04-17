const db = require("../sequelize/models");
const HTTPStatus = require("../helper/HTTPStatus");
const { hashPassword, matchPassword } = require("../lib/hash");
const { createToken } = require("../lib/jwt");
const fs = require("fs").promises;
const transporter = require("../helper/transporter");
const handlebars = require("handlebars");
const { Op } = require("sequelize");
const deleteFiles = require("../helper/deleteFiles");
const { sequelize } = require("../sequelize/models");
const { default: axios } = require("axios");
const path = require("path");

module.exports = {
	getUser: async (req, res) => {
		const { uid } = req.uid;
		try {
			const {
				name,
				email,
				gender,
				birthdate,
				phone_number,
				img,
				user_addresses,
				role,
				status,
			} = await db.user.findOne({
				where: { uid },
				include: { model: db.user_address },
			});
			const httpStatus = new HTTPStatus(res, {
				name,
				email,
				gender,
				birthdate,
				phone_number,
				img,
				role,
				status,
				user_addresses: {
					main_address: user_addresses.filter((value) => {
						return value.main_address === true;
					}),
					address: user_addresses.filter((value) => {
						return value.main_address === false;
					}),
				},
			}).success("Get user profile");
			httpStatus.send();
		} catch (error) {
			console.log(error);

			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	updateUser: async (req, res) => {
		const { uid } = req.uid;
		const { name, email, phone_number, gender, birthdate } = req.body;
		try {
			const data = await db.user.update(
				{ name, birthdate, gender, email, phone_number },
				{
					where: { uid },
				}
			);
			const httpStatus = new HTTPStatus(res, data).success("Get user profile");
			httpStatus.send();
		} catch (error) {
			res.status(400).send({
				isError: false,
				message: error.message,
				data: error,
			});
		}
	},
	register: async (req, res) => {
		try {
			let { name, email, password, phone_number } = req.body;

			if (!name || !email || !password || !phone_number)
				return res.status(404).send({
					isError: true,
					message: "Input Must Be Filled",
					data: null,
				});

			let findEmail = await db.user.findOne({
				where: {
					email: email,
				},
			});

			if (findEmail)
				return res.status(404).send({
					isError: true,
					message: "Email Already Exist",
					data: null,
				});

			let char =
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
			if (!char.test(password))
				return res.status(404).send({
					isError: true,
					message: "Password Must Contain Number and Capital",
					data: null,
				});

			if (isNaN(phone_number) || phone_number.length < 11)
				return res.status(404).send({
					isError: true,
					message: "Phone Number Must Be Number and More Than 11 Char",
					data: null,
				});
			let dataToSend = await db.user.create({
				name,
				email,
				password: await hashPassword(password),
				phone_number,
			});
			const template = await fs.readFile(path.resolve(__dirname, '../template/confirmation.html'), 'utf-8')
			
			const templateToCompile = await handlebars.compile(template);
			const newTemplate = templateToCompile({
				name,
				url: `https://jcwd230202.purwadhikabootcamp.com/activation/${dataToSend.dataValues.uid}`,
			});

			await transporter.sendMail({
				from: "Tokonglomerat",
				to: email,
				subject: "Activation account",
				html: newTemplate,
			});

			res.status(201).send({
				isError: false,
				message: "Register Success, Please Check Your Email",
				data: null,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: "Register Failed",
				data: error,
			});
		}
	},

	login: async (req, res) => {
		try {
			let { email, password } = req.body;

			if (!email || !password)
				return res.status(404).send({
					isError: true,
					message: "Input must be filled",
					data: null,
				});

			let findEmail = await db.user.findOne({
				where: {
					email: email,
				},
			});

			if (!findEmail.dataValues)
				return res.status(404).send({
					isError: true,
					message: "Email Not Found",
					data: null,
				});

			let hashMatchResult = await matchPassword(
				password,
				findEmail.dataValues.password
			);

			if (hashMatchResult === false)
				return res.status(404).send({
					isError: true,
					message: "Wrong Password or Email",
					data: null,
				});

			const token = createToken({
				uid: findEmail.uid,
			});

			res.status(201).send({
				isError: false,
				message: "Login Success",
				data: {
					token,
					uid: findEmail.dataValues.uid,
					name: findEmail.dataValues.name,
					email: findEmail.dataValues.email,
					phone_number: findEmail.dataValues.phone_number,
				},
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: "Login Failed",
				data: error.message,
			});
		}
	},
	keepLogin: async (req, res) => {
		try {
			res.status(201).send({
				isError: false,
				message: "Token Valid",
				data: req.uid.name,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	},
	activation: async (req, res) => {
		try {
			let { uid } = req.body;
			await db.user.update(
				{ status: "Verified" },
				{
					where: {
						uid: uid,
					},
				}
			);

			res.status(201).send({
				isError: false,
				message: "Account Verified!",
				data: null,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	},
	resetPassword: async (req, res) => {
		try {
			let { uid, password, confPassword } = req.body;
			if (!password)
				return res.status(404).send({
					isError: true,
					message: "Please Input Your Password",
					data: null,
				});

			if (password !== confPassword)
				return res.status(404).send({
					isError: true,
					message: "Password Not Match",
					data: password,
					confPassword,
				});

			await db.user.update(
				{ password: await hashPassword(password) },
				{
					where: {
						uid: uid,
					},
				}
			);

			res.status(201).send({
				isError: false,
				message: "Update Password Success",
				data: null,
			});
		} catch (error) {
			res.status(500).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	},
	forgotPassword: async (req, res) => {
		try {
			let { email } = req.body;

			if (!email)
				return res.status(404).send({
					isError: true,
					message: "Please Input Your Email",
				});

			let findEmail = await db.user.findOne({
				where: {
					email: email,
				},
			});

			if (!findEmail)
				return res.status(404).send({
					isError: true,
					message: "Email Not Found",
					data: null,
				});

			const name = findEmail.dataValues.name;
			
			const template = await fs.readFile(path.resolve(__dirname, '../template/resetPassword.html'), 'utf-8')
			
			const templateToCompile = await handlebars.compile(template);
			const newTemplate = templateToCompile({
				name,
				url: `https://jcwd230202.purwadhikabootcamp.com/updatePassword/${findEmail.dataValues.uid}`,
			});

			await transporter.sendMail({
				from: "Tokonglomerat",
				to: email,
				subject: "Reset Password",
				html: newTemplate,
			});

			res.status(201).send({
				isError: false,
				message: "Check Your Email",
				data: null,
			});
		} catch (error) {
			res.status(404).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	},
	editProfilePic: async (req, res) => {
		const { uid } = req.uid;

		try {
			let { img } = await db.user.findOne({
				where: {
					uid,
				},
			});
			await db.user.update(
				{
					img: `Public/images/${req.files.images[0].filename}`,
				},
				{
					where: {
						uid,
					},
				}
			);

			deleteFiles(img);

			res.status(201).send({
				isError: false,
				message: "Update Products Success!",
				data: null,
			});
		} catch (error) {
			deleteFiles(req.files.images[0].path);
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	editPaymentProof: async (req, res) => {
		const { uid } = req.uid;

		try {
			let { id } = await db.user.findOne({
				where: {
					uid,
				},
			});
			await db.transaction.update(
				{
					payment_proof: `Public/images/${req.files.images[0].filename}`,
					status: "Waiting Approval",
				},
				{
					where: {
						user_id: id,
					},
				}
			);

			res.status(201).send({
				isError: false,
				message: "Payment proof uploaded",
				data: null,
			});
		} catch (error) {
			deleteFiles(req.files.images[0].path);
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	changePassword: async (req, res) => {
		const { uid } = req.uid;
		const { oldPassword, newPassword } = req.body;
		try {
			const data = await db.user.findOne({ where: { uid } });

			if (!(await matchPassword(oldPassword, data.password))) {
				return res.status(400).send({
					isError: true,
					message: "Invalid password",
					data: null,
				});
			}
			await db.user.update(
				{ password: await hashPassword(newPassword) },
				{ where: { uid } }
			);
			res.status(201).send({
				isError: false,
				message: "Password updated",
				data: null,
			});
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	deleteAddress: async (req, res) => {
		const { id } = req.params;
		try {
			await db.user_address.destroy({ where: { id } });
			res.status(201).send({
				isError: false,
				message: "Address deleted",
				data: null,
			});
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	defaultAddress: async (req, res) => {
		const { id } = req.params;
		const t = await sequelize.transaction();
		try {
			await db.user_address.update(
				{ main_address: false },
				{ where: { main_address: true } },
				{ transaction: t }
			);
			await db.user_address.update(
				{ main_address: true },
				{ where: { id } },
				{ transaction: t }
			);

			t.commit();
			res.status(201).send({
				isError: false,
				message: "Default address updated",
				data: null,
			});
		} catch (error) {
			t.rollback();
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	rakirProvince: async (req, res) => {
		try {
			const { data } = await axios.get(
				"https://api.rajaongkir.com/starter/province",
				{
					headers: { key: "d7acd6e75f2be4840040ef9ededd90d3" },
				}
			);
			res.status(200).send({
				isError: false,
				message: "Rajaongkir Province",
				data: data.rajaongkir.results,
			});
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	rakirCity: async (req, res) => {
		const { province } = req.query;
		try {
			if (!province)
				return res.status(404).send({
					isError: true,
					message: "Province_Id Not Found!",
					data: null,
				});
			const { data } = await axios.get(
				`https://api.rajaongkir.com/starter/city?province=${province}`,
				{
					headers: { key: "d7acd6e75f2be4840040ef9ededd90d3" },
				}
			);
			res.status(201).send({
				isError: false,
				message: "Rajaongkir City by province",
				data: data.rajaongkir.results,
			});
		} catch (error) {
			res.status(400).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	},
	findAddress: async (req, res) => {
		const { id } = req.query;
		try {
			const data = await db.user_address.findByPk(id);
			new HTTPStatus(res, data).success("Find Address").send();
		} catch (error) {
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
	editAddress: async (req, res) => {
		const t = await sequelize.transaction();
		const { uid } = req.uid;
		const {
			id,
			address,
			province,
			city,
			receiver_name,
			receiver_phone,
			main_address,
		} = req.body;
		try {
			const user = await db.user.findOne({ where: { uid } });
			const { data } = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${city
					.split(".")[1]
					.replace(
						/ /g,
						"+"
					)}&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
			);
			if (main_address) {
				await db.user_address.update(
					{ main_address: false },
					{ where: { [Op.and]: [{ main_address }, { user_id: user.id }] } },
					{ transaction: t }
				);
			}
			await db.user_address.update(
				{
					province,
					city,
					address,
					receiver_name,
					receiver_phone,
					main_address,
					lat: data.results[0].geometry.lat,
					lng: data.results[0].geometry.lng,
				},
				{ where: { id } },
				{ transaction: t }
			);
			t.commit();
			new HTTPStatus(res).success("Address updated").send();
		} catch (error) {
			new HTTPStatus(res, error).success(error.message).send();
		}
	},
	addAddress: async (req, res) => {
		const t = await sequelize.transaction();
		const { uid } = req.uid;
		const {
			province,
			city,
			address,
			receiver_name,
			receiver_phone,
			main_address,
		} = req.body;
		try {
			const { id } = await db.user.findOne({ where: { uid } });
			const { data } = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${city
					.split(".")[1]
					.replace(
						/ /g,
						"+"
					)}&key=58ed1690dc1141a1bfb80cfb21b1d18a&language=en&pretty=1`
			);
			if (main_address) {
				await db.user_address.update(
					{ main_address: false },
					{ where: { [Op.and]: [{ main_address }, { user_id: id }] } },
					{ transaction: t }
				);
			}
			await db.user_address.create(
				{
					province,
					city,
					address,
					receiver_name,
					receiver_phone,
					main_address,
					user_id: id,
					lat: data.results[0].geometry.lat,
					lng: data.results[0].geometry.lng,
				},
				{ transaction: t }
			);
			t.commit();
			res.status(201).send({
				isError: false,
				message: "Address added",
				data: null,
			});
		} catch (error) {
			t.rollback();
			new HTTPStatus(res, error).error(error.message).send();
		}
	},
};
