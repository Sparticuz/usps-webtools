/* eslint-disable sonarjs/no-duplicate-string */
const test = require("ava");
const USPS = require("../dist/usps").default;

// Load .env
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: "test/.env" });
}

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

test("Address verify should validate Unit", async (t) => {
  const address = await usps.verify({
    Address1: "11205 SE 233RD PL.",
    Address2: "UNIT 2",
    City: "Kent",
    State: "WA",
    Zip5: "98031",
  });
  t.is(address.Address2, "UNIT 2");
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
