import { runTest } from './index.js'
import {objectEquals, objectContains} from './compare.js';

class LinkedList {
  constructor(next) {
    this.next = next;
  }
}

function genLinkedList(length, cyclic) {
  const head = new LinkedList;
  let curr = head;
  for (let i = 0; i < length; i++) {
    curr.next = new LinkedList;
    curr = curr.next;
  }
  if (cyclic) {
    curr.next = head;
  }
  return head;
}

export default async _ => {
  await runTest({testCases: [
    {
      name: 'testing number',
      got: objectEquals(1, 1),
      want: true,
    },
    {
      name: 'testing nested data structure',
      got: objectEquals(genLinkedList(3), genLinkedList(3)),
      want: true,
    },
    {
      name: 'testing nested structure vs json',
      got: objectEquals(genLinkedList(1), {next: {next: undefined}}),
      want: true,
    },
    {
      name: 'circular data structure does not work',
      gotFunc: _ => {
        return objectEquals(genLinkedList(1, /*cyclic=*/ true), genLinkedList(1, /*cyclic=*/ true));
      },
      wantErrSubstring: 'Maximum call stack size exceeded',
    },
    {
      name: 'objectContains: test strict containment',
      got: objectContains(
        {noise: 1, signal: {noise: 1, signal: 1}},
        {signal: {signal: 1}},
      ),
      want: true,
    },
    {
      name: 'objectContains: test equal',
      got: objectContains(
        {noise: 1, signal: {noise: 1, signal: 1}},
        {noise: 1, signal: {noise: 1, signal: 1}},
      ),
      want: true,
    },
    {
      name: 'objectContains: test non-containment',
      got: objectContains(
        {noise: 1, signal: {noise: 1, signal: 1}},
        {signal: {signal: 2}},
      ),
      want: false,
    },
  ]});
};
