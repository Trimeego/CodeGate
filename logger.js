(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["order!vendor/underscore", "order!vendor/backbone", "vendor/stacktrace"], function(underscore, backbone, stacktrace) {
    var Logger, loggerInstance, priorities;
    priorities = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
    if (!window.console) {
      window.console = {};
    }
    if (!window.console.log) {
      window.console.log = function() {
        return true;
      };
    }
    Logger = (function() {

      Logger.debug = false;

      Logger.prototype.DEBUG = 0;

      Logger.prototype.INFO = 1;

      Logger.prototype.WARN = 2;

      Logger.prototype.ERROR = 3;

      Logger.prototype.FATAL = 4;

      function Logger() {
        this.profileEnd = __bind(this.profileEnd, this);

        this.profile = __bind(this.profile, this);

        this.timeEnd = __bind(this.timeEnd, this);

        this.time = __bind(this.time, this);

        this.log = __bind(this.log, this);
        this.priority = this.ERROR;
        this.publishToConsole = true;
        this.verbose = false;
        this.times = {};
      }

      Logger.prototype.test = function() {
        return false;
      };

      Logger.prototype.log = function(priority, message, object) {
        if (priority >= this.priority) {
          this.trigger("log", {
            priority: priorities[priority],
            message: message,
            object: object
          });
          if (this.publishToConsole && console.log) {
            if (!object) {
              console.log("" + priorities[priority] + ": " + message);
            } else {
              console.log("" + priorities[priority] + ": " + message, object);
            }
            if (this.verbose) {
              return printStackTrace;
            }
          }
        }
      };

      Logger.prototype.time = function(name, message) {
        if (!this.times[name]) {
          return this.times[name] = {
            date: new Date(),
            name: name,
            message: message
          };
        }
      };

      Logger.prototype.timeEnd = function(name, message) {
        var t;
        t = this.times[name];
        if (t) {
          message || (message = t.message);
          this.log(this.INFO, "" + name + ": " + t.message + " (" + (new Date() - t.date) + "ms)", t);
          return this.times[name] = null;
        }
      };

      Logger.prototype.profile = function(name, message) {
        this.time(name, message);
        if (console && console.profile) {
          return console.profile(name);
        }
      };

      Logger.prototype.profileEnd = function(name) {
        this.timeEnd(name);
        if (console && console.profileEnd) {
          return console.profileEnd(name);
        }
      };

      Logger.prototype.write = function(msg) {
        if (this.debug && console.log) {
          return console.log(msg);
        }
      };

      return Logger;

    })();
    if (!loggerInstance) {
      loggerInstance = new Logger();
      _.extend(loggerInstance, Backbone.Events);
    }
    return loggerInstance;
  });

}).call(this);
