### nGrok

nGrok will tunnel a port on your machine to a fixed URL controlled by nGrok's system. This is done as a convenience step to make prototyping & implementing conversational experiences as fast (and secure) as possible.

<p>

**IMPORTANT:** nGrok will expose your port to nGrok's systems so your local install can talk to DialogFlow-- there are password-protected & pro/paid plans: https://ngrok.com/pricing

nGrok was developed by Alan Shreeve as a way to learn Go. nGrok will open a "secure" tunnel to nGrok's system so external services (like DialogFlow's webhook system) can access exposed resources on your local machine as if they were deployed on the public internet. This can make developing fulfillment webhooks insanely convenient & fast-- nGrok also comes with a network inspector available on localhost:4040

While it's really simple/fast to get up and running with a webhook, the downside of this approach is that every time you restart nGrok you will be assigned a new URL which you'll need to update inside DialogFlow's fulfillment settings (paid versions of nGrok have persistent URLs & other features.)

Additionally, this repo uses an **[npm package](https://www.npmjs.com/package/ngrok)** which instruments on top of nGrok and will append the endpoint specified in **[config.js](../config.js)**

Using nGrok means you...

- Trust nGrok & the team building systems/servicing for it

- Trust author of nGrok npm package (you can inspect package-lock.json) which downloads an nGrok binary

nGrok is used for speed + convenience only, you can alternatively deploy as a publically-accessible resource, ex like a **[Cloud Function](https://cloud.google.com/functions/docs/writing)**

</p>
</details>
