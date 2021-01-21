
const { dBUtils, BUILD_TYPE } = require('../../utils')
class StatisticsService {
  constructor(ctx) {
    this._ctx = ctx
  }

  async searchSummation () {
    const searchSql = `
    SELECT
      DATE_FORMAT( create_time, '%Y%m' ) months,
      build_status as status,
      count( * ) as total
    FROM
      bundler_info 
    WHERE
      DATE_FORMAT( create_time, '%Y%m' ) >= DATE_FORMAT( (CURDATE( ) - INTERVAL 6 MONTH),'%Y%m' ) 
    GROUP BY
      months,
      build_status
      ORDER BY
        months
      ASC`
    let results = await dBUtils.search(searchSql)
    const nameMap = {
      [BUILD_TYPE.BUILD_FAIL]: 'fail',
      [BUILD_TYPE.BUILD_SUCCESS]: 'success',
      [BUILD_TYPE.BUILD_CANCEL]: 'cancel'
    }
    results = results.reduce((obj, item) => {
      if (!obj[item.months]) obj[item.months] = { fail: 0, success: 0, cancel: 0 }
      obj[item.months][nameMap[item.status]] = item.total
      return obj
    }, {})
    return results
  }

  async searchPersonSummation(person) {
    const searchSql = `
    SELECT
      DATE_FORMAT( create_time, '%Y%m' ) months,
      count( * ) as total
    FROM
      bundler_info 
    WHERE
      DATE_FORMAT( create_time, '%Y%m' ) >= DATE_FORMAT( (CURDATE( ) - INTERVAL 12 MONTH),'%Y%m' )
    AND
      pusher='${person}'
    GROUP BY
      months`
    let results = await dBUtils.search(searchSql)
    results = results.reduce((obj, item) => {
      obj[item.months] = item.total
      return obj
    }, {})
    return results
  }
}

module.exports = StatisticsService