'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ylog = require('ylog');

var _ylog2 = _interopRequireDefault(_ylog);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xPath = require('x-path');

var _xPath2 = _interopRequireDefault(_xPath);

// import min from 'min-asset';

var _prettyBytes = require('pretty-bytes');

var _prettyBytes2 = _interopRequireDefault(_prettyBytes);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

var _file = require('../file');

var _file2 = _interopRequireDefault(_file);

var min;
try {
  min = require('min-asset'); // 可选的插件（安装起来比较费劲）
} catch (e) {}

function _compress(file, done) {
  var type = file.type === _file2['default'].STATIC_TYPE ? min.helper.type(file.filePath) : file.type;
  var minTypes = file.opts.min;
  var minOpts = file.opts['min' + _lodash2['default'].capitalize(type)];

  if (!type || minOpts === false) return done(null, file);
  if (typeof minTypes === 'string') minTypes = minTypes.split(',');
  if (Array.isArray(minTypes) && minTypes.length && minTypes.indexOf(type) < 0) return done(null, file);

  minOpts = minOpts || {};

  _ylog2['default'].info.title('开始压缩文件 ^%s^ ...', file.relativePath);
  min(file.content, file.filePath, minOpts, function (err, data) {

    if (err) return done(err);
    var oz = data.originalSize,
        mz = data.minifiedSize;
    var diff = oz - mz;
    var rate = (diff * 100 / oz).toFixed();
    if (diff > 10) {
      file.min = {};
      file.min.originalSize = oz;
      file.min.minifiedSize = mz;
      file.min.diffSize = diff;
      file.min.rate = rate;
      _ylog2['default'].info.writeOk('新文件 !%s! , 文件压缩了 ~%s~ , 压缩率 ~%s%~', (0, _prettyBytes2['default'])(mz), (0, _prettyBytes2['default'])(diff), rate).ln();
      file.remote.content = data.content;
    } else {
      _ylog2['default'].info.writeOk('*文件已经最小了，不需要压缩（改变压缩配置看看）*').ln();
    }
    done(null, file);
  });
}

function _inspect(file, done) {
  if (file.type === _file2['default'].STATIC_TYPE) return done(null, []);

  _ylog2['default'].info.title('开始检查文件 ^%s^ ...', file.relativePath);

  var assets = undefined;

  try {
    assets = file.insp(file.opts.inspectFilter);
  } catch (e) {
    return done(e);
  }

  assets.forEach(function (a) {
    _ylog2['default'].verbose('   资源 &%s-%s& : &%s&  *引用处: %s*', a.start, a.end, a.src, a.raw);
  });

  _ylog2['default'].info.writeOk('共找到 ^%s^ 处静态资源', assets.length).ln();

  done(null, file.resolveAssets());
}

exports['default'] = function (filePaths, opts, next) {

  _util2['default'].banner('资源检查' + (opts.min ? '(并压缩)' : ''));

  _file2['default'].refs = {}; // 先将引用清空
  var inspectedFiles = [];

  try {
    (function () {

      var getFile = function getFile(filePath) {
        var asset = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var file = _file2['default'].findFileInRefs(filePath);
        return file ? file : new _file2['default'](filePath, opts.rootDir, opts, asset);
      };

      var inspect = function inspect(file, done) {
        if (inspectedFiles.indexOf(file) >= 0) return done(null, []);
        inspectedFiles.push(file);

        if (opts.min && min) {
          _compress(file, function (err, file) {
            if (err) return done(err);
            _inspect(file, done);
          });
        } else {
          if (opts.min) {
            _ylog2['default'].warn('需要安装 ~min-asset~ 才能使用压缩功能').ln().warn('注意：如果你是全局安装的 deploy-asset，那么请先执行 `cd ' + _xPath2['default'].dirname(_xPath2['default'].dirname(__dirname)) + '`').ln();
          }
          _inspect(file, done);
        }
      };

      var walk = function walk(files, done) {
        _async2['default'].eachSeries(files, function (file, next) {
          inspect(file, function (err, assets) {
            if (err) return done(err);
            walk(assets, next);
          });
        }, done);
      };

      var startFiles = filePaths.map(getFile);
      walk(startFiles, function (err) {
        if (err) return next(err);

        _ylog2['default'].verbose('检查后的文件 *%o*', inspectedFiles.map(function (file) {
          return file.relativePath;
        }));

        // 检查是否为没有上传，同时又包含其它上传了的静态资源的文件指定 outDir
        err = inspectedFiles.some(function (f) {
          if (f.shouldSave() && !opts.outDir) {
            _ylog2['default'].error('没有指定 ~--outDir~ 参数').ln().error('文件 ^%s^ 指定为不要上传，但此文件包含有其它静态资源，它里面的内容会被替换', f.relativePath).ln().error('所以如果不上传此文件，请指定一个输出目录，将更新后的文件输出在指定的目录内');

            return true;
          }
        });
        if (err) return next(new Error('NO_OUT_DIR_FOR_FILE'));

        err = inspectedFiles.some(function (f) {
          var a = f.assets.length && f.assets.find(function (a) {
            return !getFile(a.filePath).apply.upload;
          });
          if (f.apply.upload && f.apply.replace && a) {
            _ylog2['default'].error('文件 ^%s^ 需要上传，但它所依赖的静态 ^%s^ 却没有上传', f.relativePath, a.filePath).ln().error('这样可能会导致上传的文件找不到它的依赖而显示不正常');
            return true;
          }
        });
        if (err) return next(new Error('DEPEND_ASSET_NOT_UPLOAD'));

        next(null, inspectedFiles, opts);
      });

      //outputFileTree(opts.rootDir, startFiles);
    })();
  } catch (e) {
    return next(e);
  }
};

/*
 basic
 ├── a.txt
 ├── j1.json
 └── j2.json
 │   └── a.txt
 └── index.html
 └── d/d.css
 │   └── c.gif
 └── b.js
 └── d/e/e.js

archy
 '│' : '|',
 '└' : '`',
 '├' : '+',
 '─' : '-',
 '┬' : '-'

 deploy-asset@1.0.0-alpha /Users/Mora/Workspace/node/deploy-asset
 ├─┬ alter@0.2.0
 │ └── stable@0.1.5
 ├── async@1.4.2


 └─┬ ylog@0.2.2
 ├─┬ are-we-there-yet@1.0.4
 │ ├── delegates@0.1.0
 │ └─┬ readable-stream@1.1.13
 │   ├── core-util-is@1.0.1
 │   ├── inherits@2.0.1
 │   ├── isarray@0.0.1
 │   └── string_decoder@0.10.31
 ├─┬ chalk@1.1.1
 │ ├── ansi-styles@2.1.0
 │ ├── escape-string-regexp@1.0.3
 │ ├─┬ has-ansi@2.0.0
 │ │ └── ansi-regex@2.0.0
 │ ├─┬ strip-ansi@3.0.0
 │ │ └── ansi-regex@2.0.0
 │ └── supports-color@2.0.0

 */
function outputFileTree(base, files) {}
module.exports = exports['default'];