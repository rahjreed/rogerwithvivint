import test from 'node:test';
import assert from 'node:assert/strict';
import { copyText } from '../src/clipboard.js';

test('Clipboard API and denied/unavailable API fallback report actual success', async () => {
  let copied, removed = 0, restored = 0;
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const setupNavigator = value => Object.defineProperty(globalThis, 'navigator', { configurable: true, value });
  try {
    setupNavigator({ clipboard: { writeText: async text => { copied = text; } } });
    assert.equal(await copyText('Complete body &\nall lines'), true);
    assert.equal(copied, 'Complete body &\nall lines');
    globalThis.document = {
      activeElement: { focus: () => restored++ },
      body: { appendChild: () => {} },
      createElement: () => ({ style: {}, setAttribute() {}, focus() {}, select() {}, setSelectionRange() {}, remove() { removed++; } }),
      execCommand: () => true,
    };
    setupNavigator({ clipboard: { writeText: async () => { throw new Error('denied'); } } });
    assert.equal(await copyText('fallback'), true);
    setupNavigator({});
    globalThis.document.execCommand = () => false;
    assert.equal(await copyText('manual selection needed'), false);
    assert.equal(removed, 2);
    assert.equal(restored, 2);
  } finally {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator); else delete globalThis.navigator;
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument); else delete globalThis.document;
  }
});
