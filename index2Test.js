import { runTest } from './index.js'

export default async _ => {
  await runTest({
    setupFunc: _ => {
      return {
        pi: 3.14159,
      };
    },
    testCases: [
      {
        name: 'testing number',
        got: 1,
        want: 1,
      },
      {
        name: 'testing object equality',
        got: {a: 1, b: 2},
        want: {b: 2, a: 1},
      },
      {
        name: 'testing exception',
        gotFunc: _ => {
          throw 'testing exception';
        },
        wantErrSubstring: "testing",
      },
      {
        name: 'testing async',
        gotFunc: _ => {
          return new Promise(resolve => {
            setTimeout(_ => {
              resolve(3.14);
            }, 9);
          });
        },
        want: 3.14,
      },
      {
        name: 'intentional demo of failure',
        gotFunc: context => {
          return context.setup.pi;
        },
        want: 3.14159,
      },
      {
        name: 'testing async setupFunc within a test case.',
        setupFunc: async _ => {
          return new Promise(resolve => {
            setTimeout(_ => {
              resolve({
                pi: 3.14,
              });
            }, 9);
          });
        },
        gotFunc: context => {
          return {
            pi: context.setup.pi,
            nested: {
              pi: context.setup.pi,
              pies: [context.setup.pi, context.setup.pi],
            }
          };
        },
      },
      {
        name: 'intentional demo of async failure',
        gotFunc: _ => {
          return new Promise((resolve, reject) => {
            setTimeout(_ => {
              reject('testing reject');
            }, 9);
          });
        },
        wantErrSubstring: "testing reject",
      },
      {
        name: 'testing custom comparisonFunc',
        got: 3.14159,
        want: 3.14,
        comparisonFunc: (got, want) => {
          return Math.abs(got - want) < 0.01;
        },
      },
      {
        name: 'testing async error',
        gotFunc: _ => {
          return new Promise((resolve, reject) => {
            setTimeout(_ => {
              reject('testing reject');
            }, 9);
          });
        },
        wantErrSubstring: 'testing',
      },
    ],
  });
};
