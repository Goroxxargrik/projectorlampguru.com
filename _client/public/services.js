app.factory('data', ['$http', '$window' , function ($http,$window) {
    var o = {};

    o.getLampBrands = function () {
        return $http.get('/api/lampBrands');
    };

    o.submit = function (payload) {
        return $http.post('/api/submit', payload);
    };

    o.userLogin = function (payload) {
        return $http.post('/api/login', payload)
        .success(function (data) {
            auth.saveToken(data.token);
        });    };
        

    o.userRegister = function (payload) {
        return $http.post('/api/register', payload)
        .success(function (data) {
            auth.saveToken(data.token);
        });    };


    o.saveToken = function (token) {
        $window.localStorage['jwt'] = token;
    };
    o.getToken = function () {
        return $window.localStorage['jwt'];
    };

    o.currentUser = function () {
        if (o.isLoggedIn()) {
            var token = o.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.userEmail;
        }
    };

    o.isLoggedIn = function () {
        var token = o.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    
    o.sendToken = function(payload){
        return $http.post('/api/forgot', payload);
    }

    o.resetPassword = function(payload){
        return $http.post('/api/reset', payload);
    }

    o.logOut = function () {
        $window.localStorage.removeItem('flapper-news-token');
    };


    return o;
}]);
    