import Fabric_Client from 'fabric-client';
import path from 'path';
import os from 'os';

const queryAllStore = async (req, res) => {
  const fabric_client = new Fabric_Client();

  // setup the fabric network
  const channel = fabric_client.newChannel('mychannel');
  const peer = fabric_client.newPeer('grpc://localhost:7051');
  channel.addPeer(peer);

  const store_path = path.join(os.homedir(), '.hfc-key-store');
  const tx_id = null;
  // let member_user = null;
  try {
    const state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
    fabric_client.setStateStore(state_store);
    const crypto_suite = Fabric_Client.newCryptoSuite();
    const crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    const user_from_store = await fabric_client.getUserContext('user1', true);
    if (user_from_store && user_from_store.isEnrolled()) {
      console.log('Successfully loaded user1 from persistence: ');
      // member_user = user_from_store;
    } else {
      throw new Error('Failed to get user1');
    }

    const request = {
      chaincodeId: 'guahao_hospital',
      txId: tx_id,
      fcn: 'queryAllStore',
      args: [''],
    };

    const query_responses = await channel.queryByChaincode(request);
    console.log('Query has completed, checking results');
    if (query_responses && query_responses.length === 1) {
      if (query_responses[0] instanceof Error) {
        console.error('error from query = ', query_responses[0]);
      } else {
        console.log('Response is ', query_responses[0].toString());
        const data = JSON.parse(query_responses[0].toString()).map((item) => {
          const { Key, Record } = item;
          return {
            key: Key,
            ...Record,
          };
        });
        res.json({
          status: 0,
          results: {
            data,
            pagination: {
              currentPage: 1,
              totalCount: data.length,
            },
          },
        });
      }
    } else {
      console.log('No payloads were returned from query');
    }
  } catch (err) {
    console.error('queryAllHospital err:', err);
    res.json({
      status: 1,
      err,
    });
  }

  res.end('store');
};

export default {
  queryAllStore,
};
