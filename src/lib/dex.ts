import { ITokenInfo } from "../types";
import { envconfig } from "./config";
import queryString from 'node:querystring'
class Dex {
    private headers = {
        "x-dex-api-key": envconfig.DEX_API_KEY
    }
    private endpoint = envconfig.DEX_ENDPOINT

    async getTokenInfo(chainId: string, tokenAddress: string): Promise<ITokenInfo & { status: boolean }> {
        try {
            const query = queryString.stringify({ chainId, address: tokenAddress })
            //@ts-ignore
            const res = await fetch(new URL(`${this.endpoint}/api/token?${query}`), {
                headers: this.headers
            }).then(e => e.json())
            return res
        } catch (e) {
            //@ts-ignore
            return { status: false }
        }
    }
}
export const dexHandler = new Dex()