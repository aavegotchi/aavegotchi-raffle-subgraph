import { Item, Raffle, RaffleTicketPool, Total, User } from "../generated/schema";
import { BIGINT_ZERO } from "./constants";

export function getOrCreateRaffle(id: string): Raffle {
    let raffle = Raffle.load(id);
    if(raffle == null) {
        raffle = new Raffle(id);
        let stats = getOrCreateStats(id + "-raffle-stats");
        stats.save();
        raffle.stats = stats.id;
    }

    return raffle;
}

export function getOrCreateUser(address: string): User {
    let user = User.load(address);
    if(user == null) {
        user = new User(address);
        user.totalCommon = BIGINT_ZERO;
        user.totalUncommon = BIGINT_ZERO;
        user.totalRare = BIGINT_ZERO;
        user.totalLegendary = BIGINT_ZERO;
        user.totalMythical = BIGINT_ZERO;
        user.totalGodLike = BIGINT_ZERO;
        user.totalDrop = BIGINT_ZERO;
    }

    return user as User;

}

export function getOrCreateStats(id:string): Total {
    let stats = Total.load(id);
    if(stats == null) {
        stats = new Total(id);
        stats.totalCommon = BIGINT_ZERO;
        stats.totalDrop = BIGINT_ZERO;
        stats.totalGodLike = BIGINT_ZERO;
        stats.totalLegendary = BIGINT_ZERO;
        stats.totalMythical = BIGINT_ZERO;
        stats.totalRare = BIGINT_ZERO;
        stats.totalUncommon = BIGINT_ZERO;
    }

    return stats;
}

export function getOrCreateItem(id:string): Item {
    let item = Item.load(id);
    if(item == null) {
        item = new Item(id);
        item.quantity = BIGINT_ZERO;
    }
    return item as Item;
}

export function getOrCreateRaffleTicketPool(id: string, raffle: Raffle): RaffleTicketPool {
    let pool = RaffleTicketPool.load(id);
    if(pool == null) {
        pool = new RaffleTicketPool(id);
        pool.raffle = raffle.id;
    }
    return pool;
}