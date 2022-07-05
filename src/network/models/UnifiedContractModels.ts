import type Big from "big.js";

export interface StorageBalanceResponse {
  total: Big;
  available: Big;
}
