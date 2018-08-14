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

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _upyun = require('upyun');

var _upyun2 = _interopRequireDefault(_upyun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * deploy-asset
 * https://github.com/qiu8310/deploy-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

var UpyunUploader = function (_Uploader) {
  (0, _inherits3.default)(UpyunUploader, _Uploader);

  function UpyunUploader() {
    (0, _classCallCheck3.default)(this, UpyunUploader);
    return (0, _possibleConstructorReturn3.default)(this, (UpyunUploader.__proto__ || Object.getPrototypeOf(UpyunUploader)).apply(this, arguments));
  }

  (0, _createClass3.default)(UpyunUploader, [{
    key: '_mkdirp',
    value: function _mkdirp(dir, done) {
      var _this2 = this;

      this.upyun.existsFile(dir, function (err, res) {
        if (err) return done(err);

        if (res.error) {
          // 文件不存在，需要重新创建
          _this2.upyun.createDir(dir, function (err, res) {
            done(err || res.error, dir);
          });
        } else {
          // 文件存在，直接返回
          done(null, dir);
        }
      });
    }

    /**
     * @override
     * @borrows Uploader.beforeInitOpts
     */

  }, {
    key: 'beforeInitOpts',
    value: function beforeInitOpts(opts) {
      if (!opts.operator && !opts.password && !opts.bucket && !opts.domain) {
        this.log.warn('你当前使用的是 ^又拍云上传器^ ');
        this.log.warn('你没有配置任何的又拍云配置，所以默认使用了一个公共的又拍云帐号');
        this.log.warn('此公共帐号 #随时可能被禁用# ，你可以去又拍云官网申请一个免费的帐号即可');

        opts.operator = 'dao';
        opts.password = 'da-deploy-asset';
        opts.bucket = 'da-deploy-asset';
        opts.domain = 'da-deploy-asset.b0.upaiyun.com';
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
      var _opts = this.opts,
          bucket = _opts.bucket,
          operator = _opts.operator,
          password = _opts.password,
          endpoint = _opts.endpoint,
          apiVersion = _opts.apiVersion;

      this.upyun = new _upyun2.default(bucket, operator, password, endpoint, apiVersion);
    }

    /**
     * @override
     * @borrows Uploader.destroyService
     */

  }, {
    key: 'destroyService',
    value: function destroyService() {
      this.upyun = null;
    }

    /**
     * @override
     * @borrows Uploader.uploadFile
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile(file, done) {
      var _this3 = this;

      var filePath = this.env.getFileRemotePath(file);
      this._mkdirp(this.env.getFileRemoteDir(file), function (err) {
        if (err) return done(err);
        _this3.upyun.uploadFile(filePath, file.remote.content, file.mimeType, true, function (err, res) {
          if (err || res.error) return done(err || res.error);
          done(null, res);
        });
      });
    }

    /**
     * @override
     * @borrows Uploader.isRemoteFileExists
     */

  }, {
    key: 'isRemoteFileExists',
    value: function isRemoteFileExists(file, done) {
      this.upyun.existsFile(this.env.getFileRemotePath(file), function (err, res) {
        if (err) return done(err);
        if (res.error) {
          if (res.error.code === 404) done(null, false);else done(res.error);
        } else {
          done(null, true);
        }
      });
    }

    /**
     * @override
     * @borrows Uploader.getRemoteFileContent
     */

  }, {
    key: 'getRemoteFileContent',
    value: function getRemoteFileContent(file, done) {
      var tmpFilePath = this.constructor.getLocalTmpFilePath();
      var clear = function clear() {
        return _fsExtra2.default.removeSync(tmpFilePath);
      };

      this.upyun.downloadFile(this.env.getFileRemotePath(file), tmpFilePath, function (err, rtn) {
        if (err || rtn.error || rtn.statusCode >= 400) {
          clear();
          return done(err || rtn);
        }

        _fsExtra2.default.readFile(tmpFilePath, function (err, rtn) {
          clear();
          done(err, rtn);
        });
      });
    }

    /**
     * @override
     * @borrows Uploader.removeRemoteFile
     */

  }, {
    key: 'removeRemoteFile',
    value: function removeRemoteFile(file, done) {
      this.upyun.removeFile(this.env.getFileRemotePath(file), function (err, res) {
        if (err || res.error) return done(err || res.error);
        done(null, res);
      });
    }
  }]);
  return UpyunUploader;
}(_Uploader3.default);

UpyunUploader.config = {
  error: {
    operator: '又拍云 操作员',
    password: ['又拍云 操作员密码',, true],
    bucket: '又拍云 空间',
    domain: '又拍云 当前空间的域名'
  },
  verbose: {
    endpoint: ['又拍云 节点', 'v0'],
    apiVersion: ['又拍云 接口版本', 'legacy']
  }
};

exports.default = UpyunUploader;
module.exports = exports['default'];