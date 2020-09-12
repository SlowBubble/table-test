import {htmlRenderFunc} from './renderInBrowser.js';

export async function renderFix(fix) {
  // Clear the test results from the dom first.
  document.body.innerHTML = '';

  const fixClassName = 'fix-line';
  const tcStartClassName = 'fix-tc-start';
  fix.lines.forEach((line, idx) => {
    if (fix.tcBlocks.length > 0 && idx == fix.tcBlocks[0].startIdx - 1) {
      htmlRenderFunc(`<span class='${tcStartClassName}'>${line}</span>`);
      return;
    }
    if (isWithinIntervals(idx, fix.changeIntervals)) {
      htmlRenderFunc(`<span class='${fixClassName}' style='background-color:#C4FFC1'>${line}</span>`);
      return;
    }  
    htmlRenderFunc(line);
  });
  const tcStarts = document.getElementsByClassName(tcStartClassName);
  if (tcStarts.length > 0) {
    tcStarts[0].scrollIntoView();
  }
}

function isWithinIntervals(idx, intervals) {
  for (const interval of intervals) {
    if (interval.startIdx <= idx && idx < interval.endIdx) {
      return true;
    }
  }
  return false;
}