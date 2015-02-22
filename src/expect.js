var React = require('react/addons'),
  _ = require('lodash'),
  TestUtils = React.addons.TestUtils;


module.exports = function (component) {
  var instMap = {};

  function makeIndex(node, root) {
    return component._rootNodeID + node._rootNodeID.substr(root._rootNodeID.length);
  }

  function getPropKeys(node) {
    var omit = _.isString(node.props.children) ? [] : [ 'children' ];
    return _(_.keys(node.props))
      .filter(function (key) {
        return omit.indexOf(key) < 0;
      }).value();
  }

  TestUtils.findAllInRenderedTree(component, function (element) {
    if (element === component) {
      return; //Ignore the root node
    }
    instMap[makeIndex(element, component)] = element;
  });

  function getTestContext(node) {
    if (TestUtils.isCompositeComponent(node)) {
      return node._renderedComponent && 
        node._renderedComponent._owner &&
        node._renderedComponent._owner.__test;
    } else if (TestUtils.isDOMComponent(node)) {
      return node._owner && node._owner.__test;
    }
  }

  function matchCompositeComponent(mock) {
    function compare(node, index) {
      var wth = instMap[index],
        testContext = getTestContext(node);

      if (node._owner && _.isFunction(node._owner.__test)) {
        return node._owner.__test(node, wth, getSiblings(index));
      }

      it("should find a matching node", function () {
        expect(wth).toBeDefined();
        if (!testContext || testContext.checkTag) {
          expect(wth.tagName).toEqual(node.tagName);
        }
      });
      if (!testContext || testContext.checkProps) {
        _.map(getPropKeys(node), function (key) {
          it("should find a matching property [" + key + "]", function () {
            expect(wth.props[key]).toEqual(node.props[key]);
          });
        });
      }
    }

    TestUtils.findAllInRenderedTree(mock, function (test) {
      if (mock === test) {
        return; //Ignore the root node
      }
      var index = makeIndex(test, mock);
      describe("Matching node " + (test._tag || "unnamned") + " at " + index, function () {
        compare(test, index);
      });
    });
  }

  function toMatch(mock) {
    if (TestUtils.isCompositeComponent(mock)) {
      matchCompositeComponent(mock);
    } else {
      var renderedMock = TestUtils.renderIntoDocument(mock);
      matchCompositeComponent(renderedMock);
    }
  }

  return {
    toMatch: toMatch
  };
};
