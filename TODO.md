# TODO
* Use text fragments for linking to the code of test cases.
* Allow overriding toStringFunc for got and want.
  - In addition to making got and want readable, toStringFunc should be make it easy to copy-paste changing want into the test case (perhaps even automating refactoring of tests due to changing specs/impls).
* Support circular dependency for the default toStringFunc and comparisonFunc.
  - https://www.npmjs.com/package/fast-safe-stringify
* Show diffs when got and diff are > 5 lines long.
  - This can be done by providing a good default diffFunc that combines ordered json with jsonDiff.
    + https://www.npmjs.com/package/json-diff
  - diffFunc can output a string to be displayed in the terminal, but how can we use this output to generate a nice side-by-side comparison for browser JS?
    + https://github.com/rtfpessoa/diff2html
* Produce a table view for passing test cases in html
  - Show gotFunc.name or if empty, show impl via `gotFunc.toString().match(/\{(.*)\}/s)[1].trim()`?
  - Add gotFuncArgs because the args are the important to thing to show.
  - Need to add setupFunc and teardownFunc to make it easier to keep gotFunc simple.

## Automate filling in the `want` field
### Node JS
When a test failed, offer a command to execute like this:
```
If you believe that the test is failing because of stale values in the `want` field, run this command to auto-fix/update it (WARNING: this will overwrite your existing test files, so make sure existing test changes are version controlled/committed):

  node /absolute/path/to/failingTest.js fix

```

We can also offer a command to fix all tests at once if the user is testing with:

```
$ node allTests.js failSlow
...
If you believe that the test is failing because of stale values in the `want` field, run this command to auto-fix/update it (WARNING: this will overwrite your existing test files, so make sure existing test changes are version controlled/committed):

  node /absolute/path/to/allTests.js fix
```

### Browser JS
* When a test failed, offer a link to the updated file to copy-paste.
  - The node JS command may also work, if we know the file url of the test, and if the tests and their dependencies don't have browser dependencies, but that's a stringent requirement.
  - We cannot offer a command that auto-fix/update the code because we don't know how the http url of the test relates to its file url.

### Design
* Use the test case name to identify the code location of the test case object.
* The value to update cannot have circular references nor use a custom comparator/diff func.
* Identify the code location of the want field (which may span multiple lines).
  - Overwrite the field if it's present.
  - Create a new field if it's not present.
