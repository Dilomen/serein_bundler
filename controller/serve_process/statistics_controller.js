const StatisticsService = require('../../service/serve_process/statistics_service')

class StatisticsController {
  constructor(ctx) {
    this._ctx = ctx
  }

  async searchSummation () {
    const statisticsService = new StatisticsService(this._ctx.request.query)
    const result = await statisticsService.searchSummation()
    this._ctx.body = { code: 1, data: result }
  }
}

module.exports = StatisticsController