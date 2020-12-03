export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path, state) {
        if (path.node.operator !== "===") {
          return;
        }
        path.node.left = t.identifier('left')
        path.node.right = t.identifier("right");
      }
    }
  }
}