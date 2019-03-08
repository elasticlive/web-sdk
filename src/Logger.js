// TODO: change live to ...
const logger = (() => {
  const logLevelPreset = [
    "SILENT",
    "ERROR",
    "WARN",
    "INFO",
    "DEBUG",
    "VERBOSE"
  ];
  let level;
  let ctx;
  let url;

  function init(c) {
    ctx = c;
    level = ctx.config.sdk.logLevel;
    url = ctx.config.sdk.url.log;
  }

  function e(...message) {
    if (level === "SILENT") {
      return;
    }
    console.error(...message);
  }

  function w(...message) {
    if (level === "SILENT" || level === "ERROR") {
      return;
    }
    console.warn(...message);
  }

  function l(...message) {
    i(...message);
  }

  function i(...message) {
    if (level === "SILENT" || level === "ERROR" || level === "WARN") {
      return;
    }
    console.info(...message);
  }

  function t(ctx, message) {
    if (ctx.role === "CALLER" || ctx.role === "CASTOR") return;
    fetch(ctx.config.sdk.url.channelLog, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" }
    }).catch(e => {
      console.error(e);
    });
  }

  function d(...message) {
    if (
      level === "SILENT" ||
      level === "ERROR" ||
      level === "WARN" ||
      level === "INFO"
    ) {
      return;
    }
    console.debug(...message);
  }

  function v(...object) {
    if (
      level === "SILENT" ||
      level === "ERROR" ||
      level === "WARN" ||
      level === "INFO" ||
      level === "DEBUG"
    ) {
      return;
    }
    console.trace(...object);
  }

  return Object.freeze({
    init,
    e,
    w,
    l,
    i,
    d,
    v,
    t
  });
})();

export default logger;
