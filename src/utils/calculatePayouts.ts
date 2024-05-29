import { Big, Near } from "alem";
import constants from "@app/constants";
import { CalculatedPayout } from "@app/types";

const calculatePayouts = (
  allPotDonations: any,
  totalMatchingPool: any,
  blacklistedAccounts: any,
): Promise<Record<string, CalculatedPayout>> => {
  const { NADABOT_CONTRACT_ID } = constants;

  // * QF/CLR logic taken from https://github.com/gitcoinco/quadratic-funding/blob/master/quadratic-funding/clr.py *
  return new Promise((resolve, reject) => {
    // console.log("Calculting payouts; ignoring blacklisted donors &/or projects: ", blacklistedAccounts.join(", "));
    // console.log("totalMatchingPool: ", totalMatchingPool);
    // first, flatten the list of donations into a list of contributions
    const projectContributions: any = [];
    const allDonors = new Set();
    for (const d of allPotDonations) {
      // skip if donor or project is blacklisted
      if (blacklistedAccounts.includes(d.donor_id) || blacklistedAccounts.includes(d.project_id)) {
        continue;
      }
      const amount = new Big(d.total_amount);
      const val = [d.project_id, d.donor_id, amount];
      projectContributions.push(val);
      allDonors.add(d.donor_id);
    }
    // console.log("all donors: ", allDonors);
    // fetch human scores for all donors
    const limit = 100;
    let curIndex = 0;
    let humanScores: any = {};
    // create array of asyncView promises to fetch human scores in batches of {limit} donors at a time
    let promises = [];
    while (curIndex < allDonors.size) {
      promises.push(
        Near.asyncView(NADABOT_CONTRACT_ID, "get_human_score_batch", {
          account_ids: Array.from(allDonors).slice(curIndex, curIndex + limit),
        }),
      );
      curIndex += limit;
    }
    // execute all promises and aggregate results
    Promise.all(promises)
      .then((res) => {
        for (const r of res) {
          humanScores = {
            ...humanScores,
            ...r,
          };
        }
      })
      .catch((e) => {
        console.error("error fetching human scores. Continuing anyway: ", e);
      })
      .finally(() => {
        // console.log("human scores: ", humanScores);
        // take the flattened list of contributions and aggregate
        // the amounts contributed by each user to each project.
        // create a dictionary where each key is a projectId and its value
        // is another dictionary of userIds and their aggregated contribution amounts.
        // ignore donations from account where is_human is false
        const contributions: any = {};
        for (const [proj, user, amount] of projectContributions) {
          if (!humanScores[user] || !humanScores[user].is_human) {
            // console.log("skipping non-human: ", user);
            continue;
          }
          if (!contributions[proj]) {
            contributions[proj] = {};
          }
          contributions[proj][user] = Big(contributions[proj][user] || 0).plus(amount);
        }
        // console.log("contributions: ", contributions);
        // calculate the total overlapping contribution amounts between pairs of users for each project.
        // create a nested dictionary where the outer keys are userIds and the inner keys are also userIds,
        // and the inner values are the total overlap between these two users' contributions.
        // type PairTotals = { [key: UserId]: { [key: UserId]: YoctoBig } };
        const pairTotals: any = {};
        for (const contribz of Object.values(contributions)) {
          for (const [k1, v1] of Object.entries(contribz)) {
            if (!pairTotals[k1]) {
              pairTotals[k1] = {};
            }
            for (const [k2, v2] of Object.entries(contribz)) {
              if (!pairTotals[k1][k2]) {
                pairTotals[k1][k2] = Big(0);
              }
              pairTotals[k1][k2] = pairTotals[k1][k2].plus(v1.times(v2).sqrt());
            }
          }
        }
        // Compute the CLR (Contribution Matching) amount for each project
        // using the aggregated contributions, the total overlaps between user pairs,
        // a threshold value, and the total pot available for matching.
        // Then, calculate the matching amount for each project using the quadratic formula
        // and returns a list of objects containing the projectId, the number of contributions,
        // the total contributed amount, and the matching amount.
        const threshold = Big("25000000000000000000000000"); // this value can be adjusted to tweak the matching algorithm
        const totalPot = Big(totalMatchingPool);
        let bigtot = Big(0);
        const totals: any = [];
        for (const [proj, contribz] of Object.entries(contributions)) {
          let tot = Big(0);
          let _num = 0;
          let _sum = Big(0);
          for (const [k1, v1] of Object.entries(contribz)) {
            _num += 1;
            _sum = _sum.plus(v1);
            for (const [k2, v2] of Object.entries(contribz)) {
              if (k2 > k1 || Object.keys(contribz).length === 1) {
                // not entirely sure of this "if" statement's purpose as the values being compared are account IDs. Originally taken from Gitcoin's CLR logic (see link at top of file)
                const sqrt = v1.times(v2).sqrt();
                tot = tot.plus(sqrt.div(pairTotals[k1][k2].div(threshold)));
              }
            }
          }
          bigtot = bigtot.plus(tot);
          totals.push({
            id: proj,
            number_contributions: _num,
            contribution_amount_str: _sum.toFixed(0),
            matching_amount_str: tot.toFixed(0),
          });
        }
        // console.log("totals before: ", totals);
        // if we reach saturation, we need to normalize
        if (bigtot.gte(totalPot)) {
          // console.log("NORMALIZING");
          for (const t of totals) {
            t.matching_amount_str = Big(t.matching_amount_str).div(bigtot).times(totalPot).toFixed(0);
          }
        }

        let totalAllocatedBeforeRounding = Big(0); // Initialize the accumulator as a Big object

        for (const t of totals) {
          const currentMatchingAmount = Big(t.matching_amount_str);
          totalAllocatedBeforeRounding = totalAllocatedBeforeRounding.plus(currentMatchingAmount);
        }

        let residual = totalPot.minus(totalAllocatedBeforeRounding);
        // console.log("first round residual: ", residual.toFixed(0));

        // Check if there is a residual due to rounding
        if (residual.abs().gt(Big("0"))) {
          // if (residual.toString() !== "0") {
          // Fairly distribute residual (proportionally to initial allocation)
          // NB: there may still be a residual after this step
          for (let i = 0; i < totals.length; i++) {
            let proportion = Big(totals[i].matching_amount_str).div(totalAllocatedBeforeRounding);
            let additionalAllocation = proportion.times(residual);
            // Update the matching amount with the additional allocation
            totals[i].matching_amount_str = Big(totals[i].matching_amount_str).plus(additionalAllocation).toFixed(0);
          }

          // console.log("CALCULATING TOTALS AFTER RESIDUAL DISTRIBUTION");
          totalAllocatedBeforeRounding = Big(0); // Initialize the accumulator as a Big object
          for (const t of totals) {
            const currentMatchingAmount = Big(t.matching_amount_str);
            totalAllocatedBeforeRounding = totalAllocatedBeforeRounding.plus(currentMatchingAmount);
          }
          residual = totalPot.minus(totalAllocatedBeforeRounding);
          // console.log("second round residual: ", residual.toFixed(0));

          // OLD RESIDUAL ADJUSTMENT LOGIC
          // if (residual.abs().gt(Big("0"))) {
          //   console.log("MAKING FINAL ADJUSTMENT");
          //   // Step 1: Sort 'totals' in descending order based on 'matching_amount_str'
          //   totals.sort((a, b) => Big(b.matching_amount_str).minus(Big(a.matching_amount_str)));

          //   // Step 2: Allocate the residual
          //   let residualToAllocate = Big(residual);
          //   for (let i = 0; i < totals.length && residualToAllocate.gt(Big(0)); i++) {
          //     let allocationIncrement = Big(1); // Smallest possible increment
          //     if (residualToAllocate.lt(allocationIncrement)) {
          //       allocationIncrement = residualToAllocate; // If the remaining residual is less than the increment, adjust it
          //     }
          //     totals[i].matching_amount_str = Big(totals[i].matching_amount_str)
          //       .plus(allocationIncrement)
          //       .toFixed(0);
          //     residualToAllocate = residualToAllocate.minus(allocationIncrement);
          //   }
          //   // Ensure the loop above runs until 'residualToAllocate' is 0 or sufficiently small to be considered fully allocated

          //   // Recalculate 'totalAllocatedBeforeRounding' to verify the final allocation matches the total matching pool
          //   totalAllocatedBeforeRounding = Big(0);
          //   for (const t of totals) {
          //     const currentMatchingAmount = Big(t.matching_amount_str);
          //     totalAllocatedBeforeRounding = totalAllocatedBeforeRounding.plus(currentMatchingAmount);
          //   }
          //   residual = totalPot.minus(totalAllocatedBeforeRounding);
          //   console.log("FINAL residual: ", residual.toFixed(0));
          // }

          if (residual.abs().gt(Big(0))) {
            // if (residual.toString() !== "0") {
            // Directly adjust the matching amount of one project to correct the residual
            // Find a project to adjust. Prefer adjusting projects with larger allocations to minimize impact
            totals.sort((a: any, b: any) => Big(b.matching_amount_str).minus(Big(a.matching_amount_str)));
            if (residual.gt(Big(0))) {
              // If residual is positive, increment the largest allocation
              totals[0].matching_amount_str = Big(totals[0].matching_amount_str).plus(residual).toFixed(0);
            } else {
              // If residual is negative, decrement the largest allocation
              // Ensure the allocation is large enough to be decremented
              for (let i = 0; i < totals.length; i++) {
                if (Big(totals[i].matching_amount_str).gt(residual.abs())) {
                  totals[i].matching_amount_str = Big(totals[i].matching_amount_str).plus(residual).toFixed(0); // Residual is negative here
                  break;
                }
              }
            }

            // Verify that the adjustment has corrected the residual
            totalAllocatedBeforeRounding = Big(0);
            for (const t of totals) {
              const currentMatchingAmount = Big(t.matching_amount_str);
              totalAllocatedBeforeRounding = totalAllocatedBeforeRounding.plus(currentMatchingAmount);
            }
            residual = totalPot.minus(totalAllocatedBeforeRounding);
            // console.log("Residual after final adjustment: ", residual.toFixed(0));
          }
        }

        const payouts = totals.reduce((acc: any, t: any) => {
          acc[t.id] = {
            totalAmount: t.contribution_amount_str,
            matchingAmount: t.matching_amount_str,
            donorCount: t.number_contributions,
          };
          return acc;
        }, {});
        // return payouts;
        resolve(payouts);
      });
  });
};

export default calculatePayouts;
