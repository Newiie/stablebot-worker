import { mnemonicToAccount } from "viem/accounts";
import type { IBroadcastTx, IChain, IUserToken, IWallet } from "../types";
import { Encryption } from "./encryption"
import { utils } from "./utils"
import { createPublicClient, createWalletClient, http, HttpTransport, PublicClient, publicActions, formatEther, parseUnits, formatUnits, hexToBigInt, stringToHex } from "viem";
import { mainnet, baseSepolia } from 'viem/chains'
import { ERC20_ABI } from './abi'
export class EVM extends Encryption {
    private chainData?: IChain
    private chains = {
        "1": mainnet,
        "84532": baseSepolia
    }
    private client: ReturnType<typeof createPublicClient>;
    constructor() {
        super()
        this.chainData = utils.getChain("1")
        this.client = createPublicClient({
            chain: this.chains['1'],
            transport: http(this.chainData?.rpc)
        })
    }
    setNetwork(chainId: string) {
        this.chainData = utils.getChain(chainId)
        //@ts-ignore
        this.client = createPublicClient({ chain: this.chains[chainId], transport: http(this.chainData?.rpc) })
    }
    createWallet(mnemonic: string): IWallet {
        const wallet = mnemonicToAccount(mnemonic)
        return {
            address: wallet.address,
            mnemonic: this.encrypt(mnemonic),
            type: "evm"
        }
    }
    recoverWallet(encMnemonic: string) {
        const mnemonic = this.decrypt(encMnemonic)
        const wallet = mnemonicToAccount(mnemonic)
        return {
            address: wallet.address,
            mnemonic: this.encrypt(mnemonic),
            type: "evm"
        }
    }
    async getTokenBalance(userAddress: string, token: IUserToken): Promise<IUserToken> {
        try {
            if (token.isNative) {
                const balanceInWei = await this.client.getBalance({ address: userAddress as `0x${string}` })
                const balance = parseFloat(formatEther(balanceInWei))
                return { ...token, balance }
            } else {
                const [balanceInWei] = await this.client.multicall({
                    allowFailure: true,
                    contracts: [
                        {
                            abi: ERC20_ABI,
                            address: token.address as any,
                            functionName: "balanceOf",
                            args: [userAddress as `0x${string}`]
                        }
                    ]
                });
                if (balanceInWei?.status === "failure") return token
                const balance = parseFloat(formatUnits(balanceInWei.result, token.decimals))
                return { ...token, balance }
            }
        } catch (e) {
            console.error(e)
            return token
        }
    }
    async trandferToken(token: IUserToken, userWallet: IWallet, amountInUnit: number): Promise<IBroadcastTx> {
        try {
            const account = mnemonicToAccount(this.decrypt(userWallet.mnemonic))
            const walletClient = createWalletClient({
                account: account,
                chain: this.client.chain,
                transport: http(this.chainData?.rpc)
            }).extend(publicActions)
            if (token.isNative) {

            }
            // @ts-ignore
            return { status: false, message: "Tx Failed" }
        } catch (e) {
            console.dir(e)
            // @ts-ignore
            return { status: false, message: "Tx Failed" }
        }
    }
}
export const evmHandler = new EVM()