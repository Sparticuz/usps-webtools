/* eslint-disable sonarjs/no-duplicate-string */
const test = require("ava");
const USPS = require("../dist/usps").default;

const usps = new USPS({
  userId: process.env.USPS_ID,
});

test("Address verify should validate apartment", async (t) => {
  const address = await usps.verify({
    Address1: "11205 SE 233RD PL.",
    Address2: "Apartment 2",
    City: "Kent",
    State: "WA",
    Zip5: "98031",
  });
  t.is(address.Address2, "APT 2");
});

test("Address return proper case", async (t) => {
  const uspsCase = new USPS({
    properCase: true,
    userId: process.env.USPS_ID,
  });
  const address = await uspsCase.verify({
    Address1: "11205 SE 233RD PL.",
    Address2: "UNIT 2",
    City: "Kent",
    State: "WA",
    Zip5: "98031",
  });
  t.is(address.Address2, "Unit 2");
});

test("Address verify should validate Building", async (t) => {
  const address = await usps.verify({
    Address1: "11205 southeast 233Road PLace.",
    Address2: "Building 2",
    City: "Kent",
    State: "WA",
    Zip5: "98031",
  });
  t.is(address.Address2, "BLDG 2");
  t.is(address.Zip4, undefined);
});

test("Address verify should validate Floor", async (t) => {
  const address = await usps.verify({
    Address1: "11205 SE 233RD PL.",
    Address2: "Floor 2",
    City: "Kent",
    State: "WA",
    Zip5: "98031",
  });
  t.is(address.Address2, "FL 2");
});

test("Multiple Businesses as single locaion", async (t) => {
  const error = await t.throwsAsync(async () => {
    await usps.verify({
      Address1: "1212 s kingsway rd",
      City: "seffner",
      State: "fl",
      Zip5: "33584",
    });
  });
  t.is(
    error.message,
    "Error: Multiple addresses were found for the information you entered, and no default exists."
  );
});
