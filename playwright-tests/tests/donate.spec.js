/**
 * donate modal
 */
import { test, expect } from "@playwright/test";
import { ROOT_SRC, DEFAULT_PROJECT_ID } from "../util/constants";

test("should open donate modal", async ({ page }) => {
  test.setTimeout(120000); // 2 minutes... we want to improve performance
  await page.goto(`${ROOT_SRC}?tab=project&projectId=${DEFAULT_PROJECT_ID}`);
  await page.getByRole("button", { name: "Donate" }).click();
  expect(await page.isVisible("text=Donate to")).toBeTruthy();
});

test.skip("project with no active pot should donate direct with correct amount", async ({ page }) => {
  test.setTimeout(120000); // 2 minutes... we want to improve performance

  // go to project page (PotLock project)
  await page.goto(`${ROOT_SRC}?tab=project&projectId=${DEFAULT_PROJECT_ID}`);

  // click donate button
  await page.getByRole("button", { name: "Donate" }).click();

  // wait for modal to appear
  expect(await page.isVisible("text=Donate to")).toBeTruthy();

  // input amount
  await page.fill("input[name=amount]", "1");

  await page.getByRole("button", { name: "Proceed to donate" }).click();

  // Confirm Donation
  await page.getByRole("button", { name: "Confirm donation" }).click();

  // Confirmation modal should be visible
  const transactionObj = JSON.parse(await page.locator("div.modal-body code").innerText());
  // check if transaction object is correct
  expect(transactionObj).toMatchObject({
    bypass_protocol_fee: false,
    message: "",
    recipient_id: DEFAULT_PROJECT_ID,
  });
});



test("Should donate the correct amount to active pots", async ({ page }) => {
  test.setTimeout(100000); 

  // go to Pots page 
  await page.goto(`${ROOT_SRC}?tab=pots`);
  console.log(`${ROOT_SRC}?tab=pots`);


  //Find an active pot
  const daysLeftElement = page.locator('text=days left to donate');
  await daysLeftElement.click();

  // log the current URL
  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  await page.getByRole("button", { name: "Fund matching pool" }).click();

  // wait for modal to appear
  expect(await page.isVisible("text=Enter matching pool contribution amount in NEAR (no minimum)")).toBeTruthy();

  // input amount
  await page.fill("input[name=Enter amount here in NEAR]", "100");

  await page.getByRole("button", { name: "Contribute 100 NEAR to matching pool" }).click();

  // Confirm Donation
  await page.getByRole("button", { name: "Confirm" }).click();

  // Confirmation modal should be visible
  const transactionObj = JSON.parse(await page.locator("div.modal-body code").innerText());
  
  // check if transaction object is correct
  expect(transactionObj).toMatchObject({
    bypass_protocol_fee: false,
    message: "",
    recipient_id: DEFAULT_PROJECT_ID,
  });
});