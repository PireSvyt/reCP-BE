require("@jest/globals");
const computeBudgetTarget = require("./computeBudgetTarget.js");

let debug = false;

describe("TEST OF FUNCTION : computeBudgetTarget ", () => {
  let userid = "A";
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
  let budget_personal = {
    treatment: "exit",
    categoryid: "category",
    audience: "personal",
  };
  let budget_community = {
    treatment: "exit",
    categoryid: "category",
    audience: "community",
  };
  //"2023-03-01"
  let today = new Date();
  let startdate = new Date(today.setMonth(today.getMonth() - 1));
  let enddate = new Date(today.setMonth(today.getMonth() + 2));
  if (debug) {
    console.log("today", today.toDateString());
    console.log("startdate", startdate.toDateString());
    console.log("enddate", enddate.toDateString());
  }
  let budgettarget_default = {
    startdate: startdate,
    enddate: enddate,
    budgetid: "budget",
  };
  let budgettarget_personal = {
    startdate: startdate,
    enddate: enddate,
    budgetid: "budget",
    audience: "personal",
  };
  let budgettarget_community = {
    startdate: startdate,
    enddate: enddate,
    budgetid: "budget",
    audience: "community",
  };
  let transaction_exit = {
    date: today,
    treatment: "exit",
    amount: 1,
    categoryid: "category",
    for: [userid],
    by: userid,
  };
  let transaction_entry = {
    date: today,
    treatment: "entry",
    amount: 1,
    categoryid: "category",
    for: [userid],
    by: userid,
  };
  let transaction_saving = {
    date: today,
    treatment: "saving",
    amount: 1,
    categoryid: "category",
    budgetid: "budget",
    for: [userid],
    by: userid,
  };
  let transaction_personal = {
    date: today,
    treatment: "exit",
    amount: 1,
    categoryid: "category",
    for: [userid],
    by: userid,
  };
  let transaction_community = {
    date: today,
    treatment: "exit",
    amount: 1,
    categoryid: "category",
    for: [userid, "B"],
    by: userid,
  };

  describe("Assessment of default cases", () => {
    describe("When budget treatement is unknwon", () => {
      let budget_unknwown = {
        treatment: "unknwown",
      };
      let budgettarget_outcome = computeBudgetTarget(
        budget_unknwown,
        budgettarget_default,
        [transaction_exit],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then error is found", () => {
        expect(budgettarget_outcome.error).toEqual("budget.treatment unknown");
      });
    });

    describe("When transaction list is empty", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [],
        userid
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

  describe("Assessment of exit budget", () => {
    describe("When transaction is an exit and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_exit],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 0);
      });
    });

    describe("When transaction is an entry and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_entry],
        userid
      );
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 0);
      });
    });

    describe("When transaction is a saving and budget is an exit", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_exit,
        budgettarget_default,
        [transaction_saving],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 0);
      });
    });
  });

  describe("Assessment of entry budget", () => {
    describe("When transaction is an exit and budget is an entry", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_entry,
        budgettarget_default,
        [transaction_exit],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 0);
      });
    });

    describe("When transaction is an entry and budget is an entry", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_entry,
        budgettarget_default,
        [transaction_entry],
        userid
      );
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 0);
      });
    });

    describe("When transaction is a saving and budget is an entry", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_entry,
        budgettarget_default,
        [transaction_saving],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 0);
      });
    });
  });

  describe("Assessment of saving budget", () => {
    describe("When transaction is an exit and budget is a saving", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_saving,
        budgettarget_default,
        [transaction_exit],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 0);
      });
    });

    describe("When transaction is an entry and budget is a saving", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_saving,
        budgettarget_default,
        [transaction_entry],
        userid
      );
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 0);
      });
    });

    describe("When transaction is a saving and budget is a saving", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_saving,
        budgettarget_default,
        [transaction_saving],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(-1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(-2, 0);
      });
    });
  });

  describe("Assessment of audience", () => {
    describe("When transaction personal and budget target is personal", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_community,
        budgettarget_personal,
        [transaction_personal],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(1);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(2, 0);
      });
    });

    describe("When transaction community and budget target is community", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_community,
        budgettarget_community,
        [transaction_community],
        userid,
        [{ userid: userid }, { userid: "B" }]
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum corresponds to this transaction", () => {
        expect(budgettarget_outcome.current).toEqual(0.5);
      });
      test("then projection sum is consistent with progress", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(1, 0);
      });
    });

    describe("When transaction personal and budget target is community", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_community,
        budgettarget_community,
        [transaction_personal],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum is not impacted", () => {
        expect(budgettarget_outcome.current).toEqual(0);
      });
      test("then projection sum is not impacted", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(0, 0);
      });
    });

    describe("When transaction community and budget target is personal", () => {
      let budgettarget_outcome = computeBudgetTarget(
        budget_community,
        budgettarget_personal,
        [transaction_community],
        userid
      );
      if (debug) {
        console.log("budgettarget_outcome", budgettarget_outcome);
      }
      test("then current sum is impacted following split ratio", () => {
        expect(budgettarget_outcome.current).toEqual(0);
      });
      test("then projection sum is impacted following split ratio", () => {
        expect(budgettarget_outcome.projection).toBeCloseTo(0, 0);
      });
    });
  });
});
