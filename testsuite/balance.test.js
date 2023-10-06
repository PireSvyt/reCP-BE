require("dotenv").config();
require("@jest/globals");
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

async function apiGetBalance() {
  try {
    const res = await axios.post(apiURL + "api/get/balance");
    return res.data;
  } catch (err) {
    const res = {
      status: 400,
      message: "error on apiGetBalance",
      balance: {},
      error: err,
    };
    console.error(res);
    return res;
  }
}

describe(
  "TEST OF ENDPOINTS : balance on server " & process.env.TESTSUITE_SERVER_URL,
  () => {
    describe("Assessment POST apiGetBalance", () => {
      it("tests POST apiGetBalance", async () => {
        let response = await apiGetBalance();
        //console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(Object.keys(response.summary.categories).length).toBeGreaterThan(
          1,
        );
      });
    });
  },
);
