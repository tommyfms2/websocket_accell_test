# websocket_accell_test

### setup


```
$ brew install npm
$ npm install socket.io
$ npm i -g npm to update
$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

　　
　　
### Start server
```
$ node app
> $ node app
{
  ipv4: [ { name: 'en0', address: '192.168.160.70' } ],
  ipv6: [
    { name: 'en0', address: 'fe80::10d9:2655:b945:53e2' },
    { name: 'awdl0', address: 'fe80::d7:c4ff:feac:adf2' },
    { name: 'utun0', address: 'fe80::ebec:dadd:ac61:bb03' },
    { name: 'utun1', address: 'fe80::3bfe:1360:cf:9f48' }
  ]
}
```

