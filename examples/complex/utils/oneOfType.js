function is(x, y) {

  // SameValue algorithm
  // Steps 1-5, 7-10
  if (x === y) {

    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {

    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * @function oneOf
 * @description Value checking modeled after React propType checking.
 */
export default function oneOf(actual, expected) {
  if (!Array.isArray(expected)) {
    return new Error(
      `Invalid argument supplied to oneOfType: expected an instance of array`
    );
  }

  if (expected.filter(value => is(actual, value)).length === 0) {
    return false;
  }

  return true;
}
