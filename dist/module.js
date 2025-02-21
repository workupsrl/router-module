'use strict';

const path = require('path');
const fs = require('fs');
const consola = require('consola');
const defu = require('defu');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
const defu__default = /*#__PURE__*/_interopDefaultLegacy(defu);

var name = "@nuxtjs/router";
var version = "1.6.1";

const logger = consola__default['default'].withTag("nuxt:router");
const CONFIG_KEY = "routerModule";
const nuxtModule = function(moduleOptions) {
  const DEFAULTS = {
    path: this.options.srcDir,
    fileName: "router.js",
    keepDefaultRouter: false
  };
  const options = defu__default['default'](this.options["router-module"], this.options[CONFIG_KEY], moduleOptions, DEFAULTS);
  if (typeof options.parsePages === "undefined") {
    options.parsePages = options.keepDefaultRouter;
  }
  const routerFilePath = path.resolve(options.path, options.fileName);
  if (!fs.existsSync(routerFilePath)) {
    logger.warn(`No \`${options.fileName}\` file found in \`${options.path}\`.`);
    return;
  }
  this.addPlugin({
    src: path.resolve(__dirname, "../templates/plugin.js"),
    fileName: "router.js",
    options: {
      routerFilePath: path.relative(this.options.buildDir, routerFilePath).replace(/\/+|\\+/g, "/"),
      keepDefaultRouter: options.keepDefaultRouter
    }
  });
  if (!options.parsePages) {
    this.nuxt.hook("build:before", () => {
      this.nuxt.options.build.createRoutes = () => {
        return [];
      };
    });
  }
  if (options.keepDefaultRouter) {
    let defaultRouter;
    try {
      defaultRouter = require.resolve("@nuxt/vue-app/template/router");
    } catch (err) {
      try {
        defaultRouter = require.resolve("@nuxt/vue-app-edge/template/router");
      } catch (err2) {
        defaultRouter = require.resolve("nuxt/lib/app/router");
      }
    }
    this.addTemplate({
      fileName: "defaultRouter.js",
      src: defaultRouter
    });
  }
};
nuxtModule.meta = {name, version};

module.exports = nuxtModule;
