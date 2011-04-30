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
                if (offset - 150 > y + window.innerHeight) return false;
                title = $('a', this).text();
                if (offset - 150 > y) return false;
                if (title) { document.title = title + ' | vxsx.ru' }
            })
        })
    }
})

