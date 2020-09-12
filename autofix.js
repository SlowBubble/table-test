#!/usr/bin/env node

import {genFix} from './fix.js';
import { readFileSync, writeFileSync } from 'fs';
import {verboseReportStart} from './renderInNonBrowser.js';
import { createInterface } from 'readline';

process.stdin.resume();
process.stdin.setEncoding('utf8');

const rl = createInterface({
  input: process.stdin,
  terminal: false
});

const verboseReportRegExp = new RegExp(`\\s*${verboseReportStart}(.*)`);
rl.on('line', function(line){
  const res = line.match(verboseReportRegExp);
  if (res) {
    applyFix(res[1]);
  }
});

function applyFix(verboseReport) {
  const vRep = JSON.parse(verboseReport);
  const lines = readFileSync(vRep.filePath, 'utf-8').split('\n');
  const fix = genFix(vRep.failureReports, lines);
  writeFileSync(vRep.filePath, fix.lines.join('\n'), 'utf-8');
  console.log(`🔧🔧 file://${vRep.filePath} has been autofixed!`);
}
