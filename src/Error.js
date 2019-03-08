export default class SlimeError extends Error{
  constructor(message, e){
    super(message)
    this.name='ELiveError'
    if (e) console.error(e)
  }
}