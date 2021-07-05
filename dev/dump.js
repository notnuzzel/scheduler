
const purgeQueues = async () => {
  // implement queue purge
  console.log(`purged queues`)
}

const main = async () => {
  try { await purgeQueues() } 
  catch(e) { console.error(e) }
  process.exit()
}

main()