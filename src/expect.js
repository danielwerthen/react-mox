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

  function getParentIndex(index) {
    var spl = index.split('.');
    return _.take(spl, spl.length -1).join('.');
  }

  function getSiblings(index) {
    var prIdx = getParentIndex(index);
    return _(_.keys(instMap))
      .filter(function (key) {
        return prIdx === getParentIndex(key);
      })
      .map(function (key) {
        return instMap[key];
      })
      .value();
  }

  function matchCompositeComponent(mock) {
    function compare(node, index) {
      var wth = instMap[index],
        testContext = getTestContext(node);


      it("should find a matching node", function () {
        expect(wth).toBeDefined();
      });

      if (!wth) {
        return;
      }

      it("should find a matching node with proper tagname", function () {
        if (!testContext || !testContext.ignoreTag) {
          expect(wth.tagName).toEqual(node.tagName);
        }
      });
      _.map(getPropKeys(node), function (key) {
        it("should find a matching property [" + key + "]", function () {
          expect(wth.props[key]).toEqual(node.props[key]);
        });
      });
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

  function compareNodes(alpha, beta, tc) {
    if (!(tc && tc.ignoreTag)) {
      it("should find a matching node with proper tagname", function () {
        expect(alpha.tagName).toEqual(beta.tagName);
      });
    } 
    _.map(getPropKeys(beta), function (key) {
      it("should find a matching property [" + key + "]", function () {
        expect(alpha.props[key]).toEqual(beta.props[key]);
      });
    });
  }

  function toMatch(mock) {
    if (!TestUtils.isCompositeComponent(mock) && !TestUtils.isDOMComponent(mock)) {
      var mock = TestUtils.renderIntoDocument(mock);
    }
    traverse(component, mock, [ component ]);

    function traverse(alpha, beta, alphas) {
      if (!beta) {
        return;
      }
      var testContext = getTestContext(beta);

      if (testContext && testContext.findNode) {
        alpha = testContext.findNode(beta, alpha, alphas);
        it("should locate node with NodeBy", function () {
          expect(alpha).toBeDefined();
        });
        if (!alpha) {
          return;
        }
        beta = beta._renderedComponent;
        _.map(beta._renderedChildren, function (child) {
          traverse(alpha, child, alphas);
        });
        return;
      } 
      var index = makeIndex(beta, mock);
      if (TestUtils.isDOMComponent(beta)) {

        compareNodes(alpha, beta, testContext);
        var betas = beta._renderedChildren;

        _.map(betas, function (child, idx) {
          if (TestUtils.isCompositeComponent(alpha)) {
            var item = alpha._renderedComponent;
            traverse(item, child, [item]);
          } else {
            traverse(alpha._renderedChildren[idx], child, alpha._renderedChildren);
          }
        });
      } else if (TestUtils.isCompositeComponent(beta)) {
        var al = alpha._renderedComponent || alpha;
        traverse(al, beta._renderedComponent, [ al ]);
      }
    }
  }

  return {
    toMatch: toMatch
  };
};
