require("@jest/globals");
const balanceAPI = require("./balance.api.js");
const transactionAPI = require("./transaction.api.js");

describe(
  "TEST OF ENDPOINTS : balance on server " & process.env.TESTSUITE_SERVER_URL,
  () => {
    describe("Assessment POST apiGetBalance", () => {
      test("without any transaction", async () => {
        let cleanup = await transactionAPI.apiTransactionDeleteAll();
        let response = await balanceAPI.apiGetBalance();
        //console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(Object.keys(response.summary.categories).length).toBeGreaterThan(
          1,
        );
        expect(response.summary.users.Alice).toBe(0);
        expect(response.summary.users.Pierre).toBe(0);
      });

      test("prior first rule", async () => {
        let startdate = new Date("2023-03-01");
        let transaction1 = {
          name: "TESTSUITE Transaction 1",
          date: startdate,
          by: "Alice",
          for: ["Alice", "Pierre"],
          category: "dummy",
          amount: 1,
        };
        let transaction2 = {
          name: "TESTSUITE Transaction 2",
          date: startdate,
          by: "Alice",
          for: ["Alice", "Pierre"],
          category: "dummy",
          amount: 2,
        };
        let cleanup = await transactionAPI.apiTransactionDeleteAll();
        let response1 = await transactionAPI.apiTransactionSave(transaction1);
        let response2 = await transactionAPI.apiTransactionSave(transaction2);
        let response = await balanceAPI.apiGetBalance();
        //console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(response.summary.users.Alice).toBe(1.5);
        expect(response.summary.users.Pierre).toBe(-1.5);
      });

      test("post first rule when Pierre expenses", async () => {
        console.log("post first rule when Pierre expenses");
        let startdate = new Date("2023-05-01");
        let transaction1 = {
          name: "TESTSUITE Transaction 1",
          date: startdate,
          by: "Pierre",
          for: ["Alice", "Pierre"],
          category: "Alimentation",
          amount: 10,
        };
        let transaction2 = {
          name: "TESTSUITE Transaction 2",
          date: startdate,
          by: "Pierre",
          for: ["Alice", "Pierre"],
          category: "Alimentation",
          amount: 20,
        };
        let cleanup = await transactionAPI.apiTransactionDeleteAll();
        let response1 = await transactionAPI.apiTransactionSave(transaction1);
        /*
        Alice ows -4
        Pierre ows -6
        Pierre paid 10
        Alice's balance is -4
        Pierre's balance is -6 + 10 = 4
        */
        let response2 = await transactionAPI.apiTransactionSave(transaction2);
        /*
        Alice ows -8
        Pierre ows -12
        Pierre paid 20
        Alice's balance is -4 -8 = -12
        Pierre's balance is 4 -12 +20 = 12
        */
        let response = await balanceAPI.apiGetBalance();
        //console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(response.summary.users.Alice).toBeCloseTo(-12, 0.1);
        expect(response.summary.users.Pierre).toBeCloseTo(12, 0.1);
      });

      test("post first rule when Alice expenses", async () => {
        console.log("post first rule when Alice expenses");
        let startdate = new Date("2023-05-01");
        let transaction1 = {
          name: "TESTSUITE Transaction 1",
          date: startdate,
          by: "Alice",
          for: ["Alice", "Pierre"],
          category: "Alimentation",
          amount: 1,
        };
        let transaction2 = {
          name: "TESTSUITE Transaction 2",
          date: startdate,
          by: "Alice",
          for: ["Alice", "Pierre"],
          category: "Alimentation",
          amount: 2,
        };
        let cleanup = await transactionAPI.apiTransactionDeleteAll();
        let response1 = await transactionAPI.apiTransactionSave(transaction1);
        /*
        Alice ows -0.4
        Pierre ows -0.6
        Alice paid 1
        Alice's balance is -0.4 +1 = 0.6
        Pierre's balance is -0.6
        */
        let response2 = await transactionAPI.apiTransactionSave(transaction2);
        /*
        Alice ows -0.8
        Pierre ows -1.2
        Alice paid 2
        Alice's balance is 0.6 -0.8 +2 = 1.8
        Pierre's balance is -0.6 -1.2 = -1.8
        */
        let response = await balanceAPI.apiGetBalance();
        //console.log("response", response);
        expect(response.status).toBe(200);
        expect(response.message).toBe("summary ok");
        expect(response.summary.users.Alice).toBeCloseTo(1.8, 0.01);
        expect(response.summary.users.Pierre).toBeCloseTo(-1.8, 0.01);
      });
    });
  },
);
