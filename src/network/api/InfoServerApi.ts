import type { GetInfoResponse } from "@/network/dtos/InfoServerDtos";
import axios from "axios";
import type {
  TokenMeta,
  Metadata,
  StrategyInfo,
} from "@/network/models/InfoServerModels";
import Big from "big.js";

class InfoServerApi {
  constructor() {
    // TODO
  }

  getInfo = async (): Promise<{
    strategies: StrategyInfo[];
    tokens: TokenMeta[];
    metadata: Metadata;
  }> =>
    await axios
      .get<GetInfoResponse>(`${import.meta.env.VITE_INFO_SERVER_HOST}/info`)
      .then((response) => response.data)
      .then((data) => this.mapInfoResponse(data));

  private mapInfoResponse(data: GetInfoResponse) {
    return {
      metadata: data.metadata,
      strategies: data.strategies.map((strategy) => ({
        ...strategy,
        depositTokens: strategy.depositTokens.map((token) => ({
          ...token,
          price: new Big(token.price),
        })),
        apr: new Big(strategy.apr),
        tvl: new Big(strategy.tvl),
        osc: new Big(strategy.osc),
      })),
      tokens: data.tokens,
    };
  }
}

export const infoServerApi = new InfoServerApi();
