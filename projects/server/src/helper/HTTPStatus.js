class HTTPStatus {
	constructor(res, data) {
		this.data = data;
		this.result = {
			isError: true,
			message: "",
			data: null,
			code: 500,
		};
		this.res = res;
	}
	success(message, code = 200) {
		this.result = {
			isError: false,
			message,
			data: this.data,
			code,
		};
		return this;
	}
	error(message, code = 500) {
		this.result = {
			isError: true,
			message,
			data: this.data,
			code,
		};
		return this;
	}
	send() {
		const { result, res } = this;
		res.status(result.code).send(result);
	}
}
module.exports = HTTPStatus;
