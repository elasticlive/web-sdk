import l from "./Logger.js";
import Stat from "./Stat.js";

class Health {
  constructor(ctx) {
    this.interval = 5000;
    this.statsReportTimer = null;
    this.context = ctx;
  }
  stop() {
    this._clear();
  }

  start() {
    this._clear();
    this.statsReportTimer = window.setInterval(() => {
      if (this.context.channel.type !== "P2P")
        this.context.signaler.send(
          this.context.signaler.createMessage({ command: "ping", body: {} })
        );
      const oldStat = this.context.currentStat;
      const newStat = new Stat(this.context);
      this.context.currentStat = newStat;
      // let statsOutput = "";
      this.context.peerConnection.getStats(null).then(stats => {
        stats.forEach(report => {
          switch (report.type) {
            case "track":
              if (report.kind !== "video") break;
              if (report["remoteSource"]) {
                if (report["frameWidth"])
                  newStat.remoteVideoWidth = report["frameWidth"];
                if (report["frameHeight"])
                  newStat.remoteVideoHeight = report["frameHeight"];
                newStat.remoteReceivedFrames = report["framesReceived"];
                if (report["framesReceived"])
                  newStat.remoteFrameRate =
                    (report["framesReceived"] - oldStat.remoteReceivedFrames) /
                    (this.interval / 1000);
              } else {
                if (report["frameWidth"])
                  newStat.localVideoWidth = report["frameWidth"];
                if (report["frameHeight"])
                  newStat.localVideoHeight = report["frameHeight"];
                newStat.localSentFrames = report["framesSent"];
                if (report["framesSent"])
                  newStat.localFrameRate =
                    (report["framesSent"] - oldStat.localSentFrames) /
                    (this.interval / 1000);
              }
            case "transport":
              newStat.sentBytes = report["bytesSent"];
              newStat.receivedBytes = report["bytesReceived"];
              newStat.sentBPS =
                (newStat.sentBytes - oldStat.sentBytes) /
                (this.interval / 1000);
              newStat.receivedBPS =
                (newStat.receivedBytes - oldStat.receivedBytes) /
                (this.interval / 1000);
          }
          // statsOutput += `<h2>Report: ${report.type}</h2>\n<strong>ID:</strong> ${report.id}<br>\n` +
          //               `<strong>Timestamp:</strong> ${report.timestamp}<br>\n`;
          // Object.keys(report).forEach(statName => {
          //   if (statName !== "id" && statName !== "timestamp" && statName !== "type") {
          //     statsOutput += `<strong>${statName}:</strong> ${report[statName]}<br>\n`;
          //   }
          // });
        });
        // console.log(statsOutput)
      });
      // console.log(newStat);
      this.context.callEvent({ name: "onStat", param: newStat });
    }, this.interval);
  }

  _clear() {
    if (this.statsReportTimer) {
      window.clearInterval(this.statsReportTimer);
      this.statsReportTimer = null;
    }
  }
}
export default Health;
