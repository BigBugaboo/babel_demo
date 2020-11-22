import *  as babylon from "babylon"
import traverse from "babel-traverse"
import * as t from "babel-types";

const code = `function square(n) {
  return n * n
}`

const ast = babylon.parse(code)

traverse.default(ast, {
  enter(path) {
    if (t.default.isIdentifier(path.node, { name: 'n' })) {
      path.node.name = "x"
    }
  }
})
console.log(ast)