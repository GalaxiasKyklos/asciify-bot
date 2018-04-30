require('dotenv').config()
const Bot = require('slackbots')
const axios = require('axios')
const isUrl = require('is-url')

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
    this.getASCII = this.getASCII.bind(this)
  }

  run() {
    this.on('message', this.onMessage)
  }

  async onMessage(message) {
    const channel = this.getChannels()._value.channels.find(channel => channel.id === message.channel)
    const user = this.getUsers()._value.members.find(user => user.id === message.user)
    const asciiRequest = {
      width: 40,
      height: 40,
    }
    if (message.type === 'message' && message.bot_id !== 'BAF6F2EQ0') {
      const curatedMsg = message.text.replace('<@UAFAWQ5GR> ', '')
      asciiRequest.url = curatedMsg === 'me' ? user.profile.image_original : curatedMsg.slice(1, -1)
      if (message.subtype === 'file_share') {
        try {
          const {
            data
          } = await axios.get(message.file.thumb_64, {
            responseType: 'arraybuffer',
            headers: {
              Authorization: `Bearer ${process.env.SLACK_TOKEN}`
            }
          })
          asciiRequest.fileName = message.file.name
          asciiRequest.image = data.toString('base64')
          delete asciiRequest.url
        } catch (e) {
          console.error(e)
        }
      }
      const response = await this.getASCII(asciiRequest)
      if (channel && message.text.startsWith('<@UAFAWQ5GR>')) {
        this.postMessageToChannel(channel.name, response, {
          as_user: true
        })
      } else if (!channel) {
        this.postMessageToUser(user.name, response, {
          as_user: true
        })
      }
    }
    return message
  }

  async getASCII(request) {
    if ((request.url && isUrl(request.url)) || request.image) {
      try {
        const {
          data: ascii
        } = await axios.post('https://r9l2cw9nk7.execute-api.us-east-2.amazonaws.com/Production', request)
        return `\`\`\`${ascii}\`\`\``
      } catch (e) {
        console.error(e)
      }
    }
    return 'Pa que quieres eso, jaja, saludos'
  }
}

new asciify(settings).run()
