(function (angular) {
  'use strict';

  var app = angular.module('goangular-access', []);

  app.factory('$goPermissions', function ($goConnection) {
    return {
      authorized: function (accessLevel) {
        var permission;

        switch ($goConnection.isGuest) {
          case true:
            permission = 'guest';
            break;
          case false:
            permission = 'authenticated';
            break;
          default:
            permission = null;
        }

        if (permission === accessLevel) {
          return true;
        }

        return false;
      }
    }
  });

  app.directive('access', function ($goConnection, $goPermissions) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var authenticate;

        authenticate = function() {
          var accessLevel = attrs.access;

          if (accessLevel && !$goPermissions.authorized(accessLevel)) {
            element.addClass('ng-hide');
          } else {
            element.removeClass('ng-hide');
          }
        };

        $goConnection.$ready().then(function() {
          authenticate();
        });
      }
    };
  });

  app.run(function ($injector, $location, $rootScope, $goConnection, $goPermissions, loginRedirectPath) {
    var router = $injector.has('$route') ? $injector.get('$route') : $injector.get('$state');
    var routerEvent = $injector.has('$route') ? '$routeChangeStart' : '$stateChangeStart';
    new RouteSecurityManager($location, $rootScope, router, routerEvent, $goConnection, $goPermissions, loginRedirectPath);
  });

  function RouteSecurityManager($location, $rootScope, router, routerEvent, $goConnection, $goPermissions, path) {
    this._router = router;
    this._routerEvent = routerEvent;
    this._location = $location;
    this._rootScope = $rootScope;
    this._goConnection = $goConnection;
    this._permissions = $goPermissions;
    this._loginPath = path;
    this._redirectTo = null;
    this._init();
  }

  RouteSecurityManager.prototype = {
    _init: function () {
      var self = this;

      this._goConnection.$ready().then(function() {
        self._checkCurrent();
        self._rootScope.$on(self._routerEvent, function (e, next) {
          self._authRequiredRedirect(next, self._loginPath);
        });
      });
    },

    _checkCurrent: function () {
      if (this._router.current) {
        this._authRequiredRedirect(this._router.current, this._loginPath);
      }
    },

    _redirect: function (path) {
      this._location.replace();
      this._location.path(path);
    },

    _authRequiredRedirect: function (router, path) {
      if (router.access && !this._permissions.authorized(router.access)) {
        if (router.pathTo === undefined) {
          this._redirectTo = this._location.path();
        } else {
          this._redirectTo = router.pathTo === path ? '/' : router.pathTo;
        }
        this._redirect(path);
      }
      else if (this._permissions.authorized(router.access) && this._location.path() === this._loginPath) {
        this._redirect('/');
      }
    }
  };
})(angular);