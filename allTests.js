import { isNodeJs } from './index.js'
import compareTest from './compareTest.js';
import indexTest from './indexTest.js';
import index2Test from './index2Test.js';

(async _ => {
  await compareTest();
  await index2Test();
  await indexTest();

  if (isNodeJs()) {
    process.exit(0);
  }
})();