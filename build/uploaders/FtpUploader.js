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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FTP = require('ftp'); /*
                           * deploy-asset
                           * https://github.com/qiu8310/deploy-asset
                           *
                           * Copyright (c) 2015 Zhonglei Qiu
                           * Licensed under the MIT license.
                           */

var FtpUploader = function (_Uploader) {
  (0, _inherits3.default)(FtpUploader, _Uploader);

  function FtpUploader() {
    (0, _classCallCheck3.default)(this, FtpUploader);
    return (0, _possibleConstructorReturn3.default)(this, (FtpUploader.__proto__ || Object.getPrototypeOf(FtpUploader)).apply(this, arguments));
  }

  (0, _createClass3.default)(FtpUploader, [{
    key: 'initService',


    /**
     * @override
     * @borrows Uploader.initService
     */
    value: function initService(done) {
      var opts = this.opts;
      var ftp = new FTP();
      var ended = false;
      var cb = function cb(err) {
        if (ended) return true;
        ended = true;
        done(err);
      };

      ftp.connect({
        host: opts.host,
        user: opts.user,
        password: opts.pass,
        port: opts.port
      });

      ftp.on('error', cb);
      ftp.on('ready', cb);

      this.ftp = ftp;
    }

    /**
     * @override
     * @borrows Uploader.destroyService
     */

  }, {
    key: 'destroyService',
    value: function destroyService(done) {
      this.ftp.end();
    }

    /**
     * @override
     * @borrows Uploader.uploadFile
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile(file, done) {
      var _this2 = this;

      this.ftp.mkdir(this.env.getFileRemoteDir(file), true, function (err) {
        if (err) return done(err);
        _this2.ftp.put(file.remote.content, _this2.env.getFileRemotePath(file), done);
      });
    }

    /**
     * @override
     * @borrows Uploader.isRemoteFileExists
     */

  }, {
    key: 'isRemoteFileExists',
    value: function isRemoteFileExists(file, done) {
      this.ftp.size(this.env.getFileRemotePath(file), function (err, res) {
        if (err) {
          if (err.code === 550) done(null, false);else done(err);
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

      this.ftp.get(this.env.getFileRemotePath(file), function (err, stream) {
        if (err) return done(err);
        var data = [];
        stream.on('data', function (buffer) {
          return data.push(buffer);
        });
        stream.on('end', function () {
          return done(null, Buffer.concat(data));
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
      this.ftp.delete(this.env.getFileRemotePath(file), done);
    }
  }]);
  return FtpUploader;
}(_Uploader3.default);

FtpUploader.config = {
  error: {
    host: 'FTP 域名',
    user: 'FTP 用户名',
    pass: ['FTP 密码',, true],
    baseUrl: 'FTP 服务器基准 URL'
  },
  verbose: {
    port: ['FTP 端口号', 21]
  }
};

exports.default = FtpUploader;
module.exports = exports['default'];