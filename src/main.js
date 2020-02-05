// @flow
import * as Lib from "./Lib.js";
import * as lib2 from "./lib2.js";
import { Foo } from "./foo";

const LocallyDefinedFoo = ({}: {| foo: string |}) => {};

Lib.f(Foo, { foo: "hi" });
lib2.f(Foo, { foo: "hi" });
Lib.f(LocallyDefinedFoo, { foo: "hi" });
lib2.f(LocallyDefinedFoo, { foo: "hi" });
