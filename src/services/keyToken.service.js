'use strict'

const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // // lv0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // return tokens ? tokens.publicKey : null

      // lv xx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { new: true, upsert: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
      console.log('Token created: ', tokens)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
      return error
    }
  }

  static findByUserId = async (userId) => {
    console.log('userId: ', userId)
    const objectId = new Types.ObjectId(userId) // !TODO: refactor this
    return await keyTokenModel.findOne({ user: objectId }).lean()
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) })
  }
}

module.exports = KeyTokenService
