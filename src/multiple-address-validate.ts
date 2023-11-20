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
        throw new Error("Must pass an array of addresses. For single address use 'verify' method.");
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
            const addresses = response.map((addr) => {
                const switchAddresses = addr.Address1;
                addr.Address1 = addr.Address2;
                addr.Address2 = switchAddresses;
                if (this.config.properCase) {
                    addr.Address1 = addr.Address1
                        ? properCase(addr.Address1)
                        : undefined;
                    addr.Address2 = addr.Address2
                        ? properCase(addr.Address2)
                        : undefined;
                    addr.City = addr.City ? properCase(addr.City) : undefined;
                    addr.FirmName = addr.FirmName
                        ? properCase(addr.FirmName)
                        : undefined;
                }
                addr.Zip4 =
                    typeof addr.Zip4 === "object"
                        ? undefined
                        : addr.Zip4?.toString();
                return addr as MultipleAddress;
            })
            return addresses;
        }
        throw new Error("Can't find results");
    } catch (error) {
        throw new Error(error as string);
    }
}
