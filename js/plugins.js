//jquery.stickyfloat
$.fn.stickyfloat=function(a,b){var c=this,d=parseInt(c.parent().css("padding-top")),e=c.parent().offset().top,f="relative",g=$.extend({startOffset:e,offsetY:d,duration:200,lockBottom:!0},a);c.css({position:f});if(g.lockBottom){var h=c.parent().height()-c.height()+d;h<0&&(h=0)}$(window).scroll(function(){c.stop();var a=$(document).scrollTop()>g.startOffset,b=c.offset().top>e,f=c.outerHeight()<$(window).height();if((a||b)&&f){var i=$(document).scrollTop()-e+g.offsetY;i>h&&(i=h),$(document).scrollTop()<g.startOffset&&(i=d),c.animate({top:i},g.duration)}})}

/**
 * Dragdealer JS v0.9.5
 * http://code.ovidiu.ch/dragdealer-js
 *
 * Copyright (c) 2010, Ovidiu Chereches
 * MIT License
 * http://legal.ovidiu.ch/licenses/MIT
 */

var Cursor={x:0,y:0,init:function()
{this.setEvent('mouse');this.setEvent('touch');},setEvent:function(type)
{var moveHandler=document['on'+type+'move']||function(){};document['on'+type+'move']=function(e)
{moveHandler(e);Cursor.refresh(e);}},refresh:function(e)
{if(!e)
{e=window.event;}
if(e.type=='mousemove')
{this.set(e);}
else if(e.touches)
{this.set(e.touches[0]);}},set:function(e)
{if(e.pageX||e.pageY)
{this.x=e.pageX;this.y=e.pageY;}
else if(e.clientX||e.clientY)
{this.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;this.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;}}};Cursor.init();var Position={get:function(obj)
{var curleft=curtop=0;if(obj.offsetParent)
{do
{curleft+=obj.offsetLeft;curtop+=obj.offsetTop;}
while((obj=obj.offsetParent));}
return[curleft,curtop];}};var Dragdealer=function(wrapper,options)
{if(typeof(wrapper)=='string')
{wrapper=document.getElementById(wrapper);}
if(!wrapper)
{return;}
var handle=wrapper.getElementsByTagName('ul')[0];if(!handle||handle.className.search(/(^|\s)handle(\s|$)/)==-1)
{return;}
this.init(wrapper,handle,options||{});this.setup();};Dragdealer.prototype={init:function(wrapper,handle,options)
{this.wrapper=wrapper;this.handle=handle;this.options=options;this.disabled=this.getOption('disabled',false);this.horizontal=this.getOption('horizontal',true);this.vertical=this.getOption('vertical',false);this.slide=this.getOption('slide',true);this.steps=this.getOption('steps',0);this.snap=this.getOption('snap',false);this.loose=this.getOption('loose',false);this.speed=this.getOption('speed',10)/100;this.xPrecision=this.getOption('xPrecision',0);this.yPrecision=this.getOption('yPrecision',0);this.callback=options.callback||null;this.animationCallback=options.animationCallback||null;this.bounds={left:options.left||0,right:-(options.right||0),top:options.top||0,bottom:-(options.bottom||0),x0:0,x1:0,xRange:0,y0:0,y1:0,yRange:0};this.value={prev:[-1,-1],current:[options.x||0,options.y||0],target:[options.x||0,options.y||0]};this.offset={wrapper:[0,0],mouse:[0,0],prev:[-999999,-999999],current:[0,0],target:[0,0]};this.change=[0,0];this.activity=false;this.dragging=false;this.tapping=false;},getOption:function(name,defaultValue)
{return this.options[name]!==undefined?this.options[name]:defaultValue;},setup:function()
{this.setWrapperOffset();this.setBoundsPadding();this.setBounds();this.setSteps();this.addListeners();},setWrapperOffset:function()
{this.offset.wrapper=Position.get(this.wrapper);},setBoundsPadding:function()
{if(!this.bounds.left&&!this.bounds.right)
{this.bounds.left=Position.get(this.handle)[0]-this.offset.wrapper[0];this.bounds.right=-this.bounds.left;}
if(!this.bounds.top&&!this.bounds.bottom)
{this.bounds.top=Position.get(this.handle)[1]-this.offset.wrapper[1];this.bounds.bottom=-this.bounds.top;}},setBounds:function()
{this.bounds.x0=this.bounds.left;this.bounds.x1=this.wrapper.offsetWidth+this.bounds.right;this.bounds.xRange=(this.bounds.x1-this.bounds.x0)-this.handle.offsetWidth;this.bounds.y0=this.bounds.top;this.bounds.y1=this.wrapper.offsetHeight+this.bounds.bottom;this.bounds.yRange=(this.bounds.y1-this.bounds.y0)-this.handle.offsetHeight;this.bounds.xStep=1/(this.xPrecision||Math.max(this.wrapper.offsetWidth,this.handle.offsetWidth));this.bounds.yStep=1/(this.yPrecision||Math.max(this.wrapper.offsetHeight,this.handle.offsetHeight));},setSteps:function()
{if(this.steps>1)
{this.stepRatios=[];for(var i=0;i<=this.steps-1;i++)
{this.stepRatios[i]=i/(this.steps-1);}}},addListeners:function()
{var self=this;this.wrapper.onselectstart=function()
{return false;}
this.handle.onmousedown=this.handle.ontouchstart=function(e)
{self.handleDownHandler(e);};this.wrapper.onmousedown=this.wrapper.ontouchstart=function(e)
{self.wrapperDownHandler(e);};var mouseUpHandler=document.onmouseup||function(){};document.onmouseup=function(e)
{mouseUpHandler(e);self.documentUpHandler(e);};var touchEndHandler=document.ontouchend||function(){};document.ontouchend=function(e)
{touchEndHandler(e);self.documentUpHandler(e);};var resizeHandler=window.onresize||function(){};window.onresize=function(e)
{resizeHandler(e);self.documentResizeHandler(e);};this.wrapper.onmousemove=function(e)
{self.activity=true;}
this.wrapper.onclick=function(e)
{return!self.activity;}
this.interval=setInterval(function(){self.animate()},25);self.animate(false,true);},handleDownHandler:function(e)
{this.activity=false;Cursor.refresh(e);this.preventDefaults(e,true);this.startDrag();this.cancelEvent(e);},wrapperDownHandler:function(e)
{Cursor.refresh(e);this.preventDefaults(e,true);this.startTap();},documentUpHandler:function(e)
{this.stopDrag();this.stopTap();},documentResizeHandler:function(e)
{this.setWrapperOffset();this.setBounds();this.update();},enable:function()
{this.disabled=false;this.handle.className=this.handle.className.replace(/\s?disabled/g,'');},disable:function()
{this.disabled=true;this.handle.className+=' disabled';},setStep:function(x,y,snap)
{this.setValue(this.steps&&x>1?(x-1)/(this.steps-1):0,this.steps&&y>1?(y-1)/(this.steps-1):0,snap);},setValue:function(x,y,snap)
{this.setTargetValue([x,y||0]);if(snap)
{this.groupCopy(this.value.current,this.value.target);}},startTap:function(target)
{if(this.disabled)
{return;}
this.tapping=true;if(target===undefined)
{target=[Cursor.x-this.offset.wrapper[0]-(this.handle.offsetWidth/2),Cursor.y-this.offset.wrapper[1]-(this.handle.offsetHeight/2)];}
this.setTargetOffset(target);},stopTap:function()
{if(this.disabled||!this.tapping)
{return;}
this.tapping=false;this.setTargetValue(this.value.current);this.result();},startDrag:function()
{if(this.disabled)
{return;}
this.offset.mouse=[Cursor.x-Position.get(this.handle)[0],Cursor.y-Position.get(this.handle)[1]];this.dragging=true;},stopDrag:function()
{if(this.disabled||!this.dragging)
{return;}
this.dragging=false;var target=this.groupClone(this.value.current);if(this.slide)
{var ratioChange=this.change;target[0]+=ratioChange[0]*4;target[1]+=ratioChange[1]*4;}
this.setTargetValue(target);this.result();},feedback:function()
{var value=this.value.current;if(this.snap&&this.steps>1)
{value=this.getClosestSteps(value);}
if(!this.groupCompare(value,this.value.prev))
{if(typeof(this.animationCallback)=='function')
{this.animationCallback(value[0],value[1]);}
this.groupCopy(this.value.prev,value);}},result:function()
{if(typeof(this.callback)=='function')
{this.callback(this.value.target[0],this.value.target[1]);}},animate:function(direct,first)
{if(direct&&!this.dragging)
{return;}
if(this.dragging)
{var prevTarget=this.groupClone(this.value.target);var offset=[Cursor.x-this.offset.wrapper[0]-this.offset.mouse[0],Cursor.y-this.offset.wrapper[1]-this.offset.mouse[1]];this.setTargetOffset(offset,this.loose);this.change=[this.value.target[0]-prevTarget[0],this.value.target[1]-prevTarget[1]];}
if(this.dragging||first)
{this.groupCopy(this.value.current,this.value.target);}
if(this.dragging||this.glide()||first)
{this.update();this.feedback();}},glide:function()
{var diff=[this.value.target[0]-this.value.current[0],this.value.target[1]-this.value.current[1]];if(!diff[0]&&!diff[1])
{return false;}
if(Math.abs(diff[0])>this.bounds.xStep||Math.abs(diff[1])>this.bounds.yStep)
{this.value.current[0]+=diff[0]*this.speed;this.value.current[1]+=diff[1]*this.speed;}
else
{this.groupCopy(this.value.current,this.value.target);}
return true;},update:function()
{if(!this.snap)
{this.offset.current=this.getOffsetsByRatios(this.value.current);}
else
{this.offset.current=this.getOffsetsByRatios(this.getClosestSteps(this.value.current));}
this.show();},show:function()
{if(!this.groupCompare(this.offset.current,this.offset.prev))
{if(this.horizontal)
{this.handle.style.left=String(this.offset.current[0])+'px';}
if(this.vertical)
{this.handle.style.top=String(this.offset.current[1])+'px';}
this.groupCopy(this.offset.prev,this.offset.current);}},setTargetValue:function(value,loose)
{var target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target);this.offset.target=this.getOffsetsByRatios(target);},setTargetOffset:function(offset,loose)
{var value=this.getRatiosByOffsets(offset);var target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target);this.offset.target=this.getOffsetsByRatios(target);},getLooseValue:function(value)
{var proper=this.getProperValue(value);return[proper[0]+((value[0]-proper[0])/4),proper[1]+((value[1]-proper[1])/4)];},getProperValue:function(value)
{var proper=this.groupClone(value);proper[0]=Math.max(proper[0],0);proper[1]=Math.max(proper[1],0);proper[0]=Math.min(proper[0],1);proper[1]=Math.min(proper[1],1);if((!this.dragging&&!this.tapping)||this.snap)
{if(this.steps>1)
{proper=this.getClosestSteps(proper);}}
return proper;},getRatiosByOffsets:function(group)
{return[this.getRatioByOffset(group[0],this.bounds.xRange,this.bounds.x0),this.getRatioByOffset(group[1],this.bounds.yRange,this.bounds.y0)];},getRatioByOffset:function(offset,range,padding)
{return range?(offset-padding)/range:0;},getOffsetsByRatios:function(group)
{return[this.getOffsetByRatio(group[0],this.bounds.xRange,this.bounds.x0),this.getOffsetByRatio(group[1],this.bounds.yRange,this.bounds.y0)];},getOffsetByRatio:function(ratio,range,padding)
{return Math.round(ratio*range)+padding;},getClosestSteps:function(group)
{return[this.getClosestStep(group[0]),this.getClosestStep(group[1])];},getClosestStep:function(value)
{var k=0;var min=1;for(var i=0;i<=this.steps-1;i++)
{if(Math.abs(this.stepRatios[i]-value)<min)
{min=Math.abs(this.stepRatios[i]-value);k=i;}}
return this.stepRatios[k];},groupCompare:function(a,b)
{return a[0]==b[0]&&a[1]==b[1];},groupCopy:function(a,b)
{a[0]=b[0];a[1]=b[1];},groupClone:function(a)
{return[a[0],a[1]];},preventDefaults:function(e,selection)
{if(!e)
{e=window.event;}
if(e.preventDefault)
{e.preventDefault();}
e.returnValue=false;if(selection&&document.selection)
{document.selection.empty();}},cancelEvent:function(e)
{if(!e)
{e=window.event;}
if(e.stopPropagation)
{e.stopPropagation();}
e.cancelBubble=true;}};


/** jquery tmpl plugin */
(function(a){var r=a.fn.domManip,d="_tmplitem",q=/^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,b={},f={},e,p={key:0,data:{}},h=0,c=0,l=[];function g(e,d,g,i){var c={data:i||(d?d.data:{}),_wrap:d?d._wrap:null,tmpl:null,parent:d||null,nodes:[],calls:u,nest:w,wrap:x,html:v,update:t};e&&a.extend(c,e,{nodes:[],parent:d});if(g){c.tmpl=g;c._ctnt=c._ctnt||c.tmpl(a,c);c.key=++h;(l.length?f:b)[h]=c}return c}a.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(f,d){a.fn[f]=function(n){var g=[],i=a(n),k,h,m,l,j=this.length===1&&this[0].parentNode;e=b||{};if(j&&j.nodeType===11&&j.childNodes.length===1&&i.length===1){i[d](this[0]);g=this}else{for(h=0,m=i.length;h<m;h++){c=h;k=(h>0?this.clone(true):this).get();a.fn[d].apply(a(i[h]),k);g=g.concat(k)}c=0;g=this.pushStack(g,f,i.selector)}l=e;e=null;a.tmpl.complete(l);return g}});a.fn.extend({tmpl:function(d,c,b){return a.tmpl(this[0],d,c,b)},tmplItem:function(){return a.tmplItem(this[0])},template:function(b){return a.template(b,this[0])},domManip:function(d,l,j){if(d[0]&&d[0].nodeType){var f=a.makeArray(arguments),g=d.length,i=0,h;while(i<g&&!(h=a.data(d[i++],"tmplItem")));if(g>1)f[0]=[a.makeArray(d)];if(h&&c)f[2]=function(b){a.tmpl.afterManip(this,b,j)};r.apply(this,f)}else r.apply(this,arguments);c=0;!e&&a.tmpl.complete(b);return this}});a.extend({tmpl:function(d,h,e,c){var j,k=!c;if(k){c=p;d=a.template[d]||a.template(null,d);f={}}else if(!d){d=c.tmpl;b[c.key]=c;c.nodes=[];c.wrapped&&n(c,c.wrapped);return a(i(c,null,c.tmpl(a,c)))}if(!d)return[];if(typeof h==="function")h=h.call(c||{});e&&e.wrapped&&n(e,e.wrapped);j=a.isArray(h)?a.map(h,function(a){return a?g(e,c,d,a):null}):[g(e,c,d,h)];return k?a(i(c,null,j)):j},tmplItem:function(b){var c;if(b instanceof a)b=b[0];while(b&&b.nodeType===1&&!(c=a.data(b,"tmplItem"))&&(b=b.parentNode));return c||p},template:function(c,b){if(b){if(typeof b==="string")b=o(b);else if(b instanceof a)b=b[0]||{};if(b.nodeType)b=a.data(b,"tmpl")||a.data(b,"tmpl",o(b.innerHTML));return typeof c==="string"?(a.template[c]=b):b}return c?typeof c!=="string"?a.template(null,c):a.template[c]||a.template(null,q.test(c)?c:a(c)):null},encode:function(a){return(""+a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")}});a.extend(a.tmpl,{tag:{tmpl:{_default:{$2:"null"},open:"if($notnull_1){_=_.concat($item.nest($1,$2));}"},wrap:{_default:{$2:"null"},open:"$item.calls(_,$1,$2);_=[];",close:"call=$item.calls();_=call._.concat($item.wrap(call,_));"},each:{_default:{$2:"$index, $value"},open:"if($notnull_1){$.each($1a,function($2){with(this){",close:"}});}"},"if":{open:"if(($notnull_1) && $1a){",close:"}"},"else":{_default:{$1:"true"},open:"}else if(($notnull_1) && $1a){"},html:{open:"if($notnull_1){_.push($1a);}"},"=":{_default:{$1:"$data"},open:"if($notnull_1){_.push($.encode($1a));}"},"!":{open:""}},complete:function(){b={}},afterManip:function(f,b,d){var e=b.nodeType===11?a.makeArray(b.childNodes):b.nodeType===1?[b]:[];d.call(f,b);m(e);c++}});function i(e,g,f){var b,c=f?a.map(f,function(a){return typeof a==="string"?e.key?a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,"$1 "+d+'="'+e.key+'" $2'):a:i(a,e,a._ctnt)}):e;if(g)return c;c=c.join("");c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,function(f,c,e,d){b=a(e).get();m(b);if(c)b=j(c).concat(b);if(d)b=b.concat(j(d))});return b?b:j(c)}function j(c){var b=document.createElement("div");b.innerHTML=c;return a.makeArray(b.childNodes)}function o(b){return new Function("jQuery","$item","var $=jQuery,call,_=[],$data=$item.data;with($data){_.push('"+a.trim(b).replace(/([\\'])/g,"\\$1").replace(/[\r\t\n]/g," ").replace(/\$\{([^\}]*)\}/g,"{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,function(m,l,j,d,b,c,e){var i=a.tmpl.tag[j],h,f,g;if(!i)throw"Template command not found: "+j;h=i._default||[];if(c&&!/\w$/.test(b)){b+=c;c=""}if(b){b=k(b);e=e?","+k(e)+")":c?")":"";f=c?b.indexOf(".")>-1?b+c:"("+b+").call($item"+e:b;g=c?f:"(typeof("+b+")==='function'?("+b+").call($item):("+b+"))"}else g=f=h.$1||"null";d=k(d);return"');"+i[l?"close":"open"].split("$notnull_1").join(b?"typeof("+b+")!=='undefined' && ("+b+")!=null":"true").split("$1a").join(g).split("$1").join(f).split("$2").join(d?d.replace(/\s*([^\(]+)\s*(\((.*?)\))?/g,function(d,c,b,a){a=a?","+a+")":b?")":"";return a?"("+c+").call($item"+a:d}):h.$2||"")+"_.push('"})+"');}return _;")}function n(c,b){c._wrap=i(c,true,a.isArray(b)?b:[q.test(b)?b:a(b).html()]).join("")}function k(a){return a?a.replace(/\\'/g,"'").replace(/\\\\/g,"\\"):null}function s(b){var a=document.createElement("div");a.appendChild(b.cloneNode(true));return a.innerHTML}function m(o){var n="_"+c,k,j,l={},e,p,i;for(e=0,p=o.length;e<p;e++){if((k=o[e]).nodeType!==1)continue;j=k.getElementsByTagName("*");for(i=j.length-1;i>=0;i--)m(j[i]);m(k)}function m(j){var p,i=j,k,e,m;if(m=j.getAttribute(d)){while(i.parentNode&&(i=i.parentNode).nodeType===1&&!(p=i.getAttribute(d)));if(p!==m){i=i.parentNode?i.nodeType===11?0:i.getAttribute(d)||0:0;if(!(e=b[m])){e=f[m];e=g(e,b[i]||f[i],null,true);e.key=++h;b[h]=e}c&&o(m)}j.removeAttribute(d)}else if(c&&(e=a.data(j,"tmplItem"))){o(e.key);b[e.key]=e;i=a.data(j.parentNode,"tmplItem");i=i?i.key:0}if(e){k=e;while(k&&k.key!=i){k.nodes.push(j);k=k.parent}delete e._ctnt;delete e._wrap;a.data(j,"tmplItem",e)}function o(a){a=a+n;e=l[a]=l[a]||g(e,b[e.parent.key+n]||e.parent,null,true)}}}function u(a,d,c,b){if(!a)return l.pop();l.push({_:a,tmpl:d,item:this,data:c,options:b})}function w(d,c,b){return a.tmpl(a.template(d),c,b,this)}function x(b,d){var c=b.options||{};c.wrapped=d;return a.tmpl(a.template(b.tmpl),b.data,c,b.item)}function v(d,c){var b=this._wrap;return a.map(a(a.isArray(b)?b.join(""):b).filter(d||"*"),function(a){return c?a.innerText||a.textContent:a.outerHTML||s(a)})}function t(){var b=this.nodes;a.tmpl(null,null,null,this).insertBefore(b[0]);a(b).remove()}})(jQuery)

//title changer
$(function() {
    if ( $('.name').length > 1 ) {
        $(window).bind('scroll resize', function(){
            var y = $(window).scrollTop()
            var title = ''

            $('.name').each (function() {
                var offset = $(this).offset().top;
                if (offset > y + window.innerHeight) return false;
                title = $('a', this).text();
                if (offset > y) return false;
            })

            if (title) { document.title = title + ' | vxsx.ru' }
        })
    }
})


//prettify.js
window.PR_SHOULD_USE_CONTINUATION=true;window.PR_TAB_WIDTH=8;window.PR_normalizedHtml=window.PR=window.prettyPrintOne=window.prettyPrint=void 0;window._pr_isIE6=function(){var y=navigator&&navigator.userAgent&&navigator.userAgent.match(/\bMSIE ([678])\./);y=y?+y[1]:false;window._pr_isIE6=function(){return y};return y};
(function(){function y(b){return b.replace(L,"&amp;").replace(M,"&lt;").replace(N,"&gt;")}function H(b,f,i){switch(b.nodeType){case 1:var o=b.tagName.toLowerCase();f.push("<",o);var l=b.attributes,n=l.length;if(n){if(i){for(var r=[],j=n;--j>=0;)r[j]=l[j];r.sort(function(q,m){return q.name<m.name?-1:q.name===m.name?0:1});l=r}for(j=0;j<n;++j){r=l[j];r.specified&&f.push(" ",r.name.toLowerCase(),'="',r.value.replace(L,"&amp;").replace(M,"&lt;").replace(N,"&gt;").replace(X,"&quot;"),'"')}}f.push(">");
for(l=b.firstChild;l;l=l.nextSibling)H(l,f,i);if(b.firstChild||!/^(?:br|link|img)$/.test(o))f.push("</",o,">");break;case 3:case 4:f.push(y(b.nodeValue));break}}function O(b){function f(c){if(c.charAt(0)!=="\\")return c.charCodeAt(0);switch(c.charAt(1)){case "b":return 8;case "t":return 9;case "n":return 10;case "v":return 11;case "f":return 12;case "r":return 13;case "u":case "x":return parseInt(c.substring(2),16)||c.charCodeAt(1);case "0":case "1":case "2":case "3":case "4":case "5":case "6":case "7":return parseInt(c.substring(1),
8);default:return c.charCodeAt(1)}}function i(c){if(c<32)return(c<16?"\\x0":"\\x")+c.toString(16);c=String.fromCharCode(c);if(c==="\\"||c==="-"||c==="["||c==="]")c="\\"+c;return c}function o(c){var d=c.substring(1,c.length-1).match(RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]","g"));c=[];for(var a=[],k=d[0]==="^",e=k?1:0,h=d.length;e<h;++e){var g=d[e];switch(g){case "\\B":case "\\b":case "\\D":case "\\d":case "\\S":case "\\s":case "\\W":case "\\w":c.push(g);
continue}g=f(g);var s;if(e+2<h&&"-"===d[e+1]){s=f(d[e+2]);e+=2}else s=g;a.push([g,s]);if(!(s<65||g>122)){s<65||g>90||a.push([Math.max(65,g)|32,Math.min(s,90)|32]);s<97||g>122||a.push([Math.max(97,g)&-33,Math.min(s,122)&-33])}}a.sort(function(v,w){return v[0]-w[0]||w[1]-v[1]});d=[];g=[NaN,NaN];for(e=0;e<a.length;++e){h=a[e];if(h[0]<=g[1]+1)g[1]=Math.max(g[1],h[1]);else d.push(g=h)}a=["["];k&&a.push("^");a.push.apply(a,c);for(e=0;e<d.length;++e){h=d[e];a.push(i(h[0]));if(h[1]>h[0]){h[1]+1>h[0]&&a.push("-");
a.push(i(h[1]))}}a.push("]");return a.join("")}function l(c){for(var d=c.source.match(RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)","g")),a=d.length,k=[],e=0,h=0;e<a;++e){var g=d[e];if(g==="(")++h;else if("\\"===g.charAt(0))if((g=+g.substring(1))&&g<=h)k[g]=-1}for(e=1;e<k.length;++e)if(-1===k[e])k[e]=++n;for(h=e=0;e<a;++e){g=d[e];if(g==="("){++h;if(k[h]===undefined)d[e]="(?:"}else if("\\"===
g.charAt(0))if((g=+g.substring(1))&&g<=h)d[e]="\\"+k[h]}for(h=e=0;e<a;++e)if("^"===d[e]&&"^"!==d[e+1])d[e]="";if(c.ignoreCase&&r)for(e=0;e<a;++e){g=d[e];c=g.charAt(0);if(g.length>=2&&c==="[")d[e]=o(g);else if(c!=="\\")d[e]=g.replace(/[a-zA-Z]/g,function(s){s=s.charCodeAt(0);return"["+String.fromCharCode(s&-33,s|32)+"]"})}return d.join("")}for(var n=0,r=false,j=false,q=0,m=b.length;q<m;++q){var t=b[q];if(t.ignoreCase)j=true;else if(/[a-z]/i.test(t.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,
""))){r=true;j=false;break}}var p=[];q=0;for(m=b.length;q<m;++q){t=b[q];if(t.global||t.multiline)throw Error(""+t);p.push("(?:"+l(t)+")")}return RegExp(p.join("|"),j?"gi":"g")}function Y(b){var f=0;return function(i){for(var o=null,l=0,n=0,r=i.length;n<r;++n)switch(i.charAt(n)){case "\t":o||(o=[]);o.push(i.substring(l,n));l=b-f%b;for(f+=l;l>=0;l-=16)o.push("                ".substring(0,l));l=n+1;break;case "\n":f=0;break;default:++f}if(!o)return i;o.push(i.substring(l));return o.join("")}}function I(b,
f,i,o){if(f){b={source:f,c:b};i(b);o.push.apply(o,b.d)}}function B(b,f){var i={},o;(function(){for(var r=b.concat(f),j=[],q={},m=0,t=r.length;m<t;++m){var p=r[m],c=p[3];if(c)for(var d=c.length;--d>=0;)i[c.charAt(d)]=p;p=p[1];c=""+p;if(!q.hasOwnProperty(c)){j.push(p);q[c]=null}}j.push(/[\0-\uffff]/);o=O(j)})();var l=f.length;function n(r){for(var j=r.c,q=[j,z],m=0,t=r.source.match(o)||[],p={},c=0,d=t.length;c<d;++c){var a=t[c],k=p[a],e=void 0,h;if(typeof k==="string")h=false;else{var g=i[a.charAt(0)];
if(g){e=a.match(g[1]);k=g[0]}else{for(h=0;h<l;++h){g=f[h];if(e=a.match(g[1])){k=g[0];break}}e||(k=z)}if((h=k.length>=5&&"lang-"===k.substring(0,5))&&!(e&&typeof e[1]==="string")){h=false;k=P}h||(p[a]=k)}g=m;m+=a.length;if(h){h=e[1];var s=a.indexOf(h),v=s+h.length;if(e[2]){v=a.length-e[2].length;s=v-h.length}k=k.substring(5);I(j+g,a.substring(0,s),n,q);I(j+g+s,h,Q(k,h),q);I(j+g+v,a.substring(v),n,q)}else q.push(j+g,k)}r.d=q}return n}function x(b){var f=[],i=[];if(b.tripleQuotedStrings)f.push([A,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
null,"'\""]);else b.multiLineStrings?f.push([A,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):f.push([A,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]);b.verbatimStrings&&i.push([A,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null]);if(b.hashComments)if(b.cStyleComments){f.push([C,/^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]);i.push([A,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/,
null])}else f.push([C,/^#[^\r\n]*/,null,"#"]);if(b.cStyleComments){i.push([C,/^\/\/[^\r\n]*/,null]);i.push([C,/^\/\*[\s\S]*?(?:\*\/|$)/,null])}b.regexLiterals&&i.push(["lang-regex",RegExp("^"+Z+"(/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/)")]);b=b.keywords.replace(/^\s+|\s+$/g,"");b.length&&i.push([R,RegExp("^(?:"+b.replace(/\s+/g,"|")+")\\b"),null]);f.push([z,/^\s+/,null," \r\n\t\u00a0"]);i.push([J,/^@[a-z_$][a-z_$@0-9]*/i,null],[S,/^@?[A-Z]+[a-z][A-Za-z_$@0-9]*/,
null],[z,/^[a-z_$][a-z_$@0-9]*/i,null],[J,/^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i,null,"0123456789"],[E,/^.[^\s\w\.$@\'\"\`\/\#]*/,null]);return B(f,i)}function $(b){function f(D){if(D>r){if(j&&j!==q){n.push("</span>");j=null}if(!j&&q){j=q;n.push('<span class="',j,'">')}var T=y(p(i.substring(r,D))).replace(e?d:c,"$1&#160;");e=k.test(T);n.push(T.replace(a,s));r=D}}var i=b.source,o=b.g,l=b.d,n=[],r=0,j=null,q=null,m=0,t=0,p=Y(window.PR_TAB_WIDTH),c=/([\r\n ]) /g,
d=/(^| ) /gm,a=/\r\n?|\n/g,k=/[ \r\n]$/,e=true,h=window._pr_isIE6();h=h?b.b.tagName==="PRE"?h===6?"&#160;\r\n":h===7?"&#160;<br>\r":"&#160;\r":"&#160;<br />":"<br />";var g=b.b.className.match(/\blinenums\b(?::(\d+))?/),s;if(g){for(var v=[],w=0;w<10;++w)v[w]=h+'</li><li class="L'+w+'">';var F=g[1]&&g[1].length?g[1]-1:0;n.push('<ol class="linenums"><li class="L',F%10,'"');F&&n.push(' value="',F+1,'"');n.push(">");s=function(){var D=v[++F%10];return j?"</span>"+D+'<span class="'+j+'">':D}}else s=h;
for(;;)if(m<o.length?t<l.length?o[m]<=l[t]:true:false){f(o[m]);if(j){n.push("</span>");j=null}n.push(o[m+1]);m+=2}else if(t<l.length){f(l[t]);q=l[t+1];t+=2}else break;f(i.length);j&&n.push("</span>");g&&n.push("</li></ol>");b.a=n.join("")}function u(b,f){for(var i=f.length;--i>=0;){var o=f[i];if(G.hasOwnProperty(o))"console"in window&&console.warn("cannot override language handler %s",o);else G[o]=b}}function Q(b,f){b&&G.hasOwnProperty(b)||(b=/^\s*</.test(f)?"default-markup":"default-code");return G[b]}
function U(b){var f=b.f,i=b.e;b.a=f;try{var o,l=f.match(aa);f=[];var n=0,r=[];if(l)for(var j=0,q=l.length;j<q;++j){var m=l[j];if(m.length>1&&m.charAt(0)==="<"){if(!ba.test(m))if(ca.test(m)){f.push(m.substring(9,m.length-3));n+=m.length-12}else if(da.test(m)){f.push("\n");++n}else if(m.indexOf(V)>=0&&m.replace(/\s(\w+)\s*=\s*(?:\"([^\"]*)\"|'([^\']*)'|(\S+))/g,' $1="$2$3$4"').match(/[cC][lL][aA][sS][sS]=\"[^\"]*\bnocode\b/)){var t=m.match(W)[2],p=1,c;c=j+1;a:for(;c<q;++c){var d=l[c].match(W);if(d&&
d[2]===t)if(d[1]==="/"){if(--p===0)break a}else++p}if(c<q){r.push(n,l.slice(j,c+1).join(""));j=c}else r.push(n,m)}else r.push(n,m)}else{var a;p=m;var k=p.indexOf("&");if(k<0)a=p;else{for(--k;(k=p.indexOf("&#",k+1))>=0;){var e=p.indexOf(";",k);if(e>=0){var h=p.substring(k+3,e),g=10;if(h&&h.charAt(0)==="x"){h=h.substring(1);g=16}var s=parseInt(h,g);isNaN(s)||(p=p.substring(0,k)+String.fromCharCode(s)+p.substring(e+1))}}a=p.replace(ea,"<").replace(fa,">").replace(ga,"'").replace(ha,'"').replace(ia," ").replace(ja,
"&")}f.push(a);n+=a.length}}o={source:f.join(""),h:r};var v=o.source;b.source=v;b.c=0;b.g=o.h;Q(i,v)(b);$(b)}catch(w){if("console"in window)console.log(w&&w.stack?w.stack:w)}}var A="str",R="kwd",C="com",S="typ",J="lit",E="pun",z="pln",P="src",V="nocode",Z=function(){for(var b=["!","!=","!==","#","%","%=","&","&&","&&=","&=","(","*","*=","+=",",","-=","->","/","/=",":","::",";","<","<<","<<=","<=","=","==","===",">",">=",">>",">>=",">>>",">>>=","?","@","[","^","^=","^^","^^=","{","|","|=","||","||=",
"~","break","case","continue","delete","do","else","finally","instanceof","return","throw","try","typeof"],f="(?:^^|[+-]",i=0;i<b.length;++i)f+="|"+b[i].replace(/([^=<>:&a-z])/g,"\\$1");f+=")\\s*";return f}(),L=/&/g,M=/</g,N=/>/g,X=/\"/g,ea=/&lt;/g,fa=/&gt;/g,ga=/&apos;/g,ha=/&quot;/g,ja=/&amp;/g,ia=/&nbsp;/g,ka=/[\r\n]/g,K=null,aa=RegExp("[^<]+|<!--[\\s\\S]*?--\>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>|</?[a-zA-Z](?:[^>\"']|'[^']*'|\"[^\"]*\")*>|<","g"),ba=/^<\!--/,ca=/^<!\[CDATA\[/,da=/^<br\b/i,W=/^<(\/?)([a-zA-Z][a-zA-Z0-9]*)/,
la=x({keywords:"break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual wchar_t where break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient as base by checked decimal delegate descending event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof debugger eval export function get null set undefined var with Infinity NaN caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END break continue do else for if return while and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None break continue do else for if return while alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END break continue do else for if return while case done elif esac eval fi function in local set then until ",
hashComments:true,cStyleComments:true,multiLineStrings:true,regexLiterals:true}),G={};u(la,["default-code"]);u(B([],[[z,/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],[C,/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],[E,/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup",
"htm","html","mxml","xhtml","xml","xsl"]);u(B([[z,/^[\s]+/,null," \t\r\n"],["atv",/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[E,/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],
["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]);u(B([],[["atv",/^[\s\S]+/]]),["uq.val"]);u(x({keywords:"break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual wchar_t where ",
hashComments:true,cStyleComments:true}),["c","cc","cpp","cxx","cyc","m"]);u(x({keywords:"null true false"}),["json"]);u(x({keywords:"break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient as base by checked decimal delegate descending event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var ",
hashComments:true,cStyleComments:true,verbatimStrings:true}),["cs"]);u(x({keywords:"break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient ",
cStyleComments:true}),["java"]);u(x({keywords:"break continue do else for if return while case done elif esac eval fi function in local set then until ",hashComments:true,multiLineStrings:true}),["bsh","csh","sh"]);u(x({keywords:"break continue do else for if return while and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None ",hashComments:true,multiLineStrings:true,tripleQuotedStrings:true}),["cv","py"]);
u(x({keywords:"caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",hashComments:true,multiLineStrings:true,regexLiterals:true}),["perl","pl","pm"]);u(x({keywords:"break continue do else for if return while alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END ",hashComments:true,
multiLineStrings:true,regexLiterals:true}),["rb"]);u(x({keywords:"break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof debugger eval export function get null set undefined var with Infinity NaN ",cStyleComments:true,regexLiterals:true}),["js"]);u(B([],[[A,/^[\s\S]+/]]),
["regex"]);window.PR_normalizedHtml=H;window.prettyPrintOne=function(b,f){var i={f:b,e:f};U(i);return i.a};window.prettyPrint=function(b){function f(){for(var t=window.PR_SHOULD_USE_CONTINUATION?j.now()+250:Infinity;q<o.length&&j.now()<t;q++){var p=o[q];if(p.className&&p.className.indexOf("prettyprint")>=0){var c=p.className.match(/\blang-(\w+)\b/);if(c)c=c[1];for(var d=false,a=p.parentNode;a;a=a.parentNode)if((a.tagName==="pre"||a.tagName==="code"||a.tagName==="xmp")&&a.className&&a.className.indexOf("prettyprint")>=
0){d=true;break}if(!d){a=p;if(null===K){d=document.createElement("PRE");d.appendChild(document.createTextNode('<!DOCTYPE foo PUBLIC "foo bar">\n<foo />'));K=!/</.test(d.innerHTML)}if(K){d=a.innerHTML;if("XMP"===a.tagName)d=y(d);else{a=a;if("PRE"===a.tagName)a=true;else if(ka.test(d)){var k="";if(a.currentStyle)k=a.currentStyle.whiteSpace;else if(window.getComputedStyle)k=window.getComputedStyle(a,null).whiteSpace;a=!k||k==="pre"}else a=true;a||(d=d.replace(/(<br\s*\/?>)[\r\n]+/g,"$1").replace(/(?:[\r\n]+[ \t]*)+/g,
" "))}d=d}else{d=[];for(a=a.firstChild;a;a=a.nextSibling)H(a,d);d=d.join("")}d=d.replace(/(?:\r\n?|\n)$/,"");m={f:d,e:c,b:p};U(m);if(p=m.a){c=m.b;if("XMP"===c.tagName){d=document.createElement("PRE");for(a=0;a<c.attributes.length;++a){k=c.attributes[a];if(k.specified)if(k.name.toLowerCase()==="class")d.className=k.value;else d.setAttribute(k.name,k.value)}d.innerHTML=p;c.parentNode.replaceChild(d,c)}else c.innerHTML=p}}}}if(q<o.length)setTimeout(f,250);else b&&b()}for(var i=[document.getElementsByTagName("pre"),
document.getElementsByTagName("code"),document.getElementsByTagName("xmp")],o=[],l=0;l<i.length;++l)for(var n=0,r=i[l].length;n<r;++n)o.push(i[l][n]);i=null;var j=Date;j.now||(j={now:function(){return(new Date).getTime()}});var q=0,m;f()};window.PR={combinePrefixPatterns:O,createSimpleLexer:B,registerLangHandler:u,sourceDecorator:x,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:C,PR_DECLARATION:"dec",PR_KEYWORD:R,PR_LITERAL:J,PR_NOCODE:V,PR_PLAIN:z,PR_PUNCTUATION:E,PR_SOURCE:P,PR_STRING:A,
PR_TAG:"tag",PR_TYPE:S}})()

PR.registerLangHandler(
    PR.createSimpleLexer(
        [
         // The space production <s>
         [PR.PR_PLAIN,       /^[ \t\r\n\f]+/, null, ' \t\r\n\f']
        ],
        [
         // Quoted strings.  <string1> and <string2>
         [PR.PR_STRING,
          /^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/, null],
         [PR.PR_STRING,
          /^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/, null],
         ['lang-css-str', /^url\(([^\)\"\']*)\)/i],
         [PR.PR_KEYWORD,
          /^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i,
          null],
         // A property name -- an identifier followed by a colon.
         ['lang-css-kw', /^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i],
         // A C style block comment.  The <comment> production.
         [PR.PR_COMMENT, /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
         // Escaping text spans
         [PR.PR_COMMENT, /^(?:<!--|-->)/],
         // A number possibly containing a suffix.
         [PR.PR_LITERAL, /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],
         // A hex color
         [PR.PR_LITERAL, /^#(?:[0-9a-f]{3}){1,2}/i],
         // An identifier
         [PR.PR_PLAIN,
          /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],
         // A run of punctuation
         [PR.PR_PUNCTUATION, /^[^\s\w\'\"]+/]
        ]),
    ['css']);
PR.registerLangHandler(
    PR.createSimpleLexer([],
        [
         [PR.PR_KEYWORD,
          /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]
        ]),
    ['css-kw']);
PR.registerLangHandler(
    PR.createSimpleLexer([],
        [
         [PR.PR_STRING, /^[^\)\"\']+/]
        ]),
    ['css-str']);
