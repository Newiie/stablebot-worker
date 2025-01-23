import { Bot } from 'grammy'
import { parseMode } from '@grammyjs/parse-mode'
import { envconfig } from './config';
const bot = new Bot(envconfig.BOT_TOKEN, {
    client: {
        apiRoot: envconfig.TELEGRAM_API_SERVER,
    }
})
bot.api.config.use(parseMode("HTML"));
export { bot }