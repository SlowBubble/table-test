
export function genTestSummary(testResults, testName) {
  const failedResults = testResults.filter(res => {
    return !res.isSuccessful;
  });
  const failureReports = failedResults.map(res => {
    return {
      name: res.name,
      got: res.got,
      want: res.want,
      errString: res.errString,
      stackTrace: res.stackTrace,
    }
  });
  const summary = {
    numTotal: testResults.length,
    numFailures: failedResults.length,
    numSuccesses: testResults.length - failedResults.length,
    failureReports: failureReports,
    testName: testName,
  };
  return summary;
}

export function genTestReport(testSummary, fileName) {
  if (!testSummary.numFailures) {
    return {
      header: `✅ All ${testSummary.numTotal} cases passed for ${testSummary.testName}.`,
      testName: testSummary.testName,
      fileName: fileName,
    };
  }
  return {
    header: `❌ ${testSummary.numFailures} / ${testSummary.numTotal} cases failed for ${testSummary.testName}:`,
    testName: testSummary.testName,
    fileName: fileName,
    numFailures: testSummary.numFailures,
    cases: testSummary.failureReports.map(report => {
      const caseReport = {
        header: `❌ ${report.name}`,
        got: JSON.stringify(report.got, null, 2),
        want: JSON.stringify(report.want, null, 2),
        stackTrace: report.stackTrace,
      };
      return caseReport;
    }),
  }
}