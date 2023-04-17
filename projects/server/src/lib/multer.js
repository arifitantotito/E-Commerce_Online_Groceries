const multer = require("multer");
const fs = require("fs");

const defaultPath = "Public";

const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		let isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`);
		if (!isDirectoryExist) {
			await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, {
				recursive: true,
			});
		}
		if (file.fieldname === "images") {
			cb(null, `${defaultPath}/${file.fieldname}`);
		}
	},
	filename: (req, file, cb) => {
		cb(null, "PIMG-" + Date.now() + "." + file.mimetype.split("/")[1]);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[0] === "image") {
		cb(null, true);
	} else {
		cb(new Error("File must be an Image!"));
	}
};

exports.multerUpload = multer({ storage, fileFilter });
