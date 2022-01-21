import { BigInt } from "@graphprotocol/graph-ts"
import {
  ERC1155,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/ERC1155/ERC1155"
import {
  ERC721,
  Transfer
} from "../generated/ERC721/ERC721"
import { Token, TokenBalance } from "../generated/schema"

export function handleTransferBatch(event: TransferBatch): void {}

export function handleTransferSingle(event: TransferSingle): void {}

export function handleURI(event: URI): void {}

export function handleTransfer(event: Transfer): void{
  let tkid = event.address.toHexString() + "_" + event.params.tokenId.toString()
  let token = Token.load(tkid)
  if(!token){
    
  }
}
