
import './ul.scss'

(function(){

    const template = require("pug-loader!./uploaderDom.pug")
    let manifest = [];

    $.fn.initUploader = function(o) {

        let files = [];
        let trackTarget, trackProximate;
        let $ulObj = this;


        //1000000 =~ 1Mb default
        let defaults = {
            destination:null,
            destinationParams:null,
            sizeLimit:1,
            fileLimit:5,
            selectOpts:null,
            // selectOpts:{1:"one",2:"two",3:"three"},
            showDescription:false,
            postFn:$.noop,
        };

        let opts = $.extend({},defaults,o);


        const configDom = {
            showDesc: opts.showDescription,
            options: opts.selectOpts
        }
        const dom = template(configDom);
        $ulObj.html(dom);

        opts.fileSizeLimit *= 1000000; // config param = Mb
        if(opts.destinationParams)opts.destination = () => {
            let params = `${opts.destination}?`;
            params += opts.destinationParams.each((k,v) => `${k}=${v}&`);
            return params
        };


        // todo; set up .on for any generated form el validation

        // set up submit/cancel bindings...
        $(".dDropOptsCont button:contains('Upload')").click(function(){
            handleFileUpload(files,$ulObj,opts.refreshUrl,opts.destination,true);
            // add progress bar
            files = [];

        }).siblings("button:contains('Cancel')").click(function(){
            // destroy ui els
            files = [];
        });


    }

}()); //iife
