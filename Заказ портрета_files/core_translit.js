(function(e){if(BX.translit)return;var a=null,t=[],r={max_len:100,change_case:"L",replace_space_and_other:true,replace_space:"_",replace_other:"_",delete_repeat_replace:true,use_google:false,replace_dict:"TRANS",replace_way:"LE",skip_r_test:false},n={en:/[A-Z0-9]/i,space:/\s/};BX.translit=function(e,a){if(null==a)a={};for(var t in r){if(typeof a[t]=="undefined")a[t]=r[t]}if(a.change_case)a.change_case=a.change_case.toUpperCase();if(a.use_google&&a.callback&&!!BX.message("YANDEX_KEY")){return new BX.CYandexTranslator(e,a).run()}else{var s=e.length;var l="";var o="";for(var t=0;t<s;t++){var c=e.charAt(t);if(!a.skip_r_test&&n.en.test(c)){p=c}else if(!a.skip_r_test&&n.space.test(c)){if(!a.delete_repeat_replace||t>0&&o!=a.replace_space)p=a.replace_space;else p=""}else{var p=i(c,a.change_case,a.replace_way,a.replace_dict,a.replace_separator);if(null===p){if(a.replace_space_and_other){if(!a.delete_repeat_replace||t>0&&t!=s-1&&o!=a.replace_other)p=a.replace_other;else p=""}else{p=c}}}if(null!=p&&p.length>0){switch(a.change_case){case"L":p=p.toLowerCase();break;case"U":p=p.toUpperCase();break}l+=p;o=p}if(l.length>=a.max_len)break}if(null!=a.callback&&BX.type.isFunction(a.callback)){a.callback(l);return l}else return l}};BX.correctText=function(e,a){if(typeof a=="undefined")a={};a.max_len=a.max_len?a.max_len:e.length;a.replace_way=a.replace_way?a.replace_way:"EL";a.mixed=a.mixed?true:false;if(!a.mixed||a.replace_way=="AUTO"){var t=0;var r=0;var n=e.length;var s=/[A-Z]/i;var l=/[0-9!@#$%\^\&\*:;"~_ \(\),.\+\=\-\\\{\}\?\<\>]/i;for(var i=0;i<n;i++){var o=e.charAt(i);if(s.test(o)){t++}else if(l.test(o)){}else{r++}}}if(a.replace_way=="AUTO"){if(r>t){a.replace_way="LE"}else{a.replace_way="EL"}}if(a.replace_way=="LE"){if(!a.mixed&&(t>0||r==0)){return e}}else if(!a.mixed&&a.replace_way=="EL"){if(!a.mixed&&(t==0||r>0)){return e}}return BX.translit(e,{replace_dict:"CORRECT",replace_way:a.replace_way,replace_separator:" ",skip_r_test:true,change_case:false,max_len:a.max_len,delete_repeat_replace:false,replace_space_and_other:false})};BX.IExternalTranslator=function(e,a){this.str=e;this.params=a};BX.IExternalTranslator.prototype.run=function(){var e=s(this.str);if(e)this.result({translation:e},true);else this.translate()};BX.IExternalTranslator.prototype.translate=function(){};BX.IExternalTranslator.prototype.result=function(e,a){if(!a)t[t.length]={original:this.str,translation:e.translation};this.params.use_google=false;BX.translit(e.translation,this.params)};BX.CGoogleTranslator=function(e,a){BX.CBingTranslator.superclass.constructor.apply(this,arguments)};BX.extend(BX.CGoogleTranslator,BX.IExternalTranslator);BX.CGoogleTranslator.prototype.translate=function(){if(!e.google||typeof e.google.load!="function"){if(BX.browser.IsIE()){var a=BX.proxy(this.translate,this);var t=function(){setTimeout(function(){a(arguments)},100)}}else{var t=BX.proxy(this.translate,this)}BX.loadScript("http://www.google.com/jsapi?rnd="+Math.random(),t)}else if(!e.google.language){google.load("language",1,{callback:BX.proxy(this.translate,this)})}else{google.language.translate(this.str,BX.message("LANGUAGE_ID"),"en",BX.delegate(this.result,this))}};BX.CBingTranslator=function(e,a){BX.CBingTranslator.superclass.constructor.apply(this,arguments)};BX.extend(BX.CBingTranslator,BX.IExternalTranslator);BX.CBingTranslator.prototype.translate=function(){var a="bing_translate_callback_"+parseInt(Math.random()*1e4),t="http://api.bing.net/json.aspx?AppId="+BX.message("BING_KEY")+"&Query="+BX.util.urlencode(this.str.substr(0,5e3))+"&Sources=Translation&Version="+(this.params.version||"2.2")+"&Translation.SourceLanguage="+BX.message("LANGUAGE_ID")+"&Translation.TargetLanguage=en&JsonType=callback&JsonCallback="+a;e[a]=BX.proxy(this.result,this);BX.loadScript(t,function(){e[a]=null})};BX.CBingTranslator.prototype.result=function(e,a){var t={translation:this.str};if(e){if(e.translation)t=e;else if(e.SearchResponse&&e.SearchResponse.Translation&&e.SearchResponse.Translation.Results&&e.SearchResponse.Translation.Results[0]){t.translation=e.SearchResponse.Translation.Results[0].TranslatedTerm}}return BX.CBingTranslator.superclass.result.apply(this,[t,a])};BX.CYandexTranslator=function(e,a){BX.CYandexTranslator.superclass.constructor.apply(this,arguments)};BX.extend(BX.CYandexTranslator,BX.IExternalTranslator);BX.CYandexTranslator.prototype.translate=function(){var a=this.str.substr(0,5e3).split(/\n/),t="",r;for(r=0;r<a.length;r++)t+="&text="+BX.util.urlencode(a[r]);var n=(BX.message("LANGUAGE_ID")=="ua"?"uk":BX.message("LANGUAGE_ID"))+"-en";var s="yandex_translate_callback_"+parseInt(Math.random()*1e5),l="https://translate.yandex.net/api/v1.5/tr.json/translate?key="+BX.message("YANDEX_KEY")+"&lang="+n+"&callback="+s+"&clientId=bitrix"+t;e[s]=BX.proxy(this.result,this);BX.loadScript(l,function(){e[s]=null})};BX.CYandexTranslator.prototype.result=function(e,a){var t={translation:this.str};if(!!e){if(e.translation)t=e;else if(e.code==200&&e.text.length>0)t.translation=e.text.join("\n")}return BX.CYandexTranslator.superclass.result.apply(this,[t,a])};function s(e){for(var a=0,r=t.length;a<r;a++){if(t[a].original==e)return t[a].translation}return null}function l(e,t,r){var n=(BX.message(e+(t=="LE"?"_FROM":"_TO"))||"").split(r),s=(BX.message(e+(t=="LE"?"_TO":"_FROM"))||"").split(r),l,i;if(a==null)a={};if(typeof a[e]=="undefined")a[e]={};a[e][t]=[];for(l=0,i=n.length;l<i;l++){a[e][t][l]=[n[l],s[l]]}}function i(e,t,r,n,s){if(typeof s=="undefined")s=",";if(typeof n=="undefined")n="TRANS";if(a==null||typeof a[n]=="undefined"||typeof a[n][r]=="undefined")l(n,r,s);for(var i=0,o=a[n][r].length;i<o;i++){if(e===a[n][r][i][0]){return a[n][r][i][1]}}return null}})(window);