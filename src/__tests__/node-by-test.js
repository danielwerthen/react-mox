jest.dontMock('../expect');
var React = require('react/addons'),
  TestUtils = React.addons.TestUtils,
  Expect = require('../expect'),
  NodeBy = require('../NodeBy');

describe('NodeBy', function () {
  describe('should find matching node', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <section>
            <h1>Header</h1>
            <p id="body" className="boo">Body</p>
          </section>
        </div>
      </div>);

    var found = TestUtils.findRenderedDOMComponentWithTag(glob, "section");
    var Node = NodeBy.id("body");
    Expect(found).toMatch(
      <section>
        <Node >
          <p className="boo">Body</p>
        </Node>
      </section>
      );
  });
  describe('should find matching node by class', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <section>
            <h1>Header</h1>
            <p id="body" className="boo">
              Body
              <span>Hello</span>
            </p>
          </section>
        </div>
      </div>);

    var found = TestUtils.findRenderedDOMComponentWithTag(glob, "section");
    var Node = NodeBy.className("boo");
    Expect(found).toMatch(
      <section>
        <Node >
          <p id="body" className="boo">
            Body
            <span>Hello</span>
          </p>
        </Node>
      </section>
      );
  });
});
