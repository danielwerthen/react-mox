jest.dontMock('../expect');
var React = require('react/addons'),
  TestUtils = React.addons.TestUtils,
  Expect = require('../expect'),
  Any = require('../Any');

describe('Any tags', function () {
  describe('should be valid against any tag', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <section>
            <h1>Header</h1>
            <p>Body</p>
          </section>
        </div>
      </div>);

    var found = TestUtils.findRenderedDOMComponentWithTag(glob, "section");
    Expect(found).toMatch(
      <section>
        <Any />
        <p>Body</p>
      </section>
      );
  });
  describe('should be valid against any tree', function () {
    var glob = TestUtils.renderIntoDocument(<div>
        <div>
          <section>
            <div className="con">
              <img src="hello"/>
              <img />
              <img />
            </div>
            <p>Body</p>
          </section>
        </div>
      </div>);

    var found = TestUtils.findRenderedDOMComponentWithTag(glob, "section");
    Expect(found).toMatch(
      <section>
        <Any >
          <img src="hello"/>
          <img />
          <img />
        </Any>
        <p>Body</p>
      </section>
      );
  });
});
