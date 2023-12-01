import test from "ava";

import type { CityStateLookupResponse } from "../src/lookups/city-state-lookup.js";
import USPS from "../src/usps.js";

const usps = new USPS({
  userId: process.env["USPS_ID"]!,
});
/*
// Error typeguard: TODO
function isError(
  address: CityStateLookupResponse["ZipCode"] | Error
): address is Error {
  return (address as CityStateLookupResponse["ZipCode"])?.City !== undefined;
}
*/
test("#cityStateLookup() should return the city when passed a zipcode", async (t) => {
  const address = (await usps.cityStateLookup(
    "98031",
  )) as CityStateLookupResponse["ZipCode"];
  t.is(address?.City, "KENT");
});

test("#cityStateLookup() should return the proper case", async (t) => {
  const uspsCase = new USPS({
    properCase: true,
    userId: process.env["USPS_ID"]!,
  });
  const address = (await uspsCase.cityStateLookup(
    "98031",
  )) as CityStateLookupResponse["ZipCode"];
  t.is(address?.City, "Kent");
});

test("#cityStateLookup() should return the state when passed a zipcode", async (t) => {
  const address = (await usps.cityStateLookup(
    "98031",
  )) as CityStateLookupResponse["ZipCode"];
  t.is(address?.State, "WA");
});

test("#cityStateLookup() should return an err when invalid zip", async (t) => {
  const error = (await usps.cityStateLookup("23234324")) as Error;
  t.is(error.message, "ZIPCode must be 5 characters");
});
