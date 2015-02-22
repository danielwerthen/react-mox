/** @jsx React.DOM */

var React = require('react');

var Identity = React.createClass({
  __test: function () {
  },
  render: function () {
    return this.props.children || false;
  }
});

module.exports = Identity;
