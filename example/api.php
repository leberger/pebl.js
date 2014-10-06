<?php

$e = ['arrayElement' =>
    [
        [
            'firstElement' => 'alpha first element value',
            'secondElement' => 'alpha second element value'
        ],
        [
            'firstElement' => 'beta first element value',
            'secondElement' => 'beta second element value'
        ]
    ],
    'notAnArray' => 'not an array value'
        ]


;

echo json_encode($e, JSON_PRETTY_PRINT);

//<div id='tpl'>
// {arrayElement/}
// <div>
//  <h1>{firstElement}</h1>
//  <p>{second element}</p>
// </div>
// {/arrayElement}
// {notAnArray}
//</div>


//<div id='tpl'>
// <div>
//  <h1>alpha first element value</h1>
//  <p>alpha second element value</p>
// </div>
// <div>
//  <h1>beta first element value</h1>
//  <p>beta second element value</p>
// </div>
// not an array value
//</div>
