/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({
  render: function () {
    return <div>
      <h1>Header</h1>
      <span>img</span>
      <p>Test in bundles</p>
      <hr />
    </div>;
  }
});

module.exports = Component;
