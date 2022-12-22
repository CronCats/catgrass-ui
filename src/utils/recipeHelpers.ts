export const recipeData = {
  mainnet: [],
  testnet: [
    {
      task: { // DCA
        "owner_id": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
        "actions": [
          {
            "msg": {
              "wasm": {
                "execute": {
                  "contract_addr": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
                  "msg": "eyJzd2FwX2FuZF9zZW5kX3RvIjp7ImlucHV0X3Rva2VuIjoiVG9rZW4xIiwiaW5wdXRfYW1vdW50IjoiMTAwMDAwMCIsIm1pbl90b2tlbiI6IjAiLCJyZWNpcGllbnQiOiJqdW5vMXFsbXdqa2c3dXU0YXdhanc1YXVuY3RqZGNlOXE2NTdqMHJyZHB5In19",
                  "funds": [
                    {
                      "amount": "1000000",
                      "denom": "ujunox"
                    }
                  ]
                }
              }
            },
            "gas_limit": 255499
          }
        ],
        "boundary": {
          "Height": {
            "start": "1304321",
            "end": "1314321"
          }
        },
        "cw20_coins": [],
        "interval": {
          "Block": 1000
        },
        "queries": [
          {
            "query": {
              "contract_addr": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
              "msg": "eyJ0b2tlbjFfZm9yX3Rva2VuMl9wcmljZSI6eyJ0b2tlbjFfYW1vdW50IjoiMTAwMDAwMCJ9fQ=="
            }
          }
        ],
        "transforms": [
          {
            "action_idx": 0,
            "query_idx": 0,
            "action_path": [
              {
                "key": "swap_and_send_to"
              },
              {
                "key": "min_token"
              }
            ],
            "query_response_path": [
              {
                "key": "token2_amount"
              }
            ]
          }
        ],
        "stop_on_fail": false
      }
    },
    {
      task: { // Payrolls
        "owner_id": "juno1s3g0k4fnrvqxr6w82vr6fttfp0965xlyluc2zq",
        "actions": [
          {
            "msg": {
              "bank": {
                "send": {
                  "to_address": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
                  "amount": [
                    {
                      "amount": "1000000",
                      "denom": "ujunox"
                    }
                  ]
                }
              }
            },
            "gas_limit": 62116
          },
          {
            "msg": {
              "bank": {
                "send": {
                  "to_address": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
                  "amount": [
                    {
                      "amount": "1000000",
                      "denom": "uneta"
                    }
                  ]
                }
              }
            },
            "gas_limit": 62116
          }
        ],
        "boundary": null,
        "cw20_coins": [],
        "interval": {
          "Block": 1200
        },
        "queries": null,
        "transforms": null,
        "stop_on_fail": false
      }
    },
    {
      task: { // Custom Message
        "owner_id": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
        "actions": [
          {
            "msg": {
              "wasm": {
                "execute": {
                  "contract_addr": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
                  "msg": {
                    "do_thing": {
                      "example": "YOUR THINGS HERE"
                    }
                  },
                  "funds": [
                    {
                      "amount": "1000000",
                      "denom": "ujunox"
                    }
                  ]
                }
              }
            },
            "gas_limit": null
          }
        ],
        "boundary": {
          "Height": {
            "start": "1304359"
          }
        },
        "cw20_coins": [],
        "interval": "Immediate",
        "queries": [
          {
            "contract_addr": "COSMWASM_CONTRACT_ADDRESS HERE",
            "msg": {
              "example": "YOUR QUERY HERE"
            },
            "res_query_value": [
              {
                "key": "admin"
              }
            ],
            "ordering": "unit_above",
            "value": "500"
          }
        ],
        "transforms": [
          {
            "kind": "Action",
            "req_idx": 1,
            "res_idx": 0,
            "req_path": [
              {
                "key": "transfer"
              },
              {
                "key": "amount"
              }
            ],
            "res_path": [
              {
                "key": "admin"
              }
            ]
          }
        ],
        "stop_on_fail": false
      }
    },
    // {
    //   title: "Dollar Cost Average from $JUNO to $NETA",
    //   subtitle: "",
    //   owner: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   creator: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
    //   // totalBalance: { amount: '10000000', denom: 'ujuno' },
    //   stats: {
    //     copycats: 139,
    //     runs: 1309,
    //   },
    //   actions: [],
    //   rules: [],
    //   networks: [],
    //   bgColor: "#F9226C",
    // },
    // {
    //   title: "Automate Payroll, sending $JUNO to 2 or more accounts",
    //   // subtitle: '',
    //   owner: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   creator: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
    //   // totalBalance: { amount: '100000000', denom: 'ujuno' },
    //   stats: {
    //     copycats: 19,
    //     runs: 2847,
    //   },
    //   actions: [],
    //   rules: [],
    //   networks: [],
    //   bgColor: "#037099",
    // },
    // {
    //   title: "Custom Message, flexible for developer automations",
    //   // subtitle: '',
    //   owner: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   creator: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    //   // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
    //   // totalBalance: { amount: '1000000', denom: 'ujuno' },
    //   stats: {
    //     copycats: 6,
    //     runs: 204,
    //   },
    //   actions: [],
    //   rules: [],
    //   networks: [],
    //   bgColor: "#00787B",
    // },
  ],
};

export const recipes = (type: string) => recipeData[type];