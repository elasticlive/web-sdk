export default class ELiveError extends Error {
  constructor(message, e) {
    super(message);
    this.name = "ELiveError";
    this.message = message;
    if (e) console.error(e);
  }
}
