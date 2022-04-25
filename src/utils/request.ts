/* eslint-disable security/detect-object-injection */
// The objects being injected are always specified by the API //
import { request, RequestOptions } from "https";
import { stringify } from "querystring";
import { create } from "xmlbuilder2";
import type {
  AddressValidateRequest,
  AddressValidateResponse,
} from "../address-validate";
import type {
  CityStateLookupRequest,
  CityStateLookupResponse,
} from "../lookups/city-state-lookup";
import type {
  RateV4Request,
  RateV4Response,
} from "../lookups/pricing-rate-lookup";
import type {
  ZipCodeLookupRequest,
  ZipCodeLookupResponse,
} from "../lookups/zip-code-lookup";
import type { Config, ErrorResponse } from "../usps";

export interface USPSResponse {
  AddressValidateResponse?: AddressValidateResponse;
  CityStateLookupResponse?: CityStateLookupResponse;
  Error?: ErrorResponse;
  RateV4Response?: RateV4Response;
  ZipCodeLookupResponse?: ZipCodeLookupResponse;
}

// This function runs the actual request. I've abstracted it out so it
// can be used independently of AWS
const makeRequest = async (
  options: string | RequestOptions | URL
): Promise<USPSResponse> =>
  new Promise((resolve, reject) => {
    // This is the actual request
    const innerRequest = request(options, (response) => {
      let body = "";
      // eslint-disable-next-line no-return-assign
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => {
        try {
          const xml = create(body);
          resolve(xml.end({ format: "object" }) as USPSResponse);
        } catch (error) {
          reject(new Error(error as string));
        }
      });
    });

    // This deals with errors
    innerRequest.on("error", (error) => {
      reject(error);
    });

    // This ends the request
    innerRequest.end();
  });

/**
  Method to call USPS
*/
export default async (
  api: string,
  method: string,
  property: string,
  config: Config,
  parameters:
    | AddressValidateRequest
    | ZipCodeLookupRequest
    | CityStateLookupRequest
    | RateV4Request
): Promise<
  | AddressValidateResponse
  | ZipCodeLookupResponse
  | CityStateLookupResponse
  | RateV4Response
  | ErrorResponse
> => {
  const requestName = `${method}Request`;
  const responseName = `${method}Response`;

  // Create the XML object
  const xmlObject = {
    [requestName]: {
      ...parameters,
      // Put the UserID in as an attribute
      "@USERID": config.userId,
    },
  };
  const xml = create(xmlObject).end();

  // Create the QueryString
  const qs = stringify({
    API: api,
    XML: xml,
  });

  const staging = config.staging ? config.staging : false;

  const options: RequestOptions = {
    hostname: staging
      ? "stg-secure.shippingapis.com"
      : "secure.shippingapis.com",
    method: "GET",
    path: `/ShippingAPI.dll?${qs}`,
  };

  let uspsResponse;
  try {
    uspsResponse = await makeRequest(options);
  } catch (error) {
    return error as ErrorResponse;
  }

  // may have a root-level error
  if (uspsResponse.Error) {
    const error = uspsResponse.Error;
    throw new Error(error.Description.trim());
  }

  /**
    walking the result, to drill into where we want
    resultDotNotation looks like 'key.key'
    though it may actually have arrays, so returning first cell
  */
  let specificResult:
    | AddressValidateResponse
    | ZipCodeLookupResponse
    | CityStateLookupResponse
    | RateV4Response;
  if (
    uspsResponse &&
    // @ts-expect-error It does expect a string
    uspsResponse[responseName] &&
    // @ts-expect-error It does expect a string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    uspsResponse[responseName][property]
  ) {
    // @ts-expect-error It does expect a string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    specificResult = uspsResponse[responseName][property];

    // specific error handling
    if (specificResult.Error) {
      throw new Error(specificResult.Error.Description.trim());
    }

    return specificResult;
  }
  throw new Error("Can't find result");
};
