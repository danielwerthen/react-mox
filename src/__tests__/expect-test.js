jest.dontMock('../expect');
var React = require('react/addons'),
  TestUtils = React.addons.TestUtils,
  Lib = require('../../index');

describe('Expect', function () {
  xdescribe('should match at top level', function () {
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
  xdescribe('should not match at top level', function () {
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
  xdescribe('should match at second level', function () {
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
        return <p>Inner</p>;
      }
    });
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <p>
            <Comp />
          </p>
        </div>
      </div>);

    console.info("Continue with building a better rootNodeId system");

    var found = TestUtils.findRenderedComponentWithType(glob, Comp);
    Lib.expect(found).toMatch(
      <div>
        <p>
        Inner
        </p>
      </div>
      );
  });
});
