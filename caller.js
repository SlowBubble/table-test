
// https://stackoverflow.com/a/22165114/2191332
export function getCallerInfo() {
  const result = {};
  try {
    //Throw an error to generate a stack trace
    throw new Error();
  } catch(e) {
    //Split the stack trace into each line
    var stackLines = e.stack.split('\n');
    var callerIndex = 0;
    //Now walk though each line until we find a path reference
    for(var i in stackLines){
      if(!stackLines[i].match(/:\/\//)) continue;
      //We skipped all the lines with out an http so we now have a script reference
      //This one is the class constructor, the next is the getScriptPath() call
      //The one after that is the user code requesting the path info (so offset by 2)
      callerIndex = Number(i) + 2;
      break;
    }
    //Now parse the string for each section we want to return
    if (stackLines.length > callerIndex) {
      const relevantLine = stackLines[callerIndex];
      const httpUrl = relevantLine.match(/(http[s]?:\/\/.+\/[^\/]+\.js):/);
      if (httpUrl && httpUrl.length > 1) {
        result.url = httpUrl[1];
      }
      const fileName = relevantLine.match(/\/([^\/]+\.js):/);
      if (fileName && fileName.length > 1) {
        result.fileName = fileName[1];
      }
      const filePath = relevantLine.match(/file:\/\/(\/.+\.js):/);
      if (filePath && filePath.length > 1) {
        result.filePath = filePath[1];
      }
    }
  }
  return result;
}