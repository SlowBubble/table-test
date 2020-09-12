
export function genFix(failureReports, lines) {
  // All fields will be mutated as we go thru each failureReport.
  const res = {
    lines: lines,
    changeIntervals: [],
    tcBlocks: [],
  }
  failureReports.forEach(fRep => {
    const currLines = res.lines;
    const tcBlock = findTestCaseBlock(currLines, fRep);
    if (!tcBlock) {
      console.warn('Failed to find the code block for this test case: ', fRep);
      return;
    }
    let wantBlock = findWantBlock(currLines, tcBlock);
    if (!wantBlock) {
      wantBlock = {
        startIdx: tcBlock.endIdx,
        endIdx: tcBlock.endIdx,
      };
    }
  
    const newWantLines = computeNewWantLines(fRep, tcBlock.blockIndentLevel);
    res.lines = currLines.slice(0, wantBlock.startIdx).concat(newWantLines).concat(currLines.slice(wantBlock.endIdx));
    res.changeIntervals.push({
      startIdx: wantBlock.startIdx,
      endIdx: wantBlock.startIdx + newWantLines.length,
    });
    res.tcBlocks.push(tcBlock);
  });
  
  return res;
}

function computeNewWantLines(fRep, blockIndentLevel) {
  const errString = fRep.errString;
  const wantField = errString ? 'wantErrSubstring' : 'want';
  const got = errString ? errString : fRep.got;
  if (got === undefined) {
    return [];
  }
  const jsonLines = JSON.stringify(got, null, 2).split('\n');
  return jsonLines.map((line, idx) => {
    const res = [' '.repeat(blockIndentLevel)];
    if (idx == 0) {
      res.push(`${wantField}: `);
    }
    res.push(line);
    if (idx == jsonLines.length - 1) {
      res.push(',');
    }
    return res.join('');
  });
}

// Empty line will have -1 as indent level.
function computeIndentLevel(line) {
  if (line.trimStart().length == 0) {
    return -1;
  }
  return line.length - line.trimStart().length;
}

function matchLine(line, field, value) {
  let regExp = `\\s*${field}:`;
  if (value) {
    regExp += `\\s*['"\`]${value}['"\`]`;
  }
  return line.match(regExp);
}

function computeBlock(lines, idx) {
  const blockIndentLevel = computeIndentLevel(lines[idx]);

  let startIdx = idx - 1;
  for (; startIdx >= 0; startIdx--) {
    const currIndentLevel = computeIndentLevel(lines[startIdx]);
    if (currIndentLevel != -1 && currIndentLevel < blockIndentLevel) {
      startIdx++;
      break;
    }
  }
  let endIdx = idx + 1;
  for (; endIdx < lines.length; endIdx++) {
    const currIndentLevel = computeIndentLevel(lines[endIdx]);
    if (currIndentLevel != -1 && currIndentLevel < blockIndentLevel) {
      break;
    }
  }
  return {
    startIdx: startIdx,
    endIdx: endIdx,
    blockIndentLevel: blockIndentLevel,
  };
}

function computeSubBlock(lines, idx) {
  const blockIndentLevel = computeIndentLevel(lines[idx]);

  let startIdx = idx - 1;
  for (; startIdx >= 0; startIdx--) {
    const currIndentLevel = computeIndentLevel(lines[startIdx]);
    if (currIndentLevel != -1 && currIndentLevel <= blockIndentLevel) {
      startIdx++;
      break;
    }
  }
  let endIdx = idx + 1;
  for (; endIdx < lines.length; endIdx++) {
    const currLine = lines[endIdx];
    const currIndentLevel = computeIndentLevel(currLine);
    if (currIndentLevel != -1 && currIndentLevel <= blockIndentLevel) {
      if (currIndentLevel == blockIndentLevel && !currLine.includes(':')) {
        endIdx++;
      }
      break;
    }
  }
  return {
    startIdx: startIdx,
    endIdx: endIdx,
    blockIndentLevel: blockIndentLevel,
  };
}

function findTestCaseBlock(lines, failureReport) {
  let block = null;
  lines.forEach((line, idx) => {
    const res = matchLine(line, 'name', failureReport.name);
    if (!res) {
      return;
    }
    
    block = computeBlock(lines, idx);
  });
  return block;
}

function findWantBlock(lines, tcBlock) {
  let block = null;
  lines.forEach((line, idx)  => {
    if (idx < tcBlock.startIdx || tcBlock.endIdx <= idx) {
      return;
    }
    const res = matchLine(line, '(want|wantErrSubstring|wantFunc)');
    if (!res) {
      return;
    }
    block = computeSubBlock(lines, idx);
  });
  return block;
}
