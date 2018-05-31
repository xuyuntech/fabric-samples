import Fabric_Client from 'fabric-client';
import FabricCAClient from 'fabric-ca-client';
import path from 'path';
import os from 'os';

const queryAllUser = async (req, res) => {
  const fabric_client = new Fabric_Client();

  // setup the fabric network
  const channel = fabric_client.newChannel('mychannel');
  const peer = fabric_client.newPeer('grpc://localhost:7051');
  channel.addPeer(peer);

  const store_path = path.join(os.homedir(), '.hfc-key-store');
  const tx_id = null;
  // let member_user = null;
  try {
    const stateStore = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
    fabric_client.setStateStore(stateStore);
    const cryptoSuite = Fabric_Client.newCryptoSuite();
    const cryptoStore = Fabric_Client.newCryptoKeyStore({ path: store_path });
    cryptoSuite.setCryptoKeyStore(cryptoStore);
    fabric_client.setCryptoSuite(cryptoSuite);

    const fabricCAClient = new FabricCAClient('http://localhost:7054', null, '', cryptoSuite);
    const adminFromStore = await fabric_client.getUserContext('admin', true);
    if (adminFromStore && adminFromStore.isEnrolled()) {
      console.log('Successfully loaded admin from persistence');
    } else {
      throw new Error('Failed to get admin');
    }
    const identityService = fabricCAClient.newIdentityService('admin');
    res.json(identityService.getAll(adminFromStore));
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
  queryAllUser,
};
