const {Telegraf} = require('telegraf')
const Parser = require('rss-parser')
require('dotenv').config()

const BOT_TOKEN = process.env.TOKEN
const CHANNEL_ID = process.env.CHAT_ID
const FEED_URL = 'https://feeds.bbci.co.uk/sport/football/rss.xml'

const bot = new Telegraf(BOT_TOKEN)
const parser = new Parser()

bot.start((ctx) => {
  ctx.reply('Hello! I will post the latest BBC sports news to your channel.')
})

let latestNews = null;

setInterval(async (next) => {
  try {
    const feed = await parser.parseURL(FEED_URL)
    
    if(!feed){
      return new Error("No feed is fetched...")
    }

    const latestItem = feed.items[0]

    if(!latestNews || latestNews.link !== latestItem.link) {
      latestNews = latestItem;
      const message = `${latestItem.title}\n${latestItem.link}`
      console.log('message:', message)
      await bot.telegram.sendMessage(CHANNEL_ID, message)
    }
    else return
  } catch (error) {
    next(error)
  }
}, 60000) // fetch every minute

bot.launch()
