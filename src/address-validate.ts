import type { Address, ErrorResponse } from "./usps";
import type USPSClass from "./usps";
import callUSPS from "./utils/request";
import properCase from "./utils/proper-case";

/** Address Validate */
export interface AddressValidateRequest {
  Address: {
    Address1?: string;
    Address2?: string;
    City?: string;
    FirmName?: string;
    State?: string;
    Urbanization?: string;
    Zip4?: string;
    Zip5?: string;
  };
  Revision: number;
}

export interface AddressValidateResponse {
  Address1?: string;
  Address2?: string;
  Address2Abbreviation?: string;
  Business?: string;
  CarrierRoute?: string;
  CentralDeliveryPoint?: string;
  City?: string;
  CityAbbreviation?: string;
  DPVCMRA?: string;
  DPVConfirmation?: string;
  DPVFootnotes?: string;
  DeliveryPoint?: string;
  Error?: ErrorResponse;
  FirmName?: string;
  Footnotes?: string;
  State?: string;
  Urbanization?: string;
  Vacant?: string;
  Zip4?: string;
  Zip5?: string;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default async function (
  this: USPSClass,
  address: Address
): Promise<Address> {
  const parameters: AddressValidateRequest["Address"] = {
    Address1: address.Address2 || "",
    Address2: address.Address1 || "",
    City: address.City || "",
    State: address.State || "",
    Urbanization: address.Urbanization || "",
    Zip5: address.Zip5 || "",
    // eslint-disable-next-line sort-keys
    Zip4: address.Zip4 || "",
  };
  let response: AddressValidateResponse;
  try {
    response = (await callUSPS(
      "Verify",
      "AddressValidate",
      "Address",
      this.config,
      {
        Revision: 1,
        // eslint-disable-next-line sort-keys
        Address: parameters,
      }
    )) as AddressValidateResponse;
    if (response) {
      const switchAddresses = response.Address1;
      response.Address1 = response.Address2;
      response.Address2 = switchAddresses;
      if (this.config.properCase) {
        response.Address1 = response.Address1
          ? properCase(response.Address1)
          : undefined;
        response.Address2 = response.Address2
          ? properCase(response.Address2)
          : undefined;
        response.City = response.City ? properCase(response.City) : undefined;
        response.FirmName = response.FirmName
          ? properCase(response.FirmName)
          : undefined;
      }
      response.Zip4 =
        typeof response.Zip4 === "object"
          ? undefined
          : response.Zip4?.toString();
      return response;
    }
    throw new Error("Can't find results");
  } catch (error) {
    throw new Error(error as string);
  }
}
