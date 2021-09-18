import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Round} from "../types";
import {Balance} from "@polkadot/types/interfaces";


export async function handleBlock(block: SubstrateBlock): Promise<void> {

}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    //Retrieve the record by its ID
    const record = await Round.get(event.extrinsic.block.block.header.hash.toString());

    await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {

}

export async function handleRoundCreated(event): Promise<void> {
    logger.info(`New Round created: ${JSON.stringify(event)}`);
    const {event: {data: [blockNumber,roundindex,collators,balance]}} = event;
    logger.info(`New Round created: ${roundindex}`);
    let id = 'RoundCreated' + roundindex;
    let record = new Round(id);
    record.roundindex = roundindex;
    await record.save();
  }



