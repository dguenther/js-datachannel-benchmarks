# js-datachannel-benchmarks

Benchmarks and example code for WebRTC data channel libraries for Node.js. Feel free to open an issue or submit a PR if you know of other Node.js WebRTC libraries. PRs are also welcome if you find improvements to the benchmark cases.

* [@koush/node-webrtc](https://github.com/koush/node-webrtc)
* [@WonderInventions/node-webrtc](https://github.com/WonderInventions/node-webrtc)
* [node-webrtc](https://github.com/node-webrtc/node-webrtc)
* [node-datachannel](https://github.com/murat-dogan/node-datachannel)
* [werift](https://github.com/shinyoshiaki/werift-webrtc)

## Windows

### Test environment

* Node.js v18.18.2
* Windows Build 22621.2428
* AMD Ryzen 7 2700x

### ICE

| Library | Results |
| ------- | ------- |
| @koush/wrtc (@koush/node-webrtc) | 29.75 ops/sec ±2.08% (61 runs sampled) |
| @roamhq/wrtc (@WonderInventions/node-webrtc) | 30.81 ops/sec ±2.56% (54 runs sampled) |
| wrtc (node-webrtc) | 18.02 ops/sec ±12.93% (44 runs sampled) |
| node-datachannel | 0.98 ops/sec ±1.17% (9 runs sampled) |
| werift | 1.26 ops/sec ±4.72% (11 runs sampled) |

### Messages

| Library | Results |
| ------- | ------- |
| @koush/wrtc (@koush/node-webrtc) | 186 ops/sec ±0.44% (82 runs sampled) |
| @roamhq/wrtc (@WonderInventions/node-webrtc) | 186 ops/sec ±0.41% (84 runs sampled) |
| wrtc (node-webrtc) | 184 ops/sec ±0.35% (82 runs sampled) |
| node-datachannel | 1,320 ops/sec ±1.94% (80 runs sampled) |
| werift | 149 ops/sec ±4.33% (69 runs sampled) |
