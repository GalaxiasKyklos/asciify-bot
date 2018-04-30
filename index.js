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
    let channel = this.getChannels()._value.channels.find(channel => channel.id === message.channel)
    console.log('::', message)
    if (message.type === 'message' && message.bot_id !== 'BAF6F2EQ0') {
      if(channel){
        this.postMessageToChannel(channel.name, message.text, { as_user:true })
      } else {
        const user = this.getUsers()._value.members.find(user => user.id === message.user)
        this.postMessageToUser(user.name, message.text, { as_user:true })
      }
    }
    return message
  }
}

new asciify(settings).run()
