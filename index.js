import {getCallerInfo} from './caller.js';
import {runTestCases} from './run.js';
import {renderInNonBrowser} from './renderInNonBrowser.js';
import {renderInBrowser} from './renderInBrowser.js';
import {genTestReport, genTestSummary} from './report.js';

// Returns whether or not the test ran successfully.
// Will display the result in the console and/or browser.
// Will exit early in Node.js if failfast is not set to false.
// Post-processing, e.g. exiting with correct status code, is left to the caller.
// This is because table-test is a library and not a framework,
// so it cannot perform aggregation of multiple runTest results.
export async function runTest({
    testCases = [], testName = '', setupFunc = null, failfast = true}) {
  // Note that this must be called before any await or else the stack trace will be truncated.
  const callerInfo = getCallerInfo();

  testName = testName || callerInfo.fileName || '';

  const testSummary = genTestSummary(await runTestCases(testCases, setupFunc), testName);
  const testReport = genTestReport(testSummary, callerInfo.fileName);

  if (typeof document !== 'undefined') {
    await renderInBrowser(testReport, testSummary.failureReports, callerInfo);
  } else {
    renderInNonBrowser(testReport, testSummary.failureReports, callerInfo);
  }
  if (failfast && isNodeJs() && testSummary.numFailures > 0) {
    // Fail fast; if we fail slow, we can't control the exit code, since
    // this is a library function, not a framework.
    // This has the added benefit that the tail of the logs will be the
    // most useful info about the failure (i.e. no need to scroll up).
    process.exit(1);
  }
  return testSummary.numFailures == 0;
}

export function isNodeJs() {
  return (typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined');
}

