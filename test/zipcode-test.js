const test = require("ava");
const USPS = require("../dist/usps").default;

const usps = new USPS({
  userId: process.env.USPS_ID,
});

test("Zipcode Lookup should return the address with zip", async (t) => {
  const address = await usps.zipCodeLookup({
    Address1: "121 Embarcadero West",
    Address2: "Apt 2205",
    City: "Oakland",
    State: "CA",
  });
  t.is(`${address.Zip5}-${address.Zip4}`, "94607-3785");
});

test("Zipcode Lookup should return proper case", async (t) => {
  const uspsCase = new USPS({
    properCase: true,
    userId: process.env.USPS_ID,
  });
  const address = await uspsCase.zipCodeLookup({
    Address1: "121 EMBARCADERO WEST",
    Address2: "Apt 2205",
    City: "OAKLAND",
    State: "CA",
  });
  t.is(address.City, "Oakland");
});

test("Zipcode Lookup should error if address is invalid", async (t) => {
  const error = await usps.zipCodeLookup({
    Address1: "sdfisd",
    Address2: "Apt 2205",
    City: "Seattle",
    State: "WA",
  });
  t.is(error.message, "Address Not Found.");
});

test("Zipcode Lookup should pass error to callback if street is missing", async (t) => {
  const error = await usps.zipCodeLookup({
    City: "Oakland",
    State: "CA",
  });
  t.is(error.message, "Address Not Found.");
});

test("Zipcode Lookup error should be passed to callback if city is missing", async (t) => {
  const error = await usps.zipCodeLookup({
    Address1: "121 Embarcadero West",
    Address2: "Apt 2205",
    State: "CA",
  });
  t.is(error.message, "Invalid City.");
});

test("Zipcode Lookup should return an error if the address is fake", async (t) => {
  const error = await usps.zipCodeLookup({
    Address1: "453 sdfsdfa Road",
    Address2: "sdfadf",
    City: "kojs",
    State: "LS",
  });
  t.is(error.message, "Invalid State Code.");
});
