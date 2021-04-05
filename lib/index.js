"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(_ref) {
  var t = _ref.types;
  return {
    visitor: {
      BinaryExpression: function BinaryExpression(path, state) {
        if (path.node.operator !== "===") {
          return;
        }

        path.node.left = t.identifier('left');
        path.node.right = t.identifier("right");
      }
    }
  };
}