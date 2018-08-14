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

var _githubApi = require('github-api');

var _githubApi2 = _interopRequireDefault(_githubApi);

var _binaryExtensions = require('binary-extensions');

var _binaryExtensions2 = _interopRequireDefault(_binaryExtensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * deploy-asset
 * https://github.com/qiu8310/deploy-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

var GithubUploader = function (_Uploader) {
  (0, _inherits3.default)(GithubUploader, _Uploader);

  function GithubUploader(env, opts) {
    (0, _classCallCheck3.default)(this, GithubUploader);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GithubUploader.__proto__ || Object.getPrototypeOf(GithubUploader)).call(this, env, opts));

    _this.maxConcurrentJobs = 1;
    return _this;
  }

  /**
   * @override
   * @borrows Uploader.beforeInitOpts
   */


  (0, _createClass3.default)(GithubUploader, [{
    key: 'beforeInitOpts',
    value: function beforeInitOpts(opts) {
      if (!opts.auth && !opts.user && !opts.pass && !opts.token) {

        this.log.warn('你当前使用的是 ^Github 上传器^ ');
        this.log.warn('你没有配置相关选项，所以使用的是一个公共帐号');
        this.log.warn('公共帐号的资源随时可能被他人删除或替换了');

        opts.domain = 'deploy-asset.github.io';
        opts.repo = 'deploy-asset.github.io';
        opts.branch = 'master';
        opts.auth = 'basic';
        opts.token = '';
        opts.user = 'deploy-asset';
        opts.pass = '5Rq-LLt-HRt-7Jr';
      } else {
        if (opts.auth === 'oauth') {
          opts.user = '';
          opts.pass = '';
        } else {
          opts.token = '';
        }
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
          auth = _opts.auth,
          token = _opts.token,
          user = _opts.user,
          pass = _opts.pass,
          repo = _opts.repo;

      if (auth === 'oauth') this.github = new _githubApi2.default({ token: token, auth: auth });else this.github = new _githubApi2.default({ username: user, password: pass, auth: auth });

      this.repo = this.github.getRepo(user, repo);
    }

    /**
     * @override
     * @borrows Uploader.destroyService
     */

  }, {
    key: 'destroyService',
    value: function destroyService() {
      this.github = null;
    }

    /**
     * @override
     * @borrows Uploader.uploadFile
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile(file, done) {
      var filePath = this.env.getFileRemotePath(file, false);
      var ciMessage = 'Update file ' + filePath;
      this.repo.write(this.opts.branch, filePath, file.remote.content, ciMessage, done);
    }

    /**
     * @override
     * @borrows Uploader.isRemoteFileExists
     */

  }, {
    key: 'isRemoteFileExists',
    value: function isRemoteFileExists(file, done) {
      this.repo.read(this.opts.branch, this.env.getFileRemotePath(file, false), function (err, data) {
        done(null, !!data);
      });
    }

    /**
     * 注意，Github 的 pages 生成会有很短的时间延迟，所以刚上传完的文件可能没法立即得到其内容
     *
     * 也不能使用 repo.read 方法，它返回的是字符串，不是 buffer，
     * 字符串转化成 buffer 不一定和原内容一致
     *
     * @override
     * @borrows Uploader.getRemoteFileContent
     */

  }, {
    key: 'getRemoteFileContent',
    value: function getRemoteFileContent(file, done) {
      // 判断文件类型，如果是文件文件，通过 api 的形式获取，如果是其它类型文件，则通过下载的形式
      if (_binaryExtensions2.default.indexOf(file.ext.toLowerCase()) >= 0) {
        _Uploader3.default.download(file.remote.url, done);
      } else {
        this.repo.read(this.opts.branch, this.env.getFileRemotePath(file, false), function (err, data) {
          if (err) done(err);else if (typeof data !== 'string') done(new Error(data || 'UNKNOWN'));else done(null, new Buffer(data));
        });
      }
    }

    /**
     * @override
     * @borrows Uploader.removeRemoteFile
     */

  }, {
    key: 'removeRemoteFile',
    value: function removeRemoteFile(file, done) {
      this.repo.remove(this.opts.branch, this.env.getFileRemotePath(file, false), done);
    }
  }]);
  return GithubUploader;
}(_Uploader3.default);

GithubUploader.config = {
  error: {
    auth: 'Github 的认证方式(basic/oauth)',
    user: 'Github 用户名',
    pass: ['Github 用户密码',, true],
    token: ['Github 的 oauth token',, true],
    domain: 'Github 的域名',
    repo: 'Git 创库名称',
    branch: 'Git 的分支'
  }
};

exports.default = GithubUploader;
module.exports = exports['default'];