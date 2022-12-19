import { uniq, getDenomUnitsFromPoolAssets } from '@/utils/helpers'
import { getWasmExecMsg } from '@/utils/mvpData'

// JUNOSWAP Setup
export const junoswap = {
  formatToAsset(list) {
    const allAssets: any = []

    list.forEach((i: any) => {
      i.pool_assets.forEach(p => {
        allAssets.push({
          ...p,
          base: p.denom,
          denom_units: getDenomUnitsFromPoolAssets(p),
        })
      })
    })

    return uniq(allAssets, "symbol")
  },

  filterAssetsToPoolPairTokens(list: any[], fromToken: any) {
    const allAssets: any = []

    list.forEach((i: any) => {
      const hasFromToken = i.pool_assets.filter(p => p.denom === fromToken.denom).length > 0

      if (hasFromToken) i.pool_assets.forEach(p => {
        if (p.denom !== fromToken.denom) allAssets.push({
          ...p,
          base: p.denom,
          denom_units: getDenomUnitsFromPoolAssets(p),
        })
      })
    })

    return uniq(allAssets, "symbol")
  },

  getPoolByContractAddr(pools: any[], contract_addr: string) {
    // find the correct pool
    return pools.find(p => p.swap_address === contract_addr)
  },

  getPoolByContext(pools: any[], ctx: any) {
    let pool

    // find the correct pool
    pools.forEach(p => {
      const poolDenoms = p.pool_assets.map(pa => pa.denom)

      if (poolDenoms.includes(ctx.fromToken.denom) && poolDenoms.includes(ctx.toToken.denom)) {
        pool = p
      }
    })

    return pool
  },

  // Setup query for getting price
  getQueries(pools: any[], ctx: any) {
    const queries = []
    const pool = junoswap.getPoolByContext(pools, ctx)
    if (!pool) return

    // format query based on the side
    const query = { contract_addr: pool.swap_address }

    if (pool.pool_assets[0].denom === ctx.fromToken.denom && pool.pool_assets[1].denom === ctx.toToken.denom) {
      query.msg = {
        token1_for_token2_price: {
          token1_amount: ctx.fromToken.amount
        }
      }
    }
    if (pool.pool_assets[1].denom === ctx.fromToken.denom && pool.pool_assets[0].denom === ctx.toToken.denom) {
      query.msg = {
        token2_for_token2_price: {
          token2_amount: ctx.toToken.amount
        }
      }
    }

    if (!query.msg) return
    return [{ query }]
  },

  // Setup transform for setting price in action
  getTransforms(pools: any[], ctx: any) {
    const pool = junoswap.getPoolByContext(pools, ctx)
    if (!pool) return
    let query_response_path: any = []

    if (pool.pool_assets[0].denom === ctx.fromToken.denom && pool.pool_assets[1].denom === ctx.toToken.denom) {
      query_response_path = [{ key: 'token2_amount' }]
    }
    if (pool.pool_assets[1].denom === ctx.fromToken.denom && pool.pool_assets[0].denom === ctx.toToken.denom) {
      query_response_path = [{ key: 'token1_amount' }]
    }

    const transforms = [
      {
        action_idx: 0,
        query_idx: 0,
        action_path: [
          { key: 'swap_and_send_to' },
          { key: 'min_token' }
        ],
        query_response_path,
      }
    ]
    return transforms
  },

  // Setup action for executing swap
  getActions(pools: any[], ctx: any) {
    const pool = junoswap.getPoolByContext(pools, ctx)
    if (!pool) return
    let input_token = 'Token1'
    if (pool.pool_assets[1].denom === ctx.fromToken.denom && pool.pool_assets[0].denom === ctx.toToken.denom) {
      input_token = 'Token2'
    }

    const wasmMsg = getWasmExecMsg({
      contract_addr: pool.swap_address,
      msg: {
        swap_and_send_to: {
          input_token,
          input_amount: ctx.fromToken.amount,
          min_token: "0", // gets replaced by query+tranform
          recipient: ctx.toAccount.address || ctx.fromAccount.address
        }
      },
      funds: [ctx.fromToken],
    })

    return [wasmMsg]
  },
}

// Pools, using hardcoded, as they dont change much
// REF: https://wasmswap.io/pools_list.testnet.json
// REF: https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/pools_list.json
export const junoswapPools = {
  juno: [
    {
      "pool_id": "JUNO-RAW",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g",
          "symbol": "RAW",
          "name": "Raw",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/Raw.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "raw"
        }
      ],
      "swap_address": "juno124d0zymrkdxv72ccyuqrquur8dkesmxmx2unfn7dej95yqx5yn8s70x3yj",
    },
    {
      "pool_id": "JUNO-ATOM",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "ATOM",
          "name": "Atom",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/atom.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
        }
      ],
      "swap_address": "juno1sg6chmktuhyj4lsrxrrdflem7gsnk4ejv6zkcc4d3vcqulzp55wsf4l4gl",
    },
    {
      "pool_id": "JUNO-USDC",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "USDC",
          "name": "USDC",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/axlusdc.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034"
        }
      ],
      "swap_address": "juno1ctsmp54v79x7ea970zejlyws50cj9pkrmw49x46085fn80znjmpqz2n642",
    },
    {
      "pool_id": "JUNO-UST",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "USTC",
          "name": "Terra UST Classic",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/ustc.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/2DA4136457810BCB9DAAB620CA67BC342B17C3C70151CA70490A170DF7C9CB27"
        }
      ],
      "swap_address": "juno1hue3dnrtgf9ly2frnnvf8z5u7e224ctc4hk7wks2xumeu3arj6rs9vgzec",
    },
    {
      "pool_id": "JUNO-BTSG",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "BTSG",
          "name": "BitSong",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/btsg.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/008BFD000A10BCE5F0D4DD819AE1C1EC2942396062DABDD6AE64A655ABC7085B"
        }
      ],
      "swap_address": "juno1j7pdtemw0qvl6rmnl0sf324409gz2p4sdt6rv659482x9rqqz6mqd653dg",
    },
    {
      "pool_id": "JUNO-LUNA",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "LUNC",
          "name": "Terra Classic",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/lunc.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/8F865D9760B482FF6254EDFEC1FF2F1273B9AB6873A7DE484F89639795D73D75"
        }
      ],
      "swap_address": "juno10mrlcttkwt99wxnqfyk6327lq3ac9yhfle2fd0c5s4rp8dzqy9ps3sjzyf",
    },
    {
      "pool_id": "JUNO-OSMO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "OSMO",
          "name": "OSMO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/osmo.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518"
        }
      ],
      "swap_address": "juno1el6rfmz6h9pwpdlf6k2qf4dwt3y5wqd7k3xpyvytklsnkt9uv2aqe8aq4v",
    },
    {
      "pool_id": "JUNO-STARS",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "STARS",
          "name": "STARS",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/stars.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/F6B367385300865F654E110976B838502504231705BAC0849B0651C226385885"
        }
      ],
      "swap_address": "juno1z5vukf037r6acgln3n37tr8a5rv7wafqzhcq29ddn9etwwtfrytsn6xvux",
    },
    {
      "pool_id": "JUNO-HUAHUA",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "chihuahua-1",
          "token_address": "",
          "symbol": "HUAHUA",
          "name": "HUAHUA",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/huahua.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/D836B191CDAE8EDACDEBE7B64B504C5E06CC17C6A072DAF278F9A96DF66F6241"
        }
      ],
      "swap_address": "juno1730cx75d8uevqvrkcwxpy9trhqqfksu5u9xwqss0qe4tn7x0tt3shakhk8",
    },
    {
      "pool_id": "JUNO-AKT",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "akashnet-2",
          "token_address": "",
          "symbol": "AKT",
          "name": "AKT",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/akt.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/DFC6F33796D5D0075C5FB54A4D7B8E76915ACF434CB1EE2A1BA0BB8334E17C3A"
        }
      ],
      "swap_address": "juno1tmxx3rdnnrcckkh7pjde924lftjs724rzd44sqte5xh8xax0yf2sc7v7dk",
    },
    {
      "pool_id": "JUNO-XPRT",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "core-1",
          "token_address": "",
          "symbol": "XPRT",
          "name": "XPRT",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/xprt.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/7455B3F2F2737906BACF4AE980069A4CAB7C7F9FDAABAEFBA439DF037AEC5898"
        }
      ],
      "swap_address": "juno1yaff0t6tfheqcdep24euu7w0xhnhs2yjwwv7r2c280vlns8trghq5d72pd",
    },
    {
      "pool_id": "JUNO-CMDX",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "comdex-1",
          "token_address": "",
          "symbol": "CMDX",
          "name": "CMDX",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/cmdx.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/946AD96F278770521526D7283F58268DA2F6ACDDE40324A9D1C86811D78C86A0"
        }
      ],
      "swap_address": "juno152lfpmadpxh2xha5wmlh2np5rj8fuy06sk72j55v686wd4q4c9jsvwj0gm",
    },
    {
      "pool_id": "JUNO-DIG",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "dig-1",
          "token_address": "",
          "symbol": "DIG",
          "name": "DIG",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/dig.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/6842C591DC4588411A565C9FF650FB15A17DFE3F0A43201E8141E4D14B8D171A"
        }
      ],
      "swap_address": "juno1gpa5ardzal22el6czj4j0d2pwy0m9qj06lr20t2l8fca3gkws63qfnx8eq",
    },
    {
      "pool_id": "JUNO-SCRT",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "secret-4",
          "token_address": "",
          "symbol": "SCRT",
          "name": "SCRT",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/scrt.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/B55B08EF3667B0C6F029C2CC9CAA6B00788CF639EBB84B34818C85CBABA33ABD"
        }
      ],
      "swap_address": "juno1hkz5dhn59w6l29k8w8ceuramqx2f35qpen7xtlx6ezketwh8ndxq8rwq2a",
    },
    {
      "pool_id": "JUNO-NETA",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr",
          "symbol": "NETA",
          "name": "NETA",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/neta.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "neta"
        }
      ],
      "swap_address": "juno1e8n6ch7msks487ecznyeagmzd5ml2pq9tgedqt2u63vra0q0r9mqrjy6ys",
    },
    {
      "pool_id": "JUNO-CANLAB",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1vn38rzq0wc7zczp4dhy0h5y5kxh2jjzeahwe30c9cc6dw3lkyk5qn5rmfa",
          "symbol": "CANLAB",
          "name": "CANLAB",
          "decimals": 3,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/cannalabs.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "canlab"
        }
      ],
      "swap_address": "juno1acs6q36t6qje5k82h5g74plr258y2q90cjf9z4wnktt7caln0mhsx8mt7z",
    },
    {
      "pool_id": "JUNO-TUCK",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1wurfx334prlceydmda3aecldn2xh4axhqtly05n8gptgl69ee7msrewg6y",
          "symbol": "TUCK",
          "name": "TUCK",
          "decimals": 3,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/tuckermint.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "tuck"
        }
      ],
      "swap_address": "juno133xa84qnue3uy0mj9emvauddxzw554rfl9rr6eadhfau50ws7gvs4ynm79",
    },
    {
      "pool_id": "JUNO-HULC",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1pshrvuw5ng2q4nwcsuceypjkp48d95gmcgjdxlus2ytm4k5kvz2s7t9ldx",
          "symbol": "HULC",
          "name": "HULC",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/hulcat.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "hulc"
        }
      ],
      "swap_address": "juno16zn96yf3vnxengke3vcf6mg9x7qyppgsdh3dnnmvdd8hvtpw58wsrjuu56",
    },
    {
      "pool_id": "JUNO-BITCANNA",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "bitcanna-1",
          "token_address": "",
          "symbol": "BCNA",
          "name": "BCNA",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/bcna.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/0CB5D60E57FD521FA39D11E3E410144389010AC5EF5F292BC9BDD832FA2FDBF9"
        }
      ],
      "swap_address": "juno1gv2gswtan8wsk54h663waefffywnuc9wcxr7xl5pnnxvjaqunpgs20t39g",
    },
    {
      "pool_id": "JUNO-NGM",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "emoney-3",
          "token_address": "",
          "symbol": "NGM",
          "name": "e-Money",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/ngm.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/52423136339C1CE8C91F6A586DFE41591BDDD4665AE526DFFA8421F9ACF95196"
        }
      ],
      "swap_address": "juno1653nhx2330rnhmzk2qe9w74kwwa3jtxe4lrfs5cfq8szfms8pqzsra5fvq",
    },
    {
      "pool_id": "JUNO-EEUR",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "emoney-3",
          "token_address": "",
          "symbol": "EEUR",
          "name": "e-Money EUR",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/eeur.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/B9F7C1E4CE9219B5AF06C47B18661DBD49CCD7A6C18FF789E2FB62BB365CFF9C"
        }
      ],
      "swap_address": "juno1z698dxy9gj4fnrs76xwmtqwh84lamav9xl0w35pd35vnfx7987nqudxyge",
    },
    {
      "pool_id": "JUNO-HOPE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1re3x67ppxap48ygndmrc7har2cnc7tcxtm9nplcas4v0gc3wnmvs3s807z",
          "symbol": "HOPE",
          "name": "HOPE GALAXY",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/hopelogo.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "hope"
        }
      ],
      "swap_address": "juno18nflutunkth2smnh257sxtxn9p5tq6632kqgsw6h0c02wzpnq9rq927heu",
    },
    {
      "pool_id": "JUNO-RAC",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1r4pzw8f9z0sypct5l9j906d47z998ulwvhvqe5xdwgy8wf84583sxwh0pa",
          "symbol": "RAC",
          "name": "RAC",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/racoon.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "rac"
        }
      ],
      "swap_address": "juno1m08vn7klzxh9tmqwajuux202xms2qz3uckle7zvtturcq7vk2yaqpcwxlz",
    },
    {
      "pool_id": "JUNO-MARBLE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl",
          "symbol": "MARBLE",
          "name": "MARBLE",
          "decimals": 3,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/marble.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "marble"
        }
      ],
      "swap_address": "juno1cvjuc66rdg34guugmxpz6w59rw6ghrun5m33z3hpvx6q60f40knqglhzzx",
    },
    {
      "pool_id": "JUNO-COIN",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1cl2ewl842wcnagz5psd68z4dpp4gfxrrm9atm807uvyyg235h85stg7awy",
          "symbol": "COIN",
          "name": "CoinDex",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/coindex.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "coin"
        }
      ],
      "swap_address": "juno14nak8v6xeawstrq7r7qmpa67qqfc9xzzymfdfpnp0luycv8knyuq5a6w2m",
    },
    {
      "pool_id": "JUNO-PRIMO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1t8dnpktypue65q0hjz7tr3cvqypgj5vkxhd2twvng4a2ywa3j25spjuk6z",
          "symbol": "PRIMO",
          "name": "Cardinal Finance ",
          "decimals": "6",
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/primo.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "primo"
        }
      ],
      "swap_address": "juno1enl842z00cklnathpv8f3t3w2u70dkrq22crz3gxg38we7xjfq5s8lktmg",
    },
    {
      "pool_id": "JUNO-DAISY",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1p32te9zfhd99ehpxfd06hka6hc9p7tv5kyl5909mzedg5klze09qrg08ry",
          "symbol": "DAISY",
          "name": "Daisy Finance ",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/daisy.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "daisy"
        }
      ],
      "swap_address": "juno14p3wvpeezqueenfu9jy29s96xuk0hp38k5d5k4ysyzk789v032sqp8uvh3",
    },
    {
      "pool_id": "JUNO-FUTURE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1gzys54drag6753qq75mkt3yhjwyv4rp698kfvesh0wcy5737z4tsn0chtm",
          "symbol": "FUTURE",
          "name": "FUTURE OF",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/futuretoken.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "future"
        }
      ],
      "swap_address": "juno1fzl79pekf8wtd0y37q92dmz5h9dxtfpl97w3kguyc59m7ufnlzvsf46vf8",
    },
    {
      "pool_id": "JUNO-BFOT",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1vaeuky9hqacenay9nmuualugvv54tdhyt2wsvhnjasx9s946hhmqaq3kh7",
          "symbol": "BFOT",
          "name": "Burned Fortis Oeconomia Token",
          "decimals": 10,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/bFOT.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "bfot"
        }
      ],
      "swap_address": "juno19859m5x8kgepwafc3h0n36kz545ngc2vlqnqxx7gx3t2kguv6fws93cu25",
    },
    {
      "pool_id": "JUNO-PHMN",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1rws84uz7969aaa7pej303udhlkt3j9ca0l3egpcae98jwak9quzq8szn2l",
          "symbol": "PHMN",
          "name": "POSTHUMAN",
          "decimals": "6",
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/PHMN.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "phmn"
        }
      ],
      "swap_address": "juno1xkm8tmm7jlqdh8kua9y7wst8fwcxpdnk6gglndfckj6rsjg4xc5q8aaawn",
    },
    {
      "pool_id": "JUNO-ARTO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1hy0ky3pe742phd4w55tdfej0ez55h4jx4g06rp4wsa0mne9wzudqy4hum2",
          "symbol": "ARTO",
          "name": "Arto DAO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/arto.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "arto"
        }
      ],
      "swap_address": "juno1fpphzkkq5uyezm7amk6sslyz8r94wl658zg2ku47v8mtslueyx5q29rkzq",
    },
    {
      "pool_id": "JUNO-NMN",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno17r8dyxuj25muaudhgqgx4xrg6gzr6tvzem6gwtpprnfld58yggcqjhhkjy",
          "symbol": "NMN",
          "name": "OpenNMN",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/nmn.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "nmn"
        }
      ],
      "swap_address": "juno1w7l7hetsm4x6hxa55dsjwszqh9elzwqrd6cud2qkqhafrd6u9vrqc2zh48",
    },
    {
      "pool_id": "JUNO-SGNL",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno14lycavan8gvpjn97aapzvwmsj8kyrvf644p05r0hu79namyj3ens87650k",
          "symbol": "SGNL",
          "name": "Signal",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/sgnl.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "sgnl"
        }
      ],
      "swap_address": "juno1jz50fj5zkcv3h6hmcfr3nr6eer7rj5pmsry5qj5jc8rfvpeavyzsgknm83",
    },
    {
      "pool_id": "JUNO-JOE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1n7n7d5088qlzlj37e9mgmkhx6dfgtvt02hqxq66lcap4dxnzdhwqfmgng3",
          "symbol": "JOE",
          "name": "JoeDAO",
          "decimals": "6",
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/joedao.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "joe"
        }
      ],
      "swap_address": "juno1rft4xp5e6ffta5a8aqwtu4kgdfjqw4jhnleu8agmmedzrxsat7pqxfgfrs",
    },
    {
      "pool_id": "RAW-OSMO",
      "pool_assets": [
        {
          "id": "",
          "chain_id": "juno-1",
          "token_address": "juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g",
          "symbol": "RAW",
          "name": "Raw",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/Raw.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "raw"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "OSMO",
          "name": "OSMO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/osmo.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518"
        }
      ],
      "swap_address": "juno17h4sgpaksygdnswpx74szv98hggddc08ny4zv5ca63jv53qptxrshacvku",
    },
    {
      "pool_id": "JUNO-MNTL",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "MNTL",
          "name": "Asset Mantle",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/assetmantle.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/5CB906E82B7A88E62644AD811361F5858B74BA9EBD75C84B6D24B20C01A4819F"
        }
      ],
      "swap_address": "juno1qsmywlded2sdggud5wft44gq2u6c3epl3qhzr4qv7psj536t8yhsfvrcf6",
    },
    {
      "pool_id": "JUNO-PUNK",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno13926947pmrjly5p9hf5juey65c6rget0gqrnx3us3r6pvnpf4hwqm8mchy",
          "symbol": "PUNK",
          "name": "PUNK",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/punk.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "punk"
        }
      ],
      "swap_address": "juno150vj5jusg4g8n82q40nd9cmq3unc255u3hf5qh6pud4dexkgyp0ss7yvwq",
    },
    {
      "pool_id": "JUNO-GLTO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": ["native"],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1j0a9ymgngasfn3l5me8qpd53l5zlm9wurfdk7r65s5mg6tkxal3qpgf5se",
          "symbol": "GLTO",
          "name": "Gelotto",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/glto.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "glto"
        }
      ],
      "swap_address": "juno1cugrrrryrpl383kfca0w5swywffa08zwqshrsfre82059vxjlx6syhf73y",
    },
    {
      "pool_id": "seJUNO-ATOM",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1dd0k0um5rqncfueza62w9sentdfh3ec4nw4aq4lk5hkjl63vljqscth9gv",
          "symbol": "seJUNO",
          "name": "StakeEasy seJUNO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/sejuno.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "sejuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "ATOM",
          "name": "Atom",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/atom.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
        }
      ],
      "swap_address": "juno1fha0ux5k6xxzzknhwk0j2rtwxtczlp8kzk6w9g383lzjhu337k9swvjdlv",
    },
    {
      "pool_id": "seJUNO-RAW",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1dd0k0um5rqncfueza62w9sentdfh3ec4nw4aq4lk5hkjl63vljqscth9gv",
          "symbol": "seJUNO",
          "name": "StakeEasy seJUNO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/sejuno.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "sejuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g",
          "symbol": "RAW",
          "name": "Raw",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/Raw.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "raw"
        }
      ],
      "swap_address": "juno1gxvcltkl0tf20rpsn2wf9q6ex0vr5xk6j3tzezuv6yyjez97w5vqmxk0cv",
    },
    {
      "pool_id": "bJUNO-JUNO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1wwnhkagvcd3tjz6f8vsdsw5plqnw8qy2aj3rrhqr2axvktzv9q2qz8jxn3",
          "symbol": "bJUNO",
          "name": "StakeEasy bJUNO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/bjuno.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "bjuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        }
      ],
      "swap_address": "juno17v2d2993me50e6dgzx50ckuuah0vmfyanl0segxsdcg3s4qzqersyrvu8n",
    },
    {
      "pool_id": "seJUNO-JUNO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1dd0k0um5rqncfueza62w9sentdfh3ec4nw4aq4lk5hkjl63vljqscth9gv",
          "symbol": "seJUNO",
          "name": "StakeEasy seJUNO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/sejuno.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "sejuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        }
      ],
      "swap_address": "juno1d04vn4t3cw494md0xleyqk6hxt8ctn5gmr353h06uvnudlvk5chq93vmjq",
    },
    {
      "pool_id": "SEASY-JUNO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno19rqljkh95gh40s7qdx40ksx3zq5tm4qsmsrdz9smw668x9zdr3lqtg33mf",
          "symbol": "SEASY",
          "name": "StakeEasy governance token",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/seasy.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "seasy"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        }
      ],
      "swap_address": "juno14hrt7htv42234xwpsxmxaxu7wywak7zflpk9jf5nze3w6e93czdsfwe0ly",
    },
    {
      "pool_id": "LOOP-RAW",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
          "symbol": "LOOP",
          "name": "Loop",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/a46f3a10b8e67105233f358aa1de114fc34df221/images/loop.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "loop"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno15u3dt79t6sxxa3x3kpkhzsy56edaa5a66wvt3kxmukqjz2sx0hes5sn38g",
          "symbol": "RAW",
          "name": "Raw",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/Raw.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "raw"
        }
      ],
      "swap_address": "juno1qt7uzjg9su3mk78jpt695rmxce4sa7evz7wa0edexjrsxghy35hsgje5l9",
    },
    {
      "pool_id": "JUNO-MUSE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1p8x807f6h222ur0vssqy3qk6mcpa40gw2pchquz5atl935t7kvyq894ne3",
          "symbol": "MUSE",
          "name": "MUSE",
          "decimals": "6",
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/MUSE.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "muse"
        }
      ],
      "swap_address": "juno107l74mj5q7d6zdzqzwpmdkk76628az2p9z08z9cj5pa7s5fpucws96f57e",
    },
    {
      "pool_id": "JUNO-DRGN",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno147t4fd3tny6hws6rha9xs5gah9qa6g7hrjv9tuvv6ce6m25sy39sq6yv52",
          "symbol": "DRGN",
          "name": "Stake Dragons",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/drgn.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "drgn"
        }
      ],
      "swap_address": "juno1fjmrqc5tjj2t5mfwkk5utwz2t0gcpkfajjefllrfahuqanctn9ys968emr",
    },
    {
      "pool_id": "JUNO-VERSE",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1kqx9rhc8ksx52tukdx797k4rjrhkgfh4gljs04ql97hmnnkgyvxs5cqt7d",
          "symbol": "VERSE",
          "name": "UniverseDAO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/cosmoscontracts/junoswap-asset-list/main/images/VERSE.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "verse"
        }
      ],
      "swap_address": "juno1na8zlnp3pqsjfzllcncq2ahsxg9zkdkqrz3sl4ae5lergh2wrjes7jl9gr",
    },
    {
      "pool_id": "JUNO-TORI",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "TORI",
          "name": "teritori",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/tori.png",
          "tags": ["native"],
          "native": true,
          "denom": "ibc/436B576861090C1C921D56BA1FAE481A04D2E938EBDFF55C4712670F9754AC40"
        }
      ],
      "swap_address": "juno1lgmtzhn840y9l74azn06w0wnsh4y98mjq5zs98yf96ggm7ejz05sgvpzqc",
    },
    {
      "pool_id": "JUNO-ampJUNO",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": ["native"],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1a0khag6cfzu5lrwazmyndjgvlsuk7g4vn9jd8ceym8f4jf6v2l9q6d348a",
          "symbol": "ampJUNO",
          "name": "Amplified JUNO",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/ampjuno.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "ampJUNO"
        }
      ],
      "swap_address": "juno10yvrummu6ma72z9ne82k888acn5que7s8ef3xtadd3fkhtq9xkuq80dhjs",
    },
    {
      "pool_id": "MUSE-USDC",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1p8x807f6h222ur0vssqy3qk6mcpa40gw2pchquz5atl935t7kvyq894ne3",
          "symbol": "MUSE",
          "name": "MUSE",
          "decimals": "6",
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/MUSE.png",
          "tags": [
            "cw20"
          ],
          "native": false,
          "denom": "muse"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "USDC",
          "name": "USDC",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/axlusdc.png",
          "tags": [
            "native"
          ],
          "native": true,
          "denom": "ibc/EAC38D55372F38F1AFD68DF7FE9EF762DCF69F26520643CF3F9D292A738D8034"
        }
      ],
      "swap_address": "juno1p8prj0dddf6d2wp599rtv9c5zp3v5gx0pjpk0hwl8fuhn7x8jslqxvjeqk",
    },
    {
      "pool_id": "JUNO-CZAR",
      "pool_assets": [
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "",
          "symbol": "JUNO",
          "name": "Juno",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/juno.png",
          "tags": ["native"],
          "native": true,
          "denom": "ujuno"
        },
        {
          "chain_name": "juno",
          "chain_id": "juno-1",
          "token_address": "juno1x02k67asfmjawgc96dj8nxq6se3fmx36gedgs5hvkjegdhfy97rs3jgj2h",
          "symbol": "CZAR",
          "name": "CZAR",
          "decimals": 6,
          "logoURI": "https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/images/czar.png",
          "tags": ["cw20"],
          "native": false,
          "denom": "czar"
        }
      ],
      "swap_address": "juno1z8c5kqh2yc48wstsq4h68lk78kxmf0rh30qs5f6d7luxzledvjtsxgugzt",
    }
  ],
  junotestnet: [
    {
      "pool_id": "JUNO-CRAB",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno12wwfatmpqnxdqk0ka8rpd4ud4frc97srtv55mmlf7xunux6led8s8wtgx2",
          "symbol": "CRAB",
          "name": "Crab",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/irisnet-iris-logo.svg?v=022",
          "tags": ["memecoin"],
          "native": false,
          "denom": "ucrab"
        }
      ],
      "swap_address": "juno18nhxas6yzzef3agczvfr62303enemkl8m84rlhur6q920rzarg5q3dn2fd",
    },
    {
      "pool_id": "JUNO-DAO",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno1lqhg97uxqlm7qhl4dylm2ynzf6z8r3px9epc23epkcu3703tal7qwj6vun",
          "symbol": "DAO",
          "name": "DAO",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/torn-torn-logo.svg?v=022",
          "tags": ["memecoin"],
          "native": false,
          "denom": "udao"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        }
      ],
      "swap_address": "juno1gjk9gva6dfs254qvlthw6ldqu3etp3wf2854n2ln7szepzvrggys89w3yn",
    },
    {
      "pool_id": "JUNO-POOD",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno174a3wz38p2rzqznm9npar95zpp5tpfe420amyj7qfs5373nklmqsqutetv",
          "symbol": "POOD",
          "name": "Poodle",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
          "tags": ["memecoin"],
          "native": false,
          "denom": "upood"
        }
      ],
      "swap_address": "juno1fwdduklq6csqp3xzzjdrsxqw8wtrfw3kflry09xghsn8m9nrfddsdztjjl",
    },
    {
      "pool_id": "JUNO-DOG",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno1sds2hju9gnc6g4jhu78kvxe8snwk80zypq6qlny7jv4pfmz5s9fqzl6s3g",
          "symbol": "DOG",
          "name": "Dog Coin",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=023",
          "tags": ["memecoin"],
          "native": false,
          "denom": "udog"
        }
      ],
      "swap_address": "juno177uyrw4px4dpw6ne3s0m4sfd93f6stz34k3tsgjnhezplgprfafsrd2hve",
    },
    {
      "pool_id": "JUNO-BULL",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno1c5zfjmrvja82jrwceml4d3x7xhtz8hzvwksre5u23q8q2xyxx2vqa9d7zg",
          "symbol": "BULL",
          "name": "Bull Coin",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/polymath-network-poly-logo.svg?v=023",
          "tags": ["memecoin"],
          "native": false,
          "denom": "ubull"
        }
      ],
      "swap_address": "juno1ja8s2t860q3ye8zx5dr2qqnfsemslv9ycnj60jetyp2g5ve00lzqtlqaup",
    },
    {
      "pool_id": "JUNO-CAT",
      "pool_assets": [
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "",
          "symbol": "JUNOX",
          "name": "Junox",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/anyswap-any-logo.svg?v=022",
          "tags": ["native"],
          "native": true,
          "denom": "ujunox"
        },
        {
          "chain_name": "junotestnet",
          "chain_id": "uni-5",
          "token_address": "juno1u3p88cklq0tt7frfwfjchhcs5ss0tjzwkxgr32m50j5pjnkxdzdszuj02h",
          "symbol": "CAT",
          "name": "Cat Coin",
          "decimals": 6,
          "logoURI": "https://cryptologos.cc/logos/catcoin-token-cats-logo.svg?v=023",
          "tags": ["memecoin"],
          "native": false,
          "denom": "ubull"
        }
      ],
      "swap_address": "juno1fy9hvdfluz46p38sf83gsmh4072pqa63rm9pz8qk09y3xfl5dymsvnvemc",
    }
  ],
}