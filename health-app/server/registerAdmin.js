import Fabric_Client from 'fabric-client';
import Fabric_CA_Client from 'fabric-ca-client';
import path from 'path';
import os from 'os';


const Org1Admin = {
  enrollmentID: 'org1admin',
  enrollmentSecret: 'org1adminpw',
  affiliation: 'org1',
  attrs: [
    { name: 'hf.Registrar.Roles', value: 'peer,user' },
    { name: 'hf.Registrar.Attributes', value: 'name,age,gender,sid' },
    { name: 'hf.Revoker', value: 'true' },
    { name: 'admin', value: 'true:ecert' },
  ],
};

async function registerOrg1Admin(fabric_client, fabricCAClient) {
  try {
    const org1AdminFromStore = await fabric_client.getUserContext('org1admin', true);
    console.log('org1AdminFromStore', org1AdminFromStore);
    if (org1AdminFromStore && org1AdminFromStore.isEnrolled()) {
      console.log('Successfully loaded org1admin from persistence');
      return;
    }
    console.log('Register org1admin...');
    // const org1adminSecret = await fabricCAClient.register(Org1Admin, adminFromStore);
    // console.log(`Register org1admin:${org1adminSecret} successfull `);
    const enrollment = await fabricCAClient.enroll({
      enrollmentID: 'org1admin',
      enrollmentSecret: 'org1adminpw',
    });
    console.log('org1admin enroll successfully');
    await fabric_client.createUser({
      username: 'org1admin',
      mspid: 'Org1MSP',
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate,
      },
    });
  } catch (err) {
    console.log(`registerOrg1Admin err: ${err}`);
  }
}
async function registerAdmin() {
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
    const fabricCAClient = new Fabric_CA_Client('http://localhost:7054', {
      trustedRoots: [],
      verify: false,
    }, 'ca.example.com', cryptoSuite);
    const adminFromStore = await fabric_client.getUserContext('admin', true);
    if (adminFromStore && adminFromStore.isEnrolled()) {
      console.log('Successfully loaded admin from persistence');
      await registerOrg1Admin(fabric_client, fabricCAClient);
      return;
    }
    const enrollment = await fabricCAClient.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw',
    });
    await fabric_client.createUser({
      username: 'admin',
      mspid: 'Org1MSP',
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate,
      },
    });
    console.log('Successfully loaded admin from persistence');
    await registerOrg1Admin(fabric_client, fabricCAClient);
  } catch (err) {
    console.error(`registerUser err: ${err}`);
    if (err.toString().indexOf('Authorization') > -1) {
      console.error(`${'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
    'Try again after deleting the contents of the store directory '}${store_path}`);
    }
  }
}

registerAdmin();
