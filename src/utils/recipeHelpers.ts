export const recipeData = {
  mainnet: [],
  testnet: [
    // NOTE: Junoswap paused for WYND migration :(
    // {
    //   task: { // DCA
    //     "actions": [
    //       {
    //         "msg": {
    //           "wasm": {
    //             "execute": {
    //               "contract_addr": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
    //               "msg": "eyJzd2FwX2FuZF9zZW5kX3RvIjp7ImlucHV0X3Rva2VuIjoiVG9rZW4xIiwiaW5wdXRfYW1vdW50IjoiMTAwMDAwMCIsIm1pbl90b2tlbiI6IjAiLCJyZWNpcGllbnQiOiJqdW5vMXFsbXdqa2c3dXU0YXdhanc1YXVuY3RqZGNlOXE2NTdqMHJyZHB5In19",
    //               "funds": [
    //                 {
    //                   "amount": "1000000",
    //                   "denom": "ujunox"
    //                 }
    //               ]
    //             }
    //           }
    //         },
    //         "gas_limit": 255499
    //       }
    //     ],
    //     "boundary": {
    //       "Height": {
    //         "start": "1304321",
    //         "end": "1314321"
    //       }
    //     },
    //     "cw20_coins": [],
    //     "interval": {
    //       "Block": 1000
    //     },
    //     "queries": [
    //       {
    //         "query": {
    //           "contract_addr": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
    //           "msg": "eyJ0b2tlbjFfZm9yX3Rva2VuMl9wcmljZSI6eyJ0b2tlbjFfYW1vdW50IjoiMTAwMDAwMCJ9fQ=="
    //         }
    //       }
    //     ],
    //     "transforms": [
    //       {
    //         "action_idx": 0,
    //         "query_idx": 0,
    //         "action_path": [
    //           {
    //             "key": "swap_and_send_to"
    //           },
    //           {
    //             "key": "min_token"
    //           }
    //         ],
    //         "query_response_path": [
    //           {
    //             "key": "token2_amount"
    //           }
    //         ]
    //       }
    //     ],
    //     "stop_on_fail": false
    //   }
    // },
    {
      task: { // Payrolls
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
  ],
};

export const recipes = (type: string) => recipeData[type];