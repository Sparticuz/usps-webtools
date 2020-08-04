![Node.js CI](https://github.com/Sparticuz/usps-webtools-promise/workflows/Node.js%20CI/badge.svg) ![CodeQL](https://github.com/Sparticuz/usps-webtools-promise/workflows/CodeQL/badge.svg)

### About:

This package was forked from [MadisonReed/usps-webtools](https://github.com/MadisonReed/usps-webtools), but it has been modernized with Typescript and Promises (async/await). Note: This is a drop-in replacement for MadisonReed/usps-webtools, it produces the same output.

### Installation:

``` sh
npm install usps-webtools-promise
```

### Usage:

Initializing the usps model with a user id.

__Example:__

``` js
const USPS = require('usps-webtools-promise').default;
// or
import USPS from "usps-webtools-promise";

const usps = new USPS({
  // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
  userId: 'USPS User id',
  // USPS returns ALL CAPS, this boolean turns on Proper Caps for both Street lines and City. This is an optional item.
  properCase: boolean
});
```

### verify(object)

Verify takes one parameter: object

object: street1, street2, city, state, zip

__Example__

``` js
usps.verify({
  street1: '322 3rd st.',
  street2: 'Apt 2',
  city: 'San Francisco',
  state: 'CA',
  zip: '94103'
}).then(address => {
  console.log(address);
});
```

### zipCodeLookup(object)

zipCodeLookup takes one parameter: object.

object: street1, street2, city, state

__Example__

``` js
const address = await usps.zipCodeLookup({
  street1: '322 3rd st.',
  street2: 'Apt 2',
  city: 'San Francisco',
  state: 'CA'
});

console.log(address);
```

### cityStateLookup(object)

cityStateLookup takes one parameter: zipcode.

zipcode: 5 digit zipcode as a string

__Example__

``` js
const result = await usps.cityStateLookup('94107');
console.log(result);
```
