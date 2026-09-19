/*
 * Preload that gives Node's own TypeScript support the one resolution rule
 * the bundlers have and it does not: an extensionless relative import
 * (`./boxes`) is re-pointed at the `.ts` file when there is one.
 *
 * The plugin's parsers are imported by the tests as they are shipped, and
 * those use the Vencord style of leaving the extension off. Node resolves
 * strictly, so without this `node --test` refuses to load them. Served with
 *
 *     node --import ./tests/register-ts-resolver.mjs --test "tests/*.test.ts"
 */
import { register } from "node:module";

register(new URL("./ts-resolver-hooks.mjs", import.meta.url));