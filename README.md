# js-datachannel-benchmarks

Benchmarks and example code for WebRTC DataChannel libraries for Node.js. Feel free to open an issue or submit a PR if you know of other Node.js WebRTC libraries. PRs are also welcome if you find improvements to the benchmark cases.

* [node-webrtc](https://github.com/node-webrtc/node-webrtc)
* [node-datachannel](https://github.com/murat-dogan/node-datachannel)
* [werift](https://github.com/shinyoshiaki/werift-webrtc)

## Windows

### Test environment

* Node.js v14.16.1
* Windows Build 19042.948
* Ryzen 7 2700x

### ICE

| Library | Results |
| ------- | ------- |
| node-webrtc | 18.68 ops/sec ±1.43% (44 runs sampled) |
| node-datachannel | 0.95 ops/sec ±5.58% (9 runs sampled) |
| werift | 3.41 ops/sec ±3.56% (21 runs sampled) |

### Messages

| Library | Results |
| ------- | ------- |
| node-webrtc | 541 ops/sec ±0.68% (82 runs sampled) |
| node-datachannel | 1,588 ops/sec ±1.00% (77 runs sampled) |
| werift | 201 ops/sec ±11.56% (73 runs sampled) |
