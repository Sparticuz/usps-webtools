![Node.js CI](https://github.com/Sparticuz/usps-webtools-promise/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/Sparticuz/usps-webtools-promise/workflows/CodeQL/badge.svg)

### About:

This package was forked from [MadisonReed/usps-webtools](https://github.com/MadisonReed/usps-webtools), but it has been modernized with Typescript and Promises (async/await). Note: Version 2 is a drop-in replacement for MadisonReed/usps-webtools, it produces the same output. Version 3 uses the same output from USPS, with the exception of Address1 and Address2 being switched, per social norms.

### Installation:

```sh
npm install usps-webtools-promise
```

### Usage:

Initializing the usps model with a user id.

**Example:**

```js
const USPS = require("usps-webtools-promise").default;
// or
import USPS from "usps-webtools-promise";

const usps = new USPS({
  // USPS returns ALL CAPS, this boolean turns on Proper Caps for both Street lines and City. This is an optional item. Defaults to true.
  properCase: boolean,
  // Staging will run all functions on the USPS Staging servers instead of Production. Defaults to false.
  staging: boolean,
  // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
  userId: "USPS User id",
});
```

### verifyMultiple(object[])

Verify takes one parameter: object[]

object[]: [{Address1, Address2, City, State, Zip}]  

**Example**

```js
usps
  .verifyMultiple([{
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  }, {
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  }
  ])
  .then((address) => {
    console.log(address);
  });
```

### verify(object)

Verify takes one parameter: object

object: Address1, Address2, City, State, Zip

**Example**

```js
usps
  .verify({
    Address1: "322 3rd st.",
    Address2: "Apt 2",
    City: "San Francisco",
    State: "CA",
    Zip5: "94103",
  })
  .then((address) => {
    console.log(address);
  });
```

### zipCodeLookup(object)

zipCodeLookup takes one parameter: object.

object: Address1, Address2, City, State

**Example**

```js
const address = await usps.zipCodeLookup({
  Address1: "322 3rd st.",
  Address2: "Apt 2",
  City: "San Francisco",
  State: "CA",
});

console.log(address);
```

### cityStateLookup(object)

cityStateLookup takes one parameter: zipcode.

zipcode: 5 digit Zip Code as a string

**Example**

```js
const result = await usps.cityStateLookup("94107");
console.log(result);
```

### Coverage

```
-------------------------------|---------|----------|---------|---------|------------------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|------------------------------
All files                      |   91.64 |    62.65 |   93.75 |   91.64 |
 src                           |   95.85 |    55.55 |     100 |   95.85 |
  address-validate.ts          |      96 |     37.5 |     100 |      96 | 81,84,87,93
  multiple-address-validate.ts |   92.77 |    54.54 |     100 |   92.77 | 62,65,68,80-82
  usps.ts                      |     100 |      100 |     100 |     100 |
 src/lookups                   |   84.81 |    66.66 |   83.33 |   84.81 |
  city-state-lookup.ts         |     100 |    83.33 |     100 |     100 | 45
  pricing-rate-lookup.ts       |   74.49 |      100 |      50 |   74.49 | 112-149
  zip-code-lookup.ts           |   95.83 |    54.54 |     100 |   95.83 | 57,60,63
 src/utils                     |   95.65 |       75 |     100 |   95.65 |
  proper-case.ts               |     100 |      100 |     100 |     100 |
  request.ts                   |   94.23 |    64.28 |     100 |   94.23 | 54-55,61,112,122-123,127-129
-------------------------------|---------|----------|---------|---------|------------------------------
```
