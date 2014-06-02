require('string-format');
var _ = require('lodash');
var dataValidation = require('data-validation');
var invalidMessages = {
  notEmpty: "can not be empty",
  email: "'{0}' is not a valid email address",
  minValue: "'{0}' must be at least '{1}'",
  maxValue: "'{0}' can not exceed '{1}'",
  rangeValue: "'{0}' must be between '{1}' and '{2}'",
  minLength: "'{0}' must have at least '{1}' characters",
  maxLength: "'{0}' can not have more than '{1}' characters",
  rangeLength: "'{0}' must contain between '{1}' and '{2}' characters",
  match: "'{0}' must match '{1}'"
};

module.exports = function() {
  this.validate = function() {
    var returnData = true;

    _.forEach(this._schema, function(config, property) {
      if(_.isObject(config.validate)) {
        _.forEach(config.validate, function(options, validationName) {
          var validateArguments = [validationName];
          validateArguments.push(this[property]);

          if(_.isArray(options.criteria)) {
            validateArguments = validateArguments.concat(options.criteria);
          }

          if(!dataValidation.validate.apply(null, validateArguments)) {
            if(returnData === true) {
              returnData = {};
              returnData[property] = [];
            } else if(!returnData[property]) {
              returnData[property] = [];
            }

            var errorMessage = options.message || invalidMessages[validateArguments[0]];
            errorMessage = String.prototype.format.apply(errorMessage, validateArguments.splice(1, validateArguments.length - 1));
            returnData[property].push(errorMessage);
          }
        }, this);
      }
    }, this);

    return returnData;
  };

  this.hook('beforeSave[validate]', function(model, saveType, abortCallback) {
    var validateResults = model.validate();

    if(_.isObject(validateResults)) {
      abortCallback(validateResults);
    }
  });
};