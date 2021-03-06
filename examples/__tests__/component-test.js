/** @jsx React.DOM */
var React = require('react/addons'),
  TestUtils = React.addons.TestUtils,
  Lib = require('../index'),
  Identity = Lib.Identity;

jest.dontMock('../component');
describe('Component', function() {
  var Component = require('../component'),
    rendered = TestUtils.renderIntoDocument(<Component />);

  describe('should match a rendered comparison', function() {
    var comparison = TestUtils.renderIntoDocument(<Identity>
        <div>
          <h1>Header</h1>
          <span>img</span>
          <p>Test in bundles</p>
          <hr />
        </div>
      </Identity>);

    Lib.expect(rendered).toMatch(comparison);
  });
  describe('should match a rendered comparison', function() {
    Lib.expect(rendered).toMatch(<Identity>
        <div>
          <h1>Header</h1>
          <span>img</span>
          <p>Test in bundles</p>
          <hr />
        </div>
      </Identity>);
  });
});
