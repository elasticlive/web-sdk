import l from "./Logger.js";

class Stat {
  constructor(ctx) {
    this.localVideoWidth = 0;
    this.localVideoHeight = 0;
    this.remoteVideoWidth = 0;
    this.remoteVideoHeight = 0;
    this.localFrameRate = 0;
    this.remoteFrameRate = 0;
    this.availableSendBandwidth = 0;
    this.availableReceiveBandwidth = 0;
    this.rtt = 0;
    this.localSentFrames = 0;
    this.remoteReceivedFrames = 0;
    this.sentBPS = 0;
    this.receivedBPS = 0;
    this.sentBytes = 0;
    this.receivedBytes = 0;
  }
}
export default Stat;
