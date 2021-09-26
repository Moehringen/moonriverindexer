# SubQuery - Moonriver staking track
This repository is used to track the whole staking system of Moonriver.

The official UI to track the staking collator, validator and rewards is [here](https://duckduckgo.com). 

This UI is based on Subscan, but can only provide limited information and lack of history. 

The basic conception of Moonriver staking system can be found [here](https://docs.moonbeam.network/learn/features/staking/)




# Entity Description

Entity Round: to record informaiton in each round, now 1 round = 300 blocks. The 1st round starts from block 0, the second round starts from block 300. 
```
type Round @entity {
  id: ID!  
  roundindex:String
  numberOfCollator:Int //total collators of this round
  totalbond:String 
  startblock:BigInt
  collators:[Collator]@derivedFrom(field: "round")
  timestamp: Date
  aid:BigInt!  
}
```
```
type Collator @entity{
  id: ID!
  roundindex:String
  account: String! @index
  selfbond: String
  totalbond: String
  round:Round!
  timestamp: Date
  aid:BigInt!
}
```
```
type CollatorActionHistory @entity{
  id: ID!
  roundindex:String
  account: String! @index
  actiontype:String
  balancechange:String
  balancecurrent:String
  blocknumber:BigInt
  timestamp: Date
  aid:BigInt!
}
```
```
type NominatorActionHistory @entity{
  id: ID!
  roundindex:String
  account: String! @index
  collator: String @index
  actiontype:String
  balancechange:String
  balancecurrent:String
  blocknumber:BigInt
  timestamp: Date
  aid:BigInt!
}
```
```

type RewardHistory @entity{
  id:ID!
  account: String!@index
  issueBlock: BigInt
  issueroundindex: String
  realroundindex:String
  balance:String
  timestamp: Date
  aid:BigInt!
}
```

```
type IDGenerator @entity {
    "id"
    id: ID!
    "asscending ID"
    aID: BigInt!
}
```
# Blcok number which contains the special event to test: 

Increase: 503425

Decrease: 503425   

NominatorLeftCollator: 503700

Nomination: 300383

Rewarded: The first block of each round

CollatorChosen: The first block of each round

CollatorLeft: 461400

JoinCollatorCandidate:  430473

CollatorBondLess: 455335

CollatorBondMore: 450397




