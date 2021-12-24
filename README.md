# js-datachannel-benchmarks

Benchmarks and example code for WebRTC data channel libraries for Node.js. Feel free to open an issue or submit a PR if you know of other Node.js WebRTC libraries. PRs are also welcome if you find improvements to the benchmark cases.

* [node-webrtc](https://github.com/node-webrtc/node-webrtc)
* [node-datachannel](https://github.com/murat-dogan/node-datachannel)
* [werift](https://github.com/shinyoshiaki/werift-webrtc)

## Windows

### Test environment

* Node.js v16.13.0
* Windows Build 22000.376
* AMD Ryzen 7 2700x

### ICE

| Library | Results |
| ------- | ------- |
| node-webrtc | 20.31 ops/sec ±0.84% (50 runs sampled) |
| node-datachannel | 0.96 ops/sec ±2.65% (9 runs sampled) |
| werift | 3.18 ops/sec ±3.78% (20 runs sampled) |

### Messages

| Library | Results |
| ------- | ------- |
| node-webrtc | 617 ops/sec ±0.54% (84 runs sampled) |
| node-datachannel | 2,324 ops/sec ±0.98% (82 runs sampled) |
| werift | 231 ops/sec ±11.58% (69 runs sampled) |
