jest.dontMock('../expect');
var React = require('react/addons'),
  TestUtils = React.addons.TestUtils,
  Lib = require('../../index'),
  Identity = Lib.Identity;

describe('Expect', function () {
  describe('should match at top level', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <p>not <span>spanned</span>matching</p>
        </div>
      </div>);

    Lib.expect(glob).toMatch(<div>
        <div>
          <p>not <span>spanned</span>matching</p>
        </div>
      </div>);
  });
  describe('should not match at top level', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <p>not <span>spanned</span>matching</p>
        </div>
      </div>);

    Lib.expect(glob).not.toMatch(<div>
        <div>
          <p>not <span>unequal</span>matching</p>
        </div>
      </div>);
  });
  describe('should match at second level', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <p>
            <span>Help me</span>
            <img src="help" />
          </p>
        </div>
      </div>);

    Lib.expect(TestUtils.findRenderedDOMComponentWithTag(glob, "p")).toMatch(
      <p>
        <span>Help me</span>
        <img src="help" />
      </p>);
  });
  describe('should match composite node', function () {
    var Comp = React.createClass({
      render: function () {
        return <p>
          <span>
            Inner
          </span>
        </p>;
      }
    });
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <p>
            <Comp />
          </p>
        </div>
      </div>);

    var found = TestUtils.findRenderedComponentWithType(glob, Comp);
    Lib.expect(found).toMatch(
      <Identity>
        <p>
          <span>
            Inner
          </span>
        </p>
      </Identity>
      );
  });
  describe('should match DOM node', function () {
    var Comp = React.createClass({
      render: function () {
        return <p>
          <span>
            Inner
          </span>
        </p>;
      }
    });
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <Comp />
        </div>
      </div>);

    var found = TestUtils.findRenderedDOMComponentWithTag(glob, "p");
    Lib.expect(found).toMatch(
        <p>
          <span>
            Inner
          </span>
        </p>
      );
  });
});
