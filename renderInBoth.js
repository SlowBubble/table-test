
// This works for both browser and non-browser, but browser logic is added if report.testScriptUrl is present.
export function renderTestReport(report, renderFunc) {
  const htmlId = report.numFailures ? 'failing' : 'passing';

  let testNameReplace = report.testName;
  if (report.testScriptUrl) {
    testNameReplace = `<a href='${report.testScriptUrl}'>${report.testName}</a>`;
  }
  const header = report.header.replace(report.testName, testNameReplace);
  renderFunc(header, {htmlId: htmlId});
  if (!report.cases) {
    return;
  }
  if (report.testScriptUrl) {
    const fileName = report.fileName ? report.fileName : 'your test code'
    renderFunc(`🔧  <a href="#${report.testScriptUrl}"'>Quick fix for copy-pasting</a> into ${fileName}.`, {htmlId: htmlId});
  }

  report.cases.forEach(cas => {
    renderFunc(cas.header, {indent: 2, htmlId: htmlId});
    renderFunc('got:', {indent: 4, htmlId: htmlId});
      renderFunc(cas.got, {indent: 6, htmlId: htmlId});
    renderFunc('want:', {indent: 4, htmlId: htmlId});
    renderFunc(cas.want, {indent: 6, htmlId: htmlId});
    if (cas.stackTrace) {
      renderFunc('stack trace:', {indent: 4, htmlId: htmlId});
      renderFunc(cas.stackTrace, {indent: 6, htmlId: htmlId});
    }
  });
  const fileName = report.fileName ? report.fileName : 'your test code'
}
