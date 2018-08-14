'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Uploader2 = require('./Uploader');

var _Uploader3 = _interopRequireDefault(_Uploader2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * deploy-asset
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://github.com/qiu8310/deploy-asset
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2015 Zhonglei Qiu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var OSS = require('ali-oss');

var AliUploader = function (_Uploader) {
  _inherits(AliUploader, _Uploader);

  function AliUploader() {
    _classCallCheck(this, AliUploader);

    return _possibleConstructorReturn(this, (AliUploader.__proto__ || Object.getPrototypeOf(AliUploader)).apply(this, arguments));
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
      var _opts = this.opts,
          accessKeyId = _opts.ak,
          accessKeySecret = _opts.sk,
          region = _opts.region,
          bucket = _opts.bucket;

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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, done) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.client.get(this.env.getFileRemotePath(file, false));

              case 3:
                done(null, true);
                _context.next = 9;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);

                done(null);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 6]]);
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file, done) {
        var buffer;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.client.get(this.env.getFileRemotePath(file, false));

              case 3:
                buffer = _context2.sent;

                done(null, buffer);
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);

                done(_context2.t0, null);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
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
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(file, done) {
        var ret;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.client.delete(this.env.getFileRemotePath(file, false));

              case 3:
                ret = _context3.sent;

                done(null, ret);
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3['catch'](0);

                done(_context3.t0);

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
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