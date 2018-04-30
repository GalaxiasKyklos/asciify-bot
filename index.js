require('dotenv').config()
const Bot = require('slackbots')

// create a bot
const settings = {
    token: process.env.SLACK_TOKEN,
    name: 'asciify',
}

class asciify extends Bot {
  constructor(settings) {
    super(settings)
    this.settings = settings

    this.run = this.run.bind(this)
    this.onMessage = this.onMessage.bind(this)
  }

  run() {
    this.on('message', this.onMessage)
  }

  onMessage(message) {
    console.log('::', message)
    if (message.type === 'message' && message.bot_id !== 'BAF6F2EQ0') {
      this.postMessageToChannel('asciify-dev', message.text, { as_user:true })
    }
    return message
  }
}

new asciify(settings).run()
