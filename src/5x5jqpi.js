

// todo; set up generated form el validation

import './ul.scss'

(function(){

    const template = require("pug-loader!./uploaderDom.pug");
    const alertDom = require("pug-loader!./alertModal.pug");
    let manifest = [];
    let opts = null;

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
            // selectOpts:null,
            selectOpts:{1:"one",2:"two",3:"three"},
            showDescription:true,
            postFn:$.noop,
        };
        opts = $.extend({},defaults,o);

        const configDom = {
            showDesc: opts.showDescription,
            options: opts.selectOpts
        };
        const dom = template(configDom);
        const alert = alertDom();
        $ulObj.html(dom);
        $("body").append(alert);

        if(opts.destinationParams)opts.destination = () => {
            let params = `${opts.destination}?`;
            params += opts.destinationParams.each((k,v) => `${k}=${v}&`);
            return params
        };

        $ulObj.on('click change', 'input[value]', (e) => {
            if (e.currentTarget.attributes['value'].nodeValue == 'Remove') {
                dequeueFiles(e.currentTarget);
            }else if (e.currentTarget.attributes['value'].nodeValue == 'Upload') {
                sendFiles();
            }else{ // browse
                if (e.type == 'change'){
                    const f = $(e.currentTarget).get(0).files;
                    queueFiles(f);
                }
            }
        }).on('dragenter drop dragover dragleave', '#dragandrophandler', (e) => {
            e.stopPropagation();
            e.preventDefault();
            switch (e.type) {
                case 'dragenter':
                    e.target.classList.add('active');
                    break;
                case 'dragleave':
                    e.target.classList.remove('active');
                    break;
                case 'drop':
                    e.target.classList.remove('active');
                    queueFiles(e.originalEvent.dataTransfer.files);
                    break;
            }
        });

    }; //initUploader

    function queueFiles(fl){
        if (manifest.length == opts.fileLimit || opts.fileLimit < manifest.length + fl.length) {
            const limitMsg = `The limit for number of file uploads is ${opts.fileLimit}.`;
            const $modal = $('.modal');
            $modal.find('.modal-body').html(limitMsg);
            $modal.modal('show');
            return;
        }
        let $src = $(".queueSrc").html();
        for (let i =0; i < fl.length; i++) {
            if (fl[i].size > (opts.sizeLimit * 1000000)) {
                const sizeMsg = `
                    The size limit for individual files is ${opts.sizeLimit} MB.
                    <br><b>${fl[i].name}</b> is ${(fl[i].size/1000000).toFixed(1)} MB.`
                const $modal = $('.modal');
                $modal.find('.modal-body').html(sizeMsg);
                $modal.modal('show');
                return;
            }else{
                $("<div class='row fileQueue'></div>")
                    .html($src)
                    .find('.col.name b').text(fl[i].name).end()
                    .find('.remove input').attr('data-name', fl[i].name).end()
                    .insertAfter(".row.ddHandler")
                    .animate({opacity:1},850);
                manifest.push(fl[i]);
            }
        }
        console.log('manifest', manifest);
    }

    function dequeueFiles(el){
        manifest = manifest.filter( f => f.name !== el.attributes["data-name"].value );
        let $delRow = $(el).closest('.row');
        $delRow.animate({opacity:0}, 850, () => $delRow.remove());
        console.log('manifest', manifest);
    }

    function sendFiles(){
        let fd = new FormData();
        const $fileQueue = $('.row.fileQueue');
        if (opts.selectOpts){
            File.prototype.fileType = '';
            manifest.map(f => {
                f.fileType = $fileQueue.filter(":has(input[data-name='" + f.name + "'])").find(".col.desc input").val();
                return f;
            });
        }
        if (opts.showDescription) {
            File.prototype.description = '';
            manifest.map(f => {
                f.description = $fileQueue.filter(":has(input[data-name='" + f.name + "'])").find(".col.options select").val();
                return f;
            });
        }
        console.log('man', manifest);
    }

}());
