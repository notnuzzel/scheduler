
import prisma from '@notnuzzel/prisma'
import crawl from '@notnuzzel/crawl'

const isString = (value) => {
	return typeof value === 'string' || value instanceof String
}

export const findAccount = async (id) => {
  const id = isString(id) ? parseInt(id) : id
  const account = await prisma.account.findUnique({ where: { id } })
  if (!account) throw new Error("account not found")
  return account
}

export const findAccounts = async (cursor, skip = 0) => { // when skip is 1, skips cursor to prevent loop
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

export const crawlAccount = async (account) => {
  const lastCrawl = await prisma.crawl.findFirst({ 
    where: { accountId: account.id } 
  })
  return await crawl.timeline({
    accountId: account.id,
    userId: account.userId,
    twitterUserId: account.providerAccountId,
    accessToken: account.accessToken,
    accessTokenSecret: account.refreshToken,
    tweetCursor: lastCrawl.tweetId
  })
}

export const recursiveCrawlAccounts = async (cursor, skip) => {
  const { accounts, next } = await findAccounts(cursor, skip)
  for (const account of accounts) await crawlAccount(account)
  if (accounts.length !== 0) await recursiveCrawlAccounts(next, 1) // recurse
}