import { TronWeb } from 'tronweb'
import type { IBroadcastTx, IChain, IUserToken, IWallet } from '../types'
import { Encryption } from "./encryption"
import { utils } from './utils'
export class Tron extends Encryption {
    private tronweb: TronWeb
    private chainData?: IChain
    constructor() {
        super()
        this.chainData = utils.getChain("tron")
        this.tronweb = new TronWeb({ fullHost: this.chainData?.rpc })
    }
    setNetwork(chainId: string) {
        this.chainData = utils.getChain(chainId)
        this.tronweb = new TronWeb({ fullHost: this.chainData?.rpc })
    }
    createWallet(mnemonic: string): IWallet {
        const wallet = TronWeb.fromMnemonic(mnemonic)
        return {
            address: wallet.address,
            mnemonic: this.encrypt(mnemonic),
            type: "tron"
        }
    }
    private recoverWallet(encMnemonic: string) {
        const mnemonic = this.decrypt(encMnemonic)
        const wallet = TronWeb.fromMnemonic(mnemonic)
        return {
            address: wallet.address,
            mnemonic: this.encrypt(mnemonic),
            type: "tron"
        }
    }
    async getTokenBalance(userAddress: string, token: IUserToken): Promise<IUserToken> {
        try {
            if (token.isNative) {
                //@ts-ignore
                const balanceInWei = await this.tronweb.trx.getBalance(userAddress)
                const balance = parseFloat(this.tronweb.fromSun(balanceInWei).toString())
                return { ...token, balance }
            } else {
                return token
            }
        } catch (e) {
            console.error(e)
            return token
        }
    }
    async transferToken(token: IUserToken, wallet: IWallet): Promise<IBroadcastTx> {
        try {
            // @ts-ignore
            return { status: false, message: "Tx Failed" }
        } catch (e) {
            console.dir(e)
            // @ts-ignore
            return { status: false, message: "Tx Failed" }
        }
    }
}
export const tronHandler = new Tron()