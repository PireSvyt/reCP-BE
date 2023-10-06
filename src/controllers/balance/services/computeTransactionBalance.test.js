require("@jest/globals");
const computeTransactionBalance = require("./computeTransactionBalance.js");

describe("TEST OF FUNCTION : computeTransactionBalance ", () => {
  describe("Assessment prior first rule", () => {
    let startdate = new Date("2023-03-01");
    //console.log("startdate", startdate);
    describe("When by Alice and for Alice", () => {
      let transaction_1 = {
        date: startdate,
        category: "whatever",
        for: ["Alice"],
        by: "Alice",
        amount: 1,
      };
      let transaction_1_outcome = computeTransactionBalance(transaction_1);
      test("then expense is null for Alice", () => {
        expect(transaction_1_outcome["Alice"]).toEqual(0);
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_1_outcome["Pierre"]).toBeUndefined();
      });
    });

    describe("When by Pierre and for Pierre", () => {
      let transaction_2 = {
        date: startdate,
        category: "whatever",
        for: ["Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_2_outcome = computeTransactionBalance(transaction_2);
      test("then expense is null for Alice", () => {
        expect(transaction_2_outcome["Alice"]).toBeUndefined();
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_2_outcome["Pierre"]).toEqual(0);
      });
    });

    describe("When by Alice and for Pierre", () => {
      let transaction_3 = {
        date: startdate,
        category: "whatever",
        for: ["Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_3_outcome = computeTransactionBalance(transaction_3);
      test("then expense is -100% for Alice", () => {
        expect(transaction_3_outcome["Alice"]).toEqual(1);
      });
      test("then expense is -100% for Pierre", () => {
        expect(transaction_3_outcome["Pierre"]).toEqual(-1);
      });
    });

    describe("When by Alice and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "whatever",
        for: ["Alice", "Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 50% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(0.5);
      });
      test("then expense is 50% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(-0.5);
      });
    });

    describe("When by Pierre and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "whatever",
        for: ["Alice", "Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 50% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(-0.5);
      });
      test("then expense is 50% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(0.5);
      });
    });
  });

  describe("Assessment after first rule in scope", () => {
    let startdate = new Date("2023-05-01");
    describe("When by Alice and for Alice", () => {
      let transaction_1 = {
        date: startdate,
        category: "625bea0ebd23b203b66897da",
        for: ["Alice"],
        by: "Alice",
        amount: 1,
      };
      let transaction_1_outcome = computeTransactionBalance(transaction_1);
      test("then expense is null for Alice", () => {
        expect(transaction_1_outcome["Alice"]).toEqual(0);
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_1_outcome["Pierre"]).toBeUndefined();
      });
    });

    describe("When by Pierre and for Pierre", () => {
      let transaction_2 = {
        date: startdate,
        category: "625bea0ebd23b203b66897da",
        for: ["Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_2_outcome = computeTransactionBalance(transaction_2);
      test("then expense is null for Alice", () => {
        expect(transaction_2_outcome["Alice"]).toBeUndefined();
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_2_outcome["Pierre"]).toEqual(0);
      });
    });

    describe("When by Alice and for Pierre", () => {
      let transaction_3 = {
        date: startdate,
        category: "625bea0ebd23b203b66897da",
        for: ["Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_3_outcome = computeTransactionBalance(transaction_3);
      test("then expense is 100% for Alice", () => {
        expect(transaction_3_outcome["Alice"]).toEqual(1);
      });
      test("then expense is -100% for Pierre", () => {
        expect(transaction_3_outcome["Pierre"]).toEqual(-1);
      });
    });

    describe("When by Alice and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "625bea0ebd23b203b66897da",
        for: ["Alice", "Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 40% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(0.4);
      });
      test("then expense is 60% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(-0.6);
      });
    });

    describe("When by Pierre and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "625bea0ebd23b203b66897da",
        for: ["Alice", "Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 40% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(-0.4);
      });
      test("then expense is 60% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(0.6);
      });
    });
  });

  describe("Assessment after first rule but outside of scope", () => {
    let startdate = new Date("2023-05-01");
    describe("When by Alice and for Alice", () => {
      let transaction_1 = {
        date: startdate,
        category: "whatever",
        for: ["Alice"],
        by: "Alice",
        amount: 1,
      };
      let transaction_1_outcome = computeTransactionBalance(transaction_1);
      test("then expense is null for Alice", () => {
        expect(transaction_1_outcome["Alice"]).toEqual(0);
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_1_outcome["Pierre"]).toBeUndefined();
      });
    });

    describe("When by Pierre and for Pierre", () => {
      let transaction_2 = {
        date: startdate,
        category: "whatever",
        for: ["Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_2_outcome = computeTransactionBalance(transaction_2);
      test("then expense is null for Alice", () => {
        expect(transaction_2_outcome["Alice"]).toBeUndefined();
      });
      test("then expense is null for Pierre", () => {
        expect(transaction_2_outcome["Pierre"]).toEqual(0);
      });
    });

    describe("When by Alice and for Pierre", () => {
      let transaction_3 = {
        date: startdate,
        category: "whatever",
        for: ["Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_3_outcome = computeTransactionBalance(transaction_3);
      test("then expense is 100% for Alice", () => {
        expect(transaction_3_outcome["Alice"]).toEqual(1);
      });
      test("then expense is -100% for Pierre", () => {
        expect(transaction_3_outcome["Pierre"]).toEqual(-1);
      });
    });

    describe("When by Alice and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "whatever",
        for: ["Alice", "Pierre"],
        by: "Alice",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 50% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(0.5);
      });
      test("then expense is 50% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(-0.5);
      });
    });

    describe("When by Pierre and for Alice and Pierre", () => {
      let transaction_4 = {
        date: startdate,
        category: "whatever",
        for: ["Alice", "Pierre"],
        by: "Pierre",
        amount: 1,
      };
      let transaction_4_outcome = computeTransactionBalance(transaction_4);
      test("then expense is 50% for Alice", () => {
        expect(transaction_4_outcome["Alice"]).toEqual(-0.5);
      });
      test("then expense is 50% for Pierre", () => {
        expect(transaction_4_outcome["Pierre"]).toEqual(0.5);
      });
    });
  });
});
