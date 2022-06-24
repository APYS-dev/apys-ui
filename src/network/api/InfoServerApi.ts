import type { GetInfoResponseDto } from "@/network/dtos/InfoServerDtos";
import axios from "axios";
import type { GetInfoResponse } from "@/network/models/InfoServerModels";
import Big from "big.js";

class InfoServerApi {
  constructor() {
    // TODO
  }

  getInfo = async (): Promise<GetInfoResponse> =>
    await axios
      .get<GetInfoResponseDto>(`${import.meta.env.VITE_INFO_SERVER_HOST}/info`)
      .then((response) => response.data)
      .then((data) => this.mapInfoResponse(data));

  private mapInfoResponse(data: GetInfoResponseDto): GetInfoResponse {
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
