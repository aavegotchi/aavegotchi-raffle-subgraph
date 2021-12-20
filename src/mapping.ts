import { BigInt } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  RaffleClaimPrize,
  RaffleRandomNumber,
  RaffleStarted,
  RaffleTicketsEntered,
} from "../generated/RafflesContract/RafflesContract";
import { Entrant, Item, RaffleEntrant, RaffleUser, RaffleWinner, Total, User } from "../generated/schema";
import { getOrCreateItem, getOrCreateRaffle, getOrCreateRaffleTicketPool, getOrCreateUser } from "./helper";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

/**
 * RaffleWinner
 * @param event 
 */
export function handleRaffleClaimPrize(event: RaffleClaimPrize): void {
  let raffle = getOrCreateRaffle(event.params.raffleId);
  let user = getOrCreateUser(event.transaction.from.toHexString())
  let item = getOrCreateItem(raffle.id + "-" + event.params.prizeId.toString());
  let winnerId = item.pool + "-" + item.id + "-" + user.id;
  let winner = new RaffleWinner(winnerId);
  winner.quantity = event.params.prizeQuantity;
  winner.item = item.id;
  winner.raffle = raffle.id;
  winner.pool = item.pool;
  winner.raffleUser = item.pool + "-" + event.transaction.from.toHexString();
  winner.address =  event.transaction.from.toHexString();
  winner.save();
}

export function handleRaffleRandomNumber(event: RaffleRandomNumber): void {}


/**
 * Raffle
 * RafflePools
 * RafflePoolPrizes
 * @param event 
 */
export function handleRaffleStarted(event: RaffleStarted): void {
  let raffle = getOrCreateRaffle(event.params.raffleId);
  raffle.save();
  for(let i=0; i<event.params.raffleItems.length; i++) {
    let items = event.params.raffleItems[i];

    let poolId = raffle.id + "-pool-" + items.ticketId.toString();
    let pool = getOrCreateRaffleTicketPool(poolId, raffle)
    pool.ticketId = items.ticketId;
    pool.save();

    for(let j=0; j<items.raffleItemPrizes.length; j++) {
      let data =  items.raffleItemPrizes[j];
      let item = new Item(raffle.id + "-" + data.prizeId.toString());
      item.pool = poolId;
      item.quantity = data.prizeQuantity;
      item.address = data.prizeAddress.toHexString();
      item.save();
    }
  }
  
}

/**
 * Entrants
 * @param event 
 */
export function handleRaffleTicketsEntered(event: RaffleTicketsEntered): void {
  let ticketItems = event.params.ticketItems;

  let total = Total.load(event.params.raffleId.toString() + "-raffle-stats");
  if (total == null) {
    total = new Total(event.params.raffleId.toString() + "-raffle-stats");
    total.totalCommon = BigInt.fromI32(0);
    total.totalUncommon = BigInt.fromI32(0);
    total.totalRare = BigInt.fromI32(0);
    total.totalLegendary = BigInt.fromI32(0);
    total.totalMythical = BigInt.fromI32(0);
    total.totalGodLike = BigInt.fromI32(0);
    total.totalDrop = BigInt.fromI32(0);
  }

  for (let index = 0; index < ticketItems.length; index++) {
    let element = ticketItems[index];

    let entity = Entrant.load(event.transaction.from.toHex());

    // `null` checks allow to create entities on demand
    if (entity == null) {
      let entryID =
        event.params.entrant.toHexString() +
        "_" +
        event.block.timestamp.toString();
      entity = new Entrant(entryID);
      entity.entrant = event.params.entrant;
      entity.ticketId = element.ticketId;
      entity.ticketAddress = element.ticketAddress;
      entity.ticketQuantity = element.ticketQuantity;
      entity.save();
    }

    if (entity.ticketId.equals(BigInt.fromI32(0))) {
      total.totalCommon = total.totalCommon.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(1))) {
      total.totalUncommon = total.totalUncommon.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(2))) {
      total.totalRare = total.totalRare.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(3))) {
      total.totalLegendary = total.totalLegendary.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(4))) {
      total.totalMythical = total.totalMythical.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(5))) {
      total.totalGodLike = total.totalGodLike.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(6))) {
      total.totalDrop = total.totalDrop.plus(element.ticketQuantity);
    }

    total.save();

    //Add user now
    let user = User.load(event.params.entrant.toHexString());
    if (user == null) {
      user = new User(event.params.entrant.toHexString());
      user.totalCommon = BigInt.fromI32(0);
      user.totalUncommon = BigInt.fromI32(0);
      user.totalRare = BigInt.fromI32(0);
      user.totalLegendary = BigInt.fromI32(0);
      user.totalMythical = BigInt.fromI32(0);
      user.totalGodLike = BigInt.fromI32(0);
      user.totalDrop = BigInt.fromI32(0);
    }

    if (entity.ticketId.equals(BigInt.fromI32(0))) {
      user.totalCommon = user.totalCommon.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(1))) {
      user.totalUncommon = user.totalUncommon.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(2))) {
      user.totalRare = user.totalRare.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(3))) {
      user.totalLegendary = user.totalLegendary.plus(element.ticketQuantity);
    }

    if (entity.ticketId.equals(BigInt.fromI32(4))) {
      user.totalMythical = user.totalMythical.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(5))) {
      user.totalGodLike = user.totalGodLike.plus(element.ticketQuantity);
    }
    if (entity.ticketId.equals(BigInt.fromI32(6))) {
      user.totalDrop = user.totalDrop.plus(element.ticketQuantity);
    }

    user.save();

    let poolId = event.params.raffleId.toString() + "-pool-" + entity.ticketId.toString();
    let raffle = getOrCreateRaffle(event.params.raffleId)
    let pool = getOrCreateRaffleTicketPool(poolId, raffle)
    let entrantId = poolId + "-" + event.block.timestamp.toString();

    let raffleEntrant = new RaffleEntrant(entrantId);
    raffleEntrant.user = user.id;
    raffleEntrant.raffle = raffle.id;
    raffleEntrant.pool = pool.id;
    raffleEntrant.address = event.transaction.from.toHexString();
    raffleEntrant.ticketId = entity.ticketId;
    raffleEntrant.quantity = entity.ticketQuantity;
    raffleEntrant.save();
    
    let raffleUserId = poolId + "-" + event.transaction.from.toHexString();
    let raffleUser = RaffleUser.load(raffleUserId);
    if(raffleUser == null) {
      raffleUser = new RaffleUser(raffleUserId);
      raffleUser.user = user.id;
      raffleUser.raffle = raffle.id;
      raffleUser.pool = pool.id;
      raffleUser.address = event.transaction.from.toHexString();
      raffleUser.ticketId = entity.ticketId;
      raffleUser.quantity = entity.ticketQuantity;
      raffleUser.save();
    } else {
      let quantity = raffleUser.quantity
      raffleUser.quantity = quantity.plus(entity.ticketQuantity);
    }
  }
  

}
