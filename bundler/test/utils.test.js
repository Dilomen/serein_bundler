const LRUCache = require('../utils/LRU')
const { LinkedQueue } = require('../utils/queue')
const {camlCase, camlCaseObj} = require('../utils/camlCase')
const assert = require('assert');
describe('LRU测试', function() {
  describe('#LRUCache()', function() {
    it('返回正确的字符串', function() {
      const lRUCache = new LRUCache()
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_dev')
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_feature')
      assert.strictEqual(lRUCache.toString(), "bundler_dev,bundler_master,bundler_feature")
    });
  });

  describe('#LRUCache()  延迟', function() {
    it('返回正确的字符串', function(done) {
      const lRUCache = new LRUCache()
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_dev')
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_feature')
      setTimeout(() => {
        lRUCache.append('bundler_dev')
      }, 200)
      setTimeout(() => {
        assert.strictEqual(lRUCache.toString(), "bundler_master,bundler_feature,bundler_dev")
      }, 300)
      done()
    });
  });

  describe('#LRUCache()  限制', function() {
    it('返回正确的字符串', function() {
      const lRUCache = new LRUCache(2)
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_dev')
      lRUCache.append('bundler_master')
      lRUCache.append('bundler_feature')
      lRUCache.append('bundler_dev')
      assert.strictEqual(lRUCache.toString(), "bundler_feature,bundler_dev")
    });
  });

  describe('#LRUCache()  监听方法', function() {
    it('执行监听的方法', function() {
      const lRUCache = new LRUCache()
      let sum = 0
      lRUCache.on('remove', () => { sum += 1 })
      lRUCache.on('remove', () => { sum += 1 })
      lRUCache.on('remove1', () => { sum += 1 })
      lRUCache.emit('remove')
      assert.strictEqual(sum, 2)
    });
  });
});


describe('LinkedQueue队列测试', function() {
  describe('#LinkedQueue() size', function() {
    it('长度', function() {
      const linkedQueue = new LinkedQueue()
      linkedQueue.enqueue({name: '4'})
      linkedQueue.enqueue({name: '5'})
      linkedQueue.enqueue({name: '6'})
      linkedQueue.enqueue({name: '7'})
      assert.strictEqual(linkedQueue.size(), 4)
    });
  });

  describe('#LinkedQueue() remove', function() {
    it('remove', function() {
      const linkedQueue = new LinkedQueue()
      linkedQueue.enqueue({name: '4'})
      linkedQueue.enqueue({name: '5'})
      linkedQueue.enqueue({name: '6'})
      linkedQueue.enqueue({name: '7'})
      assert.strictEqual(linkedQueue.remove('6').data.name, '6')
    });
  });

  describe('#LinkedQueue() dequeue', function() {
    it('dequeue', function() {
      const linkedQueue = new LinkedQueue()
      linkedQueue.enqueue({name: '4'})
      linkedQueue.enqueue({name: '5'})
      linkedQueue.enqueue({name: '6'})
      linkedQueue.enqueue({name: '7'})
      assert.strictEqual(linkedQueue.dequeue().data.name, '4')
    });
  });
});


describe('camlCase驼峰测试', function() {
  describe('#camlCase()', function() {
    it('camlCase', function() {
      assert.strictEqual(camlCase('_a_b_c'), 'aBC')
    });
  });

  describe('#camlCase()', function() {
    it('camlCase', function() {
      assert.strictEqual(camlCase('a_b_c'), 'aBC')
    });
  });


  describe('#camlCaseObj()', function() {
    it('camlCaseObj Object', function() {
      const obj = {
        a_b: 1,
        a_b_c: 2,
        _a_b_c_d: 3
      }
      assert.deepStrictEqual(camlCaseObj(obj), {aB: 1, aBC: 2, aBCD: 3})
    });
    it('camlCaseObj Array', function() {
      const arr = [
        {
          a_b: 1,
          a_b_c: 2,
          _a_b_c_d: 3
        }, 
        {
          a_b: 1,
          a_b_c: 2,
          _a_b_c_d: 3
        }
      ]
      assert.deepStrictEqual(camlCaseObj(arr), [{aB: 1, aBC: 2, aBCD: 3}, {aB: 1, aBC: 2, aBCD: 3}])
    });
  });
});
