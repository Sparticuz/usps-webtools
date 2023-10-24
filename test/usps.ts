/* eslint-disable no-new */
import test from "ava";
import USPS from "../src/usps.js";

test("USPS should throw an exception when constructor is called without config object", (t) => {
  t.throws(() => {
    // @ts-expect-error I'm testing this error
    new USPS();
  });
});

test("USPS should throw an exception when constructor is called without config.userId", (t) => {
  t.throws(
    () =>
      // @ts-expect-error I'm testing this error
      new USPS({
        staging: true,
      }),
  );
});
