import { Job } from "bullmq";
import { userHandler } from "./services/user";
import dayjs from 'dayjs'
import { userData, userToken } from "./models/collections";
import { utils } from "./lib/utils";
import { evmHandler } from "./lib/evm";
import * as lodash from 'lodash'
import { tronHandler } from "./lib/tron";
class Tasks {
    async updateBalance(job: Job) {
        try {
            const jobData: { userId: number } = job.data
            const user = await userHandler.getUser(jobData.userId)
            const elapse = dayjs().diff(user?.updatedAt, "seconds")
            if (elapse < 1) return
            userToken.find({ userId: { $eq: jobData.userId } })
                .cursor()
                .eachAsync(async function (token) {
                    if (utils.isEVM(token.chainId)) {
                        evmHandler.setNetwork(token.chainId)
                        const wallet = lodash.find(user?.wallets, function (e) { return e.type === "evm" })
                        if (!wallet) return
                        const tokenData = await evmHandler.getTokenBalance(wallet.address, token)
                        token.balance = tokenData.balance
                    } else {
                        console.log(token.chainId)
                        tronHandler.setNetwork(token.chainId)
                        const wallet = lodash.find(user?.wallets, function (e) { return e.type === "tron" })
                        if (!wallet) return
                        const tokenData = await tronHandler.getTokenBalance(wallet.address, token)
                        token.balance = tokenData.balance
                    }
                    await token.save()
                })
            await userData.updateOne({ userId: { $eq: jobData.userId } }, { updatedAt: Date.now() })
        } catch (e) {
            return
        }
    }
}
export const tasksHandler = new Tasks()