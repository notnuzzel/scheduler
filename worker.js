
import prisma from '@notnuzzel/prisma'
import crawl from '@notnuzzel/crawl'
import { CronJob } from 'cron'

const findAccounts = async (cursor, skip = 0) => { // when skip is 1, skips cursor to prevent loop
  const accounts = await prisma.account.findMany({
    where: { providerId: 'twitter' },
    orderBy: { id: 'asc' },
    skip,
    cursor
  })
  const lastID = accounts.length > 0 ? accounts[accounts.length-1].id : undefined
  const next = { id: lastID }
  return { next, accounts }
}

const recursiveJobEnqueue = async (cursor, skip) => {
  const { accounts, next } = await findAccounts(cursor, skip)
  for (const account of accounts) {
    const lastCrawl = await prisma.crawl.findOne({ where: { accountId: account.id } })
    await crawl({
      accountId: account.id,
      userId: account.userId,
      twitterUserId: account.providerAccountId,
      accessToken: account.accessToken,
      accessTokenSecret: account.refreshToken,
      tweetCursor: lastCrawl.tweetId
    })
  }
  if (accounts.length !== 0) await recursiveJobEnqueue(next, 1) // recurse
}

const onComplete = null, timezone = null, context = null
const start = true, runOnInit = true

new CronJob('*/5  * * * *', async () => { // 5 mins
  await recursiveJobEnqueue()
}, onComplete, start, timezone, context, runOnInit)