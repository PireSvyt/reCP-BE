require("@jest/globals");
const transactionAPI = require("./transaction.api.js");

describe("TEST OF ENDPOINTS : balance", () => {
  describe("Assessment POST apiSetTransactionSave", () => {
    test("tests POST apiSetTransactionSave is functional", async () => {
      let cleanup = await transactionAPI.apiDeleteTransactions([]);
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      // Test
      let response = await transactionAPI.apiSetTransactionSave(transaction);
      //console.log("response", response);
      expect(response.status).toBe(201);
      expect(response.message).toBe("transaction created");
      // Clean
      let deleteresponse = await transactionAPI.apiDeleteTransaction(
        response.id,
      );
    });
  });

  describe("Assessment POST apiGetTransaction", () => {
    test("tests POST apiGetTransaction", async () => {
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let response = await transactionAPI.apiSetTransactionSave(transaction);
      // Test
      let getresponse = await transactionAPI.apiGetTransaction(response.id);
      //console.log("getresponse", getresponse);
      expect(getresponse.status).toBe(200);
      expect(getresponse.message).toBe("transaction ok");
      // Clean
      let deleteresponse = await transactionAPI.apiDeleteTransaction(
        response.id,
      );
    });
  });

  describe("Assessment POST apiGetTransactions", () => {
    test("tests POST apiGetTransactions", async () => {
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let response = await transactionAPI.apiSetTransactionSave(transaction);
      // Test
      let getresponse = await transactionAPI.apiGetTransactions({
        need: "mybalance",
      });
      //console.log("getresponse", getresponse);
      expect(getresponse.status).toBe(200);
      expect(getresponse.message).toBe("list ok");
      // Clean
      let deleteresponse = await transactionAPI.apiDeleteTransaction(
        response.id,
      );
    });
  });

  describe("Assessment POST apiDeleteTransaction", () => {
    test("tests POST apiDeleteTransaction", async () => {
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let response = await transactionAPI.apiSetTransactionSave(transaction);
      // Test
      let deleteresponse = await transactionAPI.apiDeleteTransaction(
        response.id,
      );
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transaction deleted");
    });
  });

  describe("Assessment POST apiDeleteTransactions", () => {
    test("tests POST apiDeleteTransactions", async () => {
      let transaction1 = {
        name: "TESTSUITE Transaction 1",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let transaction2 = {
        name: "TESTSUITE Transaction 2",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 2,
      };
      let response1 = await transactionAPI.apiSetTransactionSave(transaction1);
      let response2 = await transactionAPI.apiSetTransactionSave(transaction2);
      // Test
      let deleteresponse = await transactionAPI.apiDeleteTransactions([
        response1.id,
        response2.id,
      ]);
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transactions deleted");
    });
  });
});
