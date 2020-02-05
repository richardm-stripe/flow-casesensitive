// @flow
export function f<+T: { x?: "x" }>(a: T => any, b: $Rest<T, {| x?: "x" |}>) {}
