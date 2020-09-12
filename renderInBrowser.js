import {genFix} from './fix.js';
import {renderTestReport} from './renderInBoth.js';
import {renderFix} from './renderFixInBrowser.js';
import * as readFile from './readFileInBrowser.js';

export async function renderInBrowser(testReport, failureReports, callerInfo) {
  // Re-run 
  window.onhashchange = function() {
    window.location.reload();
  }
  const urlWhoseScriptNeedsFixing = window.location.hash.slice(1);
  if (urlWhoseScriptNeedsFixing) {
    if (urlWhoseScriptNeedsFixing === callerInfo.url) {
      const lines = [];
      for await (let line of readFile.makeFileLineIterator(urlWhoseScriptNeedsFixing)) {
        lines.push(line);
      }
      renderFix(genFix(failureReports, lines));
    }
  } else {
    setupDom();
    testReport.testScriptUrl = callerInfo.url;
    renderTestReport(testReport, htmlRenderFunc);
  }
}

export function getOrInsertHtml(id, tag) {
  const html = document.getElementById(id);
  if (html) {
    return html;
  }
  const newHtml = document.createElement(tag);
  newHtml.id = id;
  document.body.appendChild(newHtml);
  return newHtml;
}

export function htmlRenderFunc(possStr, opts) {
  opts = opts || {};
  const html = getOrInsertHtml(opts.htmlId || 'passing', 'pre');
  // TODO may want to contain the style within a container span.
  html.style['font-size'] = 'large';
  html.style['padding'] = '9px';

  const lines = possStr ? possStr.split('\n') : [possStr];
  lines.forEach(line => {
    html.innerHTML += ' '.repeat(opts.indent || 0) + line + '\n';
  });
}

export function setupDom() {
  document.body.style['padding-left'] = '15px';
  const titleHtml = getOrInsertHtml('title-html', 'h2');
  titleHtml.textContent = 'Test Results';
  // Make sure the failing html shows up at the top.
  const failingHtml = getOrInsertHtml('failing', 'pre');
  failingHtml.style['background-color'] = '#FFE4E1';
  failingHtml.style['white-space'] = 'pre-wrap';
  const passingHtml = getOrInsertHtml('passing', 'pre');
  passingHtml.style['background-color'] = '#E4FFE1';
  passingHtml.style['white-space'] = 'pre-wrap';
}