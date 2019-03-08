import l from './Logger'
import platform from 'platform'
import SlimeError from './Error';

export default async function Auth(ctx) {
  l.d(`start auth with context`)
  const messageBody = {
    credential: { key: ctx.config.credential.key, serviceId: ctx.config.credential.serviceId },
    env: {
      os: platform.os.family,
      osVersion: platform.os.version || '0',
      device: platform.name,
      deviceVersion: platform.version || '0',
      sdkVersion: ctx.elive.version,
      country: (ctx.config.sdk && ctx.config.sdk.country)? ctx.config.sdk.country:'KR'
    }
  }
  const message = {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(messageBody)
  }
  try {
    const respObject = await fetch(ctx.config.sdk.url.auth, message)
    const response = await respObject.json()
    l.d('auth response:')
    l.d(response)
  
    Object.keys(response).forEach(responseJsonKey => {
      switch (responseJsonKey) {
        case 'iceServers': {
          response[responseJsonKey].forEach(server =>
            ctx.config.rtc.iceServers.push(server))
          break
        }
        case 'token': {
          ctx.token = response[responseJsonKey]
          break
        }
        default:
      }
    })
  }catch (e) {
    console.error(e)
    throw new SlimeError(`Auth is failed with id:${ctx.config.credential.serviceId}/ key:${ctx.config.credential.key}`)
  }
  if (!ctx.token)
    throw new SlimeError(`failed to auth with id: ${ctx.config.credential.serviceId} and key: ${ctx.config.credential.key}`)
  l.d('success auth')
}