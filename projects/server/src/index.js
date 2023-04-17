require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
// 	cors({
// 		origin: [
// 			process.env.WHITELISTED_DOMAIN &&
// 				process.env.WHITELISTED_DOMAIN.split(","),
// 		],
// 	})
// );
// console.log(process.env.WHITELISTED_DOMAIN);
app.use(cors());

app.use(express.json());

//#region API ROUTES
app.use("/Public", express.static("Public"));

const { productRouter, cartRouter, courierRouter, thirdpartyRouter, adminTransactionRouter } = require("./router");
const { userRouter } = require("./router");
const { adminRouter } = require("./router");
const { transactionRouter } = require("./router");

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter)
app.use("/courier", courierRouter)
app.use("/opencage", thirdpartyRouter)
app.use("/adminTransaction",adminTransactionRouter)

// cron.schedule("* * * * *", () => console.log("hello"), {
// 	timezone: "Asia/Jakarta",
// });

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
	res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
	res.status(200).json({
		message: "Hello, Student !",
	});
});

// ===========================

// not found
app.use((req, res, next) => {
	if (req.path.includes("/api/")) {
		res.status(404).send("Not found !");
	} else {
		next();
	}
});

// error
app.use((err, req, res, next) => {
	if (req.path.includes("/api/")) {
		console.error("Error : ", err.stack);
		res.status(500).send("Error !");
	} else {
		next();
	}
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
	res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
	if (err) {
		console.log(`ERROR: ${err}`);
	} else {
		console.log(`APP RUNNING at ${PORT} ✅`);
	}
});
