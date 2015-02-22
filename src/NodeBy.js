/** @jsx React.DOM */

var React = require('react'),
  _ = require('lodash');

function make(test) {

  var NodeBy = React.createClass({
    __test: {
      findNode: test
    },
    displayName: 'NodeBy',
    render: function () {
      return <noscript>
        {this.props.children || false}
      </noscript>;
    }
  });

  return NodeBy;
};

module.exports = {
  id: function (id) {
    return make(function (node, sibling, siblings) {
      return _.find(siblings, function (sib) {
        return sib.props && sib.props.id === id;
      });
    })
  },
  className: function (className) {
    return make(function (node, sibling, siblings) {
      return _.find(siblings, function (sib) {
        return sib.props && sib.props.className === className;
      });
    })
  }
};
