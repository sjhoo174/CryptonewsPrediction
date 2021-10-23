const openApiSpecs = {
    openapi: '3.0.2',
    info: {
      title: 'API',
      description:
        'Compliance and monitoring tool for exchanges, financial institutions and regulators. \n        next generation block explorer for enterprises - combining near real-time transaction monitoring, \n        audit capabilities with detailed historical insights.',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'localhost:5000',
      },
    ],
    paths: {
      '/risk_sentiment': {
        get: {
          tags: ['API'],
          summary: 'Ping',
          description: 'Ping to check if database server is up\n    ',
          operationId: 'ping',
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PingResponse' },
                },
              },
            },
          },
        },
      },
      '/entity/feature_risk': {
        get: {
          tags: ['API'],
          summary: 'Feature Risk',
          description:
            'Feature risks over time and by token for entity or address \n\n    ',
          operationId: 'feature_risk',
          parameters: [
            {
              description: 'Exchange/Entity name',
              required: false,
              schema: {
                title: 'entity',
                type: 'string',
                description: 'Exchange/Entity name',
              },
              name: 'entity',
              in: 'query',
            },
            {
              description: 'Address hash value',
              required: false,
              schema: {
                title: 'address',
                type: 'string',
                description: 'Address hash value',
              },
              name: 'address',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'Start Date',
                type: 'string',
                default: '2020-07-29',
              },
              name: 'start_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'End Date',
                type: 'string',
                default: '2020-08-28',
              },
              name: 'end_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'token',
                enum: ['ETH', 'BUSD', 'USDT', 'USDC', 'PAX', 'TUSD'],
                type: 'string',
              },
              name: 'token',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response Feature Risk Entity Feature Risk Get',
                    type: 'array',
                    items: { $ref: '#/components/schemas/FeatureRiskResponse' },
                  },
                },
              },
            },
          },
        },
      },
      '/entity/source_of_funds_risk': {
        get: {
          tags: ['API'],
          summary: 'Source Of Funds Risk',
          description:
            'Source of funds over time and by token for entity or address \n\n    ',
          operationId: 'source_of_funds_risk',
          parameters: [
            {
              description: 'Exchange/Entity name',
              required: false,
              schema: {
                title: 'entity',
                type: 'string',
                description: 'Exchange/Entity name',
              },
              name: 'entity',
              in: 'query',
            },
            {
              description: 'Address hash value',
              required: false,
              schema: {
                title: 'address',
                type: 'string',
                description: 'Address hash value',
              },
              name: 'address',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'Start Date',
                type: 'string',
                default: '2020-07-29',
              },
              name: 'start_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'End Date',
                type: 'string',
                default: '2020-08-28',
              },
              name: 'end_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'token',
                enum: ['ETH', 'BUSD', 'USDT', 'USDC', 'PAX', 'TUSD'],
                type: 'string',
              },
              name: 'token',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title:
                      'Response Source Of Funds Risk Entity Source Of Funds Risk Get',
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SourceOfFundsRiskResponse',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/entity/overall_risk': {
        get: {
          tags: ['Example API'],
          summary: 'Overall Risk',
          description:
            'Risk score [Feature Risk, Open Source Intelligence, Source of Funds Risk, Overall Risk] \n\nover time and by token for entity or address ',
          operationId: 'overall_risk',
          parameters: [
            {
              description: 'Exchange/Entity name',
              required: false,
              schema: {
                title: 'entity',
                type: 'string',
                description: 'Exchange/Entity name',
              },
              name: 'entity',
              in: 'query',
            },
            {
              description: 'Address hash value',
              required: false,
              schema: {
                title: 'address',
                type: 'string',
                description: 'Address hash value',
              },
              name: 'address',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'Start Date',
                type: 'string',
                default: '2020-07-29',
              },
              name: 'start_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'End Date',
                type: 'string',
                default: '2020-08-28',
              },
              name: 'end_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'token',
                enum: ['ETH', 'BUSD', 'USDT', 'USDC', 'PAX', 'TUSD'],
                type: 'string',
              },
              name: 'token',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response Overall Risk Entity Overall Risk Get',
                    type: 'array',
                    items: { $ref: '#/components/schemas/OverallRiskResponse' },
                  },
                },
              },
            },
          },
        },
      },
      '/entity/balance': {
        get: {
          tags: ['API'],
          summary: 'Balance',
          description: 'Present Holdings for provided entity or address \n\n    ',
          operationId: 'balance',
          parameters: [
            {
              description: 'Exchange/Entity name',
              required: false,
              schema: {
                title: 'entity',
                type: 'string',
                description: 'Exchange/Entity name',
              },
              name: 'entity',
              in: 'query',
            },
            {
              description: 'Address hash value',
              required: false,
              schema: {
                title: 'address',
                type: 'string',
                description: 'Address hash value',
              },
              name: 'address',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'Start Date',
                type: 'string',
                default: '2020-07-29',
              },
              name: 'start_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'End Date',
                type: 'string',
                default: '2020-08-28',
              },
              name: 'end_date',
              in: 'query',
            },
            {
              description: 'Fiat value is shown in currency',
              required: false,
              schema: {
                title: 'currency',
                enum: [
                  'EUR',
                  'HKD',
                  'KRW',
                  'JPY',
                  'SGD',
                  'USD',
                  'SAR',
                  'KRW',
                  'AUD',
                  'AED',
                ],
                type: 'string',
                description: 'Fiat value is shown in currency',
                default: 'USD',
              },
              name: 'currency',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'token',
                enum: ['ETH', 'BUSD', 'USDT', 'USDC', 'PAX', 'TUSD'],
                type: 'string',
              },
              name: 'token',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response Balance Entity Balance Get',
                    type: 'array',
                    items: { $ref: '#/components/schemas/BalanceResponse' },
                  },
                },
              },
            },
          },
        },
      },
      '/txn/overall_risk': {
        get: {
          tags: ['API'],
          summary: 'Txn Overall Risk',
          description: 'Risk score by transaction hash \n\n    ',
          operationId: 'txn_overall_risk',
          parameters: [
            {
              required: true,
              schema: { title: 'Txn Hash', type: 'string' },
              name: 'txn_hash',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TxnRiskResponse' },
                },
              },
            },
          },
        },
      },
      '/all_entities': {
        get: {
          tags: ['API'],
          summary: 'All Entities',
          description: 'Get the full list of taggged entities\n\n    ',
          operationId: 'all_entities',
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response All Entities All Entities Get',
                    type: 'array',
                    items: { $ref: '#/components/schemas/EntityResponse' },
                  },
                },
              },
            },
          },
        },
      },
      '/all_tokens': {
        get: {
          tags: ['API'],
          summary: 'All Tokens',
          description: 'Get the full list of suppourted tokens\n\n    ',
          operationId: 'all_tokens',
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response All Tokens All Tokens Get',
                    type: 'array',
                    items: { $ref: '#/components/schemas/TokenResponse' },
                  },
                },
              },
            },
          },
        },
      },
      '/txn/daily_activity': {
        get: {
          tags: ['API'],
          summary: 'Daily Activity',
          description:
            'Returns various metrics information of daily transactions between a sender and a receiver \n\n    ',
          operationId: 'daily_activity',
          parameters: [
            {
              description: 'Sender: Entity name or Address hash',
              required: false,
              schema: {
                title: 'from_address or from_entity',
                type: 'string',
                description: 'Sender: Entity name or Address hash',
                default: '0x4e99d03436f7dcfb84c113d902ab476aa5af72bf',
              },
              name: 'from',
              in: 'query',
            },
            {
              description: 'Receiver: Entity name or Address hash',
              required: false,
              schema: {
                title: 'to_address or to_entity',
                type: 'string',
                description: 'Receiver: Entity name or Address hash',
                default: 'Binance',
              },
              name: 'to',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'Start Date',
                type: 'string',
                default: '2020-07-29',
              },
              name: 'start_date',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'End Date',
                type: 'string',
                default: '2020-08-28',
              },
              name: 'end_date',
              in: 'query',
            },
            {
              description: 'Fiat value is shown in currency',
              required: false,
              schema: {
                title: 'currency',
                enum: ['USD', 'SGD'],
                type: 'string',
                description: 'Fiat value is shown in currency',
                default: 'USD',
              },
              name: 'currency',
              in: 'query',
            },
            {
              required: false,
              schema: {
                title: 'token',
                enum: ['ETH', 'BUSD', 'USDT', 'USDC', 'PAX', 'TUSD'],
                type: 'string',
              },
              name: 'token',
              in: 'query',
            },
          ],
          responses: {
            '422': { description: 'Validation Error' },
            '500': { description: 'Internal Server Error' },
            '200': {
              description: 'Successful Response',
              content: {
                'application/json': {
                  schema: {
                    title: 'Response Daily Activity Txn Daily Activity Get',
                    type: 'array',
                    items: {
                      $ref:
                        '#/components/schemas/DailyTransactionActivityResponse',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        AddressDetailsResponse: {
          title: 'AddressDetailsResponse',
          required: [
            'address',
            'token',
            'current_balance',
            'fiat_balance',
            'currency',
            'incoming_txns_count',
            'outgoing_txns_count',
            'risk',
          ],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            token: { title: 'Token', type: 'string' },
            current_balance: { title: 'Current Balance', type: 'number' },
            fiat_balance: { title: 'Fiat Balance', type: 'number' },
            currency: { title: 'Currency', type: 'string' },
            incoming_txns_count: {
              title: 'Incoming Txns Count',
              type: 'integer',
            },
            outgoing_txns_count: {
              title: 'Outgoing Txns Count',
              type: 'integer',
            },
            risk: { title: 'Risk', type: 'number' },
          },
        },
        BalanceResponse: {
          title: 'BalanceResponse',
          required: ['token', 'currency', 'current_balance', 'fiat_balance'],
          type: 'object',
          properties: {
            token: { title: 'Token', type: 'string' },
            currency: { title: 'Currency', type: 'string' },
            current_balance: { title: 'Current Balance', type: 'number' },
            fiat_balance: { title: 'Fiat Balance', type: 'number' },
          },
        },
        CounterpartyActvityResponse: {
          title: 'CounterpartyActvityResponse',
          required: [
            'entity',
            'txn_in',
            'currency',
            'fiat_in',
            'txn_out',
            'fiat_out',
          ],
          type: 'object',
          properties: {
            entity: { title: 'Entity', type: 'string' },
            txn_in: { title: 'Txn In', type: 'integer' },
            value_in: { title: 'Value In', type: 'number' },
            currency: { title: 'Currency', type: 'string' },
            fiat_in: { title: 'Fiat In', type: 'number' },
            txn_out: { title: 'Txn Out', type: 'integer' },
            value_out: { title: 'Value Out', type: 'number' },
            token: { title: 'Token', type: 'string' },
            fiat_out: { title: 'Fiat Out', type: 'number' },
          },
        },
        DailyMetricsResponse: {
          title: 'DailyMetricsResponse',
          required: [
            'date',
            'txn_in',
            'txn_out',
            'fiat_in',
            'fiat_out',
            'net_fiat',
            'vector_fiat_in',
            'vector_fiat_out',
          ],
          type: 'object',
          properties: {
            date: { title: 'Date', type: 'string', format: 'date' },
            txn_in: { title: 'Txn In', type: 'integer' },
            txn_out: { title: 'Txn Out', type: 'integer' },
            fiat_in: { title: 'Fiat In', type: 'number' },
            fiat_out: { title: 'Fiat Out', type: 'number' },
            net_fiat: { title: 'Net Fiat', type: 'number' },
            vector_fiat_in: { title: 'Vector Fiat In', type: 'array', items: {} },
            vector_fiat_out: {
              title: 'Vector Fiat Out',
              type: 'array',
              items: {},
            },
          },
        },
        DailyTransactionActivityResponse: {
          title: 'DailyTransactionActivityResponse',
          required: ['to', 'currency', 'fiat_value', 'txns', 'date'],
          type: 'object',
          properties: {
            from: { title: 'From', type: 'string' },
            to: { title: 'To', type: 'string' },
            currency: { title: 'Currency', type: 'string' },
            fiat_value: { title: 'Fiat Value', type: 'number' },
            txns: { title: 'Txns', type: 'integer' },
            date: { title: 'Date', type: 'string', format: 'date' },
          },
        },
        EntityResponse: {
          title: 'EntityResponse',
          required: ['entity'],
          type: 'object',
          properties: { entity: { title: 'Entity', type: 'string' } },
        },
        FeatureRiskResponse: {
          title: 'FeatureRiskResponse',
          required: ['name', 'date', 'features_risk'],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            entity: { title: 'Entity', type: 'string' },
            name: { title: 'Name', type: 'string' },
            date: { title: 'Date', type: 'string', format: 'date' },
            features_risk: { title: 'Features Risk', type: 'number' },
          },
        },
        NewsResponse: {
          title: 'NewsResponse',
          required: ['title', 'date', 'link'],
          type: 'object',
          properties: {
            title: { title: 'Title', type: 'string' },
            date: { title: 'Date', type: 'string' },
            link: { title: 'Link', type: 'string' },
          },
        },
        OverallRiskResponse: {
          title: 'OverallRiskResponse',
          required: [
            'name',
            'date',
            'features_risk',
            'osi_score',
            'source_of_funds_risk',
            'overall_risk',
          ],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            entity: { title: 'Entity', type: 'string' },
            name: { title: 'Name', type: 'string' },
            date: { title: 'Date', type: 'string', format: 'date' },
            features_risk: { title: 'Features Risk', type: 'number' },
            osi_score: { title: 'Osi Score', type: 'number' },
            source_of_funds_risk: {
              title: 'Source Of Funds Risk',
              type: 'number',
            },
            overall_risk: { title: 'Overall Risk', type: 'number' },
          },
        },
        OverallScoreResponse: {
          title: 'OverallScoreResponse',
          required: [
            'on_chain_risk',
            'source_of_funds_risk',
            'overall_score',
            'negative_articles',
          ],
          type: 'object',
          properties: {
            on_chain_risk: { title: 'On Chain Risk', type: 'number' },
            source_of_funds_risk: {
              title: 'Source Of Funds Risk',
              type: 'number',
            },
            osi_score: { title: 'Osi Score', type: 'number' },
            overall_score: { title: 'Overall Score', type: 'number' },
            negative_articles: {
              title: 'Negative Articles',
              type: 'array',
              items: { $ref: '#/components/schemas/NewsResponse' },
            },
          },
        },
        OverviewResponse: {
          title: 'OverviewResponse',
          required: [
            'name',
            'overall_risk',
            'txn_in',
            'txn_out',
            'value_in',
            'fiat_in',
            'value_out',
            'fiat_out',
          ],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            entity: { title: 'Entity', type: 'string' },
            category: { title: 'Category', type: 'string' },
            tags: { title: 'Tags', type: 'array', items: {} },
            name: { title: 'Name', type: 'string' },
            overall_risk: { title: 'Overall Risk', type: 'integer' },
            txn_in: { title: 'Txn In', type: 'integer' },
            txn_out: { title: 'Txn Out', type: 'integer' },
            value_in: { title: 'Value In', type: 'number' },
            fiat_in: { title: 'Fiat In', type: 'number' },
            value_out: { title: 'Value Out', type: 'number' },
            fiat_out: { title: 'Fiat Out', type: 'number' },
          },
        },
        PingResponse: {
          title: 'PingResponse',
          required: ['success'],
          type: 'object',
          properties: { success: { title: 'Success', type: 'string' } },
        },
        RiskScoreResponse: {
          title: 'RiskScoreResponse',
          required: [
            'date',
            'features_risk',
            'value_out_risk',
            'value_in_risk',
            'hbr_risk',
            'outgoing_sdc_risk',
            'incoming_sdc_risk',
            'outgoing_txns_risk',
            'incoming_txns_risk',
            'outgoing_large_txns_risk',
            'incoming_large_txns_risk',
            'hack_risk',
            'mixer_risk',
            'scam_risk',
            'source_of_funds_risk',
            'overall_risk',
          ],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            entity: { title: 'Entity', type: 'string' },
            date: { title: 'Date', type: 'string', format: 'date' },
            features_risk: { title: 'Features Risk', type: 'number' },
            value_out_risk: { title: 'Value Out Risk', type: 'number' },
            value_in_risk: { title: 'Value In Risk', type: 'number' },
            hbr_risk: { title: 'Hbr Risk', type: 'number' },
            outgoing_sdc_risk: { title: 'Outgoing Sdc Risk', type: 'number' },
            incoming_sdc_risk: { title: 'Incoming Sdc Risk', type: 'number' },
            outgoing_txns_risk: { title: 'Outgoing Txns Risk', type: 'number' },
            incoming_txns_risk: { title: 'Incoming Txns Risk', type: 'number' },
            outgoing_large_txns_risk: {
              title: 'Outgoing Large Txns Risk',
              type: 'number',
            },
            incoming_large_txns_risk: {
              title: 'Incoming Large Txns Risk',
              type: 'number',
            },
            hack_risk: { title: 'Hack Risk', type: 'number' },
            mixer_risk: { title: 'Mixer Risk', type: 'number' },
            scam_risk: { title: 'Scam Risk', type: 'number' },
            osi_score: { title: 'Osi Score', type: 'number' },
            source_of_funds_risk: {
              title: 'Source Of Funds Risk',
              type: 'number',
            },
            overall_risk: { title: 'Overall Risk', type: 'number' },
          },
        },
        SourceOfFundsRiskResponse: {
          title: 'SourceOfFundsRiskResponse',
          required: ['name', 'date', 'source_of_funds_risk'],
          type: 'object',
          properties: {
            address: { title: 'Address', type: 'string' },
            entity: { title: 'Entity', type: 'string' },
            name: { title: 'Name', type: 'string' },
            date: { title: 'Date', type: 'string', format: 'date' },
            source_of_funds_risk: {
              title: 'Source Of Funds Risk',
              type: 'number',
            },
          },
        },
        TokenResponse: {
          title: 'TokenResponse',
          required: ['token'],
          type: 'object',
          properties: { token: { title: 'Token', type: 'string' } },
        },
        TokenTransfers: {
          title: 'TokenTransfers',
          type: 'object',
          properties: {
            from: { title: 'From', type: 'string' },
            to: { title: 'To', type: 'string' },
            tokenName: { title: 'Tokenname', type: 'string' },
            symbol: { title: 'Symbol', type: 'string' },
            tokenType: { title: 'Tokentype', type: 'string' },
            tokenID: { title: 'Tokenid', type: 'string' },
            value: { title: 'Value', type: 'string' },
          },
        },
        TopTransactionActivityResponse: {
          title: 'TopTransactionActivityResponse',
          required: [
            'from_address',
            'from_entity',
            'to_address',
            'to_entity',
            'token',
            'value',
            'fiat_value',
            'currency',
            'date',
          ],
          type: 'object',
          properties: {
            from_address: { title: 'From Address', type: 'string' },
            from_entity: { title: 'From Entity', type: 'string' },
            to_address: { title: 'To Address', type: 'string' },
            to_entity: { title: 'To Entity', type: 'string' },
            token: { title: 'Token', type: 'string' },
            value: { title: 'Value', type: 'number' },
            fiat_value: { title: 'Fiat Value', type: 'number' },
            currency: { title: 'Currency', type: 'string' },
            date: { title: 'Date', type: 'string', format: 'date' },
          },
        },
        TxnDetails: {
          title: 'TxnDetails',
          required: ['block_number', 'token_transfers'],
          type: 'object',
          properties: {
            chain: { title: 'Chain', type: 'string' },
            status: { title: 'Status', type: 'string' },
            index: { title: 'Index', type: 'integer' },
            hash: { title: 'Hash', type: 'string' },
            value: { title: 'Value', type: 'string' },
            from: { title: 'From', type: 'string' },
            to: { title: 'To', type: 'string' },
            date: { title: 'Date', type: 'string' },
            timestamp: { title: 'Timestamp', type: 'integer' },
            block_hash: { title: 'Block Hash', type: 'string' },
            block_number: { title: 'Block Number', type: 'integer' },
            gas: { title: 'Gas', type: 'string' },
            gas_price: { title: 'Gas Price', type: 'string' },
            gas_used: { title: 'Gas Used', type: 'string' },
            nonce: { title: 'Nonce', type: 'integer' },
            confirmations: { title: 'Confirmations', type: 'integer' },
            input: { title: 'Input', type: 'string' },
            token_transfers: {
              title: 'Token Transfers',
              type: 'array',
              items: { $ref: '#/components/schemas/TokenTransfers' },
            },
          },
        },
        TxnRiskResponse: {
          title: 'TxnRiskResponse',
          required: [
            'on_chain_risk',
            'source_of_funds_risk',
            'txn_hash',
            'overall_score',
          ],
          type: 'object',
          properties: {
            on_chain_risk: { title: 'On Chain Risk', type: 'number' },
            source_of_funds_risk: {
              title: 'Source Of Funds Risk',
              type: 'number',
            },
            txn_hash: { title: 'Txn Hash', type: 'string' },
            osi_score: { title: 'Osi Score', type: 'number' },
            overall_score: { title: 'Overall Score', type: 'number' },
            txn_detail: { $ref: '#/components/schemas/TxnDetails' },
          },
        },
      },
    },
  };
  
  export default openApiSpecs;
