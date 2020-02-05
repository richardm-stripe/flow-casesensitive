## In this repository:

**src/Lib.js**
```flow
export function f<+T: { x?: "x" }>(a: T => any, b: $Rest<T, {| x?: "x" |}>) {}
```

**src/lib2.js** (identical to src/Lib.js)
```flow
export function f<+T: { x?: "x" }>(a: T => any, b: $Rest<T, {| x?: "x" |}>) {}
```

**src/foo.js** (defines a function to be passed in as `a` to f)
```flow
// @flow
export const Foo = ({}: {| foo: string |}) => {};
```

**src/main.js** (imports both versions of f, and attempts to call both versions with 'Foo' and 'LocallyDefinedFoo')
```flow
// @flow

// @flow
import * as Lib from "./Lib.js";
import * as lib2 from "./lib2.js";
import { Foo } from "./foo";

const LocallyDefinedFoo = ({}: {| foo: string |}) => {};

Lib.f(Foo, { foo: "hi" });
lib2.f(Foo, { foo: "hi" });
Lib.f(LocallyDefinedFoo, { foo: "hi" });
lib2.f(LocallyDefinedFoo, { foo: "hi" });
```

## Expected behavior:

All four invocations, `Lib.f(Foo, ...)`, `lib2.f(Foo, ...)`, `Lib.f(LocallyDefinedFoo, ...)`, and `lib2.f(LocallyDefinedFoo, ...)`, should either all produce a type error, or all produce no type error.

## Observed behavior

Only `Lib.f(Foo, ...)` produces a type error. The reason for this seems to have something to do with the filename being capitalized -- if I rename the file to something lower case, the type error goes away. (This is happening on a case-insensitive filesystem on Mac OS X)

```shell
$ node_modules/.bin/flow check
Error ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ src/main.js:8:12

Cannot call Lib.f with object literal bound to b because property x is missing in object type [1] but exists in object
literal [2].

     src/main.js
      5│
      6│ const LocallyDefinedFoo = ({}: {| foo: string |}) => {};
      7│
 [2]  8│ Lib.f(Foo, { foo: "hi" });
      9│ lib2.f(Foo, { foo: "hi" });
     10│ Lib.f(LocallyDefinedFoo, { foo: "hi" });
     11│ lib2.f(LocallyDefinedFoo, { foo: "hi" });

     src/foo.js
 [1]  2│ export const Foo = ({}: {| foo: string |}): void => {};

Found 1 error
```

## To reproduce

```shell
$ git clone git@github.com/richardm-stripe/flow-caseinsensitive
$ yarn
$ yarn flow check
```
