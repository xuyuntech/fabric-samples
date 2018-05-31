import Fabric_Client from 'fabric-client';
import Fabric_CA_Client from 'fabric-ca-client';
import path from 'path';
import os from 'os';


const Org1Users = [
  {
    enrollmentID: '14021119870124337X',
    enrollmentSecret: '14021119870124337Xpw',
    affiliation: 'org1',
    role: 'user',
    attrs: [
      { name: 'hf.Registrar.Roles', value: 'user' },
      { name: 'name', value: '蔡悦' },
      { name: 'sid', value: '14021119870124337X' },
      { name: 'age', value: '31' },
      { name: 'gender', value: '1' },
    ],
  },
];


async function registerUser() {
  const fabric_client = new Fabric_Client();
  const store_path = path.join(os.homedir(), '.hfc-key-store');
  console.log(`Store path:${store_path}`);

  try {
    const stateStore = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
    fabric_client.setStateStore(stateStore);
    const cryptoSuite = Fabric_Client.newCryptoSuite();
    const cryptoStore = Fabric_Client.newCryptoKeyStore({ path: store_path });
    cryptoSuite.setCryptoKeyStore(cryptoStore);
    fabric_client.setCryptoSuite(cryptoSuite);

    const fabricCAClient = new Fabric_CA_Client('http://localhost:7054', null, '', cryptoSuite);
    const adminFromStore = await fabric_client.getUserContext('org1admin', true);
    if (adminFromStore && adminFromStore.isEnrolled()) {
      console.log('Successfully loaded org1admin from persistence');
    } else {
      throw new Error('Failed to get org1admin');
    }
    //
    await Promise.all(Org1Users.map(async (org1user) => {
      const { enrollmentID, enrollmentSecret } = org1user;
      await fabricCAClient.register(org1user, adminFromStore);
      const enrollment = await fabricCAClient.enroll({ enrollmentID, enrollmentSecret });
      await fabric_client.createUser({
        username: enrollmentID,
        mspid: 'Org1MSP',
        cryptoContent: {
          privateKeyPEM: enrollment.key.toBytes(),
          signedCertPEM: enrollment.certificate,
        },
      });
      console.log(`user ${enrollmentID} register success.`);
    }));
  } catch (err) {
    console.error(`registerUser err: ${err}`);
    if (err.toString().indexOf('Authorization') > -1) {
      console.error(`${'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
    'Try again after deleting the contents of the store directory '}${store_path}`);
    }
  }
}

registerUser();
