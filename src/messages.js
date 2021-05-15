/**
 * Compares the time to send a binary message to another peer, then receive
 * a message back.
 */

const EventEmitter = require('events')
const { randomBytes } = require('crypto')

const Benchmark = require('benchmark')
const nodeDataChannel = require('node-datachannel')
const Werift = require('werift')
const wrtc = require('wrtc')

console.log('Setting up...')

var suite = new Benchmark.Suite

var testData = {
  nodeDataChannel: {
    peer1: null,
    peer2: null,
    dc1: null,
    dc2: null,
  },
  nodeWebRtc: {
    peer1: null,
    peer2: null,
    dc1: null,
    dc2: null,
  },
  werift: {
    peer1: null,
    peer2: null,
    dc1: null,
    dc2: null,
  },
}

const nodeWebRtcSetup = new Promise((resolve) => {
  testData.nodeWebRtc.peer1 = new wrtc.RTCPeerConnection()
  testData.nodeWebRtc.peer2 = new wrtc.RTCPeerConnection()
  testData.nodeWebRtc.dc1 = testData.nodeWebRtc.peer1.createDataChannel('test')
  
  const { peer1, peer2, dc1 } = testData.nodeWebRtc
  
  dc1.onopen = () => {
    resolve()
  }
  
  peer1.onicecandidate = e => {
    if (e.candidate && peer1.signalingState !== 'closed') {
      peer2.addIceCandidate(e.candidate)
    }
  }
  peer2.onicecandidate = e => {
    if (e.candidate && peer2.signalingState !== 'closed') {
      peer1.addIceCandidate(e.candidate)
    }
  }
  peer2.ondatachannel = e => {
    testData.nodeWebRtc.dc2 = e.channel
    resolve()
  }
  
  peer1.createOffer()
    .then(offer => peer1.setLocalDescription(offer))
    .then(() => peer2.setRemoteDescription(peer1.localDescription))
    .then(() => peer2.createAnswer())
    .then(answer => peer2.setLocalDescription(answer))
    .then(() => peer1.setRemoteDescription(peer2.localDescription))
})

const nodeDataChannelSetup = new Promise((resolve) => {
  testData.nodeDataChannel.peer1 = new nodeDataChannel.PeerConnection("Peer1", { iceServers: ["stun:stun.l.google.com:19302"] })
  testData.nodeDataChannel.peer2 = new nodeDataChannel.PeerConnection("Peer2", { iceServers: ["stun:stun.l.google.com:19302"] })
  testData.nodeDataChannel.events = new EventEmitter()
  
  const { peer1, peer2 } = testData.nodeDataChannel
  
  // Set Peer1 Callbacks
  peer1.onLocalDescription((sdp, type) => {
    peer2.setRemoteDescription(sdp, type)
  })
  peer1.onLocalCandidate((candidate, mid) => {
    peer2.addRemoteCandidate(candidate, mid)
  })
  
  // Set Peer2 Callbacks
  peer2.onLocalDescription((sdp, type) => {
    peer1.setRemoteDescription(sdp, type)
  })
  peer2.onLocalCandidate((candidate, mid) => {
    peer1.addRemoteCandidate(candidate, mid)
  })
  peer2.onDataChannel((dc) => {
    testData.nodeDataChannel.dc2 = dc
    testData.nodeDataChannel.dc2.onMessage(m => {
      testData.nodeDataChannel.events.emit('dc2', m)
    })
  })
  
  // Create DataChannel
  testData.nodeDataChannel.dc1 = peer1.createDataChannel('chat')
  
  testData.nodeDataChannel.dc1.onOpen(() => {
    resolve()
  })
  testData.nodeDataChannel.dc1.onMessage(m => {
    testData.nodeDataChannel.events.emit('dc1', m)
  })
})

const weriftSetup = new Promise((resolve) => {
  testData.werift.peer1 = new Werift.RTCPeerConnection({})
  testData.werift.peer2 = new Werift.RTCPeerConnection({})
  
  testData.werift.dc1 = testData.werift.peer1.createDataChannel('chat')
  
  const { peer1, peer2, dc1 } = testData.werift
  
  peer1.onicecandidate = e => {
    if (e.candidate) {
      peer2.addIceCandidate(e.candidate)
    }
  }
  peer2.onicecandidate = e => {
    if (e.candidate) {
      peer1.addIceCandidate(e.candidate)
    }
  }
  
  dc1.stateChanged.subscribe((state) => {
    if (state === 'open') {
      resolve()
    }
  })
  
  peer2.onDataChannel.subscribe((channel) => {
    testData.werift.dc2 = channel
  })
  
  peer1.createOffer()
    .then(offer => peer1.setLocalDescription(offer))
    .then(() => peer2.setRemoteDescription(peer1.localDescription))
    .then(() => peer2.createAnswer())
    .then(answer => peer2.setLocalDescription(answer))
    .then(() => peer1.setRemoteDescription(peer2.localDescription))
})

async function runTests() {
  await Promise.all([nodeWebRtcSetup, nodeDataChannelSetup, weriftSetup])
  console.log('Setup complete. Running benchmarks...')
  
  const message = randomBytes(5000)
  
  suite
    .add('node-webrtc', {
      defer: true,
      fn: function(deferred) {   
        const { dc1, dc2 } = testData.nodeWebRtc
        
        const dc2Message = ({ data }) => {
          dc2.send(data)
        }
        
        const dc1Message = () => {
          dc2.removeEventListener('message', dc2Message)
          dc1.removeEventListener('message', dc1Message)
          deferred.resolve()
        }
        
        dc2.addEventListener('message', dc2Message)
        
        dc1.addEventListener('message', dc1Message)
        
        dc1.send(message)
      },
    })
    .add('node-datachannel', {
      defer: true,
      fn: function(deferred) {   
        const { dc1, dc2 } = testData.nodeDataChannel
        
        testData.nodeDataChannel.events.once('dc2', msg => {
          dc2.sendMessageBinary(msg)
        })
        
        testData.nodeDataChannel.events.once('dc1', () => {
          deferred.resolve()
        })
        
        dc1.sendMessageBinary(message)
      },
    })
    .add('werift', {
      defer: true,
      fn: function(deferred) {   
        const { dc1, dc2 } = testData.werift
        
        dc2.message.once(m => {
          dc2.send(m)
        })
        
        dc1.message.once(e => {
          //   console.log('finished')
          deferred.resolve()
        })
        
        dc1.send(message)
      },
    })
    .on('cycle', function(event) {
      console.log(String(event.target))
    })
    .on('complete', function() {
      process.exit(0)
    })
    .run({ 'async': false })
  
}

runTests()
