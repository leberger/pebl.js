pebl.js
=======

Micro Javascript Templating

Why use pebljs in your project ?
--------------------------------

Easy to use, it is a block that provides the perfect synergy for modern applications between data provider and templating. If you have thought of your backend as an API for your frontend, pebljs will be the key for your frontend pages.

  
Usage
-----

h3. Javascript

``` 
var _events = function() {
//add events triggered for elements that will be replaced, in #tpl
});

//create an object
pebl = new Pebl($('#tpl'), '/api/', _events);

//load data
pebl.loadData();  

//replace
pebl.replace();
```

h3. HTML

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

h3. API

The URL /api/ should return a json element structured like that :

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

h3. Replaced values 

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


h3. ... 

 * #tpl
 in the #tpl element, each key : '{'+key+'}' will be replaced by the matching value in provided by the data provider
 
 *  '/api/'
 this dataProvider is an url, the method loadData will get new values and stack it internally. The ajax call should return an array with key=>values element that match the original html template
 
 *  _events
 javascript events that are bind to the elements that have been replaced. Basically, a function executed each time
 
