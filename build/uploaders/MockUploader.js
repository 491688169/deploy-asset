'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Uploader2 = require('./Uploader');

var _Uploader3 = _interopRequireDefault(_Uploader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * deploy-asset
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://github.com/qiu8310/deploy-asset
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2015 Zhonglei Qiu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var MockUploader = function (_Uploader) {
  _inherits(MockUploader, _Uploader);

  function MockUploader(opts, env) {
    _classCallCheck(this, MockUploader);

    var _this = _possibleConstructorReturn(this, (MockUploader.__proto__ || Object.getPrototypeOf(MockUploader)).call(this, opts, env));

    _this._hook('constructor', true, opts);
    _this._hook('init', true, opts);
    return _this;
  }

  _createClass(MockUploader, [{
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
}(_Uploader3.default);

MockUploader.config = {
  verbose: {
    hooks: ['hooks', {}],
    baseUrl: ['域名', 'da-mock.com'],
    destDir: ['路径', '/'],
    appendDestDirToBaseUrl: ['追回', true]
  }
};

exports.default = MockUploader;