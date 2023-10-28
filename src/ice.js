/**
 * Compares the time to create two local peers, connect them,
 * and open a DataChannel.
 */

import Benchmark from 'benchmark'
import koushWrtc from '@koush/wrtc'
import nodeDataChannel from 'node-datachannel'
import roamhqWrtc from '@roamhq/wrtc'
import Werift from 'werift'
import wrtc from 'wrtc'

console.log('Setup complete. Running benchmarks...')

new Benchmark.Suite()
  .add('@koush/wrtc (@koush/node-webrtc)', {
    defer: true,
    fn: function(deferred) {
      let peer1 = new koushWrtc.RTCPeerConnection()
      let peer2 = new koushWrtc.RTCPeerConnection()
      let dc = peer1.createDataChannel('test')
      
      dc.onopen = () => {
        deferred.resolve()
        dc.close()
        peer1.close()
        peer2.close()
        dc = null
        peer1 = null
        peer2 = null
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
      
      peer1.createOffer()
        .then(offer => peer1.setLocalDescription(offer))
        .then(() => peer2.setRemoteDescription(peer1.localDescription))
        .then(() => peer2.createAnswer())
        .then(answer => peer2.setLocalDescription(answer))
        .then(() => peer1.setRemoteDescription(peer2.localDescription))
    },
  })
  .add('@roamhq/wrtc (@WonderInventions/node-webrtc)', {
    defer: true,
    fn: function(deferred) {
      let peer1 = new roamhqWrtc.RTCPeerConnection()
      let peer2 = new roamhqWrtc.RTCPeerConnection()
      let dc = peer1.createDataChannel('test')
      
      dc.onopen = () => {
        deferred.resolve()
        dc.close()
        peer1.close()
        peer2.close()
        dc = null
        peer1 = null
        peer2 = null
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
      
      peer1.createOffer()
        .then(offer => peer1.setLocalDescription(offer))
        .then(() => peer2.setRemoteDescription(peer1.localDescription))
        .then(() => peer2.createAnswer())
        .then(answer => peer2.setLocalDescription(answer))
        .then(() => peer1.setRemoteDescription(peer2.localDescription))
    },
  })
  .add('wrtc (node-webrtc)', {
    defer: true,
    fn: function(deferred) {
      let peer1 = new wrtc.RTCPeerConnection()
      let peer2 = new wrtc.RTCPeerConnection()
      let dc = peer1.createDataChannel('test')
      
      dc.onopen = () => {
        deferred.resolve()
        dc.close()
        peer1.close()
        peer2.close()
        dc = null
        peer1 = null
        peer2 = null
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
      
      peer1.createOffer()
        .then(offer => peer1.setLocalDescription(offer))
        .then(() => peer2.setRemoteDescription(peer1.localDescription))
        .then(() => peer2.createAnswer())
        .then(answer => peer2.setLocalDescription(answer))
        .then(() => peer1.setRemoteDescription(peer2.localDescription))
    },
  })
  .add('node-datachannel', {
    defer: true,
    fn: function(deferred) {
      let peer1 = new nodeDataChannel.PeerConnection('Peer1', { iceServers: ['stun:stun.l.google.com:19302'] })
      let peer2 = new nodeDataChannel.PeerConnection('Peer2', { iceServers: ['stun:stun.l.google.com:19302'] })
      
      peer1.onLocalDescription((sdp, type) => {
        peer2.setRemoteDescription(sdp, type)
      })
      peer1.onLocalCandidate((candidate, mid) => {
        peer2.addRemoteCandidate(candidate, mid)
      })
      
      peer2.onLocalDescription((sdp, type) => {
        peer1.setRemoteDescription(sdp, type)
      })
      peer2.onLocalCandidate((candidate, mid) => {
        peer1.addRemoteCandidate(candidate, mid)
      })
      
      let dc1 = peer1.createDataChannel("test")
      dc1.onOpen(() => {
        deferred.resolve()
        dc1.close()
        peer1.close()
        peer2.close()
        dc1 = null
        peer1 = null
        peer2 = null
      })
    },
  })
  .add('werift', {
    defer: true,
    fn: function(deferred) {
      const peer1 = new Werift.RTCPeerConnection({})
      const peer2 = new Werift.RTCPeerConnection({})
      
      const dc = peer1.createDataChannel('chat')
      
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
      
      dc.stateChanged.subscribe((state) => {
        if (state === 'open') {
          deferred.resolve()
        }
      })
      
      peer1.createOffer()
        .then(offer => peer1.setLocalDescription(offer))
        .then(() => peer2.setRemoteDescription(peer1.localDescription))
        .then(() => peer2.createAnswer())
        .then(answer => peer2.setLocalDescription(answer))
        .then(() => peer1.setRemoteDescription(peer2.localDescription))
    }
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    process.exit(0)
  })
  .run({ 'async': false })