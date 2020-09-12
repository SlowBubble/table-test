import {renderTestReport} from './renderInBoth.js';
// import {genFix} from './fix.js';
// import { readFileSync, writeFileSync } from 'fs';

export const verboseReportStart = '--vrstart--';

const resetColor = `\x1b[0m`;
const hiddenColor = `\x1b[8m`;

export function renderInNonBrowser(testReport, failureReports, callerInfo) {
  if (failureReports.length) {
    consoleRenderFunc([
      verboseReportStart,
      JSON.stringify({
        filePath: callerInfo.filePath,
        failureReports: failureReports.map(fRep => {
          return {
            name: fRep.name,
            errString: fRep.errString ? fRep.errString : undefined,
            got: fRep.errString ? undefined : fRep.got,
          };
        }),
      }),
    ].join(''), {color: hiddenColor});
    consoleRenderFunc('--'.repeat(20), {color: resetColor});
    consoleRenderFunc('');
  }

  renderTestReport(testReport, consoleRenderFunc);

  if (failureReports.length) {
    consoleRenderFunc(`\n🔧 To auto-fix the above test (i.e. assuming that the implementation is correct), run the following:`);
    consoleRenderFunc(`${process.argv.join(' ')} | npx @clubfest/table-test\n`, {indent: 4});
  }

}

function consoleRenderFunc(possStr, opts) {
  opts = opts || {};
  const lines = possStr ? possStr.split('\n') : [possStr];
  lines.forEach(line => {
    const args = opts.color ? [`${opts.color}%s`] : [`${resetColor}%s`];
    args.push(' '.repeat(opts.indent || 0) + line);
    console.log(...args);
  });
}

