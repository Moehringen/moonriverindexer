# SubQuery - Moonriver staking track
This repository is used to track the whole staking system of Moonriver.

The official UI to track the staking collator, validator and rewards is [here](https://duckduckgo.com). 

This UI is based on Subscan, but can only provide limited information and lack of history. 

The basic conception of Moonriver staking system can be found [here](https://docs.moonbeam.network/learn/features/staking/)




# Entity Description

Note: 1 round = 300 blocks. The 1st round starts from block 0, the second round starts from block 300. 
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
  selfbond: String  // currently this value is NULL 
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



# Query Example
This query get all the first 5 round (start from round 2) and the collators of each round. 

```
query {
   rounds(first: 5, orderBy: AID_ASC){
      nodes{
        roundindex
        startblock
        timestamp
        totalbond
        numberOfCollator
        collators{
          nodes{
            roundindex
            timestamp
            totalbond
            account
          }
        }
    }
  }
}
```

## Result of result
```
{
  "data": {
    "rounds": {
      "nodes": [
        {
          "roundindex": "2",
          "startblock": "300",
          "timestamp": "2021-06-29T12:29:33.421",
          "totalbond": "0x00000000000001b1ae4d6e2ef5000000",
          "numberOfCollator": 8,
          "collators": {
            "nodes": [
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x10a2F17d8150B76359e9CEd567FC348C71A74B46"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x2869E58409CA3E286A89D8Baec432B6bD42Aa895"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x2bCB75e8590f945596e44A94c6B9Ba327745117a"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x3abeDa9f0f920fDa379B59B042dd6625D9C86dF3"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x461891503a7Cc40Cd5Acd630907c940D2aA84BC8"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x4828e3d2a1C4B0a90a2a125B9D53204EFaf876A5"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x6477c1006AB85E6D94E8E7371f23b782FE95ca6b"
              },
              {
                "roundindex": "2",
                "timestamp": "2021-06-29T12:29:33.421",
                "totalbond": "1000",
                "account": "0x6E2b8C8734e9b0184e4b0193EeEC2790C1bf2d2d"
              }
            ]
          }
        },
        {
          "roundindex": "3",
          "startblock": "600",
          "timestamp": "2021-06-29T13:30:54.362",
          "totalbond": "0x00000000000001b1ae4d6e2ef5000000",
          "numberOfCollator": 8,
          "collators": {
            "nodes": [
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x10a2F17d8150B76359e9CEd567FC348C71A74B46"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x2869E58409CA3E286A89D8Baec432B6bD42Aa895"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x2bCB75e8590f945596e44A94c6B9Ba327745117a"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x3abeDa9f0f920fDa379B59B042dd6625D9C86dF3"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x461891503a7Cc40Cd5Acd630907c940D2aA84BC8"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x4828e3d2a1C4B0a90a2a125B9D53204EFaf876A5"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x6477c1006AB85E6D94E8E7371f23b782FE95ca6b"
              },
              {
                "roundindex": "3",
                "timestamp": "2021-06-29T13:30:54.362",
                "totalbond": "1000",
                "account": "0x6E2b8C8734e9b0184e4b0193EeEC2790C1bf2d2d"
              }
            ]
          }
        },
        {
          "roundindex": "4",
          "startblock": "900",
          "timestamp": "2021-06-29T14:31:18.426",
          "totalbond": "0x00000000000001b1ae4d6e2ef5000000",
          "numberOfCollator": 8,
          "collators": {
            "nodes": [
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x10a2F17d8150B76359e9CEd567FC348C71A74B46"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x2869E58409CA3E286A89D8Baec432B6bD42Aa895"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x2bCB75e8590f945596e44A94c6B9Ba327745117a"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x3abeDa9f0f920fDa379B59B042dd6625D9C86dF3"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x461891503a7Cc40Cd5Acd630907c940D2aA84BC8"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x4828e3d2a1C4B0a90a2a125B9D53204EFaf876A5"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x6477c1006AB85E6D94E8E7371f23b782FE95ca6b"
              },
              {
                "roundindex": "4",
                "timestamp": "2021-06-29T14:31:18.426",
                "totalbond": "1000",
                "account": "0x6E2b8C8734e9b0184e4b0193EeEC2790C1bf2d2d"
              }
            ]
          }
        },
        {
          "roundindex": "5",
          "startblock": "1200",
          "timestamp": "2021-06-29T15:32:32.998",
          "totalbond": "0x00000000000001b1ae4d6e2ef5000000",
          "numberOfCollator": 8,
          "collators": {
            "nodes": [
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x10a2F17d8150B76359e9CEd567FC348C71A74B46"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x2869E58409CA3E286A89D8Baec432B6bD42Aa895"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x2bCB75e8590f945596e44A94c6B9Ba327745117a"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x3abeDa9f0f920fDa379B59B042dd6625D9C86dF3"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x461891503a7Cc40Cd5Acd630907c940D2aA84BC8"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x4828e3d2a1C4B0a90a2a125B9D53204EFaf876A5"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x6477c1006AB85E6D94E8E7371f23b782FE95ca6b"
              },
              {
                "roundindex": "5",
                "timestamp": "2021-06-29T15:32:32.998",
                "totalbond": "1000",
                "account": "0x6E2b8C8734e9b0184e4b0193EeEC2790C1bf2d2d"
              }
            ]
          }
        },
        {
          "roundindex": "6",
          "startblock": "1500",
          "timestamp": "2021-06-29T16:34:18.257",
          "totalbond": "0x00000000000001b1ae4d6e2ef5000000",
          "numberOfCollator": 8,
          "collators": {
            "nodes": [
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x10a2F17d8150B76359e9CEd567FC348C71A74B46"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x2869E58409CA3E286A89D8Baec432B6bD42Aa895"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x2bCB75e8590f945596e44A94c6B9Ba327745117a"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x3abeDa9f0f920fDa379B59B042dd6625D9C86dF3"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x461891503a7Cc40Cd5Acd630907c940D2aA84BC8"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x4828e3d2a1C4B0a90a2a125B9D53204EFaf876A5"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x6477c1006AB85E6D94E8E7371f23b782FE95ca6b"
              },
              {
                "roundindex": "6",
                "timestamp": "2021-06-29T16:34:18.257",
                "totalbond": "1000",
                "account": "0x6E2b8C8734e9b0184e4b0193EeEC2790C1bf2d2d"
              }
            ]
          }
        }
      ]
    }
  }
}
```