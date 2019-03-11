export default class ELiveError extends Error {
  constructor(message, e) {
    super(message);
    this.name = "ELiveError";
    this.code = message.code;
    this.text = message.text;
    if (e) console.error(e);
  }
}
