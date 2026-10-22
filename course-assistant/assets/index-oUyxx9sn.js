(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new Map;function t(t,n){let r=e.get(t);r||(r=new Set,e.set(t,r));let i=n;return r.add(i),()=>{r.delete(i)}}function n(t,n){for(let r of[...e.get(t)??[]])r(n)}async function r(e,t,n){return e}async function i(e){let t=new URL(e,location.href);if(![`http:`,`https:`].includes(t.protocol))throw Error(`只允许打开 HTTP/HTTPS 链接`);window.open(t.href,`_blank`,`noopener,noreferrer`)}function a(e,t){let n=URL.createObjectURL(new Blob([t],{type:`text/plain;charset=utf-8`})),r=document.createElement(`a`);r.href=n,r.download=e,r.click(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}var o=[`判断题`,`单选题`,`多选题`,`填空题`,`简答题`,`名词解释`,`论述题`,`排序题`];function s(e){return e.normalize(`NFKC`).trim().toLowerCase().replace(RegExp(`^(${o.join(`|`)})\\s*[:：]`),``).replace(/[^\p{L}\p{N}]/gu,``)}var c=class{data;constructor(e){if(this.data=e,!e.question_index||!Object.keys(e.question_index).length||!e.stem_index)throw Error(`题库格式错误`)}get size(){return Object.keys(this.data.question_index).length}lookup(e,t,n){if(this.data.question_index[e.id])return this.data.question_index[e.id];let r=e.stem.normalize(`NFKC`).trim().toLowerCase().replace(RegExp(`^(?:【|\\[)?(${o.join(`|`)})(?:】|\\])?\\s*[:：]?\\s*`),``);for(let i of[s(e.stem),s(r),...o.map(e=>s(e+r))]){let e=(this.data.stem_index[i]??[]).map(e=>this.data.question_index[e]).filter(Boolean),r=e.find(e=>(!t||e.course_id===t)&&(!n||e.work_id===n));if(r)return r;if(e.length&&e.every(t=>t.answer===e[0].answer))return e[0]}}};function l(e){let t=e?.trim().replace(/^[【\[]|[】\]]$/g,``)??``;return/^\d+$/.test(t)?Number(t):{单选题:0,单选:0,单项选择:0,多选题:1,多选:1,多项选择:1,填空题:2,填空:2,判断题:3,判断:3,简答题:4,简答:4,问答:4,名词解释:5,论述题:6,计算题:7,其它:8,其他:8,分录题:9,资料题:10,连线题:11,排序题:13,完型填空:14,完形填空:14,阅读理解:15,口语题:18,听力题:19,共用选项题:20,测评题:21}[t]}var u=e=>{let t=e.trim().toLowerCase();if([`true`,`对`,`正确`,`是`,`√`,`1`,`yes`,`right`].includes(t))return!0;if([`false`,`错`,`错误`,`否`,`×`,`0`,`no`,`wrong`].includes(t))return!1};function d(e,t,n){let r=n??l(e.question_type)??l(t.question_type);if(r===void 0)throw Error(`题目 ${e.id} 的题型不受支持`);let i=new URLSearchParams({[`answertype${e.id}`]:String(r)}),a=(t.answer_labels?.length?t.answer_labels:t.answer.toUpperCase().match(/[A-Z]/g)??[]).map(e=>e.trim().toUpperCase());if(r===0||r===1){if(!a.length||a.some(e=>!/^[A-Z]$/.test(e)))throw Error(`题目 ${e.id} 缺少选项答案`);if(r===0&&a.length!==1)throw Error(`题目 ${e.id} 单选答案不唯一`);i.set(`answer${e.id}`,r===0?a[0]:[...new Set(a)].sort().join(``))}else if(r===2||r===14){let n=(t.answer_blanks?.length?t.answer_blanks:t.answer.split(/[；;]/)).map(e=>e.trim());if(!n.length||n.some(e=>!e))throw Error(`题目 ${e.id} 缺少填空答案`);i.set(`tiankongsize${e.id}`,String(n.length)),n.forEach((t,n)=>{i.set(`answer${e.id}${n+1}`,t),i.set(`answerEditor${e.id}${n+1}`,t)})}else if(r===3){let n=[t.answer_text,...t.answer_labels??[],t.answer,...t.answer_blanks??[]].filter(Boolean),r=n.map(u).find(e=>e!==void 0),a=e.options.length?e.options:t.options??[];if(r===void 0){for(let e of n)if(r=u(a.find(t=>t.label.toUpperCase()===e.toUpperCase())?.text??``),r!==void 0)break}if(r===void 0&&(r=n.includes(`A`)?!0:!n.includes(`B`)&&void 0),r===void 0)throw Error(`题目 ${e.id} 缺少判断答案`);i.set(`answer${e.id}`,String(r))}else{let n=(t.answer_text||t.answer).trim();if(!n)throw Error(`题目 ${e.id} 答案为空`);i.set(`answer${e.id}`,n),r>=4&&r<=10&&i.set(`answerEditor${e.id}`,n)}return i}var f=`https://smartcourse.hust.edu.cn`,p=`hust-course-bridge-v1`;function m(e){try{let t=new URL(e.url);return t.origin!==`https://smartcourse.hust.edu.cn`||t.username||t.password||e.referrer&&new URL(e.referrer).origin!==`https://smartcourse.hust.edu.cn`?!1:e.method===`POST`?t.pathname===`/mooc-ans/work/addStudentWorkNewWeb`:e.method&&e.method!==`GET`?!1:[`/fyportal-smartcourse/fyportal/wfw/courselist/getStudyCourse`,`/fyportal-smartcourse/courselist/opencoursenewfy`,`/mooc-ans/mycourse/studentstudycourselist`,`/mooc-ans/mycourse/studentstudyAjax`,`/mooc-ans/knowledge/cards`,`/mooc-ans/api/work`,`/mooc-ans/work/validate`].includes(t.pathname)||/^\/ananas\/status\/[\w-]+$/.test(t.pathname)||/^\/mooc-ans\/multimedia\/log\/a\/[\w-]+\/[\w.-]+$/.test(t.pathname)}catch{return!1}}var h=class{popup=null;nonce=``;pending=new Map;stopConnect=null;constructor(){window.addEventListener(`message`,e=>{let t=e.data;if(e.origin!==`https://smartcourse.hust.edu.cn`||e.source!==this.popup||t?.channel!==`hust-course-bridge-v1`||t.nonce!==this.nonce)return;let n=this.pending.get(t.id);n&&t.type===`response`&&(this.pending.delete(t.id),t.error?n.reject(Error(t.error)):t.response&&typeof t.response.body==`string`&&typeof t.response.url==`string`?n.resolve(t.response):n.reject(Error(`桥接响应格式无效`)))})}connect(){return this.disconnect(),this.nonce=crypto.randomUUID(),this.popup=window.open(`${f}/i-smartcourse/base`,`_blank`,`popup,width=1100,height=800`),this.popup?new Promise((e,t)=>{let n=()=>{clearInterval(i),clearTimeout(a),window.removeEventListener(`message`,r),this.stopConnect=null},r=t=>{let r=t.data;t.origin===`https://smartcourse.hust.edu.cn`&&t.source===this.popup&&r?.channel===`hust-course-bridge-v1`&&r.nonce===this.nonce&&r.type===`ready`&&(n(),e())},i=window.setInterval(()=>{this.popup?.closed?(n(),t(Error(`学校窗口已关闭，请重新连接。`))):this.popup?.postMessage({channel:p,type:`hello`,nonce:this.nonce},f)},700),a=window.setTimeout(()=>{n(),t(Error(`连接超时。请安装桥接脚本、允许脚本运行，完成学校登录后重试；若浏览器隔离了登录窗口，请先在学校页面登录，再重新连接。`))},18e4);this.stopConnect=()=>{n(),t(Error(`连接已取消`))},window.addEventListener(`message`,r)}):Promise.reject(Error(`登录窗口被拦截，请允许本站弹出窗口后重试。`))}disconnect(){this.stopConnect?.();for(let e of this.pending.values())e.reject(Error(`连接已断开`));this.pending.clear(),this.popup?.postMessage({channel:p,type:`disconnect`,nonce:this.nonce},f),this.popup?.close(),this.popup=null,this.nonce=``}request(e,t){return m(e)?!this.popup||this.popup.closed?Promise.reject(Error(`学校连接窗口已关闭，请断开后重新连接。`)):t?.aborted?Promise.reject(new DOMException(`任务已取消`,`AbortError`)):new Promise((n,r)=>{let i=crypto.randomUUID(),a=()=>{clearTimeout(s),t?.removeEventListener(`abort`,o),this.pending.delete(i)},o=()=>{this.popup?.postMessage({channel:p,type:`abort`,nonce:this.nonce,id:i},f),a(),r(new DOMException(`任务已取消`,`AbortError`))},s=window.setTimeout(()=>{this.popup?.postMessage({channel:p,type:`abort`,nonce:this.nonce,id:i},f),a(),r(Error(`课程接口请求超时，请检查学校连接窗口。`))},45e3);this.pending.set(i,{resolve:e=>{a(),n(e)},reject:e=>{a(),r(e)}}),t?.addEventListener(`abort`,o,{once:!0}),this.popup.postMessage({channel:p,type:`request`,nonce:this.nonce,id:i,input:e},f)}):Promise.reject(Error(`请求不在课程接口白名单中`))}},g=e=>new DOMParser().parseFromString(e,`text/html`),_=e=>(e??``).replace(/\s+/g,` `).trim(),v=(e,t)=>_(e.querySelector(t)?.textContent),y=(e,t)=>e?.getAttribute(t)?.trim()||null,b=(e,t)=>y(e.getElementById(t)??e.querySelector(`input[name="${t}"]`),`value`),x=e=>typeof e==`string`||typeof e==`number`?String(e):null,S=e=>e!=null&&e!==``&&Number.isFinite(Number(e))?Number(e):null;function ee(e){let t=[...g(e).querySelectorAll(`li.w_couritem`)].flatMap(e=>{let t=y(e,`cid`)??y(e,`courseid`),n=y(e,`cname`)??y(e.querySelector(`h3 a`),`title`)??v(e,`h3`);return!t||!n?[]:[{course_id:t,class_id:y(e,`classid`)??``,cpi:y(e,`personid`)??``,name:n,cover_url:y(e.querySelector(`img`),`src`),source:y(e,`source`),kc_enc:y(e,`kcenc`),ck_enc:y(e,`ckenc`),clazz_enc:y(e,`clazzenc`),detail_url:new URL(y(e.querySelector(`a[href*='opencoursenewfy']`),`href`)??`/fyportal-smartcourse/courselist/opencoursenewfy?role=3&courseId=${t}`,f).href}]});if(!t.length&&/passport|用户登录|请先登录|\blogin\b/i.test(e))throw Error(`学校登录已失效，请在连接窗口中重新登录。`);return t}function te(e){let t=g(e),n=[...t.querySelectorAll(`ul`)].find(e=>e.querySelector(`.posCatalog_select`))??t.querySelector(`ul`);if(!n)throw Error(`章节目录格式已变化：找不到目录树`);let r=(e,t)=>[...e.children].filter(e=>e.tagName===`LI`).flatMap(e=>{let n=[...e.children].find(e=>e.matches(`div.posCatalog_select`)),i=n?.id;if(!n||!i)return[];let a=n.querySelector(`.posCatalog_name, .posCatalog_title`),o=[...e.children].find(e=>e.classList.contains(`posCatalog_level`))?.querySelector(`ul`);return[{id:i.replace(/^cur/,``),title:y(a,`title`)??_(a?.textContent),number:v(n,`em.posCatalog_sbar`)||null,level:t,is_leaf:i.startsWith(`cur`),completed:n.querySelector(`.icon_Completed`)?!0:!n.querySelector(`.icon_Uncompleted`)&&null,children:o?r(o,t+1):[],cards:[]}]});return r(n,1)}function C(e){return e.flatMap(e=>[e,...C(e.children)])}function ne(e){let t=g(e),n=[...t.querySelectorAll(`#prev_tab ul.prev_ul li, ul.prev_ul li`)].map((e,t)=>({index:t+1,card_id:y(e,`cardid`),title:y(e,`title`)??`card ${t+1}`,task_points:[]}));if(n.length)return n;let r=Math.min(500,Math.max(1,Number(b(t,`cardcount`))||1));return Array.from({length:r},(e,t)=>({index:t+1,card_id:null,title:`card ${t+1}`,task_points:[]}))}function re(e){let t=[...e.matchAll(/\bmArg\s*=\s*(?=\{)/g)];if(!t.length)throw Error(`卡片中没有 mArg 数据`);let n=t.at(-1).index+t.at(-1)[0].length,r=0,i=!1,a=!1;for(let t=n;t<e.length;t++){let o=e[t];if(i)a?a=!1:o===`\\`?a=!0:o===`"`&&(i=!1);else if(o===`"`)i=!0;else if(o===`{`)r++;else if(o===`}`&&--r===0)return JSON.parse(e.slice(n,t+1))}throw Error(`mArg JSON 不完整`)}function ie(e){let t=e.defaults;if(t&&typeof t==`object`)return{user_id:x(t.userid??t.userId),clazz_id:x(t.clazzId??t.clazzid??t.clazzID),course_id:x(t.courseid??t.courseId),fid:x(t.fid),report_url:x(t.reportUrl??t.reporturl??e.reportUrl),report_interval_secs:S(t.reportTimeInterval??t.reportTimeinterval),ktoken:x(t.ktoken)}}function ae(e){let t={video:`video`,document:`document`,workid:`work`,work:`work`,audio:`audio`,insertaudio:`audio`,live:`live`,insertlive:`live`};return(Array.isArray(e.attachments)?e.attachments:[]).map(e=>{let n=e.property??{};return{kind:t[e.type]??`other`,source_type:x(e.type)??``,name:x(n.name??n.title)??``,job_id:x(e.jobid??n.jobid),object_id:x(e.objectId??n.objectid),mid:x(e.mid??n.mid),size_bytes:S(n.size),content_ext:x(n.type),completed:typeof e.isPassed==`boolean`?e.isPassed:null,played_ms:S(e.playTime),duration_secs:S(e.attDuration),work_id:x(n.workid),work_type:x(n.worktype),enc:x(e.enc),other_info:x(e.otherInfo??n.otherInfo)??void 0,att_duration_enc:x(e.attDurationEnc??n.attDurationEnc)??void 0,rt:x(e.rt??n.rt)??void 0,video_face_capture_enc:x(e.videoFaceCaptureEnc??n.videoFaceCaptureEnc)??void 0,questions:[],raw:e}})}function oe(e){return{duration_secs:S(e.duration),size_bytes:S(e.length),filename:x(e.filename),dtoken:x(e.dtoken)??void 0,screenshot:x(e.screenshot),thumbnails:x(e.thumbnails),download_url:x(e.download),stream_url:x(e.http),hd_stream_url:x(e.httphd),status:x(e.status)}}function se(e){return(e.id||e.parentElement?.closest(`[id^="question"]`)?.id||``).replace(/^question/,``)||y(e.querySelector(`[qid]`),`qid`)||(/^\d{5,}$/.test(y(e,`data`)??``)?y(e,`data`):``)}function ce(e){let t=g(e),n=new Set,r=t.querySelectorAll(`div.TiMu`);return[...r.length?r:t.querySelectorAll(`div.questionLi`)].flatMap(e=>{let t=se(e);if(t&&n.has(t))return[];n.add(t);let r=v(e,`.newZy_TItle`).replace(/^[【\[]|[】\]]$/g,``).trim(),i=v(e,`.qtContent`)||v(e,`.Zy_TItle`);if(r){let e=i.indexOf(`【${r}】`);e>=0&&e<=12?i=i.slice(e+r.length+2).trim():i.startsWith(r)&&(i=i.slice(r.length).trim())}if(!i)return[];let a=(t,n)=>v(e,t)||[...e.querySelectorAll(n)].map(e=>_(e.textContent)).filter(e=>e&&!/^(我的|正确)答案[：:]$/.test(e)).map(e=>e.replace(/第[一二三四五六七八九十\d]+空[：:]\s*/g,`；`).replace(/^；/,``).trim()).join(`；`)||null;return[{id:t,question_type:r||null,stem:i,options:[...e.querySelectorAll(`ul.Zy_ulTop li`)].map(e=>{let t=v(e,`.num_option, .num_option_dx, i`).replace(/[、.．\s]+$/,``);return{label:t,text:v(e,`a`)||_(e.textContent).slice(t.length).replace(/^[、.．\s]+/,``)}}),my_answer:a(`.myAnswer .answerCon`,`.myAllAnswerBx .myAnswer`),correct_answer:a(`.correctAnswer .answerCon`,`.correctAnswerBx .correctAnswer`),score:v(e,`.newAnswerScore .scoreNum`)||null}]})}var w=(e,t={})=>{let n=new URL(e,f);for(let[e,r]of Object.entries(t))n.searchParams.set(e,String(r));return n.href},le=class{transport;progress;constructor(e,t=()=>{}){this.transport=e,this.progress=t}async text(e,t,n){let r=await this.transport.request({url:e,referrer:n},t);if(r.status<200||r.status>=300)throw Error(`学校接口返回 HTTP ${r.status}`);if(new URL(r.url).origin!==`https://smartcourse.hust.edu.cn`||/\/(passport|cas\/login)(?:[/?]|$)/.test(r.url)||/请先登录|用户登录|<title>[^<]*登录|没有此页面访问权限|您长时间没有操作/.test(r.body))throw Error(`登录已失效或页面拒绝访问，请在学校窗口重新登录。`);if(r.body.includes(`<title>404</title>`)||r.body.includes(`error-page/images/bg404.gif`))throw Error(`课程接口返回 404 页面`);return r}async listCourses(e){let{body:t,url:n}=await this.text(w(`/fyportal-smartcourse/fyportal/wfw/courselist/getStudyCourse`,{sectionId:0}),e,`${f}/fyportal-smartcourse/wfw/courselist/course3`);if(!new URL(n).pathname.endsWith(`/getStudyCourse`))throw Error(`请在学校窗口完成登录后重新连接`);return ee(t)}async workPage(e,t){let{course:n,knowledge:r,point:i,card:a}=e,{body:o,url:s}=await this.text(w(`/mooc-ans/api/work`,{api:1,workId:i.work_id??``,jobid:i.job_id??`work-${i.work_id}`,originJobId:i.job_id??`work-${i.work_id}`,needRedirect:`true`,skipHeader:`true`,knowledgeid:r,ktoken:a.playback?.ktoken??``,cpi:n.cpi,ut:`s`,clazzId:n.class_id,type:i.work_type===`workB`?`b`:``,enc:i.enc??``,mooc2:1,courseid:n.course_id}),t,`${f}/mooc-ans/knowledge/cards`);return{html:o,url:s,questions:ce(o),status:s.includes(`selectWorkQuestionYiPiYue`)||o.includes(`查看已批改`)?`graded`:s.includes(`doHomeWorkNew`)||o.includes(`doHomeWorkNew`)?`in_progress`:`unknown`}}async fetchCourse(e,t={},n){let r=await this.text(e.detail_url,n,`${f}/fyportal-smartcourse/wfw/courselist/course3`),i=g(r.body),a={...e,course_id:e.course_id||b(i,`courseid`)||``,class_id:e.class_id||b(i,`clazzid`)||``,cpi:e.cpi||b(i,`cpi`)||``},o=te((await this.text(w(`/mooc-ans/mycourse/studentstudycourselist`,{courseId:a.course_id,chapterId:0,clazzid:a.class_id,cpi:a.cpi,mooc2:1}),n,r.url)).body),s=C(o),c=s.filter(e=>e.is_leaf),l={chapter_nodes:s.length,leaves:c.length,cards:0,task_points:0,videos:0,documents:0,works:0,questions:0,errors:[]},u=0,d=0;this.progress({kind:`crawl`,done:d,total:c.length}),await Promise.all(Array.from({length:Math.min(8,Math.max(1,t.concurrency??4),c.length)},async()=>{for(;u<c.length;){n?.throwIfAborted();let e=c[u++];try{let r=w(`/mooc-ans/mycourse/studentstudyAjax`,{courseId:a.course_id,clazzid:a.class_id,chapterId:e.id,cpi:a.cpi,verificationcode:``,mooc2:1,toComputer:`false`,microTopicId:0,editorPreview:0,isPreviewVideo:`false`,videoWidth:0,videoHeight:0,targetVideoJobId:``,cardIndex:0,ut:`s`});e.cards=ne((await this.text(r,n,`${f}/mooc-ans/mycourse/studentstudy`)).body);for(let i of e.cards){n?.throwIfAborted();try{let o=w(`/mooc-ans/knowledge/cards`,{clazzid:a.class_id,courseid:a.course_id,knowledgeid:e.id,num:i.index-1,ut:`s`,cpi:a.cpi,v:`2025-0424-1038-4`,mooc2:1,isMicroCourse:`false`,editorPreview:0,crossId:``}),s=re((await this.text(o,n,r)).body);i.task_points=ae(s),i.playback=ie(s);for(let r of i.task_points)try{if(r.kind===`video`&&r.object_id&&t.includeVideoInfo!==!1){let e=await this.text(w(`/ananas/status/${encodeURIComponent(r.object_id)}`,{k:i.playback?.fid??`1731`,flag:`normal`}),n,o);r.video=oe(JSON.parse(e.body))}else if(r.kind===`work`&&r.work_id&&t.includeQuestions!==!1){let t=await this.workPage({course:a,knowledge:e.id,point:r,card:i},n);r.questions=t.questions,r.work_status=t.status}}catch(t){n?.throwIfAborted(),l.errors.push(`knowledge ${e.id} card ${i.index} ${r.kind}: ${t instanceof Error?t.message:`请求失败`}`)}}catch(t){n?.throwIfAborted(),l.errors.push(`knowledge ${e.id} card ${i.index}: ${t instanceof Error?t.message:`请求失败`}`)}}}catch(t){n?.throwIfAborted(),l.errors.push(`knowledge ${e.id}: ${t instanceof Error?t.message:`请求失败`}`)}this.progress({kind:`crawl`,done:++d,total:c.length})}})),n?.throwIfAborted();for(let e of s)for(let t of e.cards??[]){l.cards++;for(let e of t.task_points)l.task_points++,l.questions+=e.questions.length,e.kind===`video`&&l.videos++,e.kind===`document`&&l.documents++,e.kind===`work`&&l.works++}return{...a,title:i.title.trim()||a.name,enc:b(i,`enc`),old_enc:b(i,`oldenc`),openc:b(i,`openc`),final_url:r.url,chapters:o,stats:l}}async post(e,t,n,r){let i=await this.transport.request({url:e,method:`POST`,body:t.toString(),referrer:n},r);if(i.status<200||i.status>=300)throw Error(`提交接口返回 HTTP ${i.status}`);return i.body}};function ue(e){let t=new TextEncoder().encode(e),n=Math.ceil((t.length+9)/64)*64,r=new Uint8Array(n);r.set(t),r[t.length]=128;let i=new DataView(r.buffer);i.setUint32(n-8,t.length*8>>>0,!0),i.setUint32(n-4,Math.floor(t.length/536870912),!0);let a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21],o=1732584193,s=4023233417,c=2562383102,l=271733878;for(let e=0;e<n;e+=64){let t=o,n=s,r=c,u=l;for(let o=0;o<64;o++){let s,c;o<16?(s=n&r|~n&u,c=o):o<32?(s=u&n|~u&r,c=(5*o+1)%16):o<48?(s=n^r^u,c=(3*o+5)%16):(s=r^(n|~u),c=7*o%16);let l=t+s+Math.floor(Math.abs(Math.sin(o+1))*4294967296)+i.getUint32(e+c*4,!0)|0,d=a[Math.floor(o/16)*4+o%4],f=n+(l<<d|l>>>32-d)|0;t=u,u=r,r=n,n=f}o=o+t|0,s=s+n|0,c=c+r|0,l=l+u|0}return[o,s,c,l].flatMap(e=>[0,8,16,24].map(t=>(e>>>t&255).toString(16).padStart(2,`0`))).join(``)}function de(e,t,n,r,i,a,o){return ue(`[${e}][${t}][${n}][${r}][${i*1e3}][d_yHJ!$pdA~5][${a*1e3}][${o}]`)}function fe(e,t,n=!1){return C(e.chapters).flatMap(r=>(r.cards??[]).flatMap(i=>i.task_points.filter(e=>e.kind===`video`&&(n||!e.completed)&&(!t||e.job_id===t)).map(t=>({point:t,card:i,chapter:r.title,course:e}))))}function pe(e,t,n,r=Date.now()){let{point:i,card:a,course:o}=e,s=a.playback,c=i.duration_secs??i.video?.duration_secs;if(!i.job_id||!i.object_id||!c||c<=0||!i.video?.dtoken||!i.other_info||!s?.user_id)throw Error(`视频缺少新鲜的签名/时长/用户数据，请刷新课程`);let l=s.clazz_id||o.class_id,u=s.user_id,d=i.raw??{},p=`${d.startTime??0}_${d.endTime??c}`,m=new URL(s.report_url||`/mooc-ans/multimedia/log/a`,f);if(m.origin!==`https://smartcourse.hust.edu.cn`)throw Error(`视频上报地址不是学校域名`);m.pathname.endsWith(`/${o.cpi}`)||(m.pathname=m.pathname.replace(/\/$/,``)+`/`+encodeURIComponent(o.cpi)),m.pathname+=`/`+encodeURIComponent(i.video.dtoken);let h=i.other_info;for(let e=0;e<3;e++)try{let e=decodeURIComponent(h);if(h===e)break;h=e}catch{break}return h=h.split(`&`)[0],m.search=`clazzId=${l}&playingTime=${t}&duration=${c}&clipTime=${p}&objectId=${i.object_id}&otherInfo=${h}&courseId=${s.course_id||o.course_id}&jobid=${i.job_id}&userid=${u}&isdrag=${n}&view=pc&enc=${de(l,u,i.job_id,i.object_id,t,c,p)}&rt=${i.rt||`1`}&videoFaceCaptureEnc=&dtype=Video&_t=${r}&attDuration=${c}&attDurationEnc=${i.att_duration_enc||``}&courseEngineInfo=false`,m.href}async function me(e,t){t.throwIfAborted(),await new Promise((n,r)=>{let i=()=>{clearTimeout(a),r(new DOMException(`任务已取消`,`AbortError`))},a=setTimeout(()=>{t.removeEventListener(`abort`,i),n()},Math.max(0,e));t.addEventListener(`abort`,i,{once:!0})})}async function he(e,t,n,r,i){let a=t.point.duration_secs??t.point.video?.duration_secs??0,o=Math.min(Math.floor((t.point.played_ms??0)/1e3),a),s=async(n,r)=>{let a=JSON.parse((await e.text(pe(t,n,r),i,`${f}/ananas/modules/video/index.html?v=2026-0710-1025`)).body);if(a.success===!1)throw Error(`平台拒绝视频上报`);return a.isPassed===!0};if(await s(o,4)||await s(o,3))return!0;for(let e=o;e<a;)if(await me(r,i),e=n>0?Math.min(e+n,a):a,await s(e,4))return!0;return await me(r,i),s(a,2)}var ge=/^(?:answer|answerEditor|answertype|tiankongsize|score|type)\d+$/,_e=[`pyFlag`,`courseId`,`classId`,`api`,`workAnswerId`,`totalQuestionNum`,`fullScore`,`knowledgeid`,`oldSchoolId`,`oldWorkId`,`jobid`,`workRelationId`,`enc_work`,`userId`,`workTimesEnc`,`answerwqbid`];function ve(e){if(e.status===`graded`)throw Error(`作业已批改，跳过提交`);if(!e.questions.length||e.questions.some(e=>!e.id))throw Error(`没有抓到完整题目 ID，跳过提交`);let t=new Set(e.questions.map(e=>e.id));if(t.size!==e.questions.length)throw Error(`页面包含重复题号`);let n=g(e.html),r=b(n,`totalQuestionNum`);if(r&&/^\d+$/.test(r)&&Number(r)!==t.size)throw Error(`题目数量不完整，跳过提交`);let i=new Set([...n.querySelectorAll(`div.singleQuesId, div.TiMu`)].map(se).filter(Boolean));if(i.size&&(i.size!==t.size||[...i].some(e=>!t.has(e))))throw Error(`页面题目与解析结果不一致，跳过提交`)}function ye(e,t,n){ve(t);let r=g(t.html),i=r.querySelector(`form#form1`)??[...r.querySelectorAll(`form`)].find(e=>e.querySelector(`[name="workAnswerId"]`));if(!i?.getAttribute(`action`))throw Error(`作业页面缺少提交表单`);let a=new URL(i.getAttribute(`action`),t.url);if(a.origin!==`https://smartcourse.hust.edu.cn`||a.pathname!==`/mooc-ans/work/addStudentWorkNewWeb`)throw Error(`作业表单目标不受支持`);let o=new URLSearchParams,s=new Map;for(let e of r.querySelectorAll(`input`)){let t=e.name||e.id;if(!ge.test(t)&&(e.type===`hidden`||_e.includes(t))){for(let t of[e.id,e.name].filter(Boolean))s.get(t)||s.set(t,e.value);e.name&&o.set(e.name,e.value)}}for(let e of[`workAnswerId`,`enc_work`])if(!s.get(e))throw Error(`作业缺少 ${e}，请刷新后重试`);let{course:c,knowledge:l,point:u,card:f}=e,p={pyFlag:s.get(`pyFlag`)??``,courseId:c.course_id,classId:c.class_id,api:s.get(`api`)||`1`,workAnswerId:s.get(`workAnswerId`),totalQuestionNum:s.get(`totalQuestionNum`)||String(t.questions.length),fullScore:s.get(`fullScore`)??``,knowledgeid:l,oldSchoolId:s.get(`oldSchoolId`)??``,oldWorkId:u.work_id,jobid:u.job_id??`work-${u.work_id}`,workRelationId:s.get(`workRelationId`)??``,enc_work:s.get(`enc_work`),userId:f.playback?.user_id??s.get(`userId`)??``,workTimesEnc:s.get(`workTimesEnc`)??``,answerwqbid:t.questions.map(e=>e.id).join(`,`)+`,`};Object.entries(p).forEach(([e,t])=>o.set(e,t));for(let e of t.questions){let t=n.lookup(e,c.course_id,u.work_id);if(!t)throw Error(`题库缺少题目 ${e.id}，整份作业跳过`);let i=b(r,`answertype${e.id}`);d(e,t,i!==null&&/^\d+$/.test(i)?Number(i):void 0).forEach((e,t)=>o.set(t,e))}let m=Number(a.searchParams.get(`version`)??0)+1;return a.search=a.search.slice(1).split(`&`).filter(e=>!/^(version|ua|formType|saveStatus|pos)=/.test(e)).filter(Boolean).join(`&`)+`&ua=pc&formType=${encodeURIComponent(i.method.toLowerCase()||`post`)}&saveStatus=1&pos=&version=${m}`,{url:a.href,fields:o}}function be(e){if(/passport|请先登录|用户登录|not logged in/i.test(e))throw Error(`提交时登录已失效`);try{let t=JSON.parse(e),n=t.status??t.success,r=String(t.msg??t.message??`平台未返回提交结果`);return{success:n===!0||n===1||n===`true`||n===`1`||n===`success`||n===void 0&&r.includes(`成功`),message:r}}catch(t){if(t instanceof SyntaxError)return{success:e.trim()===`success`||e.trim()===`提交成功`,message:`平台未返回标准 JSON，请回到学校页面确认`};throw t}}function xe(e,t,n,r){if(!e.length)throw Error(`题目为空`);for(let i of e){let e=t.lookup(i,n,r);if(!e)throw Error(`题库缺少题目 ${i.id}`);d(i,e)}}async function Se(e,t,n,r,i){let a=await e.workPage(t,r),o=ye(t,a,n);if(i)return`试运行：已校验完整题目、答案与新提交表单，未发送提交`;let s=await e.text(w(`/mooc-ans/work/validate`,{classId:t.course.class_id,courseId:t.course.course_id,knowledgeId:t.knowledge,cpi:t.course.cpi}),r,a.url),c=Number(JSON.parse(s.body).status);if(c!==3)throw Error(c===2?`平台要求验证码，请到学校页面处理`:`平台未通过提交前校验`);r.throwIfAborted();let l=be(await e.post(o.url,o.fields,a.url,r));if(!l.success)throw Error(l.message);return l.message}var Ce=new h,T=e=>n(`job-progress`,e),E=new le(Ce,T),D=null,O=[],k=null,we=null,Te=()=>we??=fetch(`./answer-bank.json`).then(async e=>{if(!e.ok)throw Error(`无法加载内置题库`);return new c(await e.json())}).catch(e=>{throw we=null,e}),Ee=e=>{let t=O.find(t=>t.course_id===e||t.class_id===e||t.name===e);if(!D||!t)throw Error(`请先连接并选择课程`);return t};async function De(e){if(k)throw Error(`已有任务运行，请先停止当前任务`);let t=new AbortController;k=t;try{return await e(t.signal)}finally{k===t&&(k=null)}}var A=e=>e instanceof Error?e.message:`请求失败`;function Oe(e){let t=new Set;return C(e.chapters).flatMap(n=>(n.cards??[]).flatMap(r=>r.task_points.flatMap(i=>i.kind!==`work`||!i.work_id||t.has(i.work_id)?[]:(t.add(i.work_id),[{course:e,knowledge:n.id,card:r,point:i,chapter:n.title}]))))}var ke={async openLoginWindow(){await Ce.connect(),O=await E.listCourses(),D={cookieSource:`浏览器桥接（Cookie 留在学校）`,cookieCount:0},n(`session-changed`,D)},async sessionInfo(){return D},async disconnect(){k?.abort(),Ce.disconnect(),D=null,O=[]},async listCourses(){if(!D)throw Error(`请先连接学校页面`);return O=await E.listCourses(),O},fetchCourse(e,t){return De(n=>E.fetchCourse(Ee(e),t,n))},async cancelJob(){k?.abort()},async answerBankInfo(){let e=await Te();return{questions:e.size,version:e.data.version??null}},async helperScript(){let e=await fetch(`./hust-course-video-helper.user.js`);if(!e.ok)throw Error(`读取脚本失败`);return e.text()},async saveTextFile(e,t){a(e,t)},watchCourse(e){return De(async t=>{let n={total:0,passed:0,failed:0,errors:[],cancelled:!1};try{let r=await E.fetchCourse(Ee(e.course),{includeQuestions:!1,includeVideoInfo:!0},t),i=fe(r,e.job,e.includeCompleted).slice(0,e.maxVideos??1/0);n.total=i.length,n.errors.push(...r.stats.errors),T({kind:`watchPlan`,total:i.length,dryRun:e.dryRun!==!1});for(let r=0;r<i.length;r++){t.throwIfAborted();let a=i[r],o={kind:`watch`,index:r+1,total:i.length,label:`${a.chapter} / ${a.point.name}`,jobId:a.point.job_id??``};T({...o,status:`running`,message:null});try{if(pe(a,a.point.duration_secs??a.point.video?.duration_secs??0,4),e.dryRun!==!1){T({...o,status:`dry_run`,message:`签名计划已生成，未发送上报`});continue}let r=await he(E,a,Math.max(0,e.stepSecs??0),Math.max(0,e.delayMs??1e3),t);r?n.passed++:n.failed++,T({...o,status:r?`passed`:`failed`,message:r?`服务端 isPassed=true`:`服务端未确认完成`})}catch(e){t.throwIfAborted(),n.failed++,n.errors.push(A(e)),T({...o,status:`error`,message:A(e)})}await me(Math.max(0,e.delayMs??1e3),t)}}catch(e){if(t.aborted)n.cancelled=!0;else throw e}return n})},completeQuizzes(e){return De(async t=>{let n=await Te(),r={total:0,submitted:0,failed:0,skipped:0,cancelled:!1,dryRun:e.dryRun!==!1,skippedGraded:0,bankQuestions:n.size,planErrors:[],errors:[],works:[]};try{let i=await E.fetchCourse(Ee(e.course),{includeQuestions:!0,includeVideoInfo:!1},t);r.planErrors.push(...i.stats.errors);let a=Oe(i).filter(t=>!e.work||t.point.work_id===e.work);r.skippedGraded=a.filter(e=>e.point.work_status===`graded`).length;let o=a.filter(e=>e.point.work_status!==`graded`).slice(0,e.maxWorks??1/0),s=o.filter(e=>{try{return xe(e.point.questions,n,i.course_id,e.point.work_id),!1}catch{return!0}}).length;r.total=o.length,T({kind:`quizPlan`,total:o.length,skippedGraded:r.skippedGraded,incomplete:s,dryRun:r.dryRun,bankQuestions:n.size});for(let e=0;e<o.length;e++){t.throwIfAborted();let a=o[e],s=a.point,c={workId:s.work_id,workName:s.name,chapter:a.chapter,questionCount:s.questions.length},l={kind:`quiz`,index:e+1,total:o.length,...c};try{xe(s.questions,n,i.course_id,s.work_id)}catch(e){r.skipped++,r.planErrors.push(A(e)),r.works.push({...c,status:`skipped`,message:A(e)}),T({...l,status:`skipped`,message:A(e)});continue}T({...l,status:`running`,message:null});try{let e=await Se(E,a,n,t,r.dryRun),i=r.dryRun?`dry_run`:`submitted`;r.dryRun||r.submitted++,r.works.push({...c,status:i,message:e}),T({...l,status:i,message:e})}catch(e){t.throwIfAborted(),r.failed++,r.errors.push(A(e)),r.works.push({...c,status:`failed`,message:A(e)}),T({...l,status:`failed`,message:A(e)})}}}catch(e){if(t.aborted)r.cancelled=!0;else throw e}return r})}},j=new URLSearchParams(location.search).get(`demo`)===`1`,M=e=>new Promise(t=>setTimeout(t,e)),Ae=e=>JSON.parse(JSON.stringify(e)),N=[{course_id:`17310000026063`,class_id:`17310000023403`,cpi:`17310000196268`,name:`大学英语词汇解析(一)`,cover_url:null,source:`mooc`,kc_enc:`demo-kc-1`,ck_enc:`demo-ck-1`,clazz_enc:`demo-clazz-1`,detail_url:`https://smartcourse.hust.edu.cn/fyportal-smartcourse/courselist/opencoursenewfy?courseId=17310000026063`},{course_id:`17310000026101`,class_id:`17310000023488`,cpi:`17310000196268`,name:`计算机网络`,cover_url:null,source:`mooc`,kc_enc:`demo-kc-2`,ck_enc:`demo-ck-2`,clazz_enc:`demo-clazz-2`,detail_url:`https://smartcourse.hust.edu.cn/fyportal-smartcourse/courselist/opencoursenewfy?courseId=17310000026101`},{course_id:`17310000025200`,class_id:`17310000022117`,cpi:`17310000196268`,name:`军事理论`,cover_url:null,source:`mooc`,kc_enc:`demo-kc-3`,ck_enc:`demo-ck-3`,clazz_enc:`demo-clazz-3`,detail_url:`https://smartcourse.hust.edu.cn/fyportal-smartcourse/courselist/opencoursenewfy?courseId=17310000025200`}],P=null,F=!1,I,L=0;function R(){if(!P)throw Error(`请先进入演示模式`)}function je(e,t,n,r,i,a,o){return{id:e,question_type:t,stem:n,options:r.map(([e,t])=>({label:e,text:t})),my_answer:i,correct_answer:a,score:o}}function Me(e,t,n,r,i,a){return{kind:`video`,source_type:`video`,name:e,job_id:t,object_id:n,mid:null,size_bytes:r*297e3,content_ext:`.mp4`,completed:i,played_ms:a,duration_secs:r,work_id:null,work_type:null,enc:`demo-enc`,other_info:`nodeId_demo-cpi_17310000196268-${t}`,att_duration_enc:`demo-att-duration-enc`,rt:`1`,video:{duration_secs:r,size_bytes:r*297e3,filename:e,dtoken:`demo-dtoken`,screenshot:null,thumbnails:null,download_url:`https://example.invalid/demo.mp4`,stream_url:`https://example.invalid/demo.m3u8`,hd_stream_url:null,status:`success`},questions:[],raw:{}}}function Ne(e,t,n,r){return{kind:`document`,source_type:`document`,name:e,job_id:t,object_id:n,mid:null,size_bytes:r,content_ext:`.pdf`,completed:!1,played_ms:null,duration_secs:null,work_id:null,work_type:null,enc:null,questions:[],raw:{}}}function Pe(e,t,n,r,i){return{kind:`work`,source_type:`work`,name:e,job_id:t,object_id:null,mid:null,size_bytes:null,content_ext:null,completed:r===`graded`,played_ms:null,duration_secs:null,work_id:n,work_type:`work`,work_status:r,enc:`demo-work-enc`,questions:i,raw:{}}}function z(e,t,n){return{index:e,card_id:`demo-card-${e}`,title:t,task_points:n,playback:{user_id:`17310000196268`,clazz_id:`17310000023403`,course_id:`17310000026063`,fid:`1731`,report_url:`/mooc-ans/multimedia/log/a/17310000196268`,report_interval_secs:60,ktoken:`demo-ktoken`}}}function Fe(){let e=[je(`q-1`,`单选题`,`「abandon」最接近下面哪个意思？`,[[`A`,`放弃；抛弃`],[`B`,`获得；取得`],[`C`,`建立；创立`],[`D`,`比较；对比`]],`A`,`A`,`2.0`),je(`q-2`,`多选题`,`下列哪些词含有「扩大、增加」的含义？`,[[`A`,`increase`],[`B`,`expand`],[`C`,`reduce`],[`D`,`enlarge`]],`A,B`,`A,B,D`,`1.0`),je(`q-3`,`判断题`,`「ambiguous」表示“清晰明确的”。`,[[`A`,`正确`],[`B`,`错误`]],`B`,`B`,`2.0`)];return[{id:`582259`,title:`Unit 1 Word power`,number:`1`,level:1,is_leaf:!1,completed:!1,children:[{id:`582263`,title:`Introduction: 课程导入 —— 词汇学习策略`,number:`1.1`,level:2,is_leaf:!0,completed:!0,children:[],cards:[z(1,`学习材料`,[Me(`0.01 课程导入.mp4`,`job-1001`,`obj-1001`,821,!0,82e4),Ne(`词汇学习策略讲义.pdf`,`job-1002`,`obj-1002`,1204e3)])]},{id:`582264`,title:`Word formation: 构词法`,number:`1.2`,level:2,is_leaf:!0,completed:!1,children:[],cards:[z(1,`学习材料`,[Me(`0.02 构词法.mp4`,`job-1003`,`obj-1003`,647,!1,0)]),z(2,`章节测验`,[Pe(`Unit 1 词汇测验`,`job-1004`,`work-1004`,`graded`,e)])]}]},{id:`582260`,title:`Unit 2 Listening`,number:`2`,level:1,is_leaf:!1,completed:!1,children:[{id:`582270`,title:`Listening practice: 听力训练`,number:`2.1`,level:2,is_leaf:!0,completed:!1,children:[],cards:[z(1,`学习材料`,[Me(`0.03 听力训练.mp4`,`job-1005`,`obj-1005`,932,!1,12e4),Ne(`听力原文.pdf`,`job-1006`,`obj-1006`,856e3)])]},{id:`582271`,title:`Unit 2 quiz`,number:`2.2`,level:2,is_leaf:!0,completed:!1,children:[],cards:[z(1,`章节测验`,[Pe(`Unit 2 词汇测验`,`job-1007`,`work-1007`,`in_progress`,[je(`q-4`,`填空题`,`The word “inevitable” means “____”.`,[],null,null,null)])])]}]}]}function Ie(){return[{id:`610001`,title:`第 1 章 概述`,number:`1`,level:1,is_leaf:!1,completed:!1,children:[{id:`610010`,title:`1.1 计算机网络的发展`,number:`1.1`,level:2,is_leaf:!0,completed:!1,children:[],cards:[z(1,`学习材料`,[Me(`第1讲 网络发展史.mp4`,`job-2001`,`obj-2001`,1380,!1,0)])]}]}]}function Le(e){let t={chapter_nodes:0,leaves:0,cards:0,task_points:0,videos:0,documents:0,works:0,questions:0,errors:[]},n=e=>{for(let r of e){t.chapter_nodes+=1,r.is_leaf&&(t.leaves+=1);for(let e of r.cards??[]){t.cards+=1;for(let n of e.task_points)t.task_points+=1,n.kind===`video`&&(t.videos+=1),n.kind===`document`&&(t.documents+=1),n.kind===`work`&&(t.works+=1),t.questions+=n.questions.length}n(r.children)}};return n(e),t}function Re(e){let t=[];e.course_id===`17310000026063`&&(t=Fe()),e.course_id===`17310000026101`&&(t=Ie());let n=t=>{for(let r of t)r.cards&&=r.cards.map(t=>({...t,playback:t.playback?{...t.playback,clazz_id:e.class_id,course_id:e.course_id}:void 0})),n(r.children)};return n(t),{...e,title:e.name,enc:`demo-enc`,old_enc:`demo-old-enc`,openc:`demo-openc`,final_url:e.detail_url,chapters:t,stats:Le(t)}}function ze(e){return e.reduce((e,t)=>e+ +!!t.is_leaf+ze(t.children),0)}function B(e){let t=[],n=e=>{for(let r of e){for(let e of r.cards??[])for(let n of e.task_points)t.push({chapter:r,point:n});n(r.children)}};return n(e),t}function Be(e,t,n,r,i){return{total:e,passed:t,failed:n,errors:r,cancelled:i}}var V=j?{async sessionInfo(){return await M(120),P},async openLoginWindow(){await M(250),L+=1;let e=L;I!==void 0&&window.clearTimeout(I),I=window.setTimeout(()=>{I=void 0,e===L&&(P={cookieSource:`HUST 统一身份认证`,cookieCount:18},n(`session-changed`,P))},900)},async disconnect(){L+=1,I!==void 0&&(window.clearTimeout(I),I=void 0),P=null},async listCourses(){return R(),await M(260),Ae(N)},async fetchCourse(e,t){R();let r=N.find(t=>t.course_id===e||t.class_id===e);if(!r)throw Error(`找不到该课程`);let i=Re(r),a=ze(i.chapters);n(`job-progress`,{kind:`crawl`,done:0,total:a});for(let e=1;e<=a;e+=1){if(await M(180),F)throw Error(`已取消`);n(`job-progress`,{kind:`crawl`,done:e,total:a})}if(t.includeQuestions===!1)for(let{point:e}of B(i.chapters))e.questions=[],delete e.work_status;if(t.includeVideoInfo===!1)for(let{point:e}of B(i.chapters))delete e.video;return i.stats=Le(i.chapters),Ae(i)},async watchCourse(e){if(R(),e.dryRun===!1)throw Error(`演示模式仅支持试运行；请返回正式版连接学校后执行真实任务。`);F=!1;let t=N.find(t=>t.course_id===e.course||t.class_id===e.course||t.name===e.course);if(!t)throw Error(`找不到该课程`);let r=Re(t),i=ze(r.chapters);n(`job-progress`,{kind:`crawl`,done:0,total:i});for(let e=1;e<=i;e+=1){if(await M(150),F)return Be(0,0,0,[],!0);n(`job-progress`,{kind:`crawl`,done:e,total:i})}let a=B(r.chapters).map(({chapter:e,point:t})=>({chapter:e,point:t})).filter(({point:e})=>e.kind===`video`).filter(({point:t})=>e.includeCompleted||t.completed!==!0).filter(({point:t})=>!e.job||t.job_id===e.job).slice(0,e.maxVideos??void 0);n(`job-progress`,{kind:`watchPlan`,total:a.length,dryRun:e.dryRun===!0});let o=[];for(let[e,{chapter:t,point:r}]of a.entries()){if(F)return Be(a.length,0,0,o,!0);let i=e+1,s=r.job_id??``,c=`${t.title} / ${r.name} / ${s}`;n(`job-progress`,{kind:`watch`,index:i,total:a.length,label:c,jobId:s,status:`running`,message:null}),await M(420),n(`job-progress`,{kind:`watch`,index:i,total:a.length,label:c,jobId:s,status:`dry_run`,message:`start: https://smartcourse.hust.edu.cn/mooc-ans/multimedia/log/a/…/demo-dtoken?playingTime=0&isdrag=4
end: https://smartcourse.hust.edu.cn/mooc-ans/multimedia/log/a/…/demo-dtoken?playingTime=820&isdrag=4`})}return Be(a.length,0,0,o,F)},async completeQuizzes(e){if(R(),e.dryRun===!1)throw Error(`演示模式仅支持试运行；请返回正式版连接学校后提交。`);F=!1;let t=N.find(t=>t.course_id===e.course||t.class_id===e.course||t.name===e.course);if(!t)throw Error(`找不到该课程`);let r=B(Re(t).chapters),i=r.filter(({point:e})=>e.kind===`work`&&e.work_status===`graded`).length,a=r.filter(({point:e})=>e.kind===`work`&&e.work_status!==`graded`);if(e.work&&(a=a.filter(({point:t})=>t.work_id===e.work||t.job_id===e.work),a.length===0))throw Error(`没有找到该作业`);e.maxWorks&&(a=a.slice(0,Math.max(1,e.maxWorks)));let o=a.length,s=a.filter(({point:e})=>e.questions.length===0).length;n(`job-progress`,{kind:`quizPlan`,total:o,skippedGraded:i,incomplete:s,dryRun:e.dryRun===!0,bankQuestions:541});let c=[],l=0;for(let[e,{chapter:t,point:r}]of a.entries()){if(F)break;let i=e+1,a=r.questions.length;if(a===0){l+=1;let e=`演示数据缺少题目，未提交`;c.push({workId:r.work_id??``,workName:r.name,chapter:t.title,questionCount:a,status:`skipped`,message:e}),n(`job-progress`,{kind:`quiz`,index:i,total:o,workId:r.work_id??``,workName:r.name,chapter:t.title,questionCount:a,status:`skipped`,message:e});continue}n(`job-progress`,{kind:`quiz`,index:i,total:o,workId:r.work_id??``,workName:r.name,chapter:t.title,questionCount:a,status:`running`,message:null}),await M(450);let s=`演示模式：只生成计划，未向平台提交`;c.push({workId:r.work_id??``,workName:r.name,chapter:t.title,questionCount:a,status:`dry_run`,message:s}),n(`job-progress`,{kind:`quiz`,index:i,total:o,workId:r.work_id??``,workName:r.name,chapter:t.title,questionCount:a,status:`dry_run`,message:s})}return{total:o,submitted:0,failed:0,skipped:l,cancelled:F,dryRun:!0,skippedGraded:i,bankQuestions:541,planErrors:[],errors:[],works:c}},async answerBankInfo(){return await M(60),{questions:541,version:1}},async cancelJob(){F=!0},async helperScript(){return`// ==UserScript==
// @name         HUST Course Video Helper (演示)
// ==/UserScript==

// 当前为演示模式，不执行真实任务。
// 返回正式版后可下载完整的 Tampermonkey 视频助手脚本。`},async saveTextFile(e,t){let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e.split(/[\\/]/).pop()||`download.txt`,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}}:ke;async function Ve(e){return t(`job-progress`,e)}async function He(e){return t(`session-changed`,e)}async function Ue(e){return t(`login-closed`,e)}function H(e){return String(e??``).replace(/[&<>"']/g,e=>{switch(e){case`&`:return`&amp;`;case`<`:return`&lt;`;case`>`:return`&gt;`;case`"`:return`&quot;`;default:return`&#39;`}})}function U(e,t=document){let n=t.querySelector(e);if(!n)throw Error(`missing element: ${e}`);return n}function W(e,t=`info`){let n=document.getElementById(`toast-root`);if(!n)return;let r=document.createElement(`div`);r.className=`toast toast-${t}`,r.textContent=e,n.appendChild(r),requestAnimationFrame(()=>r.classList.add(`is-visible`)),window.setTimeout(()=>{r.classList.remove(`is-visible`),window.setTimeout(()=>r.remove(),220)},t===`error`?6e3:3600)}function We(e=``){return`<span class="spinner ${e}"></span>`}async function Ge(e,t,n){let r=e.innerHTML;e.disabled=!0,e.classList.add(`is-busy`),e.innerHTML=`${We(`spinner-sm`)}<span>${H(t)}</span>`;try{return await n()}finally{e.disabled=!1,e.classList.remove(`is-busy`),e.innerHTML=r}}function Ke(e,t={}){let n=document.getElementById(`modal-root`);if(!n)return()=>void 0;let r=!1,i=document.createElement(`div`);i.className=`modal-backdrop`;let a=document.createElement(`div`);a.className=`modal${t.wide?` modal-wide`:``}`,a.appendChild(e),i.appendChild(a),n.appendChild(i);let o=()=>{r||(r=!0,document.removeEventListener(`keydown`,s),i.classList.remove(`is-open`),window.setTimeout(()=>i.remove(),180),t.onClose?.())},s=e=>{e.key===`Escape`&&o()};return document.addEventListener(`keydown`,s),i.addEventListener(`mousedown`,e=>{e.target===i&&o()}),requestAnimationFrame(()=>i.classList.add(`is-open`)),o}function G(e){if(e instanceof Error)return e.message;if(typeof e==`string`)return e;try{return JSON.stringify(e)}catch{return String(e)}}function qe(e){if(!e||e<=0)return`—`;let t=[`B`,`KB`,`MB`,`GB`],n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;return`${r===0||n>=10?Math.round(n).toString():n.toFixed(1)} ${t[r]}`}function Je(e){if(!e||e<=0)return`—`;let t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=Math.floor(e%60),i=e=>e.toString().padStart(2,`0`);return t>0?`${t}:${i(n)}:${i(r)}`:`${n}:${i(r)}`}function Ye(e,t){return t?Math.max(0,Math.min(100,Math.round(e/t*100))):0}function Xe(e){let t=e.split(/[\\/]/).filter(Boolean);return t[t.length-1]??e}function Ze(e){return e.replace(/[\\/:*?"<>|]+/g,`-`).trim()||`course`}function Qe(e){switch(e){case`video`:return`视频`;case`document`:return`文档`;case`work`:return`测验`;case`audio`:return`音频`;case`live`:return`直播`;default:return`其他`}}function $e(e){return e===`graded`?`已批改`:e===`submitted`?`已提交`:e===`in_progress`?`作答页`:null}function et(e){if(!e)return[];let t=e.toUpperCase().match(/\b[A-H]\b/g);if(t&&t.length>0)return[...new Set(t)];let n=e.toUpperCase().replace(/[\s,;，、]/g,``);return n.length>0&&/^[A-H]+$/.test(n)?[...n]:[]}function tt(e,t,n){if(!n)return!1;let r=et(n);return r.length>0?r.includes(e.toUpperCase()):n.trim()===t.trim()}function nt(e){return e?.trim()||``}var rt={book:`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>`,video:`<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m10 9 5 3-5 3V9Z"/>`,document:`<path d="M14 3v5h5"/><path d="M6 3h8l5 5v13H6V3Z"/><path d="M9 13h6M9 17h4"/>`,work:`<path d="M9 4h6v3H9z"/><path d="M7 5H5v16h14V5h-2"/><path d="m8.5 13 2 2 4.5-4.5"/>`,audio:`<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2Z"/><path d="M20 14a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2Z"/>`,live:`<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4M3.5 3.5a12 12 0 0 0 0 17M20.5 3.5a12 12 0 0 1 0 17"/>`,other:`<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6M9 13h6M9 17h3"/>`,refresh:`<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>`,search:`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,play:`<path d="m8 5 11 7-11 7V5Z"/>`,external:`<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`,download:`<path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>`,close:`<path d="m6 6 12 12M18 6 6 18"/>`,check:`<path d="m5 12.5 4.5 4.5L19 7"/>`,clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,alert:`<path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v5M12 17h.01"/>`,link:`<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.6 1.6"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.6-1.6"/>`,shield:`<path d="M12 3 5 6v6c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>`,copy:`<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5H6a2 2 0 0 0-2 2v9"/>`,save:`<path d="M5 4h11l3 3v13H5V4Z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>`,stop:`<rect x="6" y="6" width="12" height="12" rx="2"/>`,logout:`<path d="M9 5H5v14h4"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/>`,spark:`<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>`,user:`<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>`,folder:`<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>`,chevron:`<path d="m9 6 6 6-6 6"/>`,settings:`<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>`};function K(e,t=16){return`<svg class="icon" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${rt[e]??rt.other}</svg>`}function it(e,t){e.onclick=null,e.onchange=null;let n=t.status===`opening`||t.status===`waiting`,r=t.status===`opening`?`正在打开登录窗口…`:t.status===`waiting`?`等待登录完成…`:t.status===`failed`?`重新打开登录窗口`:j?`进入演示模式`:`连接学校课程页面`;e.innerHTML=`
    <section class="connect-view">
      <div class="connect-hero">
        <div class="eyebrow">HUST · 静态网页版本</div>
        <h1>课程助手<br />在浏览器中运行</h1>
        <p class="connect-lead">
          安装一次桥接脚本，然后连接学校课程页面。在学校窗口登录并允许连接后，
          即可查看课程、视频和练习。使用期间请保持学校窗口打开。
        </p>

        ${j?`<div class="demo-notice">${K(`spark`,15)} 演示模式：只使用示例课程，不执行真实任务。<a href="./">返回正式版</a></div>`:`<div class="bridge-install"><h2>首次使用：安装桥接脚本</h2><p>在浏览器中安装 Tampermonkey，点击下方脚本链接安装。若脚本未运行，请按扩展提示开启用户脚本权限。</p><a class="btn" href="./hust-course-bridge.user.js" target="_blank" rel="noopener">安装桥接脚本 .user.js</a><p><a href="?demo=1">先体验演示模式</a> · <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener">获取 Tampermonkey</a></p></div>`}

        <div class="connect-card">
          <div class="connect-card-head">
            <span class="connect-step">1</span>
            <div>
              <h2>连接学校页面</h2>
              <p>账号密码只在学校页面输入，Cookie 留在学校域名</p>
            </div>
          </div>
          <button class="btn btn-primary btn-lg" id="login-button" ${n?`disabled`:``}>
            ${n?We(`spinner-sm`):K(`user`,17)}
            <span>${r}</span>
          </button>
          ${n?`<div class="login-wait"><span class="pulse-dot"></span> 请在新窗口登录并允许连接。若没有提示，请确认桥接脚本已启用。</div>`:``}
          ${t.error?`<div class="connect-error is-visible">${H(t.error)}</div>`:``}
        </div>

        <ol class="connect-steps">
          <li><span>2</span> 在学校窗口完成登录，并允许本站连接</li>
          <li><span>3</span> 返回这里查看课程，保持学校窗口打开</li>
        </ol>
      </div>

      <aside class="connect-aside">
        <div class="feature-card">
          <div class="feature-icon tone-blue">${K(`folder`,20)}</div>
          <h3>课程结构一目了然</h3>
          <p>章 / 节 / 知识点三级树，视频、文档、测验任务点与完成状态集中在同一页。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon tone-violet">${K(`work`,20)}</div>
          <h3>测验答案与得分</h3>
          <p>已批改作业展示正确答案、我的答案与得分；未批改作业只显示题目。</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon tone-green">${K(`video`,20)}</div>
          <h3>视频进度上报</h3>
          <p>复现播放器心跳，支持整门课或单个视频；每次运行重新获取签名，不保存 dtoken。</p>
        </div>
        <div class="security-card">
          <div class="security-head">${K(`shield`,16)} 安全说明</div>
          <ul>
            <li>学校窗口使用当前浏览器的登录态，断开连接不会退出学校账号。</li>
            <li>课程数据只保存在内存中，刷新页面后需重新连接。</li>
            <li>Cookie 和账号密码不会传给静态站或 GitHub。</li>
            <li>完成结果以服务端 <code>isPassed</code> 为准。</li>
          </ul>
        </div>
      </aside>
    </section>
  `,U(`#login-button`,e).addEventListener(`click`,()=>t.onLogin())}function at(e,t,n,r){e.innerHTML=`
    <section class="home-view">
      <header class="home-head">
        <div>
          <div class="eyebrow">已连接 SmartCourse</div>
          <h1>选择一门课程开始</h1>
          <p class="home-sub">
            当前账号共 ${n.length} 门课程 ·
            ${H(Xe(t.cookieSource))}
          </p>
        </div>
        <div class="head-actions">
          <button class="btn btn-ghost" data-helper>${K(`copy`,15)} 助手脚本</button>
          <button class="btn btn-ghost" data-refresh>${K(`refresh`,15)} 刷新课程</button>
        </div>
      </header>

      ${n.length?`<div class="course-grid">${n.map((e,t)=>{let n=[...e.name.trim()][0]??`课`,r=0;for(let t of e.course_id)r+=t.charCodeAt(0);return`
                  <button class="course-card" data-course-id="${H(e.course_id)}" style="--delay:${t*30}ms">
                    <div class="course-card-top">
                      <span class="course-avatar course-avatar-lg tone-${r%5}">${H(n)}</span>
                      <span class="course-code">${H(e.course_id)}</span>
                    </div>
                    <h3>${H(e.name)}</h3>
                    <p class="course-card-meta">班级 ${H(e.class_id)}</p>
                    <span class="course-card-cta">加载课程目录 ${K(`chevron`,14)}</span>
                  </button>
                `}).join(``)}</div>`:`<div class="empty-panel">
              <div class="empty-icon">${K(`folder`,26)}</div>
              <h2>当前账号没有课程</h2>
              <p>登录已成功，但本学期课程列表为空；也可能需要稍后刷新。</p>
              <button class="btn" data-refresh>${K(`refresh`,15)} 刷新课程列表</button>
            </div>`}

      <div class="tip-grid">
        <div class="tip-card">
          <span class="tip-index">01</span>
          <h4>抓取需要几十秒</h4>
          <p>课程目录确定后会并发请求每个知识点的卡片、题目和视频详情，进度会实时显示。</p>
        </div>
        <div class="tip-card">
          <span class="tip-index">02</span>
          <h4>按需抓取</h4>
          <p>在课程页的“抓取设置”里可以关闭章节测验或视频签名，明显加快速度。</p>
        </div>
        <div class="tip-card">
          <span class="tip-index">03</span>
          <h4>结果以服务端为准</h4>
          <p>视频上报成功与否只看接口返回的 <code>isPassed</code>，界面状态不会伪造进度。</p>
        </div>
      </div>
    </section>
  `,e.onclick=e=>{let t=e.target;if(t.closest(`[data-refresh]`)){r.onRefreshCourses();return}if(t.closest(`[data-helper]`)){r.onHelper();return}let n=t.closest(`[data-course-id]`);n&&r.onSelect(n.dataset.courseId??``)}}function q(e,t=[]){for(let n of e){for(let e of n.cards??[])for(let r of e.task_points)t.push({chapter:n,point:r});q(n.children,t)}return t}function ot(e){return e.reduce((e,t)=>e+ +!!t.is_leaf+ot(t.children),0)}function st(e){switch(e){case`video`:return`video`;case`document`:return`document`;case`work`:return`work`;case`audio`:return`audio`;case`live`:return`live`;default:return`other`}}function ct(e){let t=nt(e.number);return t?`${t} ${e.title}`:e.title}function lt(e){return e===!0?`<span class="badge badge-good">${K(`check`,12)} 已完成</span>`:e===!1?`<span class="badge badge-muted">未完成</span>`:``}function ut(e,t,n=`folder`){return`
    <div class="empty-panel compact">
      <div class="empty-icon">${K(n,24)}</div>
      <h2>${H(e)}</h2>
      <p>${t}</p>
    </div>
  `}function dt(e,t,n){e.innerHTML=`
    <div class="course-view">
      <header class="course-head">
        <div class="course-head-copy">
          <div class="eyebrow">${H(t.course_id)}</div>
          <h1>${H(t.name)}</h1>
          <p class="course-sub">正在获取课程首页与章节结构，随后逐个抓取知识点。</p>
        </div>
      </header>
      <div class="crawl-card">
        <div class="crawl-orb">${K(`refresh`,28)}</div>
        <h2>正在抓取课程数据</h2>
        <p>每个知识点的卡片、测验题目与视频签名会并发请求，通常需要几十秒。</p>
        <div class="progress progress-lg">
          <div class="progress-fill crawl-progress-fill" style="width: 0%"></div>
        </div>
        <div class="crawl-meta">
          <span class="crawl-progress-label">正在解析章节目录…</span>
          <span class="crawl-progress-count"></span>
        </div>
        <button class="btn btn-ghost" data-cancel>${K(`stop`,14)} 取消抓取</button>
      </div>
    </div>
  `,e.onclick=e=>{e.target.closest(`[data-cancel]`)&&n()},e.onchange=null}function ft(e,t,n,r){e.innerHTML=`
    <div class="course-view">
      <header class="course-head">
        <div class="course-head-copy">
          <div class="eyebrow">${H(t.course_id)}</div>
          <h1>${H(t.name)}</h1>
          <p class="course-sub">${H(t.class_id)} · 抓取未完成</p>
        </div>
      </header>
      <div class="error-card">
        <div class="error-icon">${K(`alert`,24)}</div>
        <h2>抓取课程失败</h2>
        <pre class="error-detail">${H(n)}</pre>
        <p class="hint">如果提示登录过期，请重新导出 cookies.txt 后再连接。</p>
        <button class="btn btn-primary" data-retry>${K(`refresh`,15)} 重试</button>
      </div>
    </div>
  `,e.onclick=e=>{e.target.closest(`[data-retry]`)&&r()},e.onchange=null}function pt(e,t,n){let r=Ye(t,n),i=e.querySelector(`.crawl-progress-fill`);i&&(i.style.width=`${r}%`);let a=e.querySelector(`.crawl-progress-label`);a&&(a.textContent=n>0?`正在抓取知识点`:`正在解析章节目录…`);let o=e.querySelector(`.crawl-progress-count`);o&&(o.textContent=n>0?`${t} / ${n} · ${r}%`:``)}function mt(e,t){let n=!1;for(let{point:r}of q(e.chapters))r.kind===`video`&&r.job_id===t&&r.completed!==!0&&(r.completed=!0,r.played_ms=(r.duration_secs??1)*1e3,n=!0);return n}function ht(e,t){if(!t)return!1;let n=!1;for(let{point:r}of q(e.chapters))r.kind===`work`&&r.work_id===t&&r.work_status!==`graded`&&r.work_status!==`submitted`&&(r.work_status=`submitted`,n=!0);return n}var gt=`outline`;function _t(e,t,n){let r=q(t.chapters),i=r.filter(({point:e})=>e.kind===`video`),a=i.filter(({point:e})=>e.completed===!0).length,o=Ye(a,i.length),s=t.stats.errors,c=t.stats;e.innerHTML=`
    <div class="course-view">
      <header class="course-head">
        <div class="course-head-copy">
          <div class="eyebrow">课程 · ${H(t.course_id)}</div>
          <h1>${H(t.title)}</h1>
          <p class="course-sub">
            班级 ${H(t.class_id)} · cpi ${H(t.cpi)} · ${c.chapter_nodes} 个目录节点
          </p>
        </div>
        <div class="head-actions">
          <button class="icon-button" data-action="open" title="在浏览器打开课程页" aria-label="在浏览器打开课程页">${K(`external`,16)}</button>
          <button class="icon-button" data-action="export" title="导出课程 JSON" aria-label="导出课程 JSON">${K(`download`,16)}</button>
          <button class="icon-button" data-action="refresh" title="重新抓取" aria-label="重新抓取">${K(`refresh`,16)}</button>
          <details class="options-popover">
            <summary class="btn btn-ghost">${K(`settings`,15)} 抓取设置</summary>
            <div class="popover-card">
              <label class="switch-row">
                <input type="checkbox" data-option="questions" ${n.options.includeQuestions===!1?``:`checked`} />
                <span>抓取章节测验题目</span>
              </label>
              <label class="switch-row">
                <input type="checkbox" data-option="video" ${n.options.includeVideoInfo===!1?``:`checked`} />
                <span>抓取视频签名信息</span>
              </label>
              <label class="field-row">
                <span>并发数</span>
                <input type="number" min="1" max="8" value="${n.options.concurrency??4}" data-option="concurrency" />
              </label>
              <p class="hint">修改后点击右上角刷新按钮生效。</p>
            </div>
          </details>
          <button class="btn btn-primary" data-action="quiz">${K(`work`,15)} 完成题目</button>
          <button class="btn btn-ghost" data-action="watch">${K(`play`,15)} 完成视频</button>
        </div>
      </header>

      ${n.busy?`<div class="crawl-banner">
              <div class="crawl-banner-row">
                ${We(`spinner-sm`)}
                <span class="crawl-progress-label">正在重新抓取课程…</span>
                <span class="crawl-progress-count"></span>
                <button class="btn btn-sm btn-ghost" data-cancel>取消</button>
              </div>
              <div class="progress"><div class="progress-fill crawl-progress-fill" style="width:0%"></div></div>
            </div>`:``}

      <div class="stat-strip">
        <div class="stat-card stat-card-wide">
          <div class="stat-head"><span>视频完成度</span><strong>${a} / ${i.length}</strong></div>
          <div class="progress"><div class="progress-fill fill-good" style="width:${o}%"></div></div>
          <div class="stat-foot">${o}% 的视频任务点已完成</div>
        </div>
        <div class="stat-card"><span class="stat-label">知识点</span><strong>${c.leaves}</strong><span class="stat-foot">${c.cards} 张卡片</span></div>
        <div class="stat-card"><span class="stat-label">任务点</span><strong>${c.task_points}</strong><span class="stat-foot">${c.documents} 个文档</span></div>
        <div class="stat-card"><span class="stat-label">测验</span><strong>${c.works}</strong><span class="stat-foot">${c.questions} 道题目</span></div>
        ${s.length?`<div class="stat-card stat-card-warn"><span class="stat-label">抓取警告</span><strong>${s.length}</strong><span class="stat-foot">在“诊断”中查看</span></div>`:``}
      </div>

      <div class="tab-bar" role="tablist">
        <button class="tab" data-tab="outline" role="tab">课程目录</button>
        <button class="tab" data-tab="tasks" role="tab">任务点 <span class="tab-count">${r.length}</span></button>
        <button class="tab" data-tab="quiz" role="tab">测验 <span class="tab-count">${c.questions}</span></button>
        <button class="tab" data-tab="diagnostics" role="tab">诊断${s.length?`<span class="tab-dot"></span>`:``}</button>
      </div>
      <div class="tab-panel" id="tab-panel"></div>
    </div>
  `;let l=U(`#tab-panel`,e),u=`all`,d=!1,f=gt,p=()=>{let t=r.filter(({point:e})=>u===`all`||e.kind===u).filter(({point:e})=>!d||e.completed!==!0),n=e.querySelector(`#task-rows`);n&&(n.innerHTML=t.length===0?`<tr><td colspan="6" class="table-empty">没有匹配的任务点</td></tr>`:t.map(({chapter:e,point:t})=>{let n=t.completed===!0,r=t.completed===null?`<span class="status-chip">未知</span>`:n?`<span class="status-chip is-good">已完成</span>`:`<span class="status-chip is-muted">未完成</span>`,i=t.kind===`video`?`${Je(t.duration_secs)} · ${qe(t.size_bytes)}`:qe(t.size_bytes),a=t.kind===`video`&&t.duration_secs?Math.min(100,Math.round((t.played_ms??0)/(t.duration_secs*1e3)*100)):0,o=t.kind===`video`&&t.job_id?`<button class="btn btn-sm" data-watch-job="${H(t.job_id)}">${K(`play`,13)} ${n?`重报`:`完成`}</button>`:t.kind===`work`&&t.questions.length?`<button class="btn btn-sm" data-work-id="${H(t.work_id??``)}">${K(`work`,13)} 题目</button>`:``;return`
          <tr>
            <td>${r}</td>
            <td><span class="kind-pill kind-${t.kind}">${K(st(t.kind),13)} ${Qe(t.kind)}</span></td>
            <td>
              <div class="cell-title" title="${H(t.name)}">${H(t.name)}</div>
              ${t.kind===`video`?`<div class="cell-progress"><span style="width:${a}%"></span></div>`:``}
            </td>
            <td class="cell-muted">${H(ct(e))}</td>
            <td class="cell-muted">${i}</td>
            <td class="cell-action">${o}</td>
          </tr>
        `}).join(``))},m=()=>{for(let t of e.querySelectorAll(`[data-tab]`))t.classList.toggle(`is-active`,t.dataset.tab===f);f===`outline`?l.innerHTML=yt(t):f===`tasks`?(l.innerHTML=vt(r.length),p()):f===`quiz`?l.innerHTML=Ct(t,n.options,n.bankQuestions):l.innerHTML=Et(t)},h=e=>{f=e,gt=e,m()};e.onclick=r=>{let i=r.target,a=i.closest(`[data-tab]`);if(a){h(a.dataset.tab);return}let o=i.closest(`[data-quiz-work]`);if(o){n.onQuiz(o.dataset.quizWork??null);return}if(i.closest(`[data-action='quiz']`)){n.onQuiz();return}if(i.closest(`[data-action='watch']`)){n.onWatch();return}if(i.closest(`[data-action='refresh']`)){n.onRefresh();return}if(i.closest(`[data-action='export']`)){n.onExport();return}if(i.closest(`[data-action='open']`)){n.onOpenUrl(t.final_url);return}if(i.closest(`[data-cancel]`)){n.onCancel();return}let s=i.closest(`[data-watch-job]`);if(s){n.onWatch(s.dataset.watchJob??null);return}let c=i.closest(`[data-work-id]`);if(c){h(`quiz`);let e=c.dataset.workId??``;e&&window.setTimeout(()=>{document.getElementById(`work-${e}`)?.scrollIntoView({behavior:`smooth`,block:`start`})},30);return}if(i.closest(`[data-expand]`)){for(let e of l.querySelectorAll(`details.tree-node`))e.open=!0;return}if(i.closest(`[data-collapse]`)){for(let e of l.querySelectorAll(`details.tree-node`))e.open=!1;return}let d=i.closest(`[data-kind]`);if(d){u=d.dataset.kind??`all`;for(let t of e.querySelectorAll(`[data-kind]`))t.classList.toggle(`is-active`,t===d);p()}},e.onchange=t=>{let r=t.target;r.id===`only-todo`?(d=r.checked,p()):r.matches(`[data-option]`)&&n.onOptionsChange({includeQuestions:e.querySelector(`[data-option='questions']`)?.checked??!0,includeVideoInfo:e.querySelector(`[data-option='video']`)?.checked??!0,concurrency:Math.max(1,Math.min(8,Number(e.querySelector(`[data-option='concurrency']`)?.value??4)||4))})},m()}function vt(e){return`
    <div class="filter-bar">
      <div class="chip-group">
        ${[`all`,`video`,`document`,`work`,`audio`,`live`,`other`].map(t=>`<button class="filter-chip${t===`all`?` is-active`:``}" data-kind="${t}">${t===`all`?`全部 ${e}`:Qe(t)}</button>`).join(``)}
      </div>
      <label class="check"><input type="checkbox" id="only-todo" /> 只看未完成</label>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>状态</th>
            <th>类型</th>
            <th>名称</th>
            <th>所属知识点</th>
            <th>时长 / 大小</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="task-rows"></tbody>
      </table>
    </div>
  `}function yt(e){if(e.chapters.length===0)return ut(`这门课程没有章节数据`,`平台可能对这类课程返回空目录（常见于军事理论、导论类课程），这不是抓取失败。可以稍后重新抓取，或在浏览器中打开课程页确认。`);let t=ot(e.chapters)<=10;return`
    <div class="tree-toolbar">
      <span>${ot(e.chapters)} 个知识点 · ${e.stats.cards} 张卡片</span>
      <div class="tree-tools">
        <button class="text-button" data-expand>展开全部</button>
        <button class="text-button" data-collapse>收起全部</button>
      </div>
    </div>
    <div class="tree">${e.chapters.map(e=>bt(e,t)).join(``)}</div>
  `}function bt(e,t){let n=e.cards??[],r=n.reduce((e,t)=>e+t.task_points.length,0),i=e.is_leaf||e.children.length===0,a=nt(e.number),o=e.level<=1||t&&i?` open`:``;return`
    <details class="tree-node${i?` is-leaf`:``}"${o}>
      <summary class="tree-summary">
        <span class="tree-kind">${K(i?`document`:`folder`,16)}</span>
        ${a?`<span class="tree-number">${H(a)}</span>`:``}
        <span class="tree-title">${H(e.title)}</span>
        ${lt(e.completed)}
        <span class="tree-count">${i?`${r} 个任务`:`${ot(e.children)} 个知识点`}</span>
        <span class="tree-chevron">${K(`chevron`,14)}</span>
      </summary>
      <div class="tree-body">
        ${n.length?n.map(e=>xt(e)).join(``):i?`<div class="empty-inline">该知识点没有可直接读取的卡片</div>`:``}
        ${e.children.map(e=>bt(e,t)).join(``)}
      </div>
    </details>
  `}function xt(e){return`
    <section class="card-block">
      <header class="card-head">
        <span class="card-tab">卡片 ${e.index}</span>
        <h3>${H(e.title)}</h3>
        <span class="card-count">${e.task_points.length} 个任务点</span>
      </header>
      <div class="task-rows">
        ${e.task_points.map(e=>St(e)).join(``)}
      </div>
    </section>
  `}function St(e){let t=e.completed===!0,n=[];if(e.kind===`video`){if(e.duration_secs&&n.push(Je(e.duration_secs)),e.played_ms&&e.duration_secs){let t=Math.min(100,Math.round(e.played_ms/(e.duration_secs*1e3)*100));n.push(`已看 ${t}%`)}e.size_bytes&&n.push(qe(e.size_bytes))}else e.size_bytes&&n.push(qe(e.size_bytes));e.content_ext&&n.push(e.content_ext.toUpperCase()),e.questions.length&&n.push(`${e.questions.length} 道题`);let r=$e(e.work_status);r&&n.push(r);let i=``;return e.kind===`video`&&e.job_id?i=t?`<span class="badge badge-good">${K(`check`,12)} 已完成</span>`:`<button class="btn btn-sm" data-watch-job="${H(e.job_id)}">${K(`play`,13)} 完成</button>`:e.kind===`work`&&e.questions.length&&(i=`<button class="btn btn-sm" data-work-id="${H(e.work_id??``)}">${K(`work`,13)} 查看题目</button>`),`
    <div class="task-row kind-${e.kind}${t?` is-done`:``}">
      <span class="task-kind">${K(st(e.kind),17)}</span>
      <div class="task-copy">
        <div class="task-name" title="${H(e.name)}">${H(e.name)}</div>
        <div class="task-meta">${n.length?H(n.join(` · `)):`—`}</div>
      </div>
      <div class="task-actions">${i}</div>
    </div>
  `}function Ct(e,t,n){let r=q(e.chapters).filter(({point:e})=>e.kind===`work`).filter(({point:e})=>e.questions.length>0);if(r.length===0)return t.includeQuestions===!1?ut(`抓取时跳过了测验题目`,`这次抓取关闭了“抓取章节测验题目”。在右上角抓取设置中开启后点击刷新即可显示。`,`work`):ut(`没有可显示的题目`,`平台上未批改的作业通常只返回题目页；如果这里为空，可能是当前课程没有章节测验，或题目接口要求重新登录。`,`work`);let i=r.filter(({point:e})=>e.work_status!==`graded`&&e.work_status!==`submitted`);return`
    <div class="quiz-banner">
      <div class="quiz-banner-copy">
        <strong>一键完成题目</strong>
        <p>内置题库 ${n??`…`} 题 · 已批改作业自动跳过 · 题库缺答案的作业不会提交</p>
      </div>
      ${i.length>0?`<button class="btn btn-primary" data-action="quiz">${K(`work`,14)} 完成 ${i.length} 个作业</button>`:`<span class="badge badge-good">${K(`check`,12)} 没有待提交作业</span>`}
    </div>
    <div class="quiz-list">
      ${r.map(({chapter:e,point:t})=>{let n=t.work_id??``,r=t.work_status===`graded`,i=t.work_status===`submitted`,a=r?`<span class="badge badge-good">已批改</span>`:i?`<span class="badge badge-good">已提交</span>`:t.work_status===`in_progress`?`<span class="badge badge-warn">未批改</span>`:``,o=!r&&!i&&n.length>0;return`
            <article class="quiz-group" id="work-${H(n)}">
              <header class="quiz-head">
                <div>
                  <div class="quiz-kicker">${H(ct(e))}</div>
                  <h3>${H(t.name)}</h3>
                </div>
                <div class="quiz-head-meta">
                  ${o?`<button class="btn btn-sm" data-quiz-work="${H(n)}">${K(`work`,12)} 提交本题</button>`:``}
                  ${a}
                  <span class="badge badge-muted">${t.questions.length} 题</span>
                </div>
              </header>
              ${i?`<div class="inline-notice">${K(`check`,14)} 已提交，等待平台批改；刷新课程可获取最终结果。</div>`:!r&&t.work_status===`in_progress`?`<div class="inline-notice">${K(`alert`,14)} 该作业尚未批改，平台不返回正确答案；可以用内置题库一键提交。</div>`:``}
              <div class="questions">
                ${t.questions.map((e,t)=>Tt(e,t+1)).join(``)}
              </div>
            </article>
          `}).join(``)}
    </div>
  `}function wt(e){return e?e.includes(`多选`)?`tone-violet`:e.includes(`判断`)?`tone-amber`:e.includes(`填空`)||e.includes(`简答`)?`tone-green`:`tone-blue`:`tone-gray`}function Tt(e,t){let n=e.correct_answer,r=e.my_answer,i=et(r).sort(),a=et(n).sort(),o=r&&n&&i.length>0&&a.length>0&&i.join(`,`)!==a.join(`,`),s=e.options.map(e=>{let t=tt(e.label,e.text,n),i=tt(e.label,e.text,r);return`
        <li class="${[`option`,t?`is-correct`:``,i?`is-mine`:``,i&&o&&!t?`is-wrong`:``].filter(Boolean).join(` `)}">
          <span class="option-label">${H(e.label)}</span>
          <span class="option-text">${H(e.text)}</span>
          <span class="option-tags">
            ${i?`<span class="tag tag-mine">我的</span>`:``}
            ${t&&n?`<span class="tag tag-correct">答案</span>`:``}
          </span>
        </li>
      `}).join(``),c=e.options.length===0?`<div class="answer-lines">
          <div>我的答案：<strong>${H(r??`未作答`)}</strong></div>
          ${n?`<div class="is-good">正确答案：<strong>${H(n)}</strong></div>`:``}
        </div>`:``;return`
    <article class="question">
      <div class="question-head">
        <span class="question-index">${t}</span>
        <span class="kind-pill ${wt(e.question_type)}">${H(e.question_type??`题目`)}</span>
        ${e.score?`<span class="question-score">${H(e.score)} 分</span>`:``}
      </div>
      <div class="question-stem">${H(e.stem)}</div>
      ${s?`<ul class="options">${s}</ul>`:``}
      ${c}
      <div class="question-foot">
        ${e.options.length>0?`<span>我的答案：<strong class="${o?`is-bad`:``}">${H(r??`未作答`)}</strong></span>`:``}
        ${n?`<span>正确答案：<strong class="is-good">${H(n)}</strong></span>`:``}
        ${e.score?`<span>得分：<strong>${H(e.score)}</strong></span>`:``}
      </div>
    </article>
  `}function Et(e){let t=e.stats.errors;return`
    <div class="diagnostics">
      <section class="diag-card">
        <h3>${K(`spark`,16)} 抓取统计</h3>
        <div class="kv-grid">
          <div><span>目录节点</span><strong>${e.stats.chapter_nodes}</strong></div>
          <div><span>知识点</span><strong>${e.stats.leaves}</strong></div>
          <div><span>卡片</span><strong>${e.stats.cards}</strong></div>
          <div><span>任务点</span><strong>${e.stats.task_points}</strong></div>
          <div><span>视频</span><strong>${e.stats.videos}</strong></div>
          <div><span>文档</span><strong>${e.stats.documents}</strong></div>
          <div><span>测验</span><strong>${e.stats.works}</strong></div>
          <div><span>题目</span><strong>${e.stats.questions}</strong></div>
        </div>
      </section>

      <section class="diag-card">
        <h3>${K(`link`,16)} 课程标识</h3>
        <div class="kv-list">
          <div><span>课程 id</span><code>${H(e.course_id)}</code></div>
          <div><span>班级 id</span><code>${H(e.class_id)}</code></div>
          <div><span>cpi</span><code>${H(e.cpi)}</code></div>
          <div><span>enc</span><code>${H(e.enc??`—`)}</code></div>
          <div><span>openc</span><code>${H(e.openc??`—`)}</code></div>
          <div><span>课程页</span><code class="truncate">${H(e.final_url)}</code></div>
        </div>
        <div class="diag-actions">
          <button class="btn btn-sm" data-action="open">${K(`external`,13)} 打开课程页</button>
          <button class="btn btn-sm" data-action="export">${K(`download`,13)} 导出 JSON</button>
        </div>
      </section>

      <section class="diag-card">
        <h3>${K(`alert`,16)} 抓取警告 <span class="count-pill">${t.length}</span></h3>
        ${t.length?`<ul class="error-list">${t.map(e=>`<li><pre>${H(e)}</pre></li>`).join(``)}</ul>`:`<p class="hint">没有警告，所有知识点都成功抓取。</p>`}
      </section>

      <section class="diag-card">
        <h3>${K(`shield`,16)} 数据说明</h3>
        <ul class="note-list">
          <li>视频的 <code>download_url</code> / <code>stream_url</code> 带时效签名，过期后需重新抓取。</li>
          <li><code>dtoken</code>、<code>otherInfo</code>、<code>attDurationEnc</code> 与会话和视频绑定，不保存、不复用。</li>
          <li>未批改的测验只返回题目，不返回正确答案。</li>
          <li>单个知识点失败不会中断整门课程，错误会列在上方。</li>
        </ul>
      </section>
    </div>
  `}async function Dt(e){try{return await navigator.clipboard.writeText(e),!0}catch{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();let n=document.execCommand(`copy`);return t.remove(),n}}async function Ot(){let e=document.createElement(`div`);e.className=`helper-modal`,e.innerHTML=`
    <div class="modal-head">
      <div>
        <div class="eyebrow">浏览器兜底</div>
        <h2>Tampermonkey 视频助手</h2>
        <p class="modal-sub">在网页播放器里一键完成当前视频、当前知识点或整门课</p>
      </div>
      <button class="icon-button" data-close aria-label="关闭">${K(`close`,18)}</button>
    </div>
    <div class="modal-body">
      <ol class="helper-steps">
        <li>安装 Tampermonkey，新建脚本。</li>
        <li>粘贴下面的完整脚本并保存。</li>
        <li>打开课程学习页，右上角会出现控制面板。</li>
      </ol>
      <pre class="script-preview" id="script-preview">正在读取脚本…</pre>
    </div>
    <div class="modal-foot">
      <span class="modal-note">${K(`shield`,13)} 脚本不读取也不保存 Cookie</span>
      <button class="btn btn-ghost" data-copy>${K(`copy`,14)} 复制</button>
      <button class="btn btn-primary" data-save>${K(`save`,14)} 保存为 .user.js</button>
    </div>
  `;let t=Ke(e,{wide:!0}),n=U(`#script-preview`,e),i=``;e.addEventListener(`click`,async e=>{let n=e.target;if(n.closest(`[data-close]`)){t();return}if(!i)return;if(n.closest(`[data-copy]`)){let e=await Dt(i);W(e?`脚本已复制到剪贴板`:`复制失败，请手动选择文本`,e?`success`:`error`);return}let a=n.closest(`[data-save]`);a&&await Ge(a,`保存中…`,async()=>{try{let e=await r(`hust-course-video-helper.user.js`,`UserScript`,[`js`]);if(!e)return;await V.saveTextFile(e,i),W(`脚本已保存`,`success`)}catch(e){W(e instanceof Error?e.message:String(e),`error`)}})});try{i=await V.helperScript(),n.textContent=i}catch(e){n.textContent=`读取脚本失败：${e instanceof Error?e.message:String(e)}`}}var kt={running:`提交中`,submitted:`已提交`,failed:`失败`,skipped:`已跳过`,dry_run:`计划`},At={running:`is-running`,submitted:`is-good`,failed:`is-bad`,skipped:`is-muted`,dry_run:`is-muted`};function jt(e){return K(e===`submitted`?`check`:e===`failed`?`alert`:e===`skipped`?`stop`:`clock`,12)}function Mt(e){let t=document.createElement(`div`);t.className=`watch-modal quiz-modal`,t.innerHTML=`
    <div class="modal-head">
      <div>
        <div class="eyebrow">章节测验</div>
        <h2>一键完成题目</h2>
        <p class="modal-sub">${H(e.courseName)}</p>
      </div>
      <button class="icon-button" data-close aria-label="关闭">${K(`close`,18)}</button>
    </div>
    <div class="modal-body">
      <p class="modal-lead">
        使用内置题库匹配每道题，已批改的作业自动跳过；题目没抓全或题库缺少答案的作业
        不会提交，也不会只提交一部分。每次提交前都会重新打开作答页获取页面令牌。
      </p>
      ${e.workId?`<div class="inline-notice">${K(`link`,14)} 仅处理作业 <code>${H(e.workId)}</code></div>`:``}
      <div class="inline-notice notice-warn">
        ${K(`alert`,14)} 关闭“试运行”后，这会向平台提交真实答案；请先确认题库覆盖情况。
      </div>
      <div class="quiz-bank-line">
        内置题库 <strong>${e.bankQuestions??`…`}</strong> 题 · 未批改作业会先匹配再提交
      </div>
      <div class="settings-grid quiz-settings">
        ${e.workId?``:`<label class="field">
                <span>最多处理作业数</span>
                <input id="quiz-max" type="number" min="1" step="1" placeholder="不限" />
                <em>第一次建议先试运行，或只处理 1 个</em>
              </label>`}
        <label class="check switch-row">
          <input id="quiz-dry" type="checkbox" checked />
          <span>试运行，只生成计划</span>
        </label>
        <label class="check switch-row">
          <input id="quiz-confirm" type="checkbox" />
          <span>我确认提交未批改作业</span>
        </label>
      </div>

      <div class="watch-progress" id="quiz-progress">
        <div class="watch-status-row">
          <span id="quiz-status">准备就绪</span>
          <span id="quiz-count" class="watch-count"></span>
        </div>
        <div class="progress"><div class="progress-fill" id="quiz-fill" style="width:0%"></div></div>
        <div class="watch-log" id="quiz-log"></div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" id="quiz-stop" hidden>${K(`stop`,14)} 停止</button>
      <button class="btn btn-ghost" data-close>关闭</button>
      <button class="btn btn-primary" id="quiz-start">${K(`work`,15)} 生成计划</button>
    </div>
  `;let n=U(`#quiz-status`,t),r=U(`#quiz-count`,t),i=U(`#quiz-fill`,t),a=U(`#quiz-log`,t),o=U(`#quiz-start`,t),s=U(`#quiz-stop`,t),c=U(`#quiz-dry`,t),l=U(`#quiz-confirm`,t),u=t.querySelector(`#quiz-max`),d=!1,f=!1,p=null,m=0,h=[],g=new Map,_=Ke(t,{wide:!0,onClose:()=>{f=!0,p?.(),p=null,d&&V.cancelJob().catch(()=>void 0)}});t.addEventListener(`click`,e=>{e.target.closest(`[data-close]`)&&_()});let v=e=>{n.textContent=e},y=(e,t)=>{let n=t>0?Math.min(100,Math.round(e/t*100)):0;i.style.width=`${n}%`,r.textContent=t>0?`${e} / ${t}`:``},b=e=>{o.hidden=e,o.disabled=e||!c.checked&&!l.checked,s.hidden=!e,s.disabled=!1,s.innerHTML=`${K(`stop`,14)} 停止`;for(let t of[c,l,...u?[u]:[]])t.disabled=e},x=()=>{d||(l.disabled=c.checked,c.checked&&(l.checked=!1),o.disabled=!c.checked&&!l.checked,o.title=o.disabled?`请先勾选确认提交，或改用试运行`:``,o.innerHTML=c.checked?`${K(`work`,15)} 生成计划`:`${K(`work`,15)} 开始提交`)};c.addEventListener(`change`,x),l.addEventListener(`change`,x),x();let S=e=>{let t=document.createElement(`div`);return t.className=`watch-row`,t.dataset.index=String(e.index),t.innerHTML=`
      <span class="watch-index">${e.index}</span>
      <div class="watch-row-main">
        <div class="watch-row-label" title="${H(`${e.chapter} / ${e.workName}`)}">${H(e.chapter)} / ${H(e.workName)}</div>
        <div class="watch-row-detail">${e.questionCount} 道题</div>
      </div>
      <span class="status-chip">${K(`clock`,12)} 等待</span>
    `,t},ee=e=>{let t=g.get(e.index);t||(t=S(e),g.set(e.index,t),a.appendChild(t));let n=t.querySelector(`.status-chip`);n&&(n.className=`status-chip ${At[e.status]??``}`,n.innerHTML=`${jt(e.status)} ${kt[e.status]??e.status}`);let r=t.querySelector(`.watch-row-detail`);r&&(r.textContent=e.message?e.message:e.status===`running`?`正在打开作答页并提交…`:`${e.questionCount} 道题`),t.classList.toggle(`is-passed`,e.status===`submitted`),e.status===`submitted`&&h.push(e.workId),y(e.status===`running`?e.index-1:e.index,m),e.status===`running`&&v(`正在提交：${e.workName}`)},te=e=>{f||(e.kind===`crawl`?(v(`正在刷新课程与测验题目…`),y(e.done,e.total)):e.kind===`quizPlan`?(m=e.total,g.clear(),h=[],a.innerHTML=``,y(0,e.total),e.total===0?v(e.skippedGraded>0?`没有需要提交的作业（已跳过 ${e.skippedGraded} 个已批改作业）`:`这门课程没有可提交的测验作业`):e.dryRun?v(`试运行：${e.total} 个作业，其中 ${e.incomplete} 个题库不完整`):v(`准备提交 ${e.total} 个作业${e.incomplete>0?`，将跳过 ${e.incomplete} 个不完整作业`:``}`)):e.kind===`quiz`&&ee(e))},C=t=>{d=!1,b(!1),o.hidden=!0,s.hidden=!0,t.cancelled?(v(`已取消`),e.onToast(`已取消题目提交`,`info`)):t.dryRun?(v(`试运行完成：${t.total-t.skipped-t.failed} 个作业可提交，${t.skipped} 个跳过，${t.failed} 个失败`),e.onToast(`试运行完成，没有发送任何提交请求`,`success`)):t.failed>0?(v(`完成：${t.submitted} 个已提交 · ${t.failed} 个失败 · ${t.skipped} 个跳过`),e.onToast(`${t.submitted} 个提交成功，${t.failed} 个失败，详见日志`,`error`)):t.submitted>0?(v(`完成：${t.submitted} 个已提交${t.skipped>0?` · ${t.skipped} 个跳过`:``}`),e.onToast(`已提交 ${t.submitted} 个作业`,`success`)):t.total===0?(v(t.skippedGraded>0?`没有需要提交的作业（已跳过 ${t.skippedGraded} 个已批改作业）`:`这门课程没有可提交的测验作业`),e.onToast(`没有需要提交的作业`,`info`)):(v(`没有提交任何作业，${t.skipped} 个作业被跳过`),e.onToast(`所有作业都不完整，详见日志`,`info`));let n=[...t.planErrors,...t.errors];if(n.length>0){let e=document.createElement(`div`);e.className=`watch-error`,e.textContent=n.join(`
`),a.appendChild(e)}e.onSubmitted([...new Set(h)]),h=[],t.cancelled||y(m,m)};o.addEventListener(`click`,async()=>{if(!d){if(d=!0,h=[],g.clear(),a.innerHTML=``,b(!0),v(`正在刷新课程与测验题目…`),y(0,0),p=await Ve(te),f)p?.(),p=null;else try{let t=await V.completeQuizzes({course:e.courseId,work:e.workId??null,dryRun:c.checked,maxWorks:u?.value?Math.max(1,Number(u.value)||1):null});f||C(t)}catch(t){if(f)return;d=!1,b(!1);let n=G(t);n.includes(`已取消`)?(v(`已取消`),e.onToast(`已取消题目提交`,`info`)):(v(`提交失败`),a.innerHTML=`<div class="watch-error">${H(n)}</div>`,e.onToast(n,`error`))}finally{p?.(),p=null,d=!1}}}),s.addEventListener(`click`,()=>{d&&(s.disabled=!0,s.textContent=`正在停止…`,V.cancelJob())})}function Nt(e){return[...e.trim()][0]??`课`}function Pt(e){let t=0;for(let n of e)t+=n.charCodeAt(0);return t%5}function Ft(e,t){let n={session:null,courses:[],selectedId:null,disabled:!1},r=``;e.innerHTML=`
    <div class="brand">
      <div class="brand-mark">${K(`book`,20)}</div>
      <div class="brand-copy">
        <div class="brand-name">HUST Course Hack</div>
        <div class="brand-sub">SmartCourse 网页助手</div>
      </div>
    </div>
    ${j?`<div class="demo-badge">${K(`spark`,12)} 演示模式</div>`:``}
    <div id="sidebar-session"></div>
    <div class="sidebar-nav">
      <div class="sidebar-nav-head">
        <div class="sidebar-label">我的课程 <span id="course-count" class="count-pill"></span></div>
        <button class="icon-button icon-button-dark" data-refresh title="刷新课程列表" aria-label="刷新课程列表">${K(`refresh`,15)}</button>
      </div>
      <div class="search-box">
        ${K(`search`,15)}
        <input id="course-search" type="search" placeholder="搜索课程" autocomplete="off" spellcheck="false" />
      </div>
      <div class="course-list" id="course-list"></div>
    </div>
    <div class="sidebar-footer">
      <button class="sidebar-link" data-helper>${K(`copy`,15)} 浏览器助手脚本</button>
      <div class="sidebar-note">${K(`shield`,13)} 登录会话仅保存在内存</div>
    </div>
  `;let i=e.querySelector(`#sidebar-session`),a=e.querySelector(`#course-list`),o=e.querySelector(`#course-search`),s=e.querySelector(`#course-count`),c=()=>{let e=n.session;e?i.innerHTML=`
      <div class="session-card">
        <span class="status-dot"></span>
        <div class="session-copy">
          <div class="session-title">已连接 SmartCourse</div>
          <div class="session-source" title="${H(e.cookieSource)}">${H(Xe(e.cookieSource))}</div>
        </div>
        <button class="icon-button icon-button-dark" data-disconnect title="断开连接" aria-label="断开连接">${K(`logout`,15)}</button>
      </div>
    `:i.innerHTML=`
        <div class="session-card is-idle">
          <span class="status-dot status-dot-idle"></span>
          <div class="session-copy">
            <div class="session-title">未连接</div>
            <div class="session-source">登录学校账号开始</div>
          </div>
        </div>
      `},l=()=>{if(s.textContent=n.session?String(n.courses.length):``,a.classList.toggle(`is-disabled`,n.disabled),!n.session){a.innerHTML=`
        <div class="sidebar-placeholder">
          <div class="sidebar-placeholder-icon">${K(`folder`,20)}</div>
          <p>连接账号后，课程会出现在这里</p>
        </div>
      `;return}let e=r.trim().toLowerCase(),t=n.courses.filter(t=>!e||t.name.toLowerCase().includes(e)||t.course_id.includes(e)||t.class_id.includes(e));t.length===0?a.innerHTML=`<div class="sidebar-placeholder"><p>${n.courses.length?`没有匹配的课程`:`当前账号没有课程`}</p></div>`:a.innerHTML=t.map(e=>`
          <button class="course-item${e.course_id===n.selectedId?` is-active`:``}" data-course-id="${H(e.course_id)}" title="${H(e.name)}">
            <span class="course-avatar tone-${Pt(e.course_id)}">${H(Nt(e.name))}</span>
            <span class="course-copy">
              <span class="course-name">${H(e.name)}</span>
              <span class="course-meta">${H(e.course_id)}</span>
            </span>
            <span class="course-chevron">${K(`chevron`,14)}</span>
          </button>
        `).join(``)};return o.addEventListener(`input`,()=>{r=o.value,l()}),e.addEventListener(`click`,e=>{let r=e.target;if(r.closest(`[data-refresh]`)){t.onRefreshCourses();return}if(r.closest(`[data-disconnect]`)){t.onDisconnect();return}if(r.closest(`[data-helper]`)){t.onHelper();return}let i=r.closest(`[data-course-id]`);if(i){if(n.disabled){W(`正在抓取课程，请先取消当前任务`);return}t.onSelect(i.dataset.courseId??``)}}),{update(e){n=e,c(),l()}}}var It={running:`上报中`,passed:`已通过`,failed:`未通过`,error:`出错`,dry_run:`已生成`},Lt={running:`is-running`,passed:`is-good`,failed:`is-bad`,error:`is-bad`,dry_run:`is-muted`};function Rt(e){let t=document.createElement(`div`);t.className=`watch-modal`,t.innerHTML=`
    <div class="modal-head">
      <div>
        <div class="eyebrow">视频任务</div>
        <h2>完成视频进度</h2>
        <p class="modal-sub">${H(e.courseName)}</p>
      </div>
      <button class="icon-button" data-close aria-label="关闭">${K(`close`,18)}</button>
    </div>
    <div class="modal-body">
      <p class="modal-lead">
        通过复现播放器的进度落点完成视频任务。每次执行都会重新抓取课程与
        <code>dtoken</code>、<code>otherInfo</code> 和签名，不会保存会话数据。
      </p>
      ${e.jobId?`<div class="inline-notice">${K(`link`,14)} 仅处理任务点 <code>${H(e.jobId)}</code></div>`:``}
      <div class="inline-notice notice-warn">
        ${K(`alert`,14)} 这会向平台发送真实的观看进度请求。建议先勾选“试运行”确认流程。
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>中间心跳间隔（秒）</span>
          <input id="watch-step" type="number" min="0" step="1" value="0" />
          <em>0 = 直接跳到结尾</em>
        </label>
        <label class="field">
          <span>心跳延迟（毫秒）</span>
          <input id="watch-delay" type="number" min="0" step="50" value="0" />
          <em>放慢节奏时使用</em>
        </label>
        <label class="field">
          <span>最多处理视频数</span>
          <input id="watch-max" type="number" min="1" step="1" placeholder="不限" />
          <em>用于先跑一个小批量</em>
        </label>
        <label class="check switch-row">
          <input id="watch-include-completed" type="checkbox" />
          <span>重新上报已完成的视频</span>
        </label>
        <label class="check switch-row">
          <input id="watch-dry" type="checkbox" />
          <span>试运行，只生成签名 URL</span>
        </label>
      </div>

      <div class="watch-progress" id="watch-progress">
        <div class="watch-status-row">
          <span id="watch-status">准备就绪</span>
          <span id="watch-count" class="watch-count"></span>
        </div>
        <div class="progress"><div class="progress-fill" id="watch-fill" style="width:0%"></div></div>
        <div class="watch-log" id="watch-log"></div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" id="watch-stop" hidden>${K(`stop`,14)} 停止</button>
      <button class="btn btn-ghost" data-close>关闭</button>
      <button class="btn btn-primary" id="watch-start">${K(`play`,15)} 开始上报</button>
    </div>
  `;let n=U(`#watch-status`,t),r=U(`#watch-count`,t),i=U(`#watch-fill`,t),a=U(`#watch-log`,t),o=U(`#watch-start`,t),s=U(`#watch-stop`,t),c=U(`#watch-step`,t),l=U(`#watch-delay`,t),u=U(`#watch-max`,t),d=U(`#watch-include-completed`,t),f=U(`#watch-dry`,t);e.jobId&&(d.checked=!0);let p=!1,m=!1,h=null,g=[],_=0,v=new Map,y=Ke(t,{wide:!0,onClose:()=>{m=!0,h?.(),h=null,p&&V.cancelJob().catch(()=>void 0)}});t.addEventListener(`click`,e=>{e.target.closest(`[data-close]`)&&y()});let b=e=>{n.textContent=e},x=(e,t)=>{let n=t>0?Math.min(100,Math.round(e/t*100)):0;i.style.width=`${n}%`,r.textContent=t>0?`${e} / ${t}`:``},S=e=>{o.hidden=e,o.disabled=e,s.hidden=!e,s.disabled=!1,s.innerHTML=`${K(`stop`,14)} 停止`;for(let t of[c,l,u,d,f])t.disabled=e},ee=e=>{let t=document.createElement(`div`);return t.className=`watch-row`,t.dataset.index=String(e.index),t.innerHTML=`
      <span class="watch-index">${e.index}</span>
      <div class="watch-row-main">
        <div class="watch-row-label" title="${H(e.label)}">${H(e.label)}</div>
        <div class="watch-row-detail"></div>
      </div>
      <span class="status-chip">${K(`clock`,12)} 等待</span>
    `,t},te=e=>{let t=v.get(e.index);t||(t=ee(e),v.set(e.index,t),a.appendChild(t));let n=t.querySelector(`.status-chip`);n&&(n.className=`status-chip ${Lt[e.status]??``}`,n.innerHTML=`${e.status===`running`?K(`clock`,12):K(`check`,12)} ${It[e.status]??e.status}`);let r=t.querySelector(`.watch-row-detail`);if(r){if(r.innerHTML=``,e.message){if(e.status===`dry_run`){let t=document.createElement(`details`);t.className=`watch-urls`;let n=document.createElement(`summary`);n.textContent=`查看签名 URL`;let i=document.createElement(`pre`);i.textContent=e.message,t.append(n,i),r.appendChild(t)}else{let t=document.createElement(`pre`);t.textContent=e.message,r.appendChild(t)}}else e.status===`passed`?r.textContent=`服务端返回 isPassed=true`:e.status===`running`&&(r.textContent=`正在发送心跳…`)}t.classList.toggle(`is-passed`,e.status===`passed`),e.status===`passed`&&g.push(e.jobId),x(e.status===`running`?e.index-1:e.index,_),e.status===`running`&&b(`正在处理：${e.label}`)},C=e=>{m||(e.kind===`crawl`?(b(`正在刷新课程与视频签名…`),x(e.done,e.total)):e.kind===`watchPlan`?(_=e.total,v.clear(),a.innerHTML=``,x(0,e.total),b(e.total===0?`没有需要处理的视频`:e.dryRun?`试运行：将为 ${e.total} 个视频生成签名 URL`:`准备上报 ${e.total} 个视频`)):e.kind===`watch`&&te(e))},ne=t=>{if(p=!1,S(!1),o.hidden=!0,o.disabled=!0,s.hidden=!0,t.cancelled?(b(`已取消`),e.onToast(`已取消视频上报`,`info`)):f.checked?(b(`试运行完成：${t.total-t.failed} 个签名计划有效 · ${t.failed} 个失败，未发送上报`),e.onToast(`试运行完成，没有发送视频上报请求`,t.failed?`error`:`success`)):(b(`完成：${t.passed} 个通过 · ${t.failed} 个未通过`),t.failed===0&&t.passed>0?e.onToast(`已完成 ${t.passed} 个视频`,`success`):t.failed>0?e.onToast(`${t.passed} 个通过，${t.failed} 个失败，详见日志`,`error`):e.onToast(`没有可上报的视频`,`info`)),t.errors.length){let e=document.createElement(`div`);e.className=`watch-error`,e.textContent=t.errors.join(`
`),a.appendChild(e)}e.onPassed([...new Set(g)]),g=[],t.cancelled||x(_,_)};o.addEventListener(`click`,async()=>{if(!p){if(p=!0,g=[],v.clear(),a.innerHTML=``,S(!0),b(`正在刷新课程与视频签名…`),x(0,0),h=await Ve(C),m)h?.(),h=null;else try{let t=await V.watchCourse({course:e.courseId,job:e.jobId??null,includeCompleted:d.checked,stepSecs:Math.max(0,Number(c.value)||0),delayMs:Math.max(0,Number(l.value)||0),maxVideos:u.value?Math.max(1,Number(u.value)):null,dryRun:f.checked});m||ne(t)}catch(t){if(m)return;p=!1,S(!1);let n=G(t);n.includes(`已取消`)?(b(`已取消`),e.onToast(`已取消视频上报`,`info`)):(b(`上报失败`),a.innerHTML=`<div class="watch-error">${H(n)}</div>`,e.onToast(n,`error`))}finally{h?.(),h=null,p=!1}}}),s.addEventListener(`click`,()=>{p&&(s.disabled=!0,s.textContent=`正在停止…`,V.cancelJob())})}var zt=U(`#app`);zt.innerHTML=`
  <div class="app-shell">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="main" id="main"></main>
  </div>
`;var J=U(`#main`),Y={session:null,courses:[],selectedId:null,busy:!1,details:new Map,options:{includeQuestions:!0,includeVideoInfo:!0,concurrency:4},bankQuestions:null,loginStatus:`idle`,loginError:null},Bt=Ft(U(`#sidebar`),{onSelect:e=>void Kt(e),onRefreshCourses:()=>void Qt(),onDisconnect:()=>void en(),onHelper:()=>void Ot()});function X(){Bt.update({session:Y.session,courses:Y.courses,selectedId:Y.selectedId,disabled:Y.busy})}function Vt(){return Y.courses.find(e=>e.course_id===Y.selectedId)??null}function Z(){Y.session?(X(),J.onclick=null,J.onchange=null,at(J,Y.session,Y.courses,{onSelect:e=>void Kt(e),onRefreshCourses:()=>void Qt(),onHelper:()=>void Ot()})):Q()}function Q(){Y.selectedId=null,X(),it(J,{status:Y.loginStatus,error:Y.loginError,onLogin:()=>void Ut()})}async function Ht(e){Y.session=e,Y.loginStatus=`idle`,Y.loginError=null,Y.selectedId=null,Y.details.clear(),X();try{Y.courses=await V.listCourses()}catch(e){W(G(e),`error`)}X(),Z(),W(j?`已进入演示模式`:`已连接学校课程页面`,`success`)}async function Ut(){if(Y.loginStatus!==`opening`&&Y.loginStatus!==`waiting`){Y.loginStatus=`opening`,Y.loginError=null,window.setTimeout(Q,0);try{if(await V.openLoginWindow(),Y.session)return;Y.loginStatus=`waiting`,Q()}catch(e){Y.loginStatus=`failed`,Y.loginError=G(e),Q()}}}function Wt(){Y.session||(Y.loginStatus===`opening`||Y.loginStatus===`waiting`)&&(Y.loginStatus=`failed`,Y.loginError=`登录窗口已关闭，未获取到学校会话。请重新打开登录窗口完成统一身份认证。`,Q())}async function Gt(){try{await He(e=>void Ht(e)),await Ue(()=>Wt())}catch(e){W(G(e),`error`)}}async function Kt(e){if(Y.busy){W(`正在抓取课程，请先取消当前任务`);return}let t=Y.courses.find(t=>t.course_id===e);if(!t)return;let n=Y.details.get(e);n&&Y.selectedId===e||(Y.selectedId=e,X(),n?$(n):await qt(t))}async function qt(e){if(Y.busy)return;Y.busy=!0,X(),dt(J,e,()=>void $t());let t=null,n=null,r=null;try{t=await Ve(e=>{e.kind===`crawl`&&pt(J,e.done,e.total)}),n=await V.fetchCourse(e.course_id,Y.options),Y.details.set(e.course_id,n)}catch(e){r=G(e)}finally{t?.(),Y.busy=!1,X()}Y.selectedId===e.course_id&&(n?$(n):r?.includes(`已取消`)?(Y.selectedId=null,W(`已取消抓取`,`info`),Z()):r&&ft(J,e,r,()=>void qt(e)))}function Jt(){let e=Vt();e&&!Y.busy&&(Y.details.delete(e.course_id),qt(e))}function $(e){_t(J,e,{busy:Y.busy,options:Y.options,bankQuestions:Y.bankQuestions,onRefresh:Jt,onCancel:()=>void $t(),onWatch:t=>Yt(e,t),onQuiz:t=>Xt(e,t),onExport:()=>void Zt(e),onOpenUrl:e=>{i(e).catch(e=>W(G(e),`error`))},onOptionsChange:e=>{Y.options=e,W(`抓取设置已更新，点击刷新后生效`)}})}function Yt(e,t){Rt({courseId:e.course_id,courseName:e.title,jobId:t,onToast:(e,t)=>W(e,t),onPassed:t=>{let n=!1;for(let r of t)n=mt(e,r)||n;n&&$(e)}})}function Xt(e,t){Mt({courseId:e.course_id,courseName:e.title,workId:t,bankQuestions:Y.bankQuestions,onToast:(e,t)=>W(e,t),onSubmitted:t=>{let n=!1;for(let r of t)n=ht(e,r)||n;n&&$(e)}})}async function Zt(e){try{let t=await r(`${Ze(e.title)}.json`,`课程 JSON`,[`json`]);if(!t)return;let n={generated_at_unix:Math.floor(Date.now()/1e3),course:e};await V.saveTextFile(t,JSON.stringify(n,null,2)),W(`课程 JSON 已导出`,`success`)}catch(e){W(G(e),`error`)}}async function Qt(){try{let e=await V.listCourses();Y.courses=e,Y.selectedId&&!e.some(e=>e.course_id===Y.selectedId)?(Y.selectedId=null,Y.details.clear(),Z()):Y.selectedId||Z(),X(),W(`课程列表已刷新，共 ${e.length} 门课程`,`success`)}catch(e){W(G(e),`error`)}}async function $t(){try{await V.cancelJob(),W(`正在取消任务…`,`info`)}catch(e){W(G(e),`error`)}}async function en(){Y.busy&&await V.cancelJob().catch(()=>void 0);try{await V.disconnect()}catch(e){W(G(e),`error`)}Y.session=null,Y.courses=[],Y.selectedId=null,Y.details.clear(),Y.busy=!1,Y.loginStatus=`idle`,Y.loginError=null,Q()}async function tn(){X();try{Y.bankQuestions=(await V.answerBankInfo()).questions}catch{Y.bankQuestions=null}await Gt();try{Y.session=await V.sessionInfo()}catch(e){W(G(e),`error`)}if(!Y.session)Q(),j&&window.setTimeout(()=>W(`演示模式：使用内置示例课程，不会访问真实平台`,`info`),500);else{try{Y.courses=await V.listCourses()}catch(e){W(G(e),`error`)}X(),Z()}}tn();