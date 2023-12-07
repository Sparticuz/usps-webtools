import type { Address, MultipleAddress } from "./usps.js";
import type USPSClass from "./usps.js";
import type { AddressValidateResponse } from "./address-validate.js";
import properCase from "./utils/proper-case.js";
import callUSPS from "./utils/request.js";

// See page 4, "AddressValidateRequest / Address /" section of: https://www.usps.com/business/web-tools-apis/address-information-api.pdf

export interface MultipleAddressValidateRequest {
    Address: MultipleAddress[];
    Revision: number;
}

// eslint-disable-next-line sonarjs/cognitive-complexity, func-names
export default async function (
    this: USPSClass,
    addresses: Address[],
): Promise<MultipleAddress[]> {
    if (addresses.length > 5) {
        throw new Error("Maximum of 5 addresses allowed per request.")
    }

    if (Array.isArray(addresses) === false) {
        throw new TypeError("Must pass an array of addresses. For single address use 'verify' method.");
    }

    const Addresses: MultipleAddress[] = addresses.map((address: Address, index: number) => ({
        '@ID': index.toString(),
        Address1: address.Address2 ?? "",
        Address2: address.Address1 ?? "",
        City: address.City ?? "",
        State: address.State ?? "",
        Urbanization: address.Urbanization ?? "",
        Zip5: address.Zip5 ?? "",
        // USPS expects Zip4 after Zip5
        // eslint-disable-next-line sort-keys
        Zip4: address.Zip4 ?? "",
    }));

    const parameters: MultipleAddressValidateRequest = {
        Revision: 1,
        // USPS expects Address to come after Revision
        // eslint-disable-next-line sort-keys
        Address: Addresses,
    };

    let response: AddressValidateResponse[];
    try {
        response = (await callUSPS(
            "Verify",
            "AddressValidate",
            "Address",
            this.config,
            parameters,
        )) as AddressValidateResponse[];
        if (response) {
            return response.map((addr) => {
                const fAddr = { ...addr };

                const switchAddresses = fAddr.Address1;
                fAddr.Address1 = fAddr.Address2;
                fAddr.Address2 = switchAddresses;
                if (this.config.properCase) {
                    fAddr.Address1 = fAddr.Address1
                        ? properCase(fAddr.Address1)
                        : undefined;
                    fAddr.Address2 = fAddr.Address2
                        ? properCase(fAddr.Address2)
                        : undefined;
                    fAddr.City = fAddr.City ? properCase(fAddr.City) : undefined;
                    fAddr.FirmName = fAddr.FirmName
                        ? properCase(fAddr.FirmName)
                        : undefined;
                }
                fAddr.Zip4 =
                    typeof fAddr.Zip4 === "object"
                        ? undefined
                        : fAddr.Zip4?.toString();
                return fAddr as MultipleAddress;
            });
        }
        throw new Error("Can't find results");
    } catch (error) {
        throw new Error(error as string);
    }
}
