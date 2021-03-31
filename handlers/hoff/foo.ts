import { hmac } from 'https://deno.land/x/god_crypto/hmac.ts';

const output = hmac('sha256', 'secret', '123').base64();
console.log(output);
