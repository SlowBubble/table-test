import {objectEquals} from './compare.js';

export async function runTestCases(testCases, setupFunc) {
  const results = [];
  // Using a for loop instead of map, so we can block the loop when calling a asynchronous gotFunc.
  for (const tc of testCases) {
    const result = {
      name: tc.name,
      want: tc.wantErrSubstring ? `want error substring: ${tc.wantErrSubstring}` : tc.want,
      got: tc.got,
      errString: null,
      stackTrace: null,
    };
    const tcContext = {
      args: tc.args,
      setup: {}
    };
    if (setupFunc) {
      try {
        const setupResult = await setupFunc(tcContext);
        tcContext.setup = {...tcContext.setup, ...setupResult};
      } catch (err) {
        result.isSuccessful = false;
        result.got = `common setup error: ${err.toString()}`;
        result.errString = err.toString();
        result.stackTrace = err.stack;
        results.push(result);
        continue;
      }
    }
    if (tc.setupFunc) {
      try {
        const setupResult = await tc.setupFunc(tcContext);
        tcContext.setup = {...tcContext.setup, ...setupResult};
      } catch (err) {
        result.isSuccessful = false;
        result.got = `setup error: ${err.toString()}`;
        result.errString = err.toString();
        result.stackTrace = err.stack;
        results.push(result);
        continue;
      }
    }
    if (tc.gotFunc) {
      try {
        result.got = await tc.gotFunc(tcContext);
        if (tc.wantErrSubstring) {
          result.isSuccessful = false;
          results.push(result);
          continue;
        }
      } catch (err) {
        result.got = `got error: ${err.toString()}`;
        result.errString = err.toString();
        result.isSuccessful = result.got.includes(tc.wantErrSubstring);
        if (!result.isSuccessful) {
          result.stackTrace = err.stack;
        }
        results.push(result);
        continue;
      }
    }

    const comparisonFunc = tc.comparisonFunc || objectEquals;
    result.isSuccessful = comparisonFunc(result.got, result.want);
    results.push(result);
    continue;
  }

  return results
}
