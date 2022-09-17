# js-datachannel-benchmarks

Benchmarks and example code for WebRTC data channel libraries for Node.js. Feel free to open an issue or submit a PR if you know of other Node.js WebRTC libraries. PRs are also welcome if you find improvements to the benchmark cases.

* [node-webrtc](https://github.com/node-webrtc/node-webrtc)
* [node-datachannel](https://github.com/murat-dogan/node-datachannel)
* [werift](https://github.com/shinyoshiaki/werift-webrtc)

## Windows

### Test environment

* Node.js v16.17.0
* Windows Build 22000.856
* AMD Ryzen 7 2700x

### ICE

| Library | Results |
| ------- | ------- |
| node-webrtc | 21.64 ops/sec ±11.06% (50 runs sampled) |
| node-datachannel | 1.26 ops/sec ±48.49% (6 runs sampled) |
| werift | 0.88 ops/sec ±4.59% (9 runs sampled) |

### Messages

| Library | Results |
| ------- | ------- |
| node-webrtc | 220 ops/sec ±0.47% (79 runs sampled) |
| node-datachannel | 1,472 ops/sec ±0.96% (81 runs sampled) |
| werift | 174 ops/sec ±10.20% (69 runs sampled) |
