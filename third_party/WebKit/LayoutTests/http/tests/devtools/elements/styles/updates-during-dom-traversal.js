// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(async function() {
  TestRunner.addResult(`Tests that style updates are throttled during DOM traversal. Bug 77643.\n`);
  await TestRunner.loadModule('elements_test_runner');
  await TestRunner.showPanel('elements');
  await TestRunner.loadHTML(`
      <p>
      Tests that style updates are throttled during DOM traversal. <a href="https://bugs.webkit.org/show_bug.cgi?id=77643">Bug 77643</a>.
      </p>


      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div id="inspected"></div>
    `);

  var updateCount = 0;
  var keydownCount = 5;

  ElementsTestRunner.selectNodeAndWaitForStyles('inspected', selectCallback);
  function selectCallback() {
    TestRunner.addSniffer(Elements.StylesSidebarPane.prototype, '_innerRebuildUpdate', sniffUpdate, true);
    var element = ElementsTestRunner.firstElementsTreeOutline().element;
    for (var i = 0; i < keydownCount; ++i)
      element.dispatchEvent(TestRunner.createKeyEvent('ArrowUp'));

    TestRunner.deprecatedRunAfterPendingDispatches(completeCallback);
  }

  function completeCallback() {
    if (updateCount >= keydownCount)
      TestRunner.addResult('ERROR: got ' + updateCount + ' updates for ' + keydownCount + ' consecutive keydowns');
    else
      TestRunner.addResult('OK: updates throttled');
    TestRunner.completeTest();
  }

  function sniffUpdate() {
    ++updateCount;
  }
})();
