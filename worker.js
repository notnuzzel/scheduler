
import { CronJob } from 'cron'
import { recursiveCrawlAccounts } from './src/crawl'

const onComplete = null, timezone = null, context = null
const start = true, runOnInit = true

new CronJob('*/5  * * * *', async () => { // 5 mins
  await recursiveCrawlAccounts()
}, onComplete, start, timezone, context, runOnInit)