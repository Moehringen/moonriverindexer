import { SubstrateBlock, SubstrateEvent } from '@subql/types';
import {Collator, Round} from "../types";
import { Actiontype } from '../constants';
import { NominatorActionHistory } from '../types/models/NominatorActionHistory';

export const handleNewRoundStarted = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`New Round created: ${JSON.stringify(event)}`);
  const [blockNumber,roundindex,collators,balance] = event.data.toJSON() as [bigint, string,number,string];

  // const {event: {data: [blockNumber,roundindex,collators,balance]}} = substrateEvent;
  logger.info(`New Round created: ${roundindex}`);
  let record:Round = await Round.get('RoundCreated' + roundindex);
  let id:string;
  if (!record) {
    id = 'RoundCreated' + roundindex;
    record = new Round(id);
  }

  record.roundindex = roundindex;
  record.numberOfCollator = collators;
  record.totalbond = balance;
  record.blocknumber = blockNumber;
  await record.save();
};

export const handleCollatorChosen= async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`New Collator chosen: ${JSON.stringify(event)}`);
  const [roundindex,account,balance] = event.data.toJSON() as [string,string,string];

  let round = await Round.get('RoundCreated' + roundindex);
  if (!round) {
    logger.info('Create Round for Collator');
    round = new Round('RoundCreated' + roundindex);
    round.save();
  }

  let id = account + roundindex;
  let record = new Collator(id);
  record.roundindex = roundindex;
  record.totalbond = balance;
  record.account = account;
  record.roundId = round.id;
  await record.save();
};

export const handleNomination= async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`Nomination happens: ${JSON.stringify(event)}`);
  // logger.info(`Nomination happens at:` + blockNum);
  const [nominatoraccount,balance,collatoraccount,nominatoradd] = event.data.toJSON() as [string, string,string,object];
  let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
  let id = collatoraccount + "-" + nominatoraccount + "-" + roundindex;
  // logger.info(`id is:` + id);
  // logger.info(`nominatoradd: ${JSON.stringify(nominatoradd)}`);

  let nominationActionHistory = await NominatorActionHistory.get(id);
  if (!nominationActionHistory) {
    // logger.info('create nominationActionHistory trigger by Nomination Event');
    nominationActionHistory = new NominatorActionHistory(id);
  }
  let balanceDec = Number(BigInt(balance).toString(10));
  Object.keys(nominatoradd).forEach(function(key){
    if(key === Actiontype.NOMINATIONTOTOP)
    nominationActionHistory.actiontype = Actiontype.NOMINATIONTOTOP;
    else
    nominationActionHistory.actiontype = Actiontype.NOMINATIONTOBOTTOM;
  });
  nominationActionHistory.roundindex = roundindex.toString();
  nominationActionHistory.account = nominatoraccount;
  nominationActionHistory.collator = collatoraccount;
  nominationActionHistory.balancechange =  ( balanceDec / Math.pow(10, 18)).toString();
  nominationActionHistory.blocknumber = BigInt(blockNum.toNumber());
  nominationActionHistory.save();
};


export const handleNominationIncreased= async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  logger.info(`Nomination Increase happens: ${JSON.stringify(event)}`);
  logger.info(`Nomination Increase happens at:` + blockNum);

  const [nominatoraccount,collatoraccount,balance,iftop] = event.data.toJSON() as [string, string,string,boolean];
  let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
  let id = collatoraccount + "-" + nominatoraccount + "-" + roundindex;

  let nominationActionHistory = await NominatorActionHistory.get(id);
  if (!nominationActionHistory) {
    logger.info('create nominationActionHistory trigger by Nomination Increased Event');
    nominationActionHistory = new NominatorActionHistory(id);
  }
  let balanceDec = Number(BigInt(balance).toString(10));

  nominationActionHistory.roundindex = roundindex.toString();
  nominationActionHistory.account = nominatoraccount;
  nominationActionHistory.collator = collatoraccount;
  nominationActionHistory.balancechange =  ( balanceDec / Math.pow(10, 18)).toString();
  nominationActionHistory.blocknumber = BigInt(blockNum.toNumber());
  nominationActionHistory.actiontype = Actiontype.INCREASE;
  nominationActionHistory.save();


}


export const handleNominationDecreased= async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  logger.info(`Nomination Decrease happens: ${JSON.stringify(event)}`);
  logger.info(`Nomination Decrease happens at:` + blockNum);
  const [nominatoraccount,collatoraccount,balance,iftop] = event.data.toJSON() as [string, string,string,boolean];
  let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
  let id = collatoraccount + "-" + nominatoraccount + "-" + roundindex;

  let nominationActionHistory = await NominatorActionHistory.get(id);
  if (!nominationActionHistory) {
    logger.info('create nominationActionHistory trigger by Nomination Decreased Event');
    nominationActionHistory = new NominatorActionHistory(id);
  }
  let balanceDec = Number(BigInt(balance).toString(10));
  let negtiveBalance = -Math.abs(balanceDec);

  nominationActionHistory.roundindex = roundindex.toString();
  nominationActionHistory.account = nominatoraccount;
  nominationActionHistory.collator = collatoraccount;
  nominationActionHistory.balancechange =  ( negtiveBalance / Math.pow(10, 18)).toString();
  nominationActionHistory.blocknumber = BigInt(blockNum.toNumber());
  nominationActionHistory.actiontype = Actiontype.DECREASE;
  nominationActionHistory.save();
}

export const handleNominatorLeftCollator = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  logger.info(`Nominator left happens: ${JSON.stringify(event)}`);
  logger.info(`Nominator left happens at:` + blockNum);

  const [nominatoraccount,collatoraccount,balance,newTotalBalance] = event.data.toJSON() as [string, string,string,string];
  let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
  let id = collatoraccount + "-" + nominatoraccount + "-" + roundindex;

  let nominationActionHistory = await NominatorActionHistory.get(id);
  if (!nominationActionHistory) {
    logger.info('create nominationActionHistory trigger by Nominator Left Event');
    nominationActionHistory = new NominatorActionHistory(id);
  }
  let balanceDec = Number(BigInt(balance).toString(10));
  let negtiveBalance = -Math.abs(balanceDec);

  nominationActionHistory.roundindex = roundindex.toString();
  nominationActionHistory.account = nominatoraccount;
  nominationActionHistory.collator = collatoraccount;
  nominationActionHistory.balancechange =  ( negtiveBalance / Math.pow(10, 18)).toString();
  nominationActionHistory.blocknumber = BigInt(blockNum.toNumber());
  nominationActionHistory.actiontype = Actiontype.LEFT;
  nominationActionHistory.save();

 
}
