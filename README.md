# Validate

Validate plugin for [simple ORM](https://github.com/simple-orm/core) models.

# Documentation

This plugin add support for data validation for models.

To install:

```
npm instal simple-orm-validate
```

To enable it for a model:

```javascript
model.plugin(require('simple-orm-validate'));
```

This will add a `validate()` method to the model that can be called to validate the data.  It also adds a `beforeSave` hook with an identifier of `validate`.

You configure your validation with your schema by adding a property call `validate`.  This property holds an object with the property be the name of the validation and the value is the configuration for that validation.

If a validation requires data to validation against (like `rangeValue`), you pass the values in an array call `criteria`:

```javascript
model.define('test', 'test', {
  age: {
    validate: {
      rangeValue: {
        criteria: [18, 65]
      }
    }
  }
});
```

All validations accept a message configuration (which is optional) to use as a custom error message:

```javascript
model.define('test', 'test', {
  email: {
    validate: {
      email: {
        message: 'Enter valid email'
      }
    }
  }
});
```

You can also embed values into the custom error message.  Error messages are passed the value of the property that is being validated along with any criteria that is passed.  For example:

```javascript
model.define('test', 'test', {
  email: {
    validate: {
      email: {
        message: '{0} is not a valid email'
      }
    }
  },
  age: {
    validate: {
      rangeValue: {
        criteria: [18, 65],
        message: '{0} is not between {1} and {2}'
      }
    }
  }
});
```

You can also provide multiple validations on one property:

```javascript
model.define('test', 'test', {
  email: {
    validate: {
      notEmpty: {},
      email: {}
    }
  }
});
```

Errors are returned as an object with the key being the property name and the value being an array of errors:

```javascript
var validationResults = model.validate();
// validationResults = 
// {
//   email: [
//     'Can not be empty',
//     'Enter a valid email address'
//   ],
//   age: [
//     'Must be between 18 and 65'
//   ]
// }
```

If a `save()` fails because of validation, the same thing is returned:

```javascript
var saveResults = model.save();
// saveResults = 
// {
//   email: [
//     'Can not be empty',
//     'Enter a valid email address'
//   ],
//   age: [
//     'Must be between 18 and 65'
//   ]
// }
```

## Supported Validations

The following types of validation are supported:

- notEmpty: Property not empty (no criteria)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      notEmpty: {}
    }
  }
});
```

- email: Property is a valid email (no criteria)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      email: {}
    }
  }
});
```

- minValue: Property is above certain numerical number (criteria: minimum value)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      minValue: {
        criteria: [1]
      }
    }
  }
});
```

- maxValue: Property is below certain numerical number (criteria: maximum value)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      maxValue: {
        criteria: [10]
      }
    }
  }
});
```

- rangeValue: Property is between certain numerical numbers (criteria: minimum value, minimum value)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      rangeValue: {
        criteria: [1, 10]
      }
    }
  }
});
```

- minLength: Property is above a certain number of characters (criteria: minimum character count)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      minLength: {
        criteria: [1]
      }
    }
  }
});
```

- maxLength: Property is below a certain number of characters (criteria: maximum character count)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      maxLength: {
        criteria: [10]
      }
    }
  }
});
```

- rangeLength: Property is between a certain number of characters (criteria: minimum character count, maximum character count)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      rangeLength: {
        criteria: [1, 10]
      }
    }
  }
});
```

- match: Property matches certain value (criteria: matching value)

```javascript
model.define('test', 'test', {
  propertyName: {
    validate: {
      match: {
        criteria: [true]
      }
    }
  }
});
```

# License

MIT
