'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Uploader2 = require('./Uploader');

var _Uploader3 = _interopRequireDefault(_Uploader2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _qiniu = require('qiniu');

var _qiniu2 = _interopRequireDefault(_qiniu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QiniuUploader = function (_Uploader) {
  (0, _inherits3.default)(QiniuUploader, _Uploader);

  function QiniuUploader() {
    (0, _classCallCheck3.default)(this, QiniuUploader);
    return (0, _possibleConstructorReturn3.default)(this, (QiniuUploader.__proto__ || Object.getPrototypeOf(QiniuUploader)).apply(this, arguments));
  }

  (0, _createClass3.default)(QiniuUploader, [{
    key: 'beforeInitOpts',


    /**
     * @override
     * @borrows Uploader.beforeInitOpts
     */
    value: function beforeInitOpts(opts) {
      if (!opts.ak && !opts.sk && !opts.bucket && !opts.domain) {
        this.log.warn('你当前使用的是 ^七牛上传器^ ');
        this.log.warn('你没有配置任何的七牛配置，所以默认使用了一个公共的七牛帐号');
        this.log.warn('此公共帐号 #无法上传 html 文件# ，你可以去七牛官网申请一个免费的帐号即可');

        opts.ak = '6mU6vJ3h3ffH4DrPaAyH1SDsDMktTjpBq0U6Zo8G';
        opts.sk = '0Haz628E6jxjRwdXUiYpbH4jApz019XM6L6Ykl0M';
        opts.bucket = 'depot-asset';
        opts.domain = '7ximfq.com1.z0.glb.clouddn.com';
      }

      return opts;
    }

    /**
     * @override
     * @borrows Uploader.initService
     */

  }, {
    key: 'initService',
    value: function initService() {
      _qiniu2.default.conf.ACCESS_KEY = this.opts.ak;
      _qiniu2.default.conf.SECRET_KEY = this.opts.sk;
      this.client = new _qiniu2.default.rs.Client();
    }

    /**
     * @override
     * @borrows Uploader.destroyService
     */

  }, {
    key: 'destroyService',
    value: function destroyService() {
      this.client = null;
    }

    /**
     * @override
     * @borrows Uploader.uploadFile
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile(file, done) {
      // bucket:filename => 覆盖式上传
      var filePath = this.env.getFileRemotePath(file, false);
      var token = new _qiniu2.default.rs.PutPolicy(this.opts.bucket + ':' + filePath).token();
      var extra = new _qiniu2.default.io.PutExtra({}, file.mimeType);
      _qiniu2.default.io.put(token, filePath, file.remote.content, extra, function (err, ret) {
        if (err) return done(err);
        done(null, ret);
      });
    }

    /**
     * @override
     * @borrows Uploader.isRemoteFileExists
     */

  }, {
    key: 'isRemoteFileExists',
    value: function isRemoteFileExists(file, done) {
      this.client.stat(this.opts.bucket, this.env.getFileRemotePath(file, false), function (err) {
        if (err) {
          if (err.code === 612) return done(null, false);
          return done(err);
        }
        done(null, true);
      });
    }

    /**
     * @override
     * @borrows Uploader.getRemoteFileContent
     */

  }, {
    key: 'getRemoteFileContent',
    value: function getRemoteFileContent(file, done) {
      this.constructor.download(file.remote.url, function (err, buffer) {
        done(err, err ? null : buffer);
      });
    }

    /**
     * @override
     * @borrows Uploader.removeRemoteFile
     */

  }, {
    key: 'removeRemoteFile',
    value: function removeRemoteFile(file, done) {
      this.client.remove(this.opts.bucket, this.env.getFileRemotePath(file, false), function (err, ret) {
        if (err) return done(err);
        done(null, ret);
      });
    }
  }]);
  return QiniuUploader;
}(_Uploader3.default); /*
                        * deploy-asset
                        * https://github.com/qiu8310/deploy-asset
                        *
                        * Copyright (c) 2015 Zhonglei Qiu
                        * Licensed under the MIT license.
                        */

QiniuUploader.config = {
  error: {
    ak: '七牛 Access Key',
    sk: ['七牛 Secret Key',, true],
    bucket: '七牛 空间',
    domain: '七牛 当前空间的域名'
  }
};

exports.default = QiniuUploader;
module.exports = exports['default'];