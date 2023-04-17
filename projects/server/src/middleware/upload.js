const { multerUpload } = require("../lib/multer");
const deleteFiles = require("../helper/deleteFiles");

const uploadImage = (req, res, next) => {
	const multerResult = multerUpload.fields([{ name: "images", maxCount: 1 }]);
	multerResult(req, res, function (error) {
		try {
			if (error) throw error;
			req.files.images.forEach((value) => {
				if (value.size > 1000000)
					throw {
						message: `${value.originalname} size too large`,
						fileToDelete: req.files,
					};
			});
			next();
		} catch (error) {
			if (error.fileToDelete) {
				deleteFiles(error.fileToDelete);
			}
			return res.status(413).send({
				isError: true,
				message: error.message,
				data: error,
			});
		}
	});
};

module.exports = uploadImage;
