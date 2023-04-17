const fs = require("fs");

const deleteFiles = (file) => {
	fs.unlink(file, function (error) {
		try {
			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
	});
};

module.exports = deleteFiles;
