# 5x5_jq_uploader

A responsive, parameterizeable plug in for jQuery that can be used to upload one or more files.

## Other available uploaders

A non-jQuery file uploader that uses Hyperscript-Helpers and MaterializeCss, written in a functional programming-type style is in progress. I will post the link when complete.

## Installation

Using npm;

```
$ npm install jquery bootstrap 5x5_jq_uploader

```
Using a cdn;
```
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
```

## Setup

```html

    // in script...
    $(function(){ 
        $("#uploader").initUploader({destination:'uploaderRoute'});
    });
    
    <!--in body-->
    <div id="uploader"></div>
```

## Options
```
$("#uploader").initUploader({
    // how many entries do you want?
    // default: 
    // valid values: any integer
    limit: 10,
});
```
