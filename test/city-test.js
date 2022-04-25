const test = require("ava");
const USPS = require("../dist/usps").default;

const usps = new USPS({
  userId: process.env.USPS_ID,
});

test("#cityStateLookup() should return the city when passed a zipcode", async (t) => {
  const address = await usps.cityStateLookup("98031");
  t.is(address.City, "KENT");
});

test("#cityStateLookup() should return the proper case", async (t) => {
  const uspsCase = new USPS({
    properCase: true,
    userId: process.env.USPS_ID,
  });
  const address = await uspsCase.cityStateLookup("98031");
  t.is(address.City, "Kent");
});

test("#cityStateLookup() should return the state when passed a zipcode", async (t) => {
  const address = await usps.cityStateLookup("98031");
  t.is(address.State, "WA");
});

test("#cityStateLookup() should return an err when invalid zip", async (t) => {
  const error = await usps.cityStateLookup("23234324");
  t.is(error.message, "ZIPCode must be 5 characters");
});
