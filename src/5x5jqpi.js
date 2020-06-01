
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


        let defaults = {
            destination:null,
            destinationParams:null,
            sizeLimit:1,
            fileLimit:5,
            selectOpts:null,
            showDescription:false,
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

        if (opts.destinationParams) opts.destination = `${opts.destination}?${$.param(opts.destinationParams)}`;

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
            if (fl[i].size > (opts.sizeLimit * 1048576)) {
                const sizeMsg = `
                    The size limit for individual files is ${opts.sizeLimit} MB.
                    <br><b>${fl[i].name}</b> is ${(fl[i].size/1048576).toFixed(1)} MB.`
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
        $('.row.submit').css('display','flex');
    }

    function dequeueFiles(el){
        manifest = manifest.filter( f => f.name !== el.attributes["data-name"].value );
        let $delRow = $(el).closest('.row');
        $delRow.animate({opacity:0}, 400, () => $delRow.remove());
        $('.row.submit').css('display', () => manifest.length ? 'flex' : 'none');
    }

    function sendFiles(){
        let fd = new FormData();
        let pct = 0;
        const $progress = $(".row.ulProgress .progress-bar");
        const $fileQueue = $('.row.fileQueue');

        // add extra props, if there are any...
        if (opts.selectOpts){
            File.prototype.fileType = '';
            manifest.map(f => {
                f.fileType = $fileQueue.filter(`:has(input[data-name='${f.name}'])`).find(".col.desc input").val();
                return f;
            });
        }
        if (opts.showDescription) {
            File.prototype.description = '';
            manifest.map(f => {
                f.description = $fileQueue.filter(`:has(input[data-name='${f.name}'])`).find(".col.options select").val();
                return f;
            });
        }
        manifest.forEach(f => fd.append('file', f));

        // mod dom...
        $fileQueue.animate({opacity:0}, 400, () => {
            $('.row.ddHandler').css('opacity',0);
            $('.row.submit').hide();
            $('.row.ulProgress').show();
        });

        // give above anim time to play out...
        setTimeout(() => {
            $.ajax({
                xhr: () => {
                    let xhrobj = $.ajaxSettings.xhr();
                    if(xhrobj.upload) {
                        xhrobj.upload.addEventListener('progress', e => {
                            let pos = e.loaded || e.position;
                            if (e.lengthComputable){
                                pct = Math.ceil(pos / e.total * 100 );
                                $progress.css('width',pct + "%").text(pct + "%");
                            }
                        }, false);
                    }
                    return xhrobj;
                },
                url: opts.destination,
                type: "POST",
                contentType: false,
                processData: false,
                data: fd,
                success: (d, status, xhr) => {
                    $fileQueue.remove();
                    $('.row.ddHandler').css('opacity', 100);
                    $('.row.ulProgress').hide();
                    manifest = [];
                    const $modal = $('.modal');
                    $modal.find('.modal-body').text(`File${manifest.length==1 ? '' : 's'} successfully uploaded`);
                    setTimeout(()=> $modal.modal('show'),70);
                    opts.postFn.call();
                },
                error: (xhr, status, err) => {
                    $('.row.ddHandler').css('opacity', 100);
                    $fileQueue.css('opacity', 100);
                    $('.row.ulProgress').hide();
                    $('.row.submit').show();
                    const $modal = $('.modal');
                    let msg = `There was an error uploading the file${manifest.length==1 ? '' : 's'}`;
                    msg += (err.length ? `<br><i>${err}</i>` : '');
                    $modal.find('.modal-body').html(msg);
                    setTimeout(()=> $modal.modal('show'),70);
                }

            }); // ajax

        }, 450); // timeout

    } // send files

}());


