# GoAngular Access

Access is a tiny module for handling route security, permissions and the `access` directive in a GoAngular app. It provides support for [ui-router](https://github.com/angular-ui/ui-router) and ngRoute out of the box without cluttering your controllers. The `permissions` service and `access` directive are similar to those provided in the official GoInstant [documentation](https://developers.goinstant.com/v1/GoAngular/examples/auth.html). I added them to save time building new apps.

**Requirements:** GoInstant and GoAngular

## Installation

Register `goangular-access` as a dependency:

```javascript
angular.module('myApp', ['goangular', 'goangular-access'])
```

Define the `loginRedirectPath` constant. If the user attempts to access an authorized route without permission they'll be redirected to this path. Examples include `/`, `/login`, `/restricted`.

```javascript
angular.module('myApp').constant('loginRedirectPath', '/');
```

## Usage

To take advantage of route security, simply add `access: 'authenticated'` to the routes you'd like to protect from unauthorized users.

ui-router:

```javascript
$stateProvider
  .state('main', {
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  }).state('profile', {
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'SubmitCtrl',
    access: 'authenticated'
  });

$urlRouterProvider.otherwise('/')
```

ngRoute:

```javascript
$routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'homeCtrl'
  })
  .when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'profileCtrl',
    access: 'authenticated'
  })
  .otherwise({
    redirectTo: '/'
  });
```

The `access` directive works similar to the documentation example:

```html
<ul class="nav navbar-nav">
  <li><a access="guest" href="{{conn.loginProviders[0].url}}">Login</a></li>
  <li><a access="authenticated" href="{{conn.logoutUrl}}">Logout</a></li>
</ul>
```