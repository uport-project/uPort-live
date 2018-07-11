import IpfsAPI from 'ipfs-api'
import { notDeepEqual } from 'assert';

// Initialize IPFS
const ipfs = IpfsAPI({
  host: 'ipfs.infura.io', 
  port: '5001', 
  protocol: 'https',
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // }
})

// const ipfs = IpfsAPI('/ip4/127.0.0.1/tcp/5001')

/**
 * Return a promise that resolves to the ipfs hash of 
 * the file or blob to upload
 * @param {File|Blob} file -- the file or blob object to upload
 */
export function uploadToIpfs(file) {
  // console.log('Calling uploadToIpfs')
  return new Promise((resolve, reject) => {
    // console.log('Initializing FileReader')
    const reader = new FileReader()
    reader.onload = () => {
      // console.log('Reading file')
      const buf = ipfs.Buffer.from(reader.result)
      ipfs.files.add(buf, (err, data) => {
        // console.log('Ipfs returns')
        // console.log(data)
        if (err) {
          console.error('IPFS upload failed', err)
          reject(new Error(err))
        } else {
          resolve(data[0].hash)
        }
      })
    }

    // Read the file, trigger reader.onload
    reader.readAsArrayBuffer(file)
  })
}

export function readHash(){
  const multihash = 'QmWRgdWZokCy6cJQ3fZfw2Cgz51QCnVQSYZBpKAje5qbue'
  ipfs.object.data(multihash, (err, data) => {
    if (err) {
      throw err
    }

    let json = JSON.stringify(data)
    let bufferOriginal = Buffer.from(JSON.parse(json).data);
    let stats = (JSON.parse(bufferOriginal));
    stats['badgesCollected'] += 1
    console.log(stats);
    // FUTURE: update IPFS JSON object. Infura IPFS does not support
    // ipfs.object.patch.appendData(multihash, new Buffer(JSON.stringify(stats)), (err, node) => {
    //   if (err) {
    //     throw err
    //   }
    //   console.log(node.toJSON())
    // })
  })
}

export function putData(){
  const dat = {
    badgesCollected: 0,
    eventsCreated: 0
  }

  const obj = {
    Data: new Buffer(JSON.stringify(dat)),
    Links:[]
  }
  
  ipfs.object.put(obj, (err, node) => {
    if (err) {
      throw err
    }
    console.log(node)
    console.log(node.toJSON().multihash)
    // Logs:
    // QmPb5f92FxKPYdT3QNBd1GKiL4tZUXUrzF4Hkpdr3Gf1gK
  })
}
