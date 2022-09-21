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
      .get<GetInfoResponseDto>(`${import.meta.env.VITE_INFO_SERVER_HOST}`)
      .then((response) => response.data)
      .then((data) => this.mapInfoResponse(data));

  private mapInfoResponse(data: GetInfoResponseDto): GetInfoResponse {
    return {
      metadata: data.metadata,
      vaults: data.strategies.map((vault) => ({
        ...vault,
        depositTokens: vault.depositTokens.map((token) => ({
          ...token,
          price: Big(token.price),
        })),
        apr: Big(vault.apr),
        tvl: Big(vault.tvl),
        osc: Big(vault.osc),
        bonusApr: Big(vault.bonusApr),
        category: vault.category,
      })),
      tokens: data.tokens,
    };
  }
}

export const infoServerApi = new InfoServerApi();
