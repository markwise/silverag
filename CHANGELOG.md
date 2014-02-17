# Changelog

### 0.3.0 (02/16/2014)

- Project refactor
    - Changed project name to Silver Ag
    - Using Gruntjs to manage project tasks
    - Using Karma and Jasmine to handle unit tests
    - Using Bower to manage unit test dependencies
    - Using JSHint
    - Using SASS
    
- Code
    - Added ag- namespace to all classes
    - Combined split and by classes, e.g. ag-split and ag-split:1/2
    - Added respond class for responsive layouts, e.g. ag-respond:640
    - Change with-gap to ag-space, e.g. ag-space:2
    - Change cel-line to ag-line
    - Fixed bug in IE8 to correctly hide cels when the class ag-show is applied
    - Fixed bug to correctly handle lines with multi-line layouts
    - All silverag styles are removed from responding layouts, except line-height

    
### 0.2.0 (09/30/2013)

- Switched from a float based implementation to an inline-block implementation to layout columns
- A layout can be reversed using the helper class flip
- Columns can be vertically aligned using the helper class align


### 0.1.0

- Initial release