require("@jest/globals");
const balanceAPI = require("./balance.api.js");
const transactionAPI = require("./transaction.api.js");

describe(
  "TEST OF ENDPOINTS : balance on server " & process.env.TESTSUITE_SERVER_URL,
  () => {
    describe("Assessment POST apiGetBalance", () => {
      test("without any transaction", async () => {
        let cleanup = await transactionAPI.apiTransactionDeleteMany();
        console.log("cleanup", cleanup);
        let response = await balanceAPI.apiGetBalance();
        console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(Object.keys(response.summary.categories).length).toBeGreaterThan(
          1,
        );
        expect(response.summary.users.Alice).toBe(0);
        expect(response.summary.users.Pierre).toBe(0);
      });
    });
  },
);
