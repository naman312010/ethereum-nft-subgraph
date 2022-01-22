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

export function handleTransferBatch(event: TransferBatch): void {
  let erc1155 = ERC1155.bind(event.address);
  for (let index = 0; index < event.params.ids.length;index++) {
    let tkid = event.address.toHexString() + "_" + event.params.ids[index].toString()
    let token = Token.load(tkid)
    if (token == null) {
      token = new Token(tkid)
      token.creator = event.params.to
      token.type = "ERC1155"
      token.totalcopies = event.params.values[index]
      let callUriResult = erc1155.try_uri(event.params.ids[index])
      if (!callUriResult.reverted)
        token.uri = callUriResult.value
      token.save()

      let balance = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
      balance.owner = event.params.to
      balance.token = token.id
      balance.amount = token.totalcopies
      balance.save()
    }

    else {
      let user1 = TokenBalance.load(event.params.from.toHexString() + "_" + tkid)
      if (user1) {
        let user2 = TokenBalance.load(event.params.to.toHexString() + "_" + tkid)
        if (user2 == null) {
          user2 = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
          user2.owner = event.params.to
          user2.token = tkid
          user2.amount = event.params.values[index]
        }
        else
          user2.amount = user2.amount.plus(event.params.values[index])
        user1.amount = user2.amount.minus(event.params.values[index])
        user1.save()
        user2.save()
      }
    }
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  let erc1155 = ERC1155.bind(event.address)
  let tkid = event.address.toHexString() + "_" + event.params.id.toString()
  let token = Token.load(tkid)
  if (token == null) {
    token = new Token(tkid)
    token.creator = event.params.to
    token.type = "ERC1155"
    token.totalcopies = event.params.value
    let callUriResult = erc1155.try_uri(event.params.id)
    if (!callUriResult.reverted)
      token.uri = callUriResult.value
    token.save()

    let balance = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
    balance.owner = event.params.to
    balance.token = token.id
    balance.amount = token.totalcopies
    balance.save()
  }

  else {
    let user1 = TokenBalance.load(event.params.from.toHexString() + "_" + tkid)
    if (user1) {
      let user2 = TokenBalance.load(event.params.to.toHexString() + "_" + tkid)
      if (user2 == null) {
        user2 = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
        user2.owner = event.params.to
        user2.token = tkid
        user2.amount = event.params.value
      }
      else
        user2.amount = user2.amount.plus(event.params.value)
      user1.amount = user2.amount.minus(event.params.value)
      user1.save()
      user2.save()
    }
  }
}

export function handleURI(event: URI): void {
  let token = Token.load(event.address.toHexString() + "_" + event.params.id.toString())
  if (token) {
    token.uri = event.params.value
    token.save()
  }
}

export function handleTransfer(event: Transfer): void {
  let erc721 = ERC721.bind(event.address)
  let tkid = event.address.toHexString() + "_" + event.params.tokenId.toString()
  let token = Token.load(tkid)
  if (token == null) {
    token = new Token(tkid)
    token.creator = event.params.to
    token.type = "ERC721"
    token.totalcopies = BigInt.fromI32(1)
    let callUriResult = erc721.try_tokenURI(event.params.tokenId)
    if (!callUriResult.reverted)
      token.uri = callUriResult.value
    token.save()

    let balance = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
    balance.owner = event.params.to
    balance.token = token.id
    balance.amount = token.totalcopies
    balance.save()
  }

  else {
    let user1 = TokenBalance.load(event.params.from.toHexString() + "_" + tkid)
    if (user1) {
      let user2 = TokenBalance.load(event.params.to.toHexString() + "_" + tkid)
      if (user2 == null) {
        user2 = new TokenBalance(event.params.to.toHexString() + "_" + tkid)
        user2.owner = event.params.to
        user2.token = tkid
        user2.amount = BigInt.fromI32(1)
      }
      else
        user2.amount = BigInt.fromI32(1)
      user1.amount = BigInt.fromI32(0)
      user1.save()
      user2.save()
    }
  }
}
