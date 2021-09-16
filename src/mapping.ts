import { BigInt } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  RaffleClaimPrize,
  RaffleRandomNumber,
  RaffleStarted,
  RaffleTicketsEntered,
} from "../generated/RafflesContract/RafflesContract";
import { Entrant, Total, User } from "../generated/schema";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRaffleClaimPrize(event: RaffleClaimPrize): void {}

export function handleRaffleRandomNumber(event: RaffleRandomNumber): void {}

export function handleRaffleStarted(event: RaffleStarted): void {}

export function handleRaffleTicketsEntered(event: RaffleTicketsEntered): void {
  let ticketItems = event.params.ticketItems;
  let total = Total.load(event.params.raffleId.toString());
  if (total == null) {
    total = new Total(event.params.raffleId.toString());
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

    let entryID = event.params.entrant.toHexString() + "_" + event.block.timestamp.toString() + "_" + element.ticketId.toString();
    let entity = new Entrant(entryID);
    entity.entrant = event.params.entrant;
    entity.ticketId = element.ticketId;
    entity.ticketAddress = element.ticketAddress;
    entity.ticketQuantity = element.ticketQuantity;
    entity.save();

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
  }

  // Entities only exist after they have been saved to the store;

  // BigInt and BigDecimal math are supported
  //entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  // entity.previousOwner = event.params.previousOwner
  // entity.newOwner = event.params.newOwner

  // Entities can be written to the store with `.save()`
}
// export { runTests } from "./tests/test";