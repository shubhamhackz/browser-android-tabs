// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(async function() {
  TestRunner.addResult(`Tests that CSSOM-modified shorthands are reporting their "important" bits.\n`);
  await TestRunner.loadModule('elements_test_runner');
  await TestRunner.showPanel('elements');
  await TestRunner.loadHTML(`
      <style>
      #inspected {
        padding: 10px 50px !important;
      }
      </style>
      <p>Tests that CSSOM-modified shorthands are reporting their &quot;important&quot; bits.</p>
      <div id="inspected">Text</div>
    `);
  await TestRunner.evaluateInPagePromise(`
      document.styleSheets[0].cssRules[0].style.marginTop = "10px"
  `);

  ElementsTestRunner.selectNodeAndWaitForStyles('inspected', dump);

  function dump() {
    ElementsTestRunner.dumpSelectedElementStyles(true);
    TestRunner.completeTest();
  }
})();
