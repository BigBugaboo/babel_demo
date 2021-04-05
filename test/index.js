import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFromAst, transformFileSync, transform } from '@babel/core';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types'
import * as babylon from 'babylon';
import trim from './helpers/trim.js'

describe('测试用例目录', () => {
  const fixturesDir = path.join(path.resolve(), 'test', 'fixtures');
    before(() => {
      console.log(`---开始读取测试用例文件夹 - ${fixturesDir}`)
    })
    after(() => {
      console.log(`---结束读取测试用例文件夹 - ${fixturesDir}`)
    })
  fs.readdirSync(fixturesDir).map((caseName) => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualPath = path.join(fixtureDir, 'actual.js');

    beforeEach(function(){
      console.log(`-----测试用例 - ${fixtureDir}`);
    })

    it(`should ${caseName.split('-').join(' ')}`, () => {
      const actual = transformFileSync(actualPath).code;
      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();
      assert.equal(trim(actual), trim(expected));
    })
  });
});

describe('独立测试用例', () => {
  describe('babel 转换操作', () => {
    context('添加兄弟节点', () => {
      it('insertBefore', () => {
        const code = 'var a;'
        const rightResult = `var b;\nvar a;`
        const ast = parser.parse(code)
        traverse(ast, {
          enter(path) {
            if (t.isVariableDeclaration(path.node)) {
              const node = t.variableDeclaration('var', [t.variableDeclarator(t.identifier('b'))])
              path.insertBefore(node)
              path.stop()
            }
          }
        });
        const result = transformFromAst(ast).code
        assert.equal(result, rightResult)
      })
      it('insertAfter', () => {
        const code = 'var a;'
        const rightResult = `var a;\nvar b;`
        const ast = parser.parse(code)
        traverse(ast, {
          enter(path) {
            if (t.isVariableDeclaration(path.node)) {
              const node = t.variableDeclaration('var', [t.variableDeclarator(t.identifier('b'))])
              path.insertAfter(node)
              path.stop() // 注意要加 stop 方法，因为在你添加一样的节点后，节点遍历会进入新的节点，如果没加stop，会导致死循环。
            }
          }
        });
        const result = transformFromAst(ast).code
        assert.equal(result, rightResult)
      })
    })
  })
})
