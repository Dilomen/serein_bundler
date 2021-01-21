const StatisticsService = require('../service/statistics')

class StatisticsController {
  constructor(ctx) {
    this._ctx = ctx
  }

  /**
   * 统计
   */
  async searchSummation () {
    const statisticsService = new StatisticsService()
    const result = await statisticsService.searchSummation()
    this._ctx.body = result ? { code: 1, data: result } : { code: 0, data: [] }
  }

   /**
   * 个人统计
   */
  async searchPersonSummation () {
    const person = this._ctx.request.query.person
    if (!person) { this._ctx.body = { code: 0, data: {}, message: '没有接受到对应的人员信息' }; return }
    const statisticsService = new StatisticsService()
    const result = await statisticsService.searchPersonSummation(person)
    this._ctx.body = result ? { code: 1, data: result } : { code: 0, data: {} }
  }
}

module.exports = StatisticsController