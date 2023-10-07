require("@jest/globals");
const transactionAPI = require("./transaction.api.js");

describe("TEST OF ENDPOINTS : transaction", () => {
  describe("Assessment POST apiTransactionSave", () => {
    test("tests POST apiTransactionSave is functional", async () => {
      let cleanup = await transactionAPI.apiTransactionDeleteMany();
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
      let initialgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      let response1 = await transactionAPI.apiTransactionSave(transaction1);
      let response2 = await transactionAPI.apiTransactionSave(transaction2);
      // Test
      let finalgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      //console.log("getresponse", getresponse);
      expect(initialgetresponse.status).toBe(200);
      expect(initialgetresponse.message).toBe("list ok");
      expect(finalgetresponse.status).toBe(200);
      expect(finalgetresponse.message).toBe("list ok");
      expect(
        finalgetresponse.transactions.length -
          initialgetresponse.transactions.length,
      ).toBe(2);
      // Clean
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response1.id, response2.id],
      });
    });
  });

  describe("Assessment POST apiTransactionDeleteMany", () => {
    test("tests without list of ids", async () => {
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
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany();
      //console.log("deleteresponse", deleteresponse);
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transactions deleted");
      let finalgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      expect(finalgetresponse.transactions.length).toBe(0);
    });
    test("tests with empty list of ids", async () => {
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
        ids: [],
      });
      //console.log("deleteresponse", deleteresponse);
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transactions deleted");
      let finalgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      expect(finalgetresponse.transactions.length).toBe(0);
    });
    test("tests with list of ids", async () => {
      let transaction0 = {
        name: "TESTSUITE Transaction 0",
        date: new Date(),
        by: "Pierre",
        for: ["Alice", "Pierre"],
        category: "dummy",
        amount: 0,
      };
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
      let response0 = await transactionAPI.apiTransactionSave(transaction0);
      let initialgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      let response1 = await transactionAPI.apiTransactionSave(transaction1);
      let response2 = await transactionAPI.apiTransactionSave(transaction2);
      // Test
      let deleteresponse = await transactionAPI.apiTransactionDeleteMany({
        ids: [response1.id, response2.id],
      });
      //console.log("deleteresponse", deleteresponse);
      expect(deleteresponse.status).toBe(200);
      expect(deleteresponse.message).toBe("transactions deleted");
      let finalgetresponse = await transactionAPI.apiTransactionGetMany({
        need: "mybalance",
      });
      expect(finalgetresponse.transactions.length).toBe(
        initialgetresponse.transactions.length,
      );
    });
  });
});
