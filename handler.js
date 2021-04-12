const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const axios = require("axios");

const app = express();

app.use(cors());
app.use(morgan("dev"));

const API_SERVICE_URL = "https://haveibeenpwned.com/api/v3/";

const getBreaches = async (account) => {
	try {
		const breaches = await axios.get(
			`${API_SERVICE_URL}breachedaccount/${account}?truncateResponse=false`,
			{
				headers: {
					"hibp-api-key": process.env.API_KEY,
				},
			}
		);
		return breaches;
	} catch (error) {
		console.log(error);
	}
};
// Info GET endpoint
app.get("/accbreach/:account", (req, res, next) => {
	console.log(req.params.account);

	getBreaches(req.params.account).then((breaches) => {
		if (breaches) {
				res.send(breaches.data);
		} else {
			res.send({
				status: false,
				Mensaje: "Ninguna vulnerabilidad encontrada",
			});
		}
	});
});


module.exports.handler = serverless(app);
