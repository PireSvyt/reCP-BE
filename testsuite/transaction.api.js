require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiSetTransactionSave = async function (transaction) {
  try {
    const res = await axios.post(
      apiURL + "/api/set/transaction/save",
      transaction,
    );
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiSetTransactionSave",
      error: err,
      transaction: transaction,
    };
    console.error(res);
    return res;
  }
};
exports.apiSetTransactionDelete = async function (id) {
  try {
    const res = await axios.post(apiURL + "/api/delete/transaction/" + id);
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiSetTransactionDelete",
      error: err,
    };
    console.error(res);
    return res;
  }
};
exports.apiSetTransactionsDelete = async function (ids) {
  try {
    const res = await axios.post(apiURL + "/api/delete/transactions", ids);
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiSetTransactionsDelete",
      error: err,
    };
    console.error(res);
    return res;
  }
};
exports.apiGetTransaction = async function (id) {
  try {
    const res = await axios.post(apiURL + "/api/get/transaction/item/" + id);
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiGettransaction " + id,
      transaction: {},
      error: err,
    };
    console.error(res);
    return res;
  }
};
exports.apiGetTransactions = async function (need) {
  try {
    const res = await axios.post(apiURL + "/api/get/transaction/list", need);
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiGettransactions " + need,
      transactions: [],
      error: err,
    };
    console.error(res);
    return res;
  }
};
