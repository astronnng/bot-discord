const http = require('http');

console.log("Testing Lavalink connection and YouTube search...");

const options = {
  hostname: 'localhost',
  port: 2333,
  path: '/v4/loadtracks?identifier=ytsearch:never+gonna+give+you+up',
  method: 'GET',
  headers: {
    'Authorization': 'youshallnotpass'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        console.log('LOAD TYPE:', json.loadType);
        if (json.data) {
             console.log(`FOUND ${json.data.length} TRACKS.`);
             if (json.data.length > 0) {
                 console.log('FIRST TRACK:', json.data[0].info.title);
             }
        } else {
             // V4 structure might differ slightly depending on version, sometimes it's wrapped
             console.log('RAW RESPONSE snippet:', data.substring(0, 500));
        }
    } catch (e) {
        console.log('RAW RESPONSE:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`CONNECTION ERROR: ${e.message}`);
  console.error("Make sure Lavalink Docker container is running and port 2333 is exposed.");
});

req.end();