# Changelog


#### 0.5.0

The 0.5.0 release is a complete rewrite. It's focus is to build a next generation responsive grid using flexbox, matchMedia, mutationObservers and other modern web APIs. 

- Removed all legacy code
- The interface now uses attributes instead of classes
- ag-cel is now ag-item to match flexbox terminology for flex item
- A layout is now created by adding the attribute ag to the parent element and ag-item to columns
- The default align implementation is equal height columns
- align values are now s, c, and e to match flexbox terminology for flex-start, center and flex-end 
- flip is now reverse to match flexbox terminology for row-reverse and column-reverse
- Lines are created automatically when a layout initializes
- Lines have a new API to show and hide lines
- Lines can now be styled by overriding CSS width and background properties
- The classes ag, ag-item, ag-line, ag-responding and ag-not-responding have been added as styling hooks for authors
- Dynamic layouts are now initialized when inserted into the DOM and cleaned up when removed from the DOM
- Responsive layouts are created using the attribute ag-respond


#### 0.4.0

The 0.4.0 release has been abandoned. It focused on a legacy implementation to
support older browsers, such as IE8. The branch still exists for reference, but 
never made it to a final release.


#### 0.3.0 (02/16/2014)

- Added ag- namespace to all classes
- Combined split and by classes, e.g. ag-split and ag-split:1/2
- Added respond class for responsive layouts, e.g. ag-respond:640
- Change with-gap to ag-space, e.g. ag-space:2
- Change cel-line to ag-line
- Fixed bug in IE8 to correctly hide cels when the class ag-show is applied
- Fixed bug to correctly handle lines with multi-line layouts
- All silverag styles are removed from responding layouts, except line-height

    
#### 0.2.0 (09/30/2013)

- Switched from a float based implementation to an inline-block implementation to layout columns
- A layout can be reversed using the helper class flip
- Columns can be vertically aligned using the helper class align


#### 0.1.0

- Initial release