/*
 * deploy-asset
 * https://github.com/qiu8310/deploy-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

import Uploader from './Uploader';
import path from 'path';
const OSS = require('ali-oss');

class AliUploader extends Uploader {


  /**
   * @override
   * @borrows Uploader.beforeInitOpts
   */
  beforeInitOpts(opts) {
    if (!opts.ak && !opts.sk && !opts.bucket && !opts.domain) {
      this.log.warn('你当前使用的是 ^阿里上传器^ ');
      throw new Error('你没有配置任何的阿里配置，所以默认使用了一个公共的七牛帐号')
    }

    return opts;
  }

  /**
   * @override
   * @borrows Uploader.initService
   */
  initService() {
    const {opts: {ak: accessKeyId, sk: accessKeySecret, region, bucket}} = this;
    const client = OSS({
      accessKeyId, accessKeySecret, region, bucket
    });
    this.client = client;
  }

  /**
   * @override
   * @borrows Uploader.destroyService
   */
  destroyService() {
    this.client = null;
  }

  /**
   * @override
   * @borrows Uploader.uploadFile
   */
  uploadFile(file, done) {
    let filePath = this.env.getFileRemotePath(file, false);
    this.client.put(filePath, file).then(ret => {
      done(null, ret)
    });
  }

  /**
   * @override
   * @borrows Uploader.isRemoteFileExists
   */
  isRemoteFileExists(file, done) {
    this.client.get(this.env.getFileRemotePath(file, false)).then(ret => {
      if (ret) done(null, true)
      else done(null)

    })
  }

  /**
   * @override
   * @borrows Uploader.getRemoteFileContent
   */
  getRemoteFileContent(file, done) {
    this.client.get(this.env.getFileRemotePath(file, false)).then((err, buffer) => {
      done(err, err ? null : buffer)
    });
  }

  /**
   * @override
   * @borrows Uploader.removeRemoteFile
   */
  removeRemoteFile(file, done) {
    this.client.delete(this.env.getFileRemotePath(file, false), (err, ret) => {
      if (err) return done(err);
      done(null, ret);
    });
  }
}


AliUploader.config = {
  error: {
    ak: '阿里 Access Key',
    sk: ['阿里 Secret Key', ,true],
    region: '阿里 地区',
    bucket: '阿里 空间',
    domain: '阿里 当前空间的域名'
  }
};

export default AliUploader;
