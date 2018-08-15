'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * deploy-asset
 * https://github.com/qiu8310/deploy-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

var OSS = require('ali-oss');

var AliUploader = function (_Uploader) {
  (0, _inherits3.default)(AliUploader, _Uploader);

  function AliUploader() {
    (0, _classCallCheck3.default)(this, AliUploader);
    return (0, _possibleConstructorReturn3.default)(this, (AliUploader.__proto__ || Object.getPrototypeOf(AliUploader)).apply(this, arguments));
  }

  (0, _createClass3.default)(AliUploader, [{
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
      var _opts = this.opts,
          accessKeyId = _opts.ak,
          accessKeySecret = _opts.sk,
          region = _opts.region,
          bucket = _opts.bucket;

      var client = new OSS({
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
        console.log('uploadFile', ret);
        done(null, ret);
      }).catch(function (err) {
        done(err);
      });
    }

    /**
     * @override
     * @borrows Uploader.isRemoteFileExists
     */

  }, {
    key: 'isRemoteFileExists',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file, done) {
        var ret;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.client.get(this.env.getFileRemotePath(file, false));

              case 3:
                ret = _context.sent;

                console.log('isRemoteFileExists', ret);
                done(null, true);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                done(null, false);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function isRemoteFileExists(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return isRemoteFileExists;
    }()

    /**
     * @override
     * @borrows Uploader.getRemoteFileContent
     */

  }, {
    key: 'getRemoteFileContent',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(file, done) {
        var buffer;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.client.get(this.env.getFileRemotePath(file, false));

              case 3:
                buffer = _context2.sent;

                console.log('getRemoteFileContent', buffer);
                done(null, buffer);
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](0);

                done(_context2.t0, null);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 8]]);
      }));

      function getRemoteFileContent(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getRemoteFileContent;
    }()

    /**
     * @override
     * @borrows Uploader.removeRemoteFile
     */

  }, {
    key: 'removeRemoteFile',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(file, done) {
        var ret;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.client.delete(this.env.getFileRemotePath(file, false));

              case 3:
                ret = _context3.sent;

                console.log('removeRemoteFile', ret);
                done(null, ret);
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3['catch'](0);

                done(_context3.t0);

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 8]]);
      }));

      function removeRemoteFile(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return removeRemoteFile;
    }()
  }]);
  return AliUploader;
}(_Uploader3.default);

AliUploader.config = {
  error: {
    ak: '阿里 Access Key',
    sk: ['阿里 Secret Key',, true],
    region: '阿里 地区',
    bucket: '阿里 空间',
    domain: '阿里 当前空间的域名'
  }
};

exports.default = AliUploader;
module.exports = exports['default'];