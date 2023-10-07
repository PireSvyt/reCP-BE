require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiBalanceGet = async function () {
  try {
    const res = await axios.post(apiURL + "api/balance/get");
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiBalanceGet",
      balance: {},
      error: err,
    };
    console.error(res);
    return res;
  }
};
