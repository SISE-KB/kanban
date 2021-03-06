angular.module('mongoResourceHttp', [])
.factory('$mongoResourceHttp', [
  	      '$http', '$q','SERVER_CFG', 
function ($http, $q,SERVER_CFG) {

    function MongoResourceFactory(collectionName) {
        var dbUrl = SERVER_CFG.URL+'/db/';
		var ress=collectionName;
        var collectionUrl = dbUrl + collectionName;
        var defaultParams = {};//apiKey: config.API_KEY

        var resourceRespTransform = function (response) {
            return new Resource(response.data);
        };

        var resourcesArrayRespTransform = function (response) {
            return response.data.map(function(item){
                return new Resource(item);
            });
        };

        var preparyQueryParam = function (queryJson) {
            return angular.isObject(queryJson) && Object.keys(queryJson).length ? {q: JSON.stringify(queryJson)} : {};
        };

        var Resource = function (data) {
            angular.extend(this, data);
        };
     
        Resource.query = function (queryJson, options) {

            var prepareOptions = function (options) {

                var optionsMapping = {sort: 's', limit: 'l', fields: 'f', skip: 'sk',strict:'strict'};
                var optionsTranslated = {};

                if (options && !angular.equals(options, {})) {
                    angular.forEach(optionsMapping, function (targetOption, sourceOption) {
                        if (angular.isDefined(options[sourceOption])) {
                            if (angular.isObject(options[sourceOption])) {
                                optionsTranslated[targetOption] = JSON.stringify(options[sourceOption]);
                            } else {
                                optionsTranslated[targetOption] = options[sourceOption];
                            }
                        }
                    });
                }
                return optionsTranslated;
            };

            var requestParams = angular.extend({}, defaultParams, preparyQueryParam(queryJson), prepareOptions(options));

            return $http.get(collectionUrl, {params: requestParams}).then(resourcesArrayRespTransform);
        };

        Resource.all = function (options, successcb, errorcb) {
            return Resource.query({}, options || {});
        };
/*
        Resource.count = function (queryJson) {
            return $http.get(collectionUrl, {
                params: angular.extend({}, defaultParams, preparyQueryParam(queryJson), {c: true})
            }).then(function(response){
                return response.data;
            });
        };

        Resource.distinct = function (field, queryJson) {
            return $http.post(dbUrl + '/runCommand', angular.extend({}, queryJson || {}, {
                distinct: collectionName,
                key: field}), {
                params: defaultParams
            }).then(function (response) {
                return response.data.values;
            });
        };*/
       Resource.getName=function () {
				return ress
		};
        Resource.getById = function (id) {
            return $http.get(collectionUrl + '/' + id, {params: defaultParams}).then(resourceRespTransform);
        };

        Resource.getByObjectIds = function (ids) {
                 return Resource.query({_id: {$in: ids}},{strict:true});
        };
        Resource.prototype.$id = function () {
           return this._id;
            
        };
 

        Resource.prototype.$save = function () {
            return $http.post(collectionUrl, this, {params: defaultParams}).then(resourceRespTransform);
        };

        Resource.prototype.$update = function () {
		  /*  if(!this._id) {
			   console.log("update by null id!");
			   return this;
			}*/
            return  $http.put(collectionUrl + "/" + this._id, angular.extend({}, this), {params: defaultParams})
                .then(resourceRespTransform);
        };

        Resource.prototype.$saveOrUpdate = function () {
            return this._id ? this.$update() : this.$save();
        };

        Resource.prototype.$remove = function () {
            return $http['delete'](collectionUrl + "/" + this._id, {params: defaultParams}).then(resourceRespTransform);
        };


        return Resource;
    }

    return MongoResourceFactory;
}]);
