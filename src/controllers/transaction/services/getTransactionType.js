module.exports = function getTransactionType(transaction, userid) {
  let outcome = {
    audience: "",
    byuser: undefined,
    foruser: undefined,
  };

  switch (transaction.treatment) {
    case "exit":
      if (transaction.for.length > 1) {
        outcome.audience = "community";
        if (userid !== undefined) {
          if (transaction.by === userid) {
            outcome.byuser = true;
          }
          if (transaction.for.includes(userid)) {
            outcome.foruser = true;
          }
        }
      } else {
        if (transaction.for.includes(transaction.by)) {
          outcome.audience = "personal";
          if (userid !== undefined) {
            if (transaction.by === userid) {
              outcome.byuser = true;
              outcome.foruser = true;
            }
          }
        } else {
          outcome.audience = "transfer";
          if (userid !== undefined) {
            if (transaction.by === userid) {
              outcome.byuser = true;
            }
            if (transaction.for.includes(userid)) {
              outcome.foruser = true;
            }
          }
        }
      }
      break;
    case "entry":
      if (transaction.for.length > 1) {
        outcome.audience = "community";
        if (userid !== undefined) {
          if (transaction.for.includes(userid)) {
            outcome.foruser = true;
          }
        }
      } else {
        outcome.audience = "personal";
        if (userid !== undefined) {
          if (transaction.by === userid) {
            outcome.foruser = true;
          }
        }
      }
      break;
  }

  return outcome;
};
