const ApiService = require('../../base/apiService');
const UserRepository = require('./userRepository');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcrypt');

/**
 * Provides a service for user API.
 * @extends base.ApiService
 * @memberof features.user
 */
class UserService extends ApiService {
  /**
   * Initializes a new instance of `UserService` class
   * @param {ApiContext} context
   */
  constructor(context) {
    super(context);

    this.request = context.request;

    this.response = context.response;

    /**
     * User Repository
     * @type {features.UserRepository}
     */
    this.userRepository = new UserRepository(context);
  }

  /**
   * sends reset link
   * @param {string} email of the user
   */
  async sendResetPwLink(email) {
    const userData = await this.userRepository.checkIfExist(email, 'Email');
    if (userData.length > 0) {
      const token = _encrypt(`${userData[0].UserId}-${userData[0].Email}-${moment().format('DD MM YYYY hh:mm:ss')}`);
      await this.userRepository.updateToken(email, token);
      const transporter = nodemailer.createTransport({
        service: process.env.emailService,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.emailId, // generated ethereal user
          pass: process.env.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      await transporter.sendMail({
        from: `"Heeko Hub 👻" <${process.env.emailId}>`, // sender address used static but can be configurable
        to: email, // list of receivers
        subject: "Password Reset Link", // Subject line
        text: "Reset your password by clicking below", // plain text body
        html: `<a href='http://localhost:3000/ChangePass?id=${userData[0].UserId}'>Click Me To Reset Your Password</a>`, // html body
      });
    }
    return userData;
  }

  /**
   * Checks the token expiry
   * @param {number} id of the user
   */
  async checkToken(userId) {
    let data = await this.userRepository.getToken(userId);
    if(data.length > 0) {
      const token = _decrypt(data[0].ResetToken);
      const timeStr = token.split("-")[2];
      const now = moment().format('DD MM YYYY hh:mm:ss');
      const timeDiff = moment(now, 'DD MM YYYY hh:mm:ss').diff(moment(timeStr, 'DD MM YYYY hh:mm:ss'), "minutes");
      console.log(moment().format('DD MM YYYY hh:mm:ss'));
      if (timeDiff > 1) {
        return { isExpired: true, tokenExist: true };
      }
      return { isExpired: false, tokenExist: true };
    }
    return { isExpired: false, tokenExist: false };
  }

  /**
   * Changes the pw of an user
   * @param {string} pw of the user
   */
  async changePassword(password, userId) {
    const hash = await bcrypt.hash(password, parseInt(process.env.saltRounds));
    return await this.userRepository.updatePassword(hash, userId);
  }

}

module.exports = UserService;

function _encrypt(text){
  let cipher = crypto.createCipher('aes-128-cbc', process.env.secret);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex')
  return crypted;
}

function _decrypt(text){
  let decipher = crypto.createDecipher('aes-128-cbc', process.env.secret)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
