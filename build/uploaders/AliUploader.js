/*
 * deploy-asset
 * https://github.com/qiu8310/deploy-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Uploader2 = require('./Uploader');

var _Uploader3 = _interopRequireDefault(_Uploader2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var OSS = require('ali-oss');

var AliUploader = (function (_Uploader) {
  _inherits(AliUploader, _Uploader);

  function AliUploader() {
    _classCallCheck(this, AliUploader);

    _get(Object.getPrototypeOf(AliUploader.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AliUploader, [{
    key: 'beforeInitOpts',

    /**
     * @override
     * @borrows Uploader.beforeInitOpts
     */
    value: function beforeInitOpts(opts) {
      if (!opts.ak && !opts.sk && !opts.bucket && !opts.domain) {
        this.log.warn('你当前使用的是 ^阿里上传器^ ');
        throw new Error('你没有配置任何的阿里配置，所以默认使用了一个公共的七牛帐号');
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
      var _opts = this.opts;
      var accessKeyId = _opts.ak;
      var accessKeySecret = _opts.sk;
      var region = _opts.region;
      var bucket = _opts.bucket;

      var client = OSS({
        accessKeyId: accessKeyId, accessKeySecret: accessKeySecret, region: region, bucket: bucket
      });
      this.client = client;
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
      var filePath = this.env.getFileRemotePath(file, false);
      this.client.put(filePath, file).then(function (ret) {
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
      this.client.get(this.env.getFileRemotePath(file, false)).then(function (ret) {
        if (ret) done(null, true);else done(null);
      });
    }

    /**
     * @override
     * @borrows Uploader.getRemoteFileContent
     */
  }, {
    key: 'getRemoteFileContent',
    value: function getRemoteFileContent(file, done) {
      this.client.get(this.env.getFileRemotePath(file, false)).then(function (err, buffer) {
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
      this.client['delete'](this.env.getFileRemotePath(file, false), function (err, ret) {
        if (err) return done(err);
        done(null, ret);
      });
    }
  }]);

  return AliUploader;
})(_Uploader3['default']);

AliUploader.config = {
  error: {
    ak: '阿里 Access Key',
    sk: ['阿里 Secret Key',, true],
    region: '阿里 地区',
    bucket: '阿里 空间',
    domain: '阿里 当前空间的域名'
  }
};

exports['default'] = AliUploader;
module.exports = exports['default'];