
import { crawlAccount, findAccount } from '../src/'

const pushCrawl = async () => {
  const account = await findAccount(process.env.ACCOUNT_ID)
  await crawlAccount(account)
  console.log(`queued crawl for account ${account.id}`)
}

const main = async () => {
  try { await pushCrawl() } 
  catch(e) { console.error(e) }
  process.exit()
}

main()