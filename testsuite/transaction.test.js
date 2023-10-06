require("dotenv").config();
require("@jest/globals");
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

async function apiSetTransactionSave(transaction) {
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
}

describe(
  "TEST OF ENDPOINTS : balance on server " & process.env.TESTSUITE_SERVER_URL,
  () => {
    describe("Assessment POST apiSetTransactionSave", () => {
      it("tests POST apiSetTransactionSave", async () => {
        let transaction = {
          name: "TESTSUITE Transaction",
          date: new Date(),
          by: "Pierre",
          for: ["Alice", "Pierre"],
          category: "dummy",
          amount: 1,
        };
        let response = await apiSetTransactionSave(transaction);
        console.log("response", response);
        expect(response.status).toBe(201);
        expect(response.message).toBe("transaction created");
      });
    });
  },
);
