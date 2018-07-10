import { Connect, SimpleSigner } from 'uport-connect'
import { Credentials } from 'uport'
import firebase from 'firebase'

/**********************************************************************
 * Use a client-side signer with a junk key.
 *
 * Could be replaced with a lambda/cloud function to do the signing
 * and protect the key, but the app's signature is not the essential
 * piece of puzzle, rather it is the Event's keys that are generated
 * in-app, and are given to the user.  
 * 
 * !! This key should not be considered authoritative   !!
 * !! for any credential as it is exposed to the public !!
 *********************************************************************/
const signer = SimpleSigner('cee5a66435456e057bc58e9cf6a7a83a4d40f826744975a059ec6da8610f16df')

// A connect instance to sign event ownership credentials
export const uport = new Connect('uPort Live', {
  clientId: '2p2BR9kv8xPPiNFL7bHUZXg4idyUYfaCwfg',
  network: 'rinkeby',
  signer: signer
})

var config = {
  apiKey: process.env.APIKEY,
  authDomain: "uport-live.firebaseapp.com",
  databaseURL: "https://uport-live.firebaseio.com/",
};
export const firebaseApp = firebase.initializeApp(config)

// A web3 provider in case you need it
export const web3 = uport.getWeb3()
