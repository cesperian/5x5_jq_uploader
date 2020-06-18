# 5x5_jq_uploader

This plug in can be used to instantly create a dropfile area and file queue with very little setup. Uses Bootstrap for responsive layout and alerts.

Demo page can be found [here](https://cesperian.github.io/5x5_jq_uploader/example/index.html).

An alternate uploader with the same functionality but written without jQuery and using Materialize for layout can be found [here](https://github.com/cesperian/5x5_uploader).

## Installation

Using npm;

```
$ npm install jquery bootstrap 5x5_jq_uploader

```
Using a cdn;
```
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
```

## Basic Setup

```html

    // in script...
    $(function(){ 
        $("#uploader").initUploader({destination:'/uploaderUrl'});
    });
    
    <!--in body-->
    <div id="uploader"></div>
```

## Options
Options that can be specified when initializing uploader;

|Name   |Type   |Default   |Description   |
|:---:|:---:|:---:|---|
|destination   |string   |null   |**Required**. Path to a processing script/api   |
| destinationParams  |object   |null   |Key/value pairs that can be used for creating a querystring on upload   |
|sizeLimit   |integer   |1   |Limit of individual file sizes, in MB    |
|fileLimit   |integer   |5   |Limit of total number files that can be queued for upload   |
|selectOpts   |object   |null   |Key/value pairs used to render a select element for each file queued for upload. Key is used for the individual option value and the key's value displayed to user. Chosen value gets appended to file object as property 'fileType'     |
|showDescription   |boolean   |false   |If true will render a text input for each file queued for upload. Value gets appended to file object as property 'description'   |
|postFn   |function   |noop   |A callback for when a upload has completed successfully    |

