import { Controller, Post, Get, Body } from '@nestjs/common'

const fs = require('fs')

@Controller()
export class AppController {
  dataFile: string

  constructor() {
  }

  @Get('check-need-login')
  async CheckNeedLogin() {
    let result = {
      data: {
        showDialog: false,
        type: 0
      },
      responseCode: 200,
      message: 'success'
    }
    try {
      const exists1 = await fs.existsSync('need-login')
      const exists2 = await fs.existsSync('need-login-type2')
      const type = exists1 ? 1 : 2
      if (exists1 || exists2) {
        if (exists1) fs.unlinkSync('need-login')
        if (exists2) fs.unlinkSync('need-login-type2')
        result = {
          data: {
            showDialog: true,
            type: type
          },
          responseCode: 200,
          message: 'success'
        }
      } else {
        result = {
          data: {
            showDialog: false,
            type: 0
          },
          responseCode: 404,
          message: 'Not Found'
        }
      }
    } catch (e) {
      result = {
        data: {
          showDialog: false,
          type: 0
        },
        responseCode: 404,
        message: 'error'
      }
    }
    return result

  }

  @Post('send-push-to-mobile')
  sendPushToMobile() {
    fs.writeFile('need-login', '', (err) => {
      if (err) console.log(err)
    })
    return {
      responseCode: 200,
      message: 'success'
    }
  }

  @Post('send-push-to-mobile-type2')
  sendPushToMobileType2() {
    fs.writeFile('need-login-type2', '', (err) => {
      if (err) console.log(err)
    })
    return {
      responseCode: 200,
      message: 'success'
    }
  }

  @Get('check-need-confirm')
  async CheckNeedConfirm() {

    let result = {
      data: false,
      responseCode: 200,
      message: 'success'
    }
    try {
      const exists = await fs.readFileSync('need-confirm.txt')

      if (exists) {
        const fileData = JSON.parse(exists)
        fs.unlinkSync('need-confirm.txt')
        result = {
          data: fileData,
          responseCode: 200,
          message: 'success'
        }
      } else {
        result = {
          data: false,
          responseCode: 200,
          message: 'success'
        }
      }
    } catch (e) {
      result = {
        data: false,
        responseCode: 404,
        message: 'success'
      }
    }
    return result

  }

  @Post('send-push-to-web')
  sendPushToWeb(@Body() body: any) {
    fs.writeFile('need-confirm.txt', JSON.stringify(body), (err) => {
      if (err) console.log(err)
    })
    return {
      responseCode: 200,
      message: 'success'
    }
  }

}
