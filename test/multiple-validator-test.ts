/* eslint-disable sonarjs/no-duplicate-string */
import test from "ava";

import USPS from "../src/usps.js";

const usps = new USPS({
    userId: process.env["USPS_ID"]!,
});

const fourAddresses = [
    {
        Address1: "11205 SE 233RD PL.",
        Address2: "Apartment 2",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
    {
        Address1: "11205 SE 233RD PL.",
        Address2: "UNIT 2",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
    {
        Address1: "11205 southeast 233Road PLace.",
        Address2: "Building 2",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
    {
        Address1: "11205 SE 233RD PL.",
        Address2: "Floor 2",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
];

const moreAddresses = [
    {
        Address1: "11205 SE 233RD PL.",
        Address2: "Apartment 4",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
    {
        Address1: "11205 southeast 233Road PLace.",
        Address2: "Building 3",
        City: "Kent",
        State: "WA",
        Zip5: "98031",
    },
]

const invalidAddress = {
    Address1: "1212 s kingsway rd",
    City: "seffner",
    State: "fl",
    Zip5: "33584",
}

test("Multiple address verify should return the same number of addresses.", async (t) => {
    const addresses = await usps.verifyMultiple(fourAddresses);
    t.is(addresses.length, 4);
});

test("Multiple address verify should only accept addesses in an array.", async (t) => {
    const error = await t.throwsAsync(async () => {
        // @ts-expect-error Testing invalid input
        await usps.verifyMultiple(fourAddresses[0]);
    });
    t.is(
        error?.message,
        "Must pass an array of addresses. For single address use 'verify' method.",
    );
});

test("Multiple address verify should throw an error if more than 5 addresses are passed.", async (t) => {
    const error = await t.throwsAsync(async () => {
        await usps.verifyMultiple([...fourAddresses, ...moreAddresses]);
    });
    t.is(
        error?.message,
        "Maximum of 5 addresses allowed per request.",
    );
});

test("Multiple address verify should validate each address in the same way as a single verify would.", async (t) => {
    const addresses = await usps.verifyMultiple(fourAddresses);
    t.is(addresses[0]?.Address2, "APT 2");
    t.is(addresses[1]?.Address2, "UNIT 2");
    t.is(addresses[2]?.Address2, "BLDG 2");
    t.is(addresses[3]?.Address2, "FL 2");
});

test("Multiple address verify should handle proper case the same as single verify.", async (t) => {
    const uspsCase = new USPS({
        properCase: true,
        userId: process.env["USPS_ID"]!,
    });
    const addresses = await uspsCase.verifyMultiple(moreAddresses);
    t.is(addresses[0]?.Address1, "11205 SE 233rd Pl");
    t.is(addresses[0]?.Address2, "Apt 4");
    t.is(addresses[0]?.City, "Kent");
});

test("Multiple address verify should contain error message for any unverifiable addresses in a list.", async (t) => {
    const addresses = await usps.verifyMultiple([...moreAddresses, invalidAddress]);
    t.false("Error" in addresses[0]!);
    t.false("Error" in addresses[1]!);
    t.is(addresses[2]?.Error?.Description, "Multiple addresses were found for the information you entered, and no default exists.");
});