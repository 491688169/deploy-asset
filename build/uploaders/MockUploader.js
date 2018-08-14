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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MockUploader = function (_Uploader) {
  (0, _inherits3.default)(MockUploader, _Uploader);

  function MockUploader(opts, env) {
    (0, _classCallCheck3.default)(this, MockUploader);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MockUploader.__proto__ || Object.getPrototypeOf(MockUploader)).call(this, opts, env));

    _this._hook('constructor', true, opts);
    _this._hook('init', true, opts);
    return _this;
  }

  (0, _createClass3.default)(MockUploader, [{
    key: '_hook',
    value: function _hook(name, rtn) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var err = void 0,
          hook = this.opts.hooks[name],
          done = args[args.length - 1];

      if (typeof done === 'function') args.pop();else done = function done() {};

      if (typeof hook === 'function') {
        try {
          rtn = hook.apply(this, args);
        } catch (e) {
          err = e;
        }
      }

      done(err, rtn);
    }
  }, {
    key: 'initService',
    value: function initService(done) {
      this._hook('initService', null, done);
    }
  }, {
    key: 'destroyService',
    value: function destroyService(done) {
      this._hook('destroyService', null, done);
    }
  }, {
    key: 'beforeUpload',
    value: function beforeUpload(done) {
      this._hook('beforeUpload', null, done);
    }
  }, {
    key: 'afterUpload',
    value: function afterUpload(done) {
      this._hook('afterUpload', null, done);
    }
  }, {
    key: 'beforeUploadFile',
    value: function beforeUploadFile(file, done) {
      this._hook('beforeUploadFile', null, file, done);
    }
  }, {
    key: 'afterUploadFile',
    value: function afterUploadFile(file, done) {
      this._hook('afterUploadFile', null, file, done);
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(file, done) {
      this._hook('uploadFile', null, file, done);
    }
  }, {
    key: 'isRemoteFileExists',
    value: function isRemoteFileExists(file, done) {
      this._hook('isRemoteFileExists', false, file, done);
    }
  }, {
    key: 'getRemoteFileContent',
    value: function getRemoteFileContent(file, done) {
      this._hook('getRemoteFileContent', new Buffer('__content*dasd'), file, done);
    }
  }, {
    key: 'removeRemoteFile',
    value: function removeRemoteFile(file, done) {
      this._hook('removeRemoteFile', null, file, done);
    }
  }]);
  return MockUploader;
}(_Uploader3.default); /*
                        * deploy-asset
                        * https://github.com/qiu8310/deploy-asset
                        *
                        * Copyright (c) 2015 Zhonglei Qiu
                        * Licensed under the MIT license.
                        */

MockUploader.config = {
  verbose: {
    hooks: ['hooks', {}],
    baseUrl: ['域名', 'da-mock.com'],
    destDir: ['路径', '/'],
    appendDestDirToBaseUrl: ['追回', true]
  }
};

exports.default = MockUploader;
module.exports = exports['default'];