pebl.js
=======

Micro Javascript Templating




Why use pebljs in your project ?
--------------------------------

Easy to use, it is the front end tier block of your application. It provides the perfect synergy for modern applications between data provider and templating.
If you have thought of your backend as an API for your frontend, pebljs will be the key for your frontend pages.

  
Usage
-----

### Javascript

``` 
var _events = function() {
//add events triggered for elements that will be replaced, in #tpl
});

pebl = new Pebl($('#tpl'), '/api/', _events);

pebl.loadData();  

pebl.replace();
```

### HTML

```
<div id='tpl'>
 {arrayElement/}
 <div>
  <h1>{firstElement}</h1>
  <p>{second element}</p>
 </div>
 {/arrayElement}
 {notAnArray}
</div>
```

### data provider (your API)

The URL `/api/` should return a JSON element structured like that :

```
{
    "arrayElement": [
        {
            "firstElement": "alpha first element value",
            "secondElement": "alpha second element value"
        },
        {
            "firstElement": "beta first element value",
            "secondElement": "beta second element value"
        }
    ],
    "notAnArray": "not an array value"
}
```

### Result 

```
<div id='tpl'>
 <div>
  <h1>alpha first element value</h1>
  <p>alpha second element value</p>
 </div>
 <div>
  <h1>beta first element value</h1>
  <p>beta second element value</p>
 </div>
 not an array value
</div>
```


### ... 

 * \#tpl  
 in the #tpl element, each key : '{'+key+'}' will be replaced by the matching value in provided by the data provider
 
 *  '/api/'  
 this dataProvider is an url, the method loadData will get new values and stack it internally. The ajax call should return an array with key=>values element that match the original html template
 
 *  _events  
 javascript events that are bind to the elements that have been replaced. Basically, a function executed each time
 

### Example

```
@todo:  insert another example

```

### Todo
* do a minify version
* do a dev version and add if(IS_DEV_MODE) console.log() to add some extra useful info for development purposes
* add unittests
* show example of other function and show it is chainable
* show how to replace on completion
* add events to be triggered on some HTTP response . Use 4*, 40*, 30*. 404 code and patterns to name them. 
* there is an example.php . Rename it to api.php , and add the index.html , and put all that in an example directory 
