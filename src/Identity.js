/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({
  render: function () {
    return this.props.children;
  }
});

module.exports = Component;
