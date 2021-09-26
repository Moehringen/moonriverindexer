import { SubstrateBlock, SubstrateEvent } from '@subql/types';
import {Collator, Round} from "../types";
import { NominationActiontype,CollatorActiontype } from '../constants';
import { NominatorActionHistory } from '../types/models/NominatorActionHistory';
import { RewardHistory } from '../types/models/RewardHistory';
import { CollatorActionHistory } from '../types/models/CollatorActionHistory';
import { IDGenerator } from '../types/models/IDGenerator';

const generaterID = "GENERATOR"

const getID = async() => {
  let generator =  await IDGenerator.get(generaterID);
  if (generator == null) {
    generator =  new IDGenerator(generaterID);
    generator.aID = BigInt(0).valueOf();
    await generator.save();
    logger.info(`first aID is : ${generator.aID}`);
    return generator.aID
  }
  else{
    generator.aID =  generator.aID + BigInt(1).valueOf()
    await generator.save()
    logger.info(`new aID is : ${generator.aID}`);
    return generator.aID
  }
}

export const handleNewRoundStarted = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`New Round created: ${JSON.stringify(event)}`);
  const [blockNumber,roundindex,collators,balance] = event.data.toJSON() as [bigint, string,number,string];

  // const {event: {data: [blockNumber,roundindex,collators,balance]}} = substrateEvent;
  logger.info(`New Round created: ${roundindex}`);
  let record:Round = await Round.get(roundindex);
  let id:string;
  if (!record) {
    id = roundindex;
    record = new Round(id);
  }

  record.roundindex = roundindex;
  record.numberOfCollator = collators;
  record.totalbond = balance;
  record.startblock = blockNumber;
  record.timestamp = createdAt;
  record.aid = await getID();
  await record.save();
};

export const handleCollatorChosen= async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  // logger.info(`New Collator chosen: ${JSON.stringify(event)}`);
  const [roundindex,account,balance] = event.data.toJSON() as [string,string,string];

  let round = await Round.get(roundindex);
  if (!round) {
    logger.info('Create Round for Collator');
    round = new Round(roundindex);
    round.aid = await getID();
    await round.save();
  }
  let totalbondDec = Number(BigInt(balance).toString(10));
  let id = account + "-" + roundindex;
  let record = new Collator(id);
  record.roundindex = roundindex;
  record.totalbond = ( totalbondDec / Math.pow(10, 18)).toString();;
  record.account = account;
  record.roundId = round.id;
  record.timestamp = createdAt;
  record.aid = await getID();
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
    if(key === NominationActiontype.NOMINATIONTOTOP)
    nominationActionHistory.actiontype = NominationActiontype.NOMINATIONTOTOP;
    else
    nominationActionHistory.actiontype = NominationActiontype.NOMINATIONTOBOTTOM;
  });
  nominationActionHistory.roundindex = roundindex.toString();
  nominationActionHistory.account = nominatoraccount;
  nominationActionHistory.collator = collatoraccount;
  nominationActionHistory.balancechange =  ( balanceDec / Math.pow(10, 18)).toString();
  nominationActionHistory.blocknumber = BigInt(blockNum.toNumber());
  nominationActionHistory.timestamp = createdAt;
  nominationActionHistory.aid = await getID();
  await nominationActionHistory.save();
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
  nominationActionHistory.actiontype = NominationActiontype.INCREASE;
  nominationActionHistory.timestamp = createdAt;
  nominationActionHistory.aid = await getID();
  await nominationActionHistory.save();


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
  nominationActionHistory.actiontype = NominationActiontype.DECREASE;
  nominationActionHistory.timestamp = createdAt;
  nominationActionHistory.aid = await getID();
  await nominationActionHistory.save();
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
  nominationActionHistory.actiontype = NominationActiontype.LEFT;
  nominationActionHistory.timestamp = createdAt;
  nominationActionHistory.aid = await getID();
  await nominationActionHistory.save(); 
}



export const handleRewarded = async (substrateEvent: SubstrateEvent) => {
  const { event, block } = substrateEvent;
  const { timestamp: createdAt, block: rawBlock } = block;
  const { number: blockNum } = rawBlock.header;

  logger.info(`Reward happens: ${JSON.stringify(event)}`);
  logger.info(`Reward at:` + blockNum);

  const [account,balance] = event.data.toJSON() as [string, string];
  let issueroundindex = Math.floor(blockNum.toNumber()/300) + 1;
  let realroundindex = issueroundindex - 2;
  let id = account;

  let rewardHistory = await RewardHistory.get(id);
  if (!rewardHistory) {
    logger.info('create rewardHistory trigger by Rewarded Event');
    rewardHistory = new RewardHistory(id);
  }
  rewardHistory.id = id;
  rewardHistory.account = account;
  rewardHistory.issueBlock = BigInt(blockNum.toNumber());
  rewardHistory.issueroundindex = issueroundindex.toString();
  rewardHistory.realroundindex = realroundindex.toString();
  let balanceDec = Number(BigInt(balance).toString(10));
  rewardHistory.balance = ( balanceDec / Math.pow(10, 18)).toString();
  rewardHistory.timestamp = createdAt;
  rewardHistory.aid = await getID();
  await rewardHistory.save();
}

  

  export const handleJoinedCollatorCandidates = async (substrateEvent: SubstrateEvent) => {
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const { number: blockNum } = rawBlock.header;
  
    logger.info(`Join Candidate happens: ${JSON.stringify(event)}`);
    logger.info(`Join candidate happens at:` + blockNum);
    const [account,selfbond,totalbond] = event.data.toJSON() as [string, string,string];
    let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
    let id = account  + "-" + roundindex;
  
    let collatorActionHistory = await CollatorActionHistory.get(id);
    if (!collatorActionHistory) {
      collatorActionHistory = new CollatorActionHistory(id);
    }
    let selfbondDec = Number(BigInt(selfbond).toString(10));
    let totalbondDec = Number(BigInt(selfbond).toString(10));

    collatorActionHistory.roundindex = roundindex.toString();
    collatorActionHistory.account = account;
    collatorActionHistory.balancecurrent = ( selfbondDec / Math.pow(10, 18)).toString();;
    collatorActionHistory.balancechange =  ( selfbondDec / Math.pow(10, 18)).toString();
    collatorActionHistory.blocknumber = BigInt(blockNum.toNumber());
    collatorActionHistory.actiontype = CollatorActiontype.JOINED;
    collatorActionHistory.timestamp = createdAt;
    collatorActionHistory.aid =await getID();
    await collatorActionHistory.save();
  };
  
  


  export const handelCollatorBondedMore = async (substrateEvent: SubstrateEvent) => {
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const { number: blockNum } = rawBlock.header;
  
    logger.info(`Bond More happens: ${JSON.stringify(event)}`);
    logger.info(`Bond More happens at:` + blockNum);
    const [account,beforebond,afterbond] = event.data.toJSON() as [string, string,string];
    let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
    let id = account  + "-" + roundindex;
  
    let collatorActionHistory = await CollatorActionHistory.get(id);
    if (!collatorActionHistory) {
      collatorActionHistory = new CollatorActionHistory(id);
    }
    let beforebondDec = Number(BigInt(beforebond).toString(10));
    let afterbondDec = Number(BigInt(afterbond).toString(10));
    let changebondDec = afterbondDec - beforebondDec;

    collatorActionHistory.roundindex = roundindex.toString();
    collatorActionHistory.account = account;
    collatorActionHistory.balancecurrent = ( afterbondDec / Math.pow(10, 18)).toString();;
    collatorActionHistory.balancechange =  ( changebondDec / Math.pow(10, 18)).toString();
    collatorActionHistory.blocknumber = BigInt(blockNum.toNumber());
    collatorActionHistory.actiontype = CollatorActiontype.BONDMORE;
    collatorActionHistory.timestamp = createdAt;
    collatorActionHistory.aid = await getID();
    await collatorActionHistory.save();
  };


  export const handelCollatorBondedLess = async (substrateEvent: SubstrateEvent) => {
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const { number: blockNum } = rawBlock.header;
  
    logger.info(`Bond More happens: ${JSON.stringify(event)}`);
    logger.info(`Bond More happens at:` + blockNum);
    const [account,beforebond,afterbond] = event.data.toJSON() as [string, string,string];
    let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
    let id = account  + "-" + roundindex;
  
    let collatorActionHistory = await CollatorActionHistory.get(id);
    if (!collatorActionHistory) {
      collatorActionHistory = new CollatorActionHistory(id);
    }
    let beforebondDec = Number(BigInt(beforebond).toString(10));
    let afterbondDec = Number(BigInt(afterbond).toString(10));
    let changebondDec = -Math.abs(afterbondDec - beforebondDec);

    collatorActionHistory.roundindex = roundindex.toString();
    collatorActionHistory.account = account;
    collatorActionHistory.balancecurrent = ( afterbondDec / Math.pow(10, 18)).toString();;
    collatorActionHistory.balancechange =  ( changebondDec / Math.pow(10, 18)).toString();
    collatorActionHistory.blocknumber = BigInt(blockNum.toNumber());
    collatorActionHistory.actiontype = CollatorActiontype.BONDLESS;
    collatorActionHistory.timestamp = createdAt;
    collatorActionHistory.aid = await getID();
    await collatorActionHistory.save();
  };

  export const handleCollatorLeft = async (substrateEvent: SubstrateEvent) => {
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const { number: blockNum } = rawBlock.header;
  
    logger.info(`Collator happens: ${JSON.stringify(event)}`);
    logger.info(`Collator happens at:` + blockNum);
    const [account,beforebond,afterbond] = event.data.toJSON() as [string, string,string];
    let roundindex = Math.floor(blockNum.toNumber()/300) + 1;
    let id = account  + "-" + roundindex;
  
    let collatorActionHistory = await CollatorActionHistory.get(id);
    if (!collatorActionHistory) {
      collatorActionHistory = new CollatorActionHistory(id);
    }
    let beforebondDec = -Math.abs(Number(BigInt(beforebond).toString(10)));
    // let afterbondDec = Number(BigInt(afterbond).toString(10));
    // let changebondDec = afterbondDec - beforebondDec;

    collatorActionHistory.roundindex = roundindex.toString();
    collatorActionHistory.account = account;
    collatorActionHistory.balancecurrent = "0";
    collatorActionHistory.balancechange =  ( beforebondDec / Math.pow(10, 18)).toString();
    collatorActionHistory.blocknumber = BigInt(blockNum.toNumber());
    collatorActionHistory.actiontype = CollatorActiontype.LEFT;
    collatorActionHistory.timestamp = createdAt;
    collatorActionHistory.aid = await getID();
    await collatorActionHistory.save();
  };