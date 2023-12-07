import verify from "./address-validate.js";
import verifyMultiple from "./multiple-address-validate.js"
import cityStateLookup from "./lookups/city-state-lookup.js";
import pricingRateLookup from "./lookups/pricing-rate-lookup.js";
import zipCodeLookup from "./lookups/zip-code-lookup.js";

export interface ErrorResponse {
  Description: string;
  HelpContext: string;
  HelpFile: string;
  Number: string;
  Source: string;
}

export interface Config {
  properCase?: boolean;
  staging?: boolean;
  userId: string;
}

export interface Address {
  Address1?: string;
  Address2?: string;
  City?: string;
  FirmName?: string;
  State?: string;
  Urbanization?: string;
  Zip4?: string;
  Zip5?: string;
}

// Each address needs an ID when sending multiple in a single request
// Error can be returned for each address
export interface MultipleAddress extends Address {
  "@ID": string;
  Error?: ErrorResponse;
}

export default class {
  public cityStateLookup = cityStateLookup;

  config: Config;

  constructor(config: Config) {
    if (!config?.userId) {
      throw new Error("Must pass USPS userId");
    }
    this.config = {
      ...config,
    };
  }

  public pricingRateV4 = pricingRateLookup;

  public verify = verify;

  public verifyMultiple = verifyMultiple;

  public zipCodeLookup = zipCodeLookup;
}
