/** @jsx React.DOM */

var React = require('react');

var Any = React.createClass({
  __test: {
    ignoreTag: true
  },
  render: function () {
    return <div>
      {this.props.children || false}
    </div>;
  }
});

module.exports = Any;
