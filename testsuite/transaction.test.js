require("@jest/globals");
const transactionAPI = require("./transaction.api.js");

describe("TEST OF ENDPOINTS : balance", () => {
  describe("Assessment POST apiTransactionSave", () => {
    test("tests POST apiTransactionSave is functional", async () => {
      let cleanup = await transactionAPI.apiTransactionDeleteMany({ ids: [] });
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      // Test
      let response = await transactionAPI.apiTransactionSave(transaction);
      //console.log("response", response);
      expect(response.status).toBe(201);
      expect(response.message).toBe("transaction created");
      // Clean
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response.id],
      });
    });
  });

  describe("Assessment POST apiTransactionGetOne", () => {
    test("tests POST apiTransactionGetOne", async () => {
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let response = await transactionAPI.apiTransactionSave(transaction);
      // Test
      let getresponse = await transactionAPI.apiTransactionGetOne(response.id);
      //console.log("getresponse", getresponse);
      expect(getresponse.status).toBe(200);
      expect(getresponse.message).toBe("transaction ok");
      // Clean
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response.id],
      });
    });
  });

  describe("Assessment POST apiTransactionGetMany", () => {
    test("tests POST apiTransactionGetMany", async () => {
      let transaction = {
        name: "TESTSUITE Transaction",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 1,
      };
      let response = await transactionAPI.apiTransactionSave(transaction);
      // Test
      let getresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      //console.log("getresponse", getresponse);
      expect(getresponse.status).toBe(200);
      expect(getresponse.message).toBe("list ok");
      // Clean
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response.id],
      });
      console.log("deleteresponse", deleteresponse);
    });
  });

  describe("Assessment POST apiTransactionDeleteMany", () => {
    test("tests POST apiTransactionDeleteMany", async () => {
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
      let response1 = await transactionAPI.apiTransactionSave(transaction1);
      let response2 = await transactionAPI.apiTransactionSave(transaction2);
      // Test
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response1.id, response2.id],
      });
      console.log("deleteresponse", deleteresponse);
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transactions deleted");
    });
  });
});
