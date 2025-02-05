require("@jest/globals");
const computeBudgetTarget = require("./computeBudgetTarget.js");

let debug = true;

describe("TEST OF FUNCTION : computeBudgetTarget ", () => {
  let budget_exit = {
    treatment: "exit",
    categoryid: "category",
    budgetid: "budget",
  };
  let budget_entry = {
    treatment: "entry",
    categoryid: "category",
    budgetid: "budget",
  };
  let budget_saving = {
    treatment: "saving",
    name: "saving budget",
    budgetid: "budget",
  };
  let today = new Date();
  let startdate = today.setMonth(today.getMonth() - 1);
  let enddate = today.setMonth(today.getMonth() + 1);
  let budgettarget_default = {
    startdate: String(startdate),
    enddate: enddate.toLocaleString(),
    budgetid: "budget",
  };
  let transaction_exit = {
    date: today,
    treatment: "exit",
    amount: 1,
    categoryid: "category",
  };
  let transaction_entry = {
    date: today,
    treatment: "entry",
    amount: 1,
    categoryid: "category",
  };
  let transaction_saving = {
    date: today,
    treatment: "saving",
    amount: 1,
    categoryid: "category",
    budgetid: "budget",
  };

  describe("Assessment of default cases", () => {
    describe("When budget treatement is unknwon", () => {
      let budget_unknwown = {
        treatment: "unknwown",
      };
      let budgettarget_outcome = computeBudgetTarget(
        budget_unknwown,
        budgettarget_default,
        [transaction_exit]
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then error is found", () => {
        expect(budgettarget_outcome.error).toEqual("budget.treatment unknown");
      });
      test("then current sum is undefined", () => {
        expect(budgettarget_outcome.current).toEqual(undefined);
      });
      test("then projection sum is undefined", () => {
        expect(budgettarget_outcome.projection).toEqual(undefined);
      });
    });

    describe("When transaction list is empty", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        []
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum is null", () => {
        expect(budgettarget_outcome.current).toEqual(0);
      });
      test("then projection sum is null", () => {
        expect(budgettarget_outcome.projection).toEqual(0);
      });
    });
  });

  describe("Assessment of exits", () => {
    describe("When transaction is an exit and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_exit]
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 1);
      });
    });

    describe("When transaction is an entry and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_entry]
      );
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 1);
      });
    });

    describe("When transaction is a saving and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_saving]
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 1);
      });
    });
  });
});
