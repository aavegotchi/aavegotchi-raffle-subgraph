import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { test, assert, clearStore, createMockedFunction } from "matchstick-as/assembly/index";
import { RaffleClaimPrize, RaffleStarted, RaffleTicketsEntered, RaffleTicketsEnteredTicketItemsStruct } from "../../generated/RafflesContract/RafflesContract";
import { BIGINT_ONE, BIGINT_ZERO, RAFFLE_CONTRACT } from "../constants";
import { handleRaffleStarted, handleRaffleTicketsEntered } from "../mapping";

let userAddress1 = "0x1AD3d72e54Fb0eB46e87F82f77B284FC8a66b16C"
let userAddress2 = "0x96FceD8740d50C896F60187D1ad9e60D86cf610C"

function createEthereumParam(name: string, value: ethereum.Value): ethereum.EventParam {
    let param = new ethereum.EventParam();
    param.name = name
    param.value = value
    return param
}

function createRaffleStartedEvent(): RaffleStarted {
    let event = new RaffleStarted();
    let params = new Array<ethereum.EventParam>();
    
    params.push(createEthereumParam("raffleId", ethereum.Value.fromI32(1)));
    params.push(createEthereumParam("raffleEnd", ethereum.Value.fromI32(2)));
    params.push(createEthereumParam("raffleEnd", ethereum.Value.fromI32(2)));
    // params.push(createEthereumParam("_to", ethereum.Value.fromAddress(Address.fromString(to))))
    // params.push(createEthereumParam("_value", ethereum.Value.fromSignedBigInt(value)))
    event.parameters = params;

    event.address = RAFFLE_CONTRACT;

    return event;
}

function createRaffleTicketsEnteredEvent(tokenId: BigInt = BIGINT_ONE): RaffleTicketsEntered {
    let event = new RaffleTicketsEntered();
    let params = new Array<ethereum.EventParam>();
    let userAddress = Address.fromString(userAddress1);
    params.push(createEthereumParam("raffleId", ethereum.Value.fromUnsignedBigInt(tokenId)))
    params.push(createEthereumParam("entrant",  ethereum.Value.fromAddress(userAddress)))


    let values = new Array<ethereum.Tuple>();
    for(let i=0;i<=6;i++) {
        let struct = new RaffleTicketsEnteredTicketItemsStruct();
        struct.push(ethereum.Value.fromAddress(Address.fromString(userAddress1)));
        struct.push(ethereum.Value.fromI32(i));
        struct.push(ethereum.Value.fromI32(i));
        values.push(struct);
    }
    params.push(createEthereumParam("ticketItems",  ethereum.Value.fromTupleArray(values)))

    event.parameters = params;

    event.transaction.from = userAddress;
    event.address = RAFFLE_CONTRACT;
    event.block.timestamp = BIGINT_ONE;

    return event;
}

function createRaffleClaimPrizeEvent(from: string, to: string): RaffleClaimPrize {
    ethereum.Value.fromAddress(Address.fromString(from));
    let event = new RaffleClaimPrize(); 
    let ids = new Array<BigInt>();
    ids.push(BIGINT_ZERO)
    ids.push(BIGINT_ONE)
    ids.push(BIGINT_ZERO)
    ids.push(BIGINT_ZERO)
    ids.push(BIGINT_ZERO)
    ids.push(BIGINT_ZERO)
    
    let values = new Array<ethereum.Tuple>();
    
    values.push(BIGINT_ZERO)
    values.push(BIGINT_ONE)
    values.push(BIGINT_ZERO)
    values.push(BIGINT_ZERO)
    values.push(BIGINT_ZERO)
    values.push(BIGINT_ZERO)


    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(createEthereumParam("_operator", ethereum.Value.fromAddress(Address.fromString(from))))
    event.parameters.push(createEthereumParam("_from", ethereum.Value.fromAddress(Address.fromString(from))))
    event.parameters.push(createEthereumParam("_to", ethereum.Value.fromAddress(Address.fromString(to))))
    event.parameters.push(createEthereumParam("_ids", ethereum.Value.fromUnsignedBigIntArray(ids)))
    event.parameters.push(createEthereumParam("_values", ethereum.Value.fromTupleArray(values)))
    
    return event;
}

export function runTests(): void {
    
    test("raffle started", () => {
        // do nothing
    })

    test("enter tickets", () => {
        let event = createRaffleTicketsEnteredEvent();
        handleRaffleTicketsEntered(event);

        // expected total entity
        assert.fieldEquals("Total", "1", "totalCommon", "0")
        assert.fieldEquals("Total", "1", "totalUncommon", "1")
        assert.fieldEquals("Total", "1", "totalRare", "2")
        assert.fieldEquals("Total", "1", "totalLegendary", "3")
        assert.fieldEquals("Total", "1", "totalMythical", "4")
        assert.fieldEquals("Total", "1", "totalGodLike", "5")
        assert.fieldEquals("Total", "1", "totalDrop", "6")

        // expected entrant
        let user = Address.fromString(userAddress1).toHexString();
        assert.fieldEquals("Entrant", user + "_" + event.block.timestamp.toString() + "_1", "ticketId", "1")
        assert.fieldEquals("Entrant", user + "_" + event.block.timestamp.toString() + "_2", "ticketId", "2")

        // expected user
        assert.fieldEquals("User", user, "totalCommon", "0")
        assert.fieldEquals("User", user, "totalUncommon", "1")
        assert.fieldEquals("User", user, "totalRare", "2")
        assert.fieldEquals("User", user, "totalLegendary", "3")
        assert.fieldEquals("User", user, "totalMythical", "4")
        assert.fieldEquals("User", user, "totalGodLike", "5")
        assert.fieldEquals("User", user, "totalDrop", "6")

        clearStore();
    })

    test("get random number", () => {

    })

    test("claim prize", () => {
        
    })
}