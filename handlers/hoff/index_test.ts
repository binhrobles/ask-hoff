import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { isValidHMAC } from "./index.ts";

Deno.test("Auth header HMAC is constructed correctly", () => {
  assert(
    isValidHMAC({
      authHeader: "HMAC ec4caP03UIEqHFUcWPB3ZRH11D86eJxBo+20QhO94+k=",
      body: "this is a body",
      base64secret: "Z3JlYXRzZWNyZXQ=",
    }),
  );

  assert(
    !isValidHMAC({
      authHeader: "HMAC ec4caP03UIEqHFUcWPB3ZRH11D86eJxBo+20QhO94+k=",
      body: "this is a different body",
      base64secret: "Z3JlYXRzZWNyZXQ=",
    }),
  );
});
