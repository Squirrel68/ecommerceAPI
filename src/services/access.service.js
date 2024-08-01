'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  // check this refresh token is used or not
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError(`Something wrong happened !! Please login again`)
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered 2')
    // create new token pair
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })
    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(delKey)
    return delKey
  }
  static login = async ({ email, password, refreshToken = null }) => {
    //1.
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError(`Error: Shop with email ${email} not found`)
    }
    //2.
    const isMatch = await bcrypt.compare(password, foundShop.password)
    if (!isMatch) {
      throw new AuthFailureError(`Authentication error`)
    }
    //3. create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    //4. generate tokens
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist?
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        throw new BadRequestError(`Error: Shop with email ${email} already exists`)
      }
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        console.log({ privateKey, publicKey })

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error'
          }
        }
        // create token pair
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
        console.log(`Create Token Success::`, tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop
            }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService
