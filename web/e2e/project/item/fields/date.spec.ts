import { closeNotification } from "@reearth-cms/e2e/common/notification";
import { createModelFromOverview } from "@reearth-cms/e2e/project/utils/model";
import { createProject, deleteProject } from "@reearth-cms/e2e/project/utils/project";
import { expect, test } from "@reearth-cms/e2e/utils";

test.beforeEach(async ({ reearth, page }) => {
  await reearth.goto("/", { waitUntil: "domcontentloaded" });
  await createProject(page);
  await createModelFromOverview(page);
});

test.afterEach(async ({ page }) => {
  await deleteProject(page);
});

test("Date field creating and updating has succeeded", async ({ page }) => {
  await page.locator("li").filter({ hasText: "Date" }).locator("div").first().click();
  await page.getByLabel("Display name").click();
  await page.getByLabel("Display name").fill("date1");
  await page.getByLabel("Settings").locator("#key").click();
  await page.getByLabel("Settings").locator("#key").fill("date1");
  await page.getByLabel("Settings").locator("#description").click();
  await page.getByLabel("Settings").locator("#description").fill("date1 description");
  await page.getByRole("button", { name: "OK" }).click();
  await closeNotification(page);

  await expect(page.getByLabel("Fields").getByRole("paragraph")).toContainText("date1#date1");
  await page.getByText("Content").click();
  await page.getByRole("button", { name: "plus New Item" }).click();
  await expect(page.locator("label")).toContainText("date1");
  await expect(page.getByRole("main")).toContainText("date1 description");

  await page.getByPlaceholder("Select date").click();
  await page.getByPlaceholder("Select date").fill("2024-01-01");
  await page.getByPlaceholder("Select date").press("Enter");
  await page.getByRole("button", { name: "Save" }).click();
  await closeNotification(page);
  await page.getByLabel("Back").click();
  await expect(page.locator("tbody")).toContainText("2024-01-01");
  await page.getByRole("cell").getByLabel("edit").locator("svg").click();
  await page.getByRole("button", { name: "close-circle" }).click();
  await page.getByRole("button", { name: "Save" }).click();
  await closeNotification(page);
  await page.getByLabel("Back").click();
  await expect(page.locator("tbody")).not.toContainText("2024-01-01");
});

test("Date field editing has succeeded", async ({ page }) => {
  await page.locator("li").filter({ hasText: "Date" }).locator("div").first().click();
  await page.getByLabel("Display name").click();
  await page.getByLabel("Display name").fill("date1");
  await page.getByLabel("Settings").locator("#key").click();
  await page.getByLabel("Settings").locator("#key").fill("date1");
  await page.getByLabel("Settings").locator("#description").click();
  await page.getByLabel("Settings").locator("#description").fill("date1 description");
  await page.getByRole("tab", { name: "Default value" }).click();
  await page.getByPlaceholder("Select date").click();
  await page.getByPlaceholder("Select date").fill("2024-01-01");
  await page.getByPlaceholder("Select date").press("Enter");
  await page.getByRole("button", { name: "OK" }).click();
  await closeNotification(page);
  await page.getByText("Content").click();
  await expect(page.locator("thead")).toContainText("date1");
  await page.getByRole("button", { name: "plus New Item" }).click();
  await expect(page.getByPlaceholder("Select date")).toHaveValue("2024-01-01");
  await page.getByRole("button", { name: "Save" }).click();
  await closeNotification(page);
  await page.getByLabel("Back").click();
  await expect(page.locator("tbody")).toContainText("2024-01-01");
  await page.getByText("Schema").click();
  await page.getByRole("img", { name: "ellipsis" }).locator("svg").click();
  await page.getByLabel("Display name").click();
  await page.getByLabel("Display name").fill("new date1");
  await page.getByLabel("Field Key").click();
  await page.getByLabel("Field Key").fill("new-date1");
  await page.getByLabel("Description(optional)").click();
  await page.getByLabel("Description(optional)").fill("new date1 description");
  await page.getByLabel("Support multiple values").check();
  await expect(page.getByLabel("Use as title")).toBeHidden();
  await page.getByRole("tab", { name: "Validation" }).click();
  await page.getByLabel("Make field required").check();
  await page.getByLabel("Set field as unique").check();
  await page.getByRole("tab", { name: "Default value" }).click();
  await expect(page.getByPlaceholder("Select date")).toHaveValue("2024-01-01");
  await page.getByRole("textbox").nth(0).click();
  await page.getByTitle("2024-01-02").locator("div").click();
  await page.getByRole("button", { name: "plus New" }).click();
  await page.getByRole("textbox").nth(1).click();
  await page.getByRole("textbox").nth(1).fill("2024-01-03");
  await page.getByRole("textbox").nth(1).press("Enter");
  await page.getByRole("button", { name: "arrow-down" }).first().click();
  await expect(page.getByPlaceholder("Select date").nth(0)).toHaveValue("2024-01-03");
  await page.getByRole("button", { name: "OK" }).click();
  await closeNotification(page);
  await expect(page.getByText("new date1 *#new-date1(unique)")).toBeVisible();
  await page.getByText("Content").click();
  await expect(page.locator("thead")).toContainText("new date1");
  await expect(page.locator("tbody")).toContainText("2024-01-01");
  await page.getByRole("button", { name: "plus New Item" }).click();
  await expect(page.locator("label")).toContainText("new date1(unique)");
  await expect(page.getByRole("textbox").nth(0)).toHaveValue("2024-01-03");
  await expect(page.getByRole("textbox").nth(1)).toHaveValue("2024-01-02");
  await page.getByRole("button", { name: "plus New" }).click();
  await page.getByRole("textbox").nth(2).click();
  await page.getByRole("textbox").nth(2).fill("2024-01-04");
  await page.getByRole("textbox").nth(2).press("Enter");
  await page.getByRole("button", { name: "Save" }).click();
  await closeNotification(page);
  await page.getByLabel("Back").click();
  await page.getByRole("button", { name: "x3" }).click();
  await expect(page.getByRole("tooltip").locator("p").nth(0)).toContainText("2024-01-03");
  await expect(page.getByRole("tooltip").locator("p").nth(1)).toContainText("2024-01-02");
  await expect(page.getByRole("tooltip").locator("p").nth(2)).toContainText("2024-01-04");
});
