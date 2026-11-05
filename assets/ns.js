/* Nivesh Sahayak · niveshsahayak.in · Designed & Developed by Nivesh Sahayak */

(function(){
/* ===== Pages from GitHub =====
   A Blogger page holds only <div data-ns-page="about">short fallback text</div>. The real content is
   pages/about.html next to this file: edit it and push, and the live page changes with nothing to paste.
   Everything else in this file starts once the page content is in place, so translation, images and
   the Wealthy card see the full page. */
var ME=document.currentScript, BASE=ME&&ME.src?ME.src.replace(/ns\.js.*$/,''):'';
var CFG=window.NS_CONFIG||{};

/* The theme fills these when the page opens; content from GitHub arrives later, so fill it here too */
function fillContacts(root){
  var wa=String(CFG.whatsapp||'').replace(/\D/g,''), email=String(CFG.email||'').trim();
  [].forEach.call(root.querySelectorAll('[data-ns-whatsapp]'),function(el){
    if(!wa){ el.hidden=true; return; }
    el.href='https://wa.me/'+wa; el.target='_blank'; el.rel='noopener';
    if(el.hasAttribute('data-ns-text')) el.textContent='+'+wa;
  });
  [].forEach.call(root.querySelectorAll('[data-ns-email]'),function(el){
    if(!email){ el.hidden=true; return; }
    el.href='mailto:'+email;
    if(el.hasAttribute('data-ns-text')) el.textContent=email;
  });
  /* social buttons: copy the ones the theme already drew in the footer */
  var src=document.querySelectorAll('.ns-footer .ns-social a.ns-social__a');
  [].forEach.call(root.querySelectorAll('[data-ns-social]'),function(ph){
    if(!src.length){ ph.hidden=true; return; }
    var labels=ph.getAttribute('data-ns-social')==='labels', wrap=document.createElement('div');
    wrap.className='ns-social'+(labels?' ns-social--labels':'');
    [].forEach.call(src,function(a){
      var c=a.cloneNode(true);
      if(labels && !c.querySelector('span')){ var t=document.createElement('span'); t.textContent=(a.title||'').replace(/^.* on /,''); c.appendChild(t); }
      wrap.appendChild(c);
    });
    ph.innerHTML=''; ph.appendChild(wrap);
  });
}

function loadPages(done){
  var slots=document.querySelectorAll('[data-ns-page]'), left=slots.length;
  if(!left) return done();
  [].forEach.call(slots,function(el){
    el.classList.add('is-loading');   /* shimmer skeleton (ns.css) until the content arrives */
    var name=el.getAttribute('data-ns-page'), v=(window.NS_ASSETS||{}).v||'';
    fetch(BASE+'pages/'+name+'.html'+(v?'?v='+v:''),{cache:'no-cache'})
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(html){
        el.innerHTML=html;
        [].forEach.call(el.querySelectorAll('script'),function(old){   /* scripts added with innerHTML don't run */
          var s=document.createElement('script');
          [].forEach.call(old.attributes,function(a){ s.setAttribute(a.name,a.value); });
          s.text=old.text; old.parentNode.replaceChild(s,old);
        });
        fillContacts(el);
        el.classList.add('is-loaded');   /* sections fade up one after another */
      })
      .catch(function () { el.classList.add('is-failed'); })   /* keep the fallback text from the Blogger page */
      .then(function(){ el.classList.remove('is-loading'); if(--left===0) done(); });
  });
}

function nsMain(){
/* ===== Language system, articles, SEO helpers ===== */
(function(){
'use strict';

/* ------------------------------------------------------------------
   1. SETTINGS
   ------------------------------------------------------------------ */
var LANGS = {               // languages you WRITE posts in
  en:  {name:'English',  native:'English',  short:'EN', html:'en-IN', locale:'en-IN'},
  hi:  {name:'Hindi',    native:'हिन्दी',     short:'हिं', html:'hi',    locale:'hi-IN'},
  pa:  {name:'Punjabi',  native:'ਪੰਜਾਬੀ',     short:'ਪੰ', html:'pa',    locale:'pa-IN'},
  bho: {name:'Bhojpuri', native:'भोजपुरी',    short:'भो', html:'bho',   locale:'hi-IN'}
};
var TRANSLATE = [           // languages offered through Google auto-translate
  ['mr','मराठी — Marathi'],['gu','ગુજરાતી — Gujarati'],['bn','বাংলা — Bengali'],
  ['ta','தமிழ் — Tamil'],['te','తెలుగు — Telugu'],['kn','ಕನ್ನಡ — Kannada'],
  ['ml','മലയാളം — Malayalam'],['or','ଓଡ଼ିଆ — Odia'],['as','অসমীয়া — Assamese'],
  ['mai','मैथिली — Maithili'],['ur','اردو — Urdu'],['ne','नेपाली — Nepali'],
  ['gom','कोंकणी — Konkani'],['sd','سنڌي — Sindhi'],['doi','डोगरी — Dogri'],['sa','संस्कृतम् — Sanskrit']
];
var LANG_PREFIX = 'lang-';  // post label: lang-hi, lang-pa, lang-bho (English posts need no label)
var PAIR_PREFIX = 'pair-';  // shared label on every language version of the same article
var PAGE_SIZE   = 8;

/* ------------------------------------------------------------------
   2. TRANSLATIONS of the site's own text (menus, buttons, footer…)
      Key = the English text exactly as it appears on the site.
      Bhojpuri falls back to Hindi where no Bhojpuri text is given
      (used on purpose for legal/regulatory wording).
   ------------------------------------------------------------------ */
var T = {
"★ Add us as a preferred source on Google":{hi:"★ Google पर हमें पसंदीदा स्रोत बनाएँ",pa:"★ Google 'ਤੇ ਸਾਨੂੰ ਪਸੰਦੀਦਾ ਸਰੋਤ ਬਣਾਓ",bho:"★ Google पर हमनी के पसंदीदा स्रोत बनाईं"},
"Add us as a preferred source on Google":{hi:"Google पर हमें पसंदीदा स्रोत बनाएँ",pa:"Google 'ਤੇ ਸਾਨੂੰ ਪਸੰਦੀਦਾ ਸਰੋਤ ਬਣਾਓ",bho:"Google पर हमनी के पसंदीदा स्रोत बनाईं"},
"Preferred source":{hi:"पसंदीदा स्रोत",pa:"ਪਸੰਦੀਦਾ ਸਰੋਤ",bho:"पसंदीदा स्रोत"},
"Skip to content":{hi:"मुख्य सामग्री पर जाएँ",pa:"ਮੁੱਖ ਸਮੱਗਰੀ 'ਤੇ ਜਾਓ",bho:"मुख्य सामग्री पर जाईं"},
"AMFI Registered Mutual Fund Distributor ·":{hi:"AMFI पंजीकृत म्यूचुअल फंड वितरक ·",pa:"AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ ·",bho:"AMFI रजिस्टर्ड म्यूचुअल फंड वितरक ·"},
"AMFI Registered Mutual Fund Distributor":{hi:"AMFI पंजीकृत म्यूचुअल फंड वितरक",pa:"AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ",bho:"AMFI रजिस्टर्ड म्यूचुअल फंड वितरक"},
"Mutual Fund investments are subject to market risks, read all scheme related documents carefully.":{hi:"म्यूचुअल फंड निवेश बाज़ार जोखिमों के अधीन हैं, योजना संबंधी सभी दस्तावेज़ों को ध्यान से पढ़ें।",pa:"ਮਿਊਚੁਅਲ ਫੰਡ ਨਿਵੇਸ਼ ਬਾਜ਼ਾਰ ਦੇ ਜੋਖਮਾਂ ਦੇ ਅਧੀਨ ਹਨ, ਸਕੀਮ ਨਾਲ ਸਬੰਧਤ ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।"},
"Learn · Plan · Invest":{hi:"सीखें · योजना बनाएँ · निवेश करें",pa:"ਸਿੱਖੋ · ਯੋਜਨਾ ਬਣਾਓ · ਨਿਵੇਸ਼ ਕਰੋ",bho:"सीखीं · योजना बनाईं · निवेश करीं"},
"Home":{hi:"होम",pa:"ਹੋਮ",bho:"होम"},
"Learn":{hi:"सीखें",pa:"ਸਿੱਖੋ",bho:"सीखीं"},
"Mutual Fund Basics":{hi:"म्यूचुअल फंड की बुनियादी बातें",pa:"ਮਿਊਚੁਅਲ ਫੰਡ ਦੀਆਂ ਮੁੱਢਲੀਆਂ ਗੱਲਾਂ",bho:"म्यूचुअल फंड के बुनियादी बात"},
"SIP & Systematic Investing":{hi:"SIP और व्यवस्थित निवेश",pa:"SIP ਅਤੇ ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼",bho:"SIP आ नियमित निवेश"},
"Tax Saving & ELSS":{hi:"टैक्स बचत और ELSS",pa:"ਟੈਕਸ ਬੱਚਤ ਅਤੇ ELSS",bho:"टैक्स बचत आ ELSS"},
"Goal Planning":{hi:"लक्ष्य योजना",pa:"ਟੀਚਾ ਯੋਜਨਾ",bho:"लक्ष्य के योजना"},
"Debt Funds":{hi:"डेट फंड",pa:"ਡੈੱਟ ਫੰਡ",bho:"डेट फंड"},
"Investor Awareness":{hi:"निवेशक जागरूकता",pa:"ਨਿਵੇਸ਼ਕ ਜਾਗਰੂਕਤਾ",bho:"निवेशक जागरूकता"},
"Tax Saving":{hi:"टैक्स बचत",pa:"ਟੈਕਸ ਬੱਚਤ",bho:"टैक्स बचत"},
"Calculators":{hi:"कैलकुलेटर",pa:"ਕੈਲਕੁਲੇਟਰ",bho:"कैलकुलेटर"},
"About":{hi:"हमारे बारे में",pa:"ਸਾਡੇ ਬਾਰੇ",bho:"हमनी के बारे में"},
"Contact":{hi:"संपर्क",pa:"ਸੰਪਰਕ",bho:"संपर्क"},
"Services":{hi:"सेवाएँ",pa:"ਸੇਵਾਵਾਂ",bho:"सेवा"},
"Disclaimer":{hi:"अस्वीकरण",pa:"ਬੇਦਾਅਵਾ",bho:"अस्वीकरण"},
"Privacy Policy":{hi:"गोपनीयता नीति",pa:"ਪਰਦੇਦਾਰੀ ਨੀਤੀ",bho:"गोपनीयता नीति"},
"Talk to us":{hi:"हमसे बात करें",pa:"ਸਾਡੇ ਨਾਲ ਗੱਲ ਕਰੋ",bho:"हमनी से बात करीं"},
"Search":{hi:"खोजें",pa:"ਖੋਜੋ",bho:"खोजीं"},
"Understand mutual funds.":{hi:"म्यूचुअल फंड को समझें।",pa:"ਮਿਊਚੁਅਲ ਫੰਡਾਂ ਨੂੰ ਸਮਝੋ।",bho:"म्यूचुअल फंड के समझीं।"},
"Invest with clarity.":{hi:"समझदारी से निवेश करें।",pa:"ਸਪਸ਼ਟਤਾ ਨਾਲ ਨਿਵੇਸ਼ ਕਰੋ।",bho:"समझ-बूझ के निवेश करीं।"},
"Plain-language guides on mutual funds, SIPs, taxation and goal-based investing — written by Love Rai to help you make informed decisions for your family.":{hi:"म्यूचुअल फंड, SIP, टैक्स और लक्ष्य-आधारित निवेश पर आसान भाषा में गाइड — लव राय द्वारा लिखी गईं, ताकि आप अपने परिवार के लिए सोच-समझकर फ़ैसले ले सकें।",pa:"ਮਿਊਚੁਅਲ ਫੰਡ, SIP, ਟੈਕਸ ਅਤੇ ਟੀਚਾ-ਅਧਾਰਿਤ ਨਿਵੇਸ਼ ਬਾਰੇ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਗਾਈਡਾਂ — ਲਵ ਰਾਏ ਵੱਲੋਂ ਲਿਖੀਆਂ, ਤਾਂ ਜੋ ਤੁਸੀਂ ਆਪਣੇ ਪਰਿਵਾਰ ਲਈ ਸੋਚ-ਸਮਝ ਕੇ ਫ਼ੈਸਲੇ ਲੈ ਸਕੋ।",bho:"म्यूचुअल फंड, SIP, टैक्स आ लक्ष्य-आधारित निवेश पर आसान भाषा में गाइड — लव राय के लिखल, ताकि रउआ अपना परिवार खातिर सोच-समझ के फैसला ले सकीं।"},
"Start learning":{hi:"सीखना शुरू करें",pa:"ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ",bho:"सीखल शुरू करीं"},
"Try the SIP calculator":{hi:"SIP कैलकुलेटर आज़माएँ",pa:"SIP ਕੈਲਕੁਲੇਟਰ ਵਰਤ ਕੇ ਦੇਖੋ",bho:"SIP कैलकुलेटर आजमाईं"},
"Jargon-free explainers":{hi:"बिना कठिन शब्दों के समझाया गया",pa:"ਔਖੇ ਸ਼ਬਦਾਂ ਤੋਂ ਬਿਨਾਂ ਸਮਝਾਇਆ",bho:"बिना कठिन शब्द के समझावल"},
"Education, not tips":{hi:"शिक्षा, टिप्स नहीं",pa:"ਸਿੱਖਿਆ, ਟਿਪਸ ਨਹੀਂ",bho:"शिक्षा, टिप्स ना"},
"Investor-first, no hype":{hi:"निवेशक सबसे पहले, कोई दिखावा नहीं",pa:"ਨਿਵੇਸ਼ਕ ਪਹਿਲਾਂ, ਕੋਈ ਦਿਖਾਵਾ ਨਹੀਂ",bho:"निवेशक पहिले, कवनो दिखावा ना"},
"Start here":{hi:"यहाँ से शुरू करें",pa:"ਇੱਥੋਂ ਸ਼ੁਰੂ ਕਰੋ",bho:"इहाँ से शुरू करीं"},
"Your investing journey":{hi:"आपकी निवेश यात्रा",pa:"ਤੁਹਾਡਾ ਨਿਵੇਸ਼ ਸਫ਼ਰ",bho:"रउआ निवेश के सफर"},
"Learn the basics":{hi:"बुनियादी बातें सीखें",pa:"ਮੁੱਢਲੀਆਂ ਗੱਲਾਂ ਸਿੱਖੋ",bho:"बुनियादी बात सीखीं"},
"What a mutual fund is, NAV, fund categories":{hi:"म्यूचुअल फंड क्या है, NAV, फंड की श्रेणियाँ",pa:"ਮਿਊਚੁਅਲ ਫੰਡ ਕੀ ਹੈ, NAV, ਫੰਡ ਸ਼੍ਰੇਣੀਆਂ",bho:"म्यूचुअल फंड का ह, NAV, फंड के श्रेणी"},
"Know your risk":{hi:"अपना जोखिम जानें",pa:"ਆਪਣਾ ਜੋਖਮ ਜਾਣੋ",bho:"आपन जोखिम जानीं"},
"Riskometer, risk profile & asset allocation":{hi:"रिस्कोमीटर, जोखिम प्रोफ़ाइल और एसेट एलोकेशन",pa:"ਰਿਸਕੋਮੀਟਰ, ਜੋਖਮ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਐਸੇਟ ਐਲੋਕੇਸ਼ਨ",bho:"रिस्कोमीटर, जोखिम प्रोफाइल आ एसेट एलोकेशन"},
"Plan your goals":{hi:"अपने लक्ष्यों की योजना बनाएँ",pa:"ਆਪਣੇ ਟੀਚਿਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ",bho:"आपन लक्ष्य के योजना बनाईं"},
"Match every goal to its time horizon":{hi:"हर लक्ष्य को उसकी समय-सीमा से मिलाएँ",pa:"ਹਰ ਟੀਚੇ ਨੂੰ ਉਸਦੀ ਸਮਾਂ-ਸੀਮਾ ਨਾਲ ਮਿਲਾਓ",bho:"हर लक्ष्य के ओकरा समय-सीमा से मिलाईं"},
"Stay disciplined":{hi:"अनुशासित रहें",pa:"ਅਨੁਸ਼ਾਸਿਤ ਰਹੋ",bho:"अनुशासन में रहीं"},
"SIPs, step-ups, reviews & rebalancing":{hi:"SIP, स्टेप-अप, समीक्षा और रीबैलेंसिंग",pa:"SIP, ਸਟੈੱਪ-ਅੱਪ, ਸਮੀਖਿਆ ਅਤੇ ਰੀਬੈਲੈਂਸਿੰਗ",bho:"SIP, स्टेप-अप, समीक्षा आ रीबैलेंसिंग"},
"Content is for investor education only and is not investment advice.":{hi:"यह सामग्री केवल निवेशक शिक्षा के लिए है और निवेश सलाह नहीं है।",pa:"ਇਹ ਸਮੱਗਰੀ ਸਿਰਫ਼ ਨਿਵੇਸ਼ਕ ਸਿੱਖਿਆ ਲਈ ਹੈ ਅਤੇ ਨਿਵੇਸ਼ ਸਲਾਹ ਨਹੀਂ ਹੈ।"},
"Explore by topic":{hi:"विषय के अनुसार देखें",pa:"ਵਿਸ਼ੇ ਅਨੁਸਾਰ ਦੇਖੋ",bho:"विषय के हिसाब से देखीं"},
"What would you like to understand today?":{hi:"आज आप क्या समझना चाहेंगे?",pa:"ਅੱਜ ਤੁਸੀਂ ਕੀ ਸਮਝਣਾ ਚਾਹੋਗੇ?",bho:"आज रउआ का समझल चाहब?"},
"NAV, AMCs, fund types and how it all works.":{hi:"NAV, AMC, फंड के प्रकार और यह सब कैसे काम करता है।",pa:"NAV, AMC, ਫੰਡ ਦੀਆਂ ਕਿਸਮਾਂ ਅਤੇ ਇਹ ਸਭ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ।",bho:"NAV, AMC, फंड के किसिम आ ई सब कइसे काम करेला।"},
"Systematic investing, step-ups and rupee-cost averaging.":{hi:"व्यवस्थित निवेश, स्टेप-अप और रुपी-कॉस्ट एवरेजिंग।",pa:"ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼, ਸਟੈੱਪ-ਅੱਪ ਅਤੇ ਰੁਪੀ-ਕੌਸਟ ਐਵਰੇਜਿੰਗ।",bho:"नियमित निवेश, स्टेप-अप आ रुपी-कॉस्ट एवरेजिंग।"},
"ELSS, capital gains and tax-efficient investing.":{hi:"ELSS, कैपिटल गेन और टैक्स-कुशल निवेश।",pa:"ELSS, ਕੈਪੀਟਲ ਗੇਨ ਅਤੇ ਟੈਕਸ-ਕੁਸ਼ਲ ਨਿਵੇਸ਼।",bho:"ELSS, कैपिटल गेन आ टैक्स बचावे वाला निवेश।"},
"Education, home, retirement — plan backwards.":{hi:"पढ़ाई, घर, रिटायरमेंट — लक्ष्य से पीछे की ओर योजना बनाएँ।",pa:"ਪੜ੍ਹਾਈ, ਘਰ, ਰਿਟਾਇਰਮੈਂਟ — ਟੀਚੇ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਯੋਜਨਾ ਬਣਾਓ।",bho:"पढ़ाई, घर, रिटायरमेंट — लक्ष्य से पाछे के ओर योजना बनाईं।"},
"Liquid, short-duration and how interest rates matter.":{hi:"लिक्विड, शॉर्ट-ड्यूरेशन और ब्याज दरें क्यों मायने रखती हैं।",pa:"ਲਿਕਵਿਡ, ਸ਼ਾਰਟ-ਡਿਊਰੇਸ਼ਨ ਅਤੇ ਵਿਆਜ ਦਰਾਂ ਕਿਉਂ ਮਾਇਨੇ ਰੱਖਦੀਆਂ ਹਨ।",bho:"लिक्विड, शॉर्ट-ड्यूरेशन आ ब्याज दर काहे मायने रखेला।"},
"KYC, nominations, riskometer and avoiding mis-selling.":{hi:"KYC, नॉमिनेशन, रिस्कोमीटर और गलत बिक्री से बचाव।",pa:"KYC, ਨਾਮਜ਼ਦਗੀ, ਰਿਸਕੋਮੀਟਰ ਅਤੇ ਗਲਤ ਵਿਕਰੀ ਤੋਂ ਬਚਾਅ।",bho:"KYC, नॉमिनेशन, रिस्कोमीटर आ गलत बिक्री से बचाव।"},
"Latest articles":{hi:"नवीनतम लेख",pa:"ਨਵੇਂ ਲੇਖ",bho:"नयका लेख"},
"Fresh from the blog":{hi:"हाल ही में प्रकाशित",pa:"ਹਾਲ ਹੀ ਵਿੱਚ ਪ੍ਰਕਾਸ਼ਿਤ",bho:"हाले में प्रकाशित"},
"Love Rai":{hi:"लव राय",pa:"ਲਵ ਰਾਏ",bho:"लव राय"},
"I write simple, jargon-free guides to help families understand mutual funds, SIPs and goal-based investing — so every decision is an informed one.":{hi:"मेरी गाइड आसान और बिना कठिन शब्दों की होती हैं, ताकि परिवार म्यूचुअल फंड, SIP और लक्ष्य-आधारित निवेश को समझ सकें — और हर फ़ैसला सोच-समझकर हो।",pa:"ਮੇਰੀਆਂ ਗਾਈਡਾਂ ਸੌਖੀਆਂ ਅਤੇ ਔਖੇ ਸ਼ਬਦਾਂ ਤੋਂ ਬਿਨਾਂ ਹੁੰਦੀਆਂ ਹਨ, ਤਾਂ ਜੋ ਪਰਿਵਾਰ ਮਿਊਚੁਅਲ ਫੰਡ, SIP ਅਤੇ ਟੀਚਾ-ਅਧਾਰਿਤ ਨਿਵੇਸ਼ ਨੂੰ ਸਮਝ ਸਕਣ — ਅਤੇ ਹਰ ਫ਼ੈਸਲਾ ਸੋਚ-ਸਮਝ ਕੇ ਹੋਵੇ।",bho:"हमार गाइड आसान आ बिना कठिन शब्द के होला, ताकि परिवार म्यूचुअल फंड, SIP आ लक्ष्य-आधारित निवेश के समझ सके — आ हर फैसला सोच-समझ के होखे।"},
"More about me":{hi:"मेरे बारे में और जानें",pa:"ਮੇਰੇ ਬਾਰੇ ਹੋਰ ਜਾਣੋ",bho:"हमरा बारे में अउर जानीं"},
"Quick calculator":{hi:"झटपट कैलकुलेटर",pa:"ਝਟਪਟ ਕੈਲਕੁਲੇਟਰ",bho:"झटपट कैलकुलेटर"},
"Lumpsum":{hi:"एकमुश्त",pa:"ਇੱਕਮੁਸ਼ਤ",bho:"एकमुश्त"},
"Monthly investment":{hi:"मासिक निवेश",pa:"ਮਹੀਨਾਵਾਰ ਨਿਵੇਸ਼",bho:"महीना के निवेश"},
"Total investment":{hi:"कुल निवेश",pa:"ਕੁੱਲ ਨਿਵੇਸ਼",bho:"कुल निवेश"},
"Expected return (p.a.)":{hi:"अनुमानित रिटर्न (वार्षिक)",pa:"ਅਨੁਮਾਨਿਤ ਰਿਟਰਨ (ਸਾਲਾਨਾ)",bho:"अनुमानित रिटर्न (सालाना)"},
"Time period":{hi:"अवधि",pa:"ਮਿਆਦ",bho:"अवधि"},
"Yr":{hi:"वर्ष",pa:"ਸਾਲ",bho:"साल"},
"Annual step-up":{hi:"वार्षिक स्टेप-अप",pa:"ਸਾਲਾਨਾ ਸਟੈੱਪ-ਅੱਪ",bho:"सालाना स्टेप-अप"},
"Invested amount":{hi:"निवेश की गई राशि",pa:"ਨਿਵੇਸ਼ ਕੀਤੀ ਰਕਮ",bho:"निवेश कइल रकम"},
"Est. returns":{hi:"अनुमानित रिटर्न",pa:"ਅਨੁਮਾਨਿਤ ਰਿਟਰਨ",bho:"अनुमानित रिटर्न"},
"Estimated value":{hi:"अनुमानित मूल्य",pa:"ਅਨੁਮਾਨਿਤ ਮੁੱਲ",bho:"अनुमानित मूल्य"},
"For illustration only. The assumed rate of return is not guaranteed — actual mutual fund returns vary with market conditions. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.":{hi:"केवल उदाहरण के लिए। मानी गई रिटर्न दर की गारंटी नहीं है — म्यूचुअल फंड का वास्तविक रिटर्न बाज़ार की स्थितियों के साथ बदलता है। म्यूचुअल फंड निवेश बाज़ार जोखिमों के अधीन हैं, योजना संबंधी सभी दस्तावेज़ों को ध्यान से पढ़ें।",pa:"ਸਿਰਫ਼ ਉਦਾਹਰਣ ਲਈ। ਮੰਨੀ ਗਈ ਰਿਟਰਨ ਦਰ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਹੈ — ਮਿਊਚੁਅਲ ਫੰਡ ਦਾ ਅਸਲ ਰਿਟਰਨ ਬਾਜ਼ਾਰ ਦੇ ਹਾਲਾਤਾਂ ਨਾਲ ਬਦਲਦਾ ਹੈ। ਮਿਊਚੁਅਲ ਫੰਡ ਨਿਵੇਸ਼ ਬਾਜ਼ਾਰ ਦੇ ਜੋਖਮਾਂ ਦੇ ਅਧੀਨ ਹਨ, ਸਕੀਮ ਨਾਲ ਸਬੰਧਤ ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।"},
"Labels":{hi:"विषय",pa:"ਵਿਸ਼ੇ",bho:"विषय"},
"Popular Posts":{hi:"लोकप्रिय लेख",pa:"ਪ੍ਰਸਿੱਧ ਲੇਖ",bho:"लोकप्रिय लेख"},
"Contact Form":{hi:"संपर्क फ़ॉर्म",pa:"ਸੰਪਰਕ ਫਾਰਮ",bho:"संपर्क फॉर्म"},
"Name":{hi:"नाम",pa:"ਨਾਮ",bho:"नाम"},
"Email":{hi:"ईमेल",pa:"ਈਮੇਲ",bho:"ईमेल"},
"Message":{hi:"संदेश",pa:"ਸੁਨੇਹਾ",bho:"संदेश"},
"Send":{hi:"भेजें",pa:"ਭੇਜੋ",bho:"भेजीं"},
"An investor-education initiative by Love Rai. Simple explanations of mutual funds, SIPs and goal-based investing for Indian families.":{hi:"लव राय की एक निवेशक-शिक्षा पहल। भारतीय परिवारों के लिए म्यूचुअल फंड, SIP और लक्ष्य-आधारित निवेश की आसान व्याख्या।",pa:"ਲਵ ਰਾਏ ਦੀ ਇੱਕ ਨਿਵੇਸ਼ਕ-ਸਿੱਖਿਆ ਪਹਿਲਕਦਮੀ। ਭਾਰਤੀ ਪਰਿਵਾਰਾਂ ਲਈ ਮਿਊਚੁਅਲ ਫੰਡ, SIP ਅਤੇ ਟੀਚਾ-ਅਧਾਰਿਤ ਨਿਵੇਸ਼ ਦੀ ਸੌਖੀ ਵਿਆਖਿਆ।",bho:"लव राय के एगो निवेशक-शिक्षा पहल। भारतीय परिवार खातिर म्यूचुअल फंड, SIP आ लक्ष्य-आधारित निवेश के आसान समझाइश।"},
"AMFI Registered MFD · ARN":{hi:"AMFI पंजीकृत MFD · ARN",pa:"AMFI ਰਜਿਸਟਰਡ MFD · ARN",bho:"AMFI रजिस्टर्ड MFD · ARN"},
"AMFI Registered MFD · ARN-354017":{hi:"AMFI पंजीकृत MFD · ARN-354017",pa:"AMFI ਰਜਿਸਟਰਡ MFD · ARN-354017",bho:"AMFI रजिस्टर्ड MFD · ARN-354017"},
"Follow Love Rai":{hi:"लव राय को फ़ॉलो करें",pa:"ਲਵ ਰਾਏ ਨੂੰ ਫਾਲੋ ਕਰੋ",bho:"लव राय के फॉलो करीं"},
"Disclaimer & Disclosures":{hi:"अस्वीकरण और प्रकटीकरण",pa:"ਬੇਦਾਅਵਾ ਅਤੇ ਖੁਲਾਸੇ"},
"Investor resources":{hi:"निवेशक संसाधन",pa:"ਨਿਵੇਸ਼ਕ ਸਰੋਤ",bho:"निवेशक संसाधन"},
"AMFI India — verify ARN":{hi:"AMFI इंडिया — ARN सत्यापित करें",pa:"AMFI ਇੰਡੀਆ — ARN ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",bho:"AMFI इंडिया — ARN जाँचीं"},
"SEBI Investor Website":{hi:"SEBI निवेशक वेबसाइट",pa:"SEBI ਨਿਵੇਸ਼ਕ ਵੈੱਬਸਾਈਟ",bho:"SEBI निवेशक वेबसाइट"},
"SEBI SCORES (grievances)":{hi:"SEBI SCORES (शिकायतें)",pa:"SEBI SCORES (ਸ਼ਿਕਾਇਤਾਂ)",bho:"SEBI SCORES (शिकायत)"},
"SMART ODR Portal":{hi:"SMART ODR पोर्टल",pa:"SMART ODR ਪੋਰਟਲ",bho:"SMART ODR पोर्टल"},
"Disclosure:":{hi:"प्रकटीकरण:",pa:"ਖੁਲਾਸਾ:"},
"Love Rai is an AMFI Registered Mutual Fund Distributor (ARN-354017). Nivesh Sahayak is an investor-education initiative. We are not a SEBI Registered Investment Adviser and do not provide investment advice. Content on this website is for general information and education only and must not be read as a recommendation to buy, sell or hold any scheme. Any examples, figures or returns shown are illustrative; past performance may or may not be sustained in future. As a distributor, we receive commission from Asset Management Companies (AMCs) on investments made through us. Investors should consider their own risk profile and read the Scheme Information Document before investing.":{hi:"लव राय एक AMFI पंजीकृत म्यूचुअल फंड वितरक (ARN-354017) हैं। निवेश सहायक एक निवेशक-शिक्षा पहल है। हम SEBI पंजीकृत निवेश सलाहकार नहीं हैं और निवेश सलाह नहीं देते। इस वेबसाइट की सामग्री केवल सामान्य जानकारी और शिक्षा के लिए है और इसे किसी योजना को खरीदने, बेचने या रखने की सिफ़ारिश के रूप में नहीं पढ़ा जाना चाहिए। दिखाए गए उदाहरण, आँकड़े या रिटर्न केवल समझाने के लिए हैं; पिछला प्रदर्शन भविष्य में बना रह भी सकता है और नहीं भी। वितरक के रूप में, हमारे माध्यम से किए गए निवेश पर हमें एसेट मैनेजमेंट कंपनियों (AMC) से कमीशन मिलता है। निवेशकों को निवेश से पहले अपनी जोखिम प्रोफ़ाइल पर विचार करना चाहिए और स्कीम इन्फ़ॉर्मेशन डॉक्यूमेंट (SID) पढ़ना चाहिए।",pa:"ਲਵ ਰਾਏ ਇੱਕ AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ (ARN-354017) ਹਨ। ਨਿਵੇਸ਼ ਸਹਾਇਕ ਇੱਕ ਨਿਵੇਸ਼ਕ-ਸਿੱਖਿਆ ਪਹਿਲਕਦਮੀ ਹੈ। ਅਸੀਂ SEBI ਰਜਿਸਟਰਡ ਨਿਵੇਸ਼ ਸਲਾਹਕਾਰ ਨਹੀਂ ਹਾਂ ਅਤੇ ਨਿਵੇਸ਼ ਸਲਾਹ ਨਹੀਂ ਦਿੰਦੇ। ਇਸ ਵੈੱਬਸਾਈਟ ਦੀ ਸਮੱਗਰੀ ਸਿਰਫ਼ ਆਮ ਜਾਣਕਾਰੀ ਅਤੇ ਸਿੱਖਿਆ ਲਈ ਹੈ ਅਤੇ ਇਸਨੂੰ ਕਿਸੇ ਸਕੀਮ ਨੂੰ ਖਰੀਦਣ, ਵੇਚਣ ਜਾਂ ਰੱਖਣ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਵਜੋਂ ਨਹੀਂ ਪੜ੍ਹਿਆ ਜਾਣਾ ਚਾਹੀਦਾ। ਦਿਖਾਏ ਗਏ ਉਦਾਹਰਣ, ਅੰਕੜੇ ਜਾਂ ਰਿਟਰਨ ਸਿਰਫ਼ ਸਮਝਾਉਣ ਲਈ ਹਨ; ਪਿਛਲਾ ਪ੍ਰਦਰਸ਼ਨ ਭਵਿੱਖ ਵਿੱਚ ਕਾਇਮ ਰਹਿ ਵੀ ਸਕਦਾ ਹੈ ਅਤੇ ਨਹੀਂ ਵੀ। ਡਿਸਟ੍ਰੀਬਿਊਟਰ ਵਜੋਂ, ਸਾਡੇ ਰਾਹੀਂ ਕੀਤੇ ਨਿਵੇਸ਼ 'ਤੇ ਸਾਨੂੰ ਐਸੇਟ ਮੈਨੇਜਮੈਂਟ ਕੰਪਨੀਆਂ (AMC) ਤੋਂ ਕਮਿਸ਼ਨ ਮਿਲਦਾ ਹੈ। ਨਿਵੇਸ਼ਕਾਂ ਨੂੰ ਨਿਵੇਸ਼ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਜੋਖਮ ਪ੍ਰੋਫਾਈਲ 'ਤੇ ਵਿਚਾਰ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ ਸਕੀਮ ਇਨਫਰਮੇਸ਼ਨ ਡਾਕੂਮੈਂਟ (SID) ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।"},
"Read the full disclaimer":{hi:"पूरा अस्वीकरण पढ़ें",pa:"ਪੂਰਾ ਬੇਦਾਅਵਾ ਪੜ੍ਹੋ",bho:"पूरा अस्वीकरण पढ़ीं"},
"Nivesh Sahayak · Love Rai, ARN-354017. All rights reserved.":{hi:"निवेश सहायक · लव राय, ARN-354017. सर्वाधिकार सुरक्षित।",pa:"ਨਿਵੇਸ਼ ਸਹਾਇਕ · ਲਵ ਰਾਏ, ARN-354017. ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",bho:"निवेश सहायक · लव राय, ARN-354017. सब अधिकार सुरक्षित।"},
"Privacy":{hi:"गोपनीयता",pa:"ਪਰਦੇਦਾਰੀ",bho:"गोपनीयता"},
"Grievances":{hi:"शिकायतें",pa:"ਸ਼ਿਕਾਇਤਾਂ",bho:"शिकायत"},
"Ask on WhatsApp":{hi:"WhatsApp पर पूछें",pa:"WhatsApp 'ਤੇ ਪੁੱਛੋ",bho:"WhatsApp पर पूछीं"},
/* article pages */
"In this article":{hi:"इस लेख में",pa:"ਇਸ ਲੇਖ ਵਿੱਚ",bho:"एह लेख में"},
"This article is for investor education only and is not investment advice or a recommendation of any scheme. Examples and figures are illustrative. Love Rai is an AMFI Registered Mutual Fund Distributor (ARN-354017) and receives commission from AMCs on investments made through us.":{hi:"यह लेख केवल निवेशक शिक्षा के लिए है और यह निवेश सलाह या किसी योजना की सिफ़ारिश नहीं है। उदाहरण और आँकड़े केवल समझाने के लिए हैं। लव राय एक AMFI पंजीकृत म्यूचुअल फंड वितरक (ARN-354017) हैं; हमारे माध्यम से किए गए निवेश पर AMC से कमीशन प्राप्त होता है।",pa:"ਇਹ ਲੇਖ ਸਿਰਫ਼ ਨਿਵੇਸ਼ਕ ਸਿੱਖਿਆ ਲਈ ਹੈ ਅਤੇ ਇਹ ਨਿਵੇਸ਼ ਸਲਾਹ ਜਾਂ ਕਿਸੇ ਸਕੀਮ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਨਹੀਂ ਹੈ। ਉਦਾਹਰਣ ਅਤੇ ਅੰਕੜੇ ਸਿਰਫ਼ ਸਮਝਾਉਣ ਲਈ ਹਨ। ਲਵ ਰਾਏ ਇੱਕ AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ (ARN-354017) ਹਨ; ਸਾਡੇ ਰਾਹੀਂ ਕੀਤੇ ਨਿਵੇਸ਼ 'ਤੇ AMC ਤੋਂ ਕਮਿਸ਼ਨ ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।"},
"Full disclaimer":{hi:"पूरा अस्वीकरण",pa:"ਪੂਰਾ ਬੇਦਾਅਵਾ",bho:"पूरा अस्वीकरण"},
"Filed under":{hi:"विषय:",pa:"ਵਿਸ਼ਾ:",bho:"विषय:"},
"Share":{hi:"शेयर करें",pa:"ਸਾਂਝਾ ਕਰੋ",bho:"शेयर करीं"},
"Copy link":{hi:"लिंक कॉपी करें",pa:"ਲਿੰਕ ਕਾਪੀ ਕਰੋ",bho:"लिंक कॉपी करीं"},
"Share this article":{hi:"यह लेख शेयर करें",pa:"ਇਹ ਲੇਖ ਸਾਂਝਾ ਕਰੋ",bho:"ई लेख शेयर करीं"},
"Share on WhatsApp":{hi:"WhatsApp पर शेयर करें",pa:"WhatsApp 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"WhatsApp पर शेयर करीं"},
"Share on LinkedIn":{hi:"LinkedIn पर शेयर करें",pa:"LinkedIn 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"LinkedIn पर शेयर करीं"},
"Share on X (Twitter)":{hi:"X (Twitter) पर शेयर करें",pa:"X (Twitter) 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"X (Twitter) पर शेयर करीं"},
"Share on X":{hi:"X पर शेयर करें",pa:"X 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"X पर शेयर करीं"},
"Share on Facebook":{hi:"Facebook पर शेयर करें",pa:"Facebook 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"Facebook पर शेयर करीं"},
"Share on Telegram":{hi:"Telegram पर शेयर करें",pa:"Telegram 'ਤੇ ਸਾਂਝਾ ਕਰੋ",bho:"Telegram पर शेयर करीं"},
"Copied!":{hi:"कॉपी हो गया!",pa:"ਕਾਪੀ ਹੋ ਗਿਆ!",bho:"कॉपी हो गइल!"},
"More…":{hi:"और…",pa:"ਹੋਰ…",bho:"अउर…"},
"Written by":{hi:"लेखक",pa:"ਲੇਖਕ",bho:"लेखक"},
"AMFI Registered Mutual Fund Distributor. I break down mutual funds, SIPs and goal-based investing into simple steps so you can invest with confidence. Have a question about this topic? I am happy to explain.":{hi:"AMFI पंजीकृत म्यूचुअल फंड वितरक। म्यूचुअल फंड, SIP और लक्ष्य-आधारित निवेश को आसान कदमों में समझाना मेरा काम है, ताकि आप भरोसे के साथ निवेश कर सकें। इस विषय पर कोई सवाल है? मुझे समझाने में खुशी होगी।",pa:"AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ। ਮਿਊਚੁਅਲ ਫੰਡ, SIP ਅਤੇ ਟੀਚਾ-ਅਧਾਰਿਤ ਨਿਵੇਸ਼ ਨੂੰ ਸੌਖੇ ਕਦਮਾਂ ਵਿੱਚ ਸਮਝਾਉਣਾ ਮੇਰਾ ਕੰਮ ਹੈ, ਤਾਂ ਜੋ ਤੁਸੀਂ ਭਰੋਸੇ ਨਾਲ ਨਿਵੇਸ਼ ਕਰ ਸਕੋ। ਇਸ ਵਿਸ਼ੇ ਬਾਰੇ ਕੋਈ ਸਵਾਲ ਹੈ? ਮੈਨੂੰ ਸਮਝਾ ਕੇ ਖ਼ੁਸ਼ੀ ਹੋਵੇਗੀ।",bho:"AMFI रजिस्टर्ड म्यूचुअल फंड वितरक। म्यूचुअल फंड, SIP आ लक्ष्य-आधारित निवेश के आसान कदम में समझावल हमार काम ह, ताकि रउआ भरोसा से निवेश कर सकीं। एह विषय पर कवनो सवाल बा? समझा के हमरा खुशी होई।"},
"Ask a question":{hi:"सवाल पूछें",pa:"ਸਵਾਲ ਪੁੱਛੋ",bho:"सवाल पूछीं"},
"About me":{hi:"मेरे बारे में",pa:"ਮੇਰੇ ਬਾਰੇ",bho:"हमरा बारे में"},
"Older article →":{hi:"पुराना लेख →",pa:"ਪੁਰਾਣਾ ਲੇਖ →",bho:"पुरान लेख →"},
"← Newer article":{hi:"← नया लेख",pa:"← ਨਵਾਂ ਲੇਖ",bho:"← नयका लेख"},
"Older posts →":{hi:"पुराने लेख →",pa:"ਪੁਰਾਣੇ ਲੇਖ →",bho:"पुरान लेख →"},
"← Newer posts":{hi:"← नए लेख",pa:"← ਨਵੇਂ ਲੇਖ",bho:"← नयका लेख"},
"Article":{hi:"लेख",pa:"ਲੇਖ",bho:"लेख"},
"Read →":{hi:"पढ़ें →",pa:"ਪੜ੍ਹੋ →",bho:"पढ़ीं →"},
"Topic":{hi:"विषय",pa:"ਵਿਸ਼ਾ",bho:"विषय"},
"Search results":{hi:"खोज परिणाम",pa:"ਖੋਜ ਨਤੀਜੇ",bho:"खोज के नतीजा"},
/* 404 page */
"Sorry, we couldn't find this page.":{hi:"माफ़ कीजिए, यह पेज नहीं मिला।",pa:"ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਪੇਜ ਨਹੀਂ ਮਿਲਿਆ।",bho:"माफ करीं, ई पेज ना मिलल।"},
"The page you are looking for does not exist or has been moved.":{hi:"आप जो पेज ढूँढ रहे हैं, वह मौजूद नहीं है या कहीं और चला गया है।",pa:"ਤੁਸੀਂ ਜੋ ਪੇਜ ਲੱਭ ਰਹੇ ਹੋ, ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਹੈ ਜਾਂ ਕਿਤੇ ਹੋਰ ਚਲਾ ਗਿਆ ਹੈ।",bho:"रउआ जवन पेज खोजत बानी, ऊ नइखे भा कहीं अउर चल गइल बा।"},
"Back to home":{hi:"होम पर लौटें",pa:"ਹੋਮ 'ਤੇ ਵਾਪਸ ਜਾਓ",bho:"होम पर लौटीं"},
"Try searching":{hi:"खोज कर देखें",pa:"ਖੋਜ ਕੇ ਦੇਖੋ",bho:"खोज के देखीं"},
"Or explore a topic":{hi:"या कोई विषय चुनें",pa:"ਜਾਂ ਕੋਈ ਵਿਸ਼ਾ ਚੁਣੋ",bho:"भा कवनो विषय चुनीं"},
"Page not found":{hi:"पेज नहीं मिला",pa:"ਪੇਜ ਨਹੀਂ ਮਿਲਿਆ",bho:"पेज ना मिलल"},
/* calculators page */
"See how regular or one-time investing could grow over time under an assumed rate of return. Move the sliders or type a value.":{hi:"देखें कि मानी गई रिटर्न दर पर नियमित या एकमुश्त निवेश समय के साथ कैसे बढ़ सकता है। स्लाइडर खिसकाएँ या कोई मान लिखें।",pa:"ਦੇਖੋ ਕਿ ਮੰਨੀ ਗਈ ਰਿਟਰਨ ਦਰ 'ਤੇ ਨਿਯਮਤ ਜਾਂ ਇੱਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਸਮੇਂ ਨਾਲ ਕਿਵੇਂ ਵਧ ਸਕਦਾ ਹੈ। ਸਲਾਈਡਰ ਹਿਲਾਓ ਜਾਂ ਕੋਈ ਮੁੱਲ ਲਿਖੋ।",bho:"देखीं कि मानल रिटर्न दर पर नियमित भा एकमुश्त निवेश समय के साथे कइसे बढ़ सकेला। स्लाइडर खिसकाईं भा कवनो मान लिखीं।"},
"SIP calculator":{hi:"SIP कैलकुलेटर",pa:"SIP ਕੈਲਕੁਲੇਟਰ",bho:"SIP कैलकुलेटर"},
"Lumpsum calculator":{hi:"एकमुश्त निवेश कैलकुलेटर",pa:"ਇੱਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਕੈਲਕੁਲੇਟਰ",bho:"एकमुश्त निवेश कैलकुलेटर"},
"A Systematic Investment Plan (SIP) invests a fixed amount every month. Add an annual step-up to see the effect of increasing your SIP as your income grows.":{hi:"सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) में हर महीने एक तय राशि निवेश होती है। आय बढ़ने के साथ SIP बढ़ाने का असर देखने के लिए वार्षिक स्टेप-अप जोड़ें।",pa:"ਸਿਸਟਮੈਟਿਕ ਇਨਵੈਸਟਮੈਂਟ ਪਲਾਨ (SIP) ਵਿੱਚ ਹਰ ਮਹੀਨੇ ਇੱਕ ਤੈਅ ਰਕਮ ਨਿਵੇਸ਼ ਹੁੰਦੀ ਹੈ। ਆਮਦਨ ਵਧਣ ਨਾਲ SIP ਵਧਾਉਣ ਦਾ ਅਸਰ ਦੇਖਣ ਲਈ ਸਾਲਾਨਾ ਸਟੈੱਪ-ਅੱਪ ਜੋੜੋ।",bho:"सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) में हर महीना एगो तय रकम निवेश होला। कमाई बढ़े के साथे SIP बढ़ावे के असर देखे खातिर सालाना स्टेप-अप जोड़ीं।"},
"Estimate the value of a one-time investment over your chosen time period.":{hi:"अपनी चुनी हुई अवधि में एकमुश्त निवेश के मूल्य का अनुमान लगाएँ।",pa:"ਆਪਣੀ ਚੁਣੀ ਹੋਈ ਮਿਆਦ ਵਿੱਚ ਇੱਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਦੇ ਮੁੱਲ ਦਾ ਅਨੁਮਾਨ ਲਗਾਓ।",bho:"आपन चुनल अवधि में एकमुश्त निवेश के मूल्य के अनुमान लगाईं।"},
"How these numbers are calculated:":{hi:"ये आँकड़े कैसे निकाले जाते हैं:",pa:"ਇਹ ਅੰਕੜੇ ਕਿਵੇਂ ਕੱਢੇ ਜਾਂਦੇ ਹਨ:",bho:"ई आँकड़ा कइसे निकालल जाला:"},
"SIP values assume monthly investments at the start of each month, compounded monthly at (annual rate ÷ 12). Lumpsum values compound annually. Taxes, exit loads and expense ratios are not included.":{hi:"SIP मूल्य यह मानकर निकाले जाते हैं कि निवेश हर महीने की शुरुआत में होता है और (वार्षिक दर ÷ 12) पर मासिक चक्रवृद्धि होती है। एकमुश्त मूल्य पर वार्षिक चक्रवृद्धि होती है। टैक्स, एग्ज़िट लोड और एक्सपेंस रेशियो शामिल नहीं हैं।",pa:"SIP ਮੁੱਲ ਇਹ ਮੰਨ ਕੇ ਕੱਢੇ ਜਾਂਦੇ ਹਨ ਕਿ ਨਿਵੇਸ਼ ਹਰ ਮਹੀਨੇ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ ਅਤੇ (ਸਾਲਾਨਾ ਦਰ ÷ 12) 'ਤੇ ਮਹੀਨਾਵਾਰ ਮਿਸ਼ਰਿਤ ਹੁੰਦਾ ਹੈ। ਇੱਕਮੁਸ਼ਤ ਮੁੱਲ ਸਾਲਾਨਾ ਮਿਸ਼ਰਿਤ ਹੁੰਦਾ ਹੈ। ਟੈਕਸ, ਐਗਜ਼ਿਟ ਲੋਡ ਅਤੇ ਐਕਸਪੈਂਸ ਰੇਸ਼ੋ ਸ਼ਾਮਲ ਨਹੀਂ ਹਨ।"},
"These calculators are for illustration and education only. The assumed rate of return is not guaranteed and does not represent the performance of any scheme.":{hi:"ये कैलकुलेटर केवल उदाहरण और शिक्षा के लिए हैं। मानी गई रिटर्न दर की गारंटी नहीं है और यह किसी योजना के प्रदर्शन को नहीं दर्शाती।",pa:"ਇਹ ਕੈਲਕੁਲੇਟਰ ਸਿਰਫ਼ ਉਦਾਹਰਣ ਅਤੇ ਸਿੱਖਿਆ ਲਈ ਹਨ। ਮੰਨੀ ਗਈ ਰਿਟਰਨ ਦਰ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਹੈ ਅਤੇ ਇਹ ਕਿਸੇ ਸਕੀਮ ਦੇ ਪ੍ਰਦਰਸ਼ਨ ਨੂੰ ਨਹੀਂ ਦਰਸਾਉਂਦੀ।"},
/* attributes (placeholders / screen-reader labels) */
"Search articles — e.g. ELSS, SIP, NAV, exit load…":{hi:"लेख खोजें — जैसे ELSS, SIP, NAV, एग्ज़िट लोड…",pa:"ਲੇਖ ਖੋਜੋ — ਜਿਵੇਂ ELSS, SIP, NAV, ਐਗਜ਼ਿਟ ਲੋਡ…",bho:"लेख खोजीं — जइसे ELSS, SIP, NAV, एग्जिट लोड…"},
"Search articles":{hi:"लेख खोजें",pa:"ਲੇਖ ਖੋਜੋ",bho:"लेख खोजीं"},
"Toggle dark mode":{hi:"डार्क मोड बदलें",pa:"ਡਾਰਕ ਮੋਡ ਬਦਲੋ",bho:"डार्क मोड बदलीं"},
"Open menu":{hi:"मेन्यू खोलें",pa:"ਮੀਨੂ ਖੋਲ੍ਹੋ",bho:"मेन्यू खोलीं"},
"Back to top":{hi:"ऊपर जाएँ",pa:"ਉੱਪਰ ਜਾਓ",bho:"ऊपर जाईं"},
"Chat on WhatsApp":{hi:"WhatsApp पर बात करें",pa:"WhatsApp 'ਤੇ ਗੱਲ ਕਰੋ",bho:"WhatsApp पर बात करीं"}
};

/* Messages used by the language system itself ({L} = language name) */
var S = {
  en:{lang:'Language',pageEn:'This page is available in English only for now. The English text is the official version.',gtRead:'Read with Google Translate ↗',title:'Choose your language',sub:'You can change this any time using the 🌐 button at the top.',other:'Other languages (auto-translate)',go:'Translate',otherNote:'Translated automatically by Google. Finance terms may not be exact — the English version is authoritative.',avail:'This article is also available in {L}.',read:'Read in {L} →',onlyIn:'This article is currently available in {L} only.',none:'No articles in {L} here yet — showing English articles for now.',more:'Load more articles',trBar:'This page is auto-translated from English. Finance terms may not be exact.',trOff:'Show original'},
  hi:{lang:'भाषा',pageEn:'यह पेज अभी केवल अंग्रेज़ी में उपलब्ध है। अंग्रेज़ी संस्करण ही आधिकारिक है।',gtRead:'Google अनुवाद से पढ़ें ↗',title:'अपनी भाषा चुनें',sub:'आप इसे कभी भी ऊपर दिए 🌐 बटन से बदल सकते हैं।',avail:'यह लेख हिन्दी में भी उपलब्ध है।',read:'हिन्दी में पढ़ें →',onlyIn:'यह लेख अभी केवल {L} में उपलब्ध है।',none:'यहाँ अभी हिन्दी में लेख नहीं हैं — फ़िलहाल अंग्रेज़ी लेख दिखाए जा रहे हैं।',more:'और लेख देखें'},
  pa:{lang:'ਭਾਸ਼ਾ',pageEn:'ਇਹ ਪੰਨਾ ਹਾਲੇ ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਉਪਲਬਧ ਹੈ। ਅੰਗਰੇਜ਼ੀ ਸੰਸਕਰਣ ਹੀ ਅਧਿਕਾਰਤ ਹੈ।',gtRead:'Google ਅਨੁਵਾਦ ਨਾਲ ਪੜ੍ਹੋ ↗',title:'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',sub:'ਤੁਸੀਂ ਇਸਨੂੰ ਕਦੇ ਵੀ ਉੱਪਰ ਦਿੱਤੇ 🌐 ਬਟਨ ਨਾਲ ਬਦਲ ਸਕਦੇ ਹੋ।',avail:'ਇਹ ਲੇਖ ਪੰਜਾਬੀ ਵਿੱਚ ਵੀ ਉਪਲਬਧ ਹੈ।',read:'ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ →',onlyIn:'ਇਹ ਲੇਖ ਹਾਲੇ ਸਿਰਫ਼ {L} ਵਿੱਚ ਉਪਲਬਧ ਹੈ।',none:'ਇੱਥੇ ਹਾਲੇ ਪੰਜਾਬੀ ਵਿੱਚ ਲੇਖ ਨਹੀਂ ਹਨ — ਫ਼ਿਲਹਾਲ ਅੰਗਰੇਜ਼ੀ ਲੇਖ ਦਿਖਾਏ ਜਾ ਰਹੇ ਹਨ।',more:'ਹੋਰ ਲੇਖ ਦੇਖੋ'},
  bho:{lang:'भाषा',pageEn:'ई पेज अभी खाली अंग्रेजी में बा। अंग्रेजी वाला संस्करण ही आधिकारिक बा।',gtRead:'Google अनुवाद से पढ़ीं ↗',title:'आपन भाषा चुनीं',sub:'रउआ एकरा के कबहूँ ऊपर दिहल 🌐 बटन से बदल सकीले।',avail:'ई लेख भोजपुरी में भी बा।',read:'भोजपुरी में पढ़ीं →',onlyIn:'ई लेख अभी खाली {L} में बा।',none:'इहाँ अभी भोजपुरी में लेख नइखे — फिलहाल अंग्रेजी लेख देखावल जात बा।',more:'अउर लेख देखीं'}
};
var LANG_IN = { // language names as written inside each UI language (for "only in {L}")
  en:{en:'English',hi:'Hindi',pa:'Punjabi',bho:'Bhojpuri'},
  hi:{en:'अंग्रेज़ी',hi:'हिन्दी',pa:'पंजाबी',bho:'भोजपुरी'},
  pa:{en:'ਅੰਗਰੇਜ਼ੀ',hi:'ਹਿੰਦੀ',pa:'ਪੰਜਾਬੀ',bho:'ਭੋਜਪੁਰੀ'},
  bho:{en:'अंग्रेजी',hi:'हिन्दी',pa:'पंजाबी',bho:'भोजपुरी'}
};
var MIN_READ = {hi:'{n} मिनट में पढ़ें',pa:'{n} ਮਿੰਟ ਦਾ ਪਾਠ',bho:'{n} मिनट में पढ़ीं'};
var NUM_WORDS ={hi:{Lakh:'लाख',Crore:'करोड़'},pa:{Lakh:'ਲੱਖ',Crore:'ਕਰੋੜ'},bho:{Lakh:'लाख',Crore:'करोड़'}};

/* ------------------------------------------------------------------
   3. STATE
   ------------------------------------------------------------------ */
var KEY='ns-lang', doc=document, html=doc.documentElement, body=doc.body;
function getPref(){ try{return localStorage.getItem(KEY);}catch(e){return null;} }
function setPref(v){ try{localStorage.setItem(KEY,v);}catch(e){} }
var pref = getPref();
var trCode = pref && pref.indexOf('tr:')===0 ? pref.slice(3) : null;
var lang = (pref && LANGS[pref]) ? pref : 'en';           // language for UI + posts
var isBot = /bot|crawl|spider|slurp|lighthouse|headless|google|bing|yandex|baidu|facebookexternalhit|whatsapp/i.test(navigator.userAgent);

function s(k){ var o=S[lang]||S.en; return (o[k]!=null?o[k]:S.en[k]); }
function fill(str,l){ return str.replace(/\{L\}/g,(LANG_IN[lang]||LANG_IN.en)[l]||LANGS[l].name); }
function tr(text){ var e=T[text]; if(!e||lang==='en')return null; return e[lang]||(lang==='bho'?e.hi:null)||null; }
function esc(t){ return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function unpend(){ html.className=html.className.replace(/\s*ns-lang-pending/g,''); }

/* ------------------------------------------------------------------
   4. TRANSLATE THE SITE'S OWN TEXT
   ------------------------------------------------------------------ */
var isArticle = body.classList.contains('is-post');
function skipNode(el){
  // article titles and bodies are written by hand in each language (a calculator inside an article is still translated);
  // page headings ("About", "Contact"…) are translated
  return !el || !!el.closest('script,style,textarea,.ns-lang-ov,.ns-lang-btn,.ns-card__title,.ns-card__excerpt,#PopularPosts1 .post-title'+(isArticle?',.ns-crumbs__cur,.ns-article__title,.post-title':''))
    || (isArticle && !!el.closest('.post-body') && !el.closest('.ns-calc'));
}
function translateTree(root){
  if(lang==='en') return;
  var w=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), n, list=[];
  while((n=w.nextNode())) list.push(n);
  list.forEach(function(n){
    var raw=n.nodeValue, t=raw.trim(); if(!t||skipNode(n.parentElement)) return;
    var x=tr(t);
    if(x){ n.nodeValue=raw.replace(t,x); return; }
    var mr=t.match(/^(\d+) min read$/);
    if(mr && MIN_READ[lang]){ n.nodeValue=raw.replace(t,MIN_READ[lang].replace('{n}',mr[1])); return; }
    if(NUM_WORDS[lang] && /(Lakh|Crore)$/.test(t) && n.parentElement.closest('.ns-calc')){
      n.nodeValue=raw.replace(/Lakh|Crore/,function(m){return NUM_WORDS[lang][m];});
    }
  });
  root.querySelectorAll && root.querySelectorAll('[placeholder],[aria-label],[title],input[type=button],input[type=submit]').forEach(function(el){
    if(el.closest('.ns-lang-ov')) return;
    ['placeholder','aria-label','title','value'].forEach(function(a){
      if(a==='value' && !/^(button|submit)$/.test(el.type)) return;
      var v=el.getAttribute(a); if(!v) return; var x=tr(v.trim()); if(x) el.setAttribute(a,x);
    });
  });
}
function localDates(root){
  var loc=(LANGS[lang]||LANGS.en).locale;
  (root||doc).querySelectorAll('time[datetime]').forEach(function(t){
    if(t.dataset.nsDone) return; var d=new Date(t.getAttribute('datetime')); if(isNaN(d)) return;
    try{ t.textContent=d.toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'}); }catch(e){}
    t.dataset.nsDone='1';
  });
}

/* Static pages: show only the block for the chosen language
   <div data-ns-lang="en">…</div> <div data-ns-lang="hi">…</div> */
function langBlocks(){
  var blocks=doc.querySelectorAll('[data-ns-lang]'), slot=doc.querySelector('[data-ns-page]');
  if(!blocks.length){ if(slot) pageOnlyEn(slot); return; }
  var has={}; blocks.forEach(function(b){ has[b.getAttribute('data-ns-lang')]=1; });
  var show = has[lang] ? lang : 'en';
  blocks.forEach(function(b){ var l=b.getAttribute('data-ns-lang'); b.hidden = (l!==show); if(l===show && LANGS[l]) b.setAttribute('lang',LANGS[l].html); });
  if(show!==lang) pageOnlyEn(blocks[0]);
}
/* A page from GitHub with no text in the reader's language: say so (in their language) and offer Google's translation */
function pageOnlyEn(at){
  if(lang==='en' || trCode || doc.querySelector('.ns-lang-banner')) return;
  var b=doc.createElement('div'); b.className='ns-lang-banner'; b.setAttribute('role','note');
  b.innerHTML='<span>'+esc(s('pageEn'))+'</span><a href="https://translate.google.com/translate?sl=en&amp;tl='+lang+'&amp;u='+encodeURIComponent(location.href)+'" target="_blank" rel="noopener">'+esc(s('gtRead'))+'</a>';
  at.parentNode.insertBefore(b,at);
}

/* Article images: show banners at full width (sharp WebP from Blogger),
   load the top banner first, and give every image a description (alt text). */
function fixPostImages(){
  var pb=doc.querySelector('.post-body'); if(!pb) return;
  var tEl=doc.querySelector('.ns-article__title, .post-title');
  var title=((tEl&&tEl.textContent)||doc.title.split('|')[0]).replace(/\s+/g,' ').trim();
  [].forEach.call(pb.querySelectorAll('img'),function(img,i){
    var src=img.getAttribute('src')||'';
    var ow0=+img.getAttribute('data-original-width')||+img.getAttribute('width')||0, oh0=+img.getAttribute('data-original-height')||+img.getAttribute('height')||0;
    var sizedByAuthor=/(^|;)\s*(max-)?width\s*:/i.test(img.getAttribute('style')||'');   // e.g. a profile photo set to 220px
    var isBanner=isArticle && !sizedByAuthor && (!ow0 || !oh0 || ow0>=oh0*1.2);         // only wide images inside articles
    if(isBanner && /googleusercontent\.com|bp\.blogspot\.com/.test(src)){
      var pathSize=/\/(s\d+|w\d+(-h\d+)?)(-[a-z0-9-]+)?\//, tailSize=/=(s\d+|w\d+(-h\d+)?)(-[a-z0-9-]+)?$/;
      var at=function(sz){ return pathSize.test(src)?src.replace(pathSize,'/'+sz+'/'):(tailSize.test(src)?src.replace(tailSize,'='+sz):src); };
      if(at('s1200-rw')!==src){
        img.setAttribute('srcset',at('s800-rw')+' 800w, '+at('s1200-rw')+' 1200w');
        img.setAttribute('sizes','(max-width: 900px) 100vw, 840px');
        img.setAttribute('src',at('s1200-rw'));
      }
      var ow=+img.getAttribute('data-original-width'), oh=+img.getAttribute('data-original-height');
      if(ow&&oh) img.style.aspectRatio=ow+' / '+oh;
      img.removeAttribute('width'); img.removeAttribute('height');
      img.style.width='100%'; img.style.height='auto';
      var a=img.parentNode; if(a&&a.tagName==='A'){ a.style.padding='0'; a.style.margin='0'; }
      var sep=img.closest('.separator'); if(sep){ sep.style.margin='0 0 1.4em'; sep.style.textAlign='center'; }
    }
    if(!(img.getAttribute('alt')||'').trim() && title) img.setAttribute('alt', i===0 ? title+' – Nivesh Sahayak' : title);
    if(i===0 && isBanner){ img.setAttribute('loading','eager'); img.setAttribute('fetchpriority','high'); }
  });
}

/* 404 page: no sidebar, a search box and topic links, a clear tab title */
var TOPICS=['Mutual Fund Basics','SIP','Tax Saving','Goal Planning','Debt Funds','Investor Awareness'];
function enhance404(){
  var box=doc.querySelector('.ns-404'); if(!box) return;
  body.classList.add('is-404');
  var h=box.querySelector('h1'); if(h) h.textContent="Sorry, we couldn't find this page.";
  doc.title=(tr('Page not found')||'Page not found')+' | Nivesh Sahayak';
  var ph='Search articles — e.g. ELSS, SIP, NAV, exit load…';
  box.insertAdjacentHTML('beforeend',
    '<div class="ns-404__more">'+
      '<p class="ns-404__label">Try searching</p>'+
      '<form class="ns-404__search" action="/search" method="get" role="search">'+
        '<input type="search" name="q" placeholder="'+esc(ph)+'" aria-label="Search articles"/>'+
        '<button class="ns-btn" type="submit">Search</button></form>'+
      '<p class="ns-404__label">Or explore a topic</p>'+
      '<div class="ns-404__topics">'+TOPICS.map(function(t){ return '<a class="ns-chip" href="/search/label/'+encodeURIComponent(t)+'">'+esc(t)+'</a>'; }).join('')+'</div>'+
    '</div>');
}

/* Popular Posts: full-width banner, title underneath, rank number */
function stylePopular(){
  var w=doc.querySelector('#PopularPosts1'); if(!w) return;
  w.classList.add('ns-pop');
  [].forEach.call(w.querySelectorAll('article.post, li'),function(it){
    var title=it.querySelector('.post-title, .item-title'), th=it.querySelector('.item-thumbnail');
    var tText=title?title.textContent.replace(/\s+/g,' ').trim():'';
    if(th){
      var img=th.querySelector('img');
      if(img){
        var src=img.getAttribute('src')||'';
        var big=src.replace(/\/(s\d+|w\d+(-h\d+)?)(-[a-z0-9-]+)?\//,'/w640-h360-p-k-no-nu-rw/').replace(/=(s\d+|w\d+(-h\d+)?)(-[a-z0-9-]+)?$/,'=w640-h360-p-k-no-nu-rw');
        img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.removeAttribute('width'); img.removeAttribute('height');
        img.setAttribute('src',big); img.setAttribute('loading','lazy');
        img.setAttribute('alt',tText);
      }
      if(title && th.nextElementSibling!==title) th.parentNode.insertBefore(th,title);   // banner above the title
      if(!th.querySelector('.ns-pop__n')) th.insertAdjacentHTML('beforeend','<span class="ns-pop__n" aria-hidden="true"></span>');
    } else if(title && !title.querySelector('.ns-pop__n')){
      title.insertAdjacentHTML('afterbegin','<span class="ns-pop__n ns-pop__n--inline" aria-hidden="true"></span>');
    }
  });
  rankPopular();
}
function rankPopular(){
  var n=0;
  [].forEach.call(doc.querySelectorAll('#PopularPosts1 article.post, #PopularPosts1 li'),function(it){
    if(it.style.display==='none') return;
    var b=it.querySelector('.ns-pop__n'); if(b) b.textContent=++n;
  });
}

/* ------------------------------------------------------------------
   5. POST INDEX (from the blog feed) — which post is in which language
   ------------------------------------------------------------------ */
function postLangOf(cats){ for(var i=0;i<cats.length;i++){ if(cats[i].indexOf(LANG_PREFIX)===0){ var l=cats[i].slice(LANG_PREFIX.length); if(LANGS[l]) return l; } } return 'en'; }
function topicsOf(cats){ return cats.filter(function(c){ return c.indexOf(LANG_PREFIX)!==0 && c.indexOf(PAIR_PREFIX)!==0; }); }
function pairOf(cats){ for(var i=0;i<cats.length;i++) if(cats[i].indexOf(PAIR_PREFIX)===0) return cats[i]; return null; }
function normUrl(u){ return (u||'').replace(/^https?:\/\/[^/]+/,'').replace(/[?#].*$/,'').replace(/\.html.*$/,'.html'); }

function loadIndex(){
  var CK='ns-lang-index-v2';
  try{ var c=JSON.parse(sessionStorage.getItem(CK)||'null'); if(c && Date.now()-c.t<600000) return Promise.resolve(c.p); }catch(e){}
  var all=[];
  function page(start){
    return fetch('/feeds/posts/summary?alt=json&max-results=150&start-index='+start).then(function(r){return r.json();}).then(function(j){
      var es=(j.feed&&j.feed.entry)||[];
      es.forEach(function(e){
        var link=(e.link||[]).filter(function(l){return l.rel==='alternate';})[0];
        var cats=(e.category||[]).map(function(c){return c.term;});
        var sum=((e.summary&&e.summary.$t)||'').replace(/\s+/g,' ').trim();
        all.push({u:link?link.href:'',t:e.title.$t,s:sum.length>160?sum.slice(0,157).replace(/\s+\S*$/,'')+'…':sum,
                  d:e.published.$t,up:(e.updated&&e.updated.$t)||e.published.$t,c:cats,l:postLangOf(cats),p:pairOf(cats),tp:topicsOf(cats),
                  i:e.media$thumbnail?e.media$thumbnail.url.replace(/\/s72(-[a-z]+)?\//,'/w640-h360-c/').replace(/=s72(-[a-z]+)?$/,'=w640-h360-c'):''});
      });
      return (es.length===150 && start<600) ? page(start+150) : all;
    });
  }
  return page(1).then(function(p){ try{sessionStorage.setItem(CK,JSON.stringify({t:Date.now(),p:p}));}catch(e){} return p; });
}

/* ------------------------------------------------------------------
   6. POST LISTS — home & topic pages show only the chosen language
   ------------------------------------------------------------------ */
var cardTpl=null;
function cardHTML(p){
  var topic=p.tp[0]||'', topicTxt=tr(topic)||topic, loc=(LANGS[lang]||LANGS.en).locale, date='';
  try{ date=new Date(p.d).toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'}); }catch(e){}
  var media = p.i ? '<img src="'+esc(p.i)+'" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"/>' : (cardTpl&&cardTpl.ph||'');
  return '<article class="ns-card" lang="'+LANGS[p.l].html+'">'+
    '<a class="ns-card__media" href="'+esc(p.u)+'" tabindex="-1">'+media+'</a>'+
    '<div class="ns-card__body">'+
      (topic?'<a class="ns-chip" href="/search/label/'+encodeURIComponent(topic)+'">'+esc(topicTxt)+'</a>':'')+
      '<h3 class="ns-card__title"><a href="'+esc(p.u)+'">'+esc(p.t)+'</a></h3>'+
      '<p class="ns-card__excerpt">'+esc(p.s)+'</p>'+
      '<div class="ns-meta"><time datetime="'+esc(p.d)+'" data-ns-done="1">'+esc(date)+'</time><span class="ns-more">'+esc(tr('Read →')||'Read →')+'</span></div>'+
    '</div></article>';
}
function renderList(grid,posts,noteHtml){
  var pager=doc.querySelector('#Blog1 .ns-pager'), shown=0;
  // the note sits ABOVE the grid, so the theme's big "featured" first card still works
  var oldNote=grid.parentNode.querySelector('.ns-lang-note'); if(oldNote) oldNote.remove();
  if(noteHtml) grid.insertAdjacentHTML('beforebegin',noteHtml);
  grid.innerHTML='';
  if(pager) pager.innerHTML='';
  function more(){
    var chunk=posts.slice(shown,shown+PAGE_SIZE); shown+=chunk.length;
    grid.insertAdjacentHTML('beforeend',chunk.map(cardHTML).join(''));
    if(pager){
      pager.innerHTML='';
      if(shown<posts.length){
        var b=doc.createElement('button'); b.type='button'; b.className='ns-btn ns-btn--ghost'; b.textContent=s('more');
        b.onclick=more; var wrap=doc.createElement('div'); wrap.className='ns-lang-loadmore'; wrap.appendChild(b); pager.appendChild(wrap);
      }
    }
  }
  more();
}
function filterLists(idx){
  var grid=doc.querySelector('#Blog1 .ns-grid'); if(!grid) return;
  var first=grid.querySelector('.ns-card .ns-card__ph');
  cardTpl={ph:first?first.outerHTML:''};
  var path=decodeURIComponent(location.pathname), q=location.search;
  var isHome = path==='/' && !/[?&](q|updated-max|updated-min)=/.test(q);
  var labelM = path.match(/^\/search\/label\/(.+)$/);
  var scope=null;
  if(isHome) scope=idx;
  else if(labelM){ var lab=labelM[1]; scope=idx.filter(function(p){return p.c.indexOf(lab)>-1;}); }
  if(scope){
    var mine=scope.filter(function(p){return p.l===lang;});
    if(mine.length) renderList(grid,mine);
    else{
      var en=scope.filter(function(p){return p.l==='en';});
      renderList(grid, en.length?en:scope, lang==='en'?'':'<p class="ns-lang-note">'+esc(fill(s('none'),lang))+'</p>');
    }
  } else {
    // search results / archives: hide other-language cards (keep all if none match)
    var cards=[].slice.call(grid.querySelectorAll('.ns-card')), byUrl={};
    idx.forEach(function(p){ byUrl[normUrl(p.u)]=p; });
    var keep=cards.filter(function(c){ var a=c.querySelector('.ns-card__title a'); var p=a&&byUrl[normUrl(a.href)]; return !p||p.l===lang; });
    if(keep.length) cards.forEach(function(c){ if(keep.indexOf(c)<0) c.style.display='none'; });
  }
}
// Popular posts widget (home, topic pages AND article pages)
function filterPopular(idx){
  var byU={}; idx.forEach(function(p){ byU[normUrl(p.u)]=p; });
  var pops=[].slice.call(doc.querySelectorAll('#PopularPosts1 article, #PopularPosts1 li'));
  // a popular post written in another language points to its version in the reader's language, when there is one
  if(lang!=='en') pops.forEach(function(a){
    var l=a.querySelector('a'), p=l&&byU[normUrl(l.href)]; if(!p||p.l===lang||!p.p) return;
    var twin=idx.filter(function(x){ return x.p===p.p && x.l===lang; })[0]; if(!twin) return;
    [].forEach.call(a.querySelectorAll('a[href]'),function(x){ if(normUrl(x.href)===normUrl(p.u)) x.href=twin.u; });
    var t=a.querySelector('.post-title a, .item-title a, .post-title'); if(t) t.textContent=twin.t;
    var img=a.querySelector('img'); if(img) img.alt=twin.t;
    var sn=a.querySelector('.snippet-item, .item-snippet, .post-snippet'); if(sn) sn.textContent=twin.s;
    a.setAttribute('lang',LANGS[lang].html);
  });
  var seen={}, popKeep=pops.filter(function(a){
    var l=a.querySelector('a'), u=l&&normUrl(l.href), p=u&&byU[u];
    if(p && (p.l!==lang || seen[u])) return false;   // other language, or a second card for the same article
    if(u) seen[u]=1; return true;
  });
  if(popKeep.length) pops.forEach(function(a){ if(popKeep.indexOf(a)<0) a.style.display='none'; });
}

/* ------------------------------------------------------------------
   7. ARTICLE PAGES — link to the reader's language version
   ------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   SEO — structured data (JSON-LD), language links, clear page titles
   Google reads these after rendering the page.
   ------------------------------------------------------------------ */
var SITE='Nivesh Sahayak', ORIGIN=location.protocol+'//'+location.host;
var HREFLANG={en:'en',hi:'hi',pa:'pa',bho:'bho'};
function addLd(obj){ var sc=doc.createElement('script'); sc.type='application/ld+json'; sc.text=JSON.stringify(obj); doc.head.appendChild(sc); }
function metaContent(sel){ var m=doc.querySelector(sel); return m?(m.getAttribute('content')||'').trim():''; }
function socialLinks(){
  var seen={}, out=[];
  [].forEach.call(doc.querySelectorAll('.ns-footer a[href], .ns-social a[href]'),function(a){
    var h=a.getAttribute('href')||''; if(/instagram\.com|facebook\.com|linkedin\.com|x\.com|twitter\.com|youtube\.com/.test(h) && !seen[h]){ seen[h]=1; out.push(h); }
  });
  return out;
}
function author(){ return {'@type':'Person','name':'Love Rai','jobTitle':'AMFI Registered Mutual Fund Distributor (ARN-354017)','url':ORIGIN+'/p/about.html','sameAs':socialLinks()}; }
function seoArticle(idx,me){
  var canon=(doc.querySelector('link[rel=canonical]')||{}).href||me.u;
  var firstP=doc.querySelector('.post-body > p');
  var desc=metaContent('meta[name=description]')||(firstP?firstP.textContent.replace(/\s+/g,' ').trim().slice(0,200):'');
  var img=metaContent('meta[property="og:image"]').replace(/\/(s\d+|w\d+(-h\d+)?)(-[a-z0-9-]+)?\//,'/s1200/');
  var sibs=me.p?idx.filter(function(p){return p.p===me.p;}):[me];
  var en=sibs.filter(function(p){return p.l==='en';})[0];
  var art={'@context':'https://schema.org','@type':'BlogPosting','mainEntityOfPage':{'@type':'WebPage','@id':canon},
    'headline':me.t,'description':desc,'inLanguage':HREFLANG[me.l],'datePublished':me.d,'dateModified':me.up||me.d,
    'author':author(),'publisher':{'@type':'Organization','name':SITE,'url':ORIGIN+'/'},'isAccessibleForFree':true};
  if(img) art.image=[img];
  if(me.tp[0]) art.articleSection=me.tp[0];
  if(me.l!=='en' && en) art.translationOfWork={'@id':en.u};
  if(me.l==='en' && sibs.length>1) art.workTranslation=sibs.filter(function(p){return p!==me;}).map(function(p){return {'@id':p.u};});
  addLd(art);
  var crumbs=[{'@type':'ListItem','position':1,'name':'Home','item':ORIGIN+'/'}];
  if(me.tp[0]) crumbs.push({'@type':'ListItem','position':2,'name':me.tp[0],'item':ORIGIN+'/search/label/'+encodeURIComponent(me.tp[0])});
  crumbs.push({'@type':'ListItem','position':crumbs.length+1,'name':me.t,'item':canon});
  addLd({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':crumbs});
  // tell search engines which posts are translations of each other
  if(sibs.length>1 && !doc.querySelector('link[hreflang]')){
    sibs.forEach(function(p){ var l=doc.createElement('link'); l.rel='alternate'; l.hreflang=HREFLANG[p.l]; l.href=p.u; doc.head.appendChild(l); });
    if(en){ var x=doc.createElement('link'); x.rel='alternate'; x.hreflang='x-default'; x.href=en.u; doc.head.appendChild(x); }
  }
}
/* Local business details (home, About and Contact pages) */
function seoBusiness(){
  var CFG=window.NS_CONFIG||{};   // phone and email come from the theme settings, not from this public file
  var path=location.pathname;
  if(!(body.classList.contains('is-home') || /\/p\/(about|contact|services)\.html$/.test(path))) return;
  addLd({'@context':'https://schema.org','@type':'FinancialService','name':SITE+' — Love Rai, Mutual Fund Distributor','url':ORIGIN+'/',
    'description':'Investor education and mutual fund distribution by Love Rai, AMFI Registered Mutual Fund Distributor (ARN-354017), plus Excel toolkits, Windows software and website design.',
    'telephone':CFG.whatsapp?'+'+CFG.whatsapp:undefined,'email':CFG.email||undefined,
    'address':{'@type':'PostalAddress','streetAddress':'Sua Road','addressLocality':'Ludhiana','addressRegion':'Punjab','postalCode':'141010','addressCountry':'IN'},
    'areaServed':'IN','openingHoursSpecification':[{'@type':'OpeningHoursSpecification','dayOfWeek':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'opens':'10:00','closes':'18:00'}],
    'founder':author(),'sameAs':socialLinks(),
    'hasOfferCatalog':{'@type':'OfferCatalog','name':'Services','itemListElement':[
      ['Mutual fund distribution','KYC, account opening, SIPs, nominations and service requests (ARN-354017).'],
      ['Excel toolkits','Ready-made and custom Excel workbooks for accounting, billing, registers and reports.'],
      ['Windows software','Signed PowerShell-based Windows utilities such as DeskOrg.'],
      ['Website design and development','Custom Blogger themes, SEO, AdSense and multi-language websites.']
    ].map(function(x){ return {'@type':'Offer','itemOffered':{'@type':'Service','name':x[0],'description':x[1],'url':ORIGIN+'/p/services.html'}}; })}});
}
/* Clear titles for topic and search pages (instead of "Nivesh Sahayak | Nivesh Sahayak") */
function seoTitles(){
  var path=decodeURIComponent(location.pathname), m=path.match(/^\/search\/label\/(.+)$/), q=(location.search.match(/[?&]q=([^&]*)/)||[])[1];
  if(m && !/^(lang|pair)-/.test(m[1])) doc.title=(tr(m[1])||m[1])+' | '+SITE;
  else if(q) doc.title='“'+decodeURIComponent(q.replace(/\+/g,' '))+'” — '+(tr('Search results')||'Search results')+' | '+SITE;
  else if(body.classList.contains('is-page')){ var pt=doc.title.split(' | '), x=tr(pt[0].trim()); if(x){ pt[0]=x; doc.title=pt.join(' | '); } }
}

function articleExtras(idx){
  if(!isArticle) return;
  var here=normUrl(location.href), me=null;
  idx.forEach(function(p){ if(normUrl(p.u)===here) me=p; });
  if(!me) return;
  var prose=doc.querySelector('.post-body'), title=doc.querySelector('.ns-article__title');
  [prose,title].forEach(function(el){ if(el) el.setAttribute('lang',LANGS[me.l].html); });
  // breadcrumb should show the topic, never the language label
  var crumb=doc.querySelector('.ns-crumbs a[href*="/search/label/"]');
  if(crumb && me.tp[0] && /\/label\/(lang|pair)-/.test(crumb.getAttribute('href'))){
    crumb.href='/search/label/'+encodeURIComponent(me.tp[0]); crumb.textContent=tr(me.tp[0])||me.tp[0]; crumb.style.display='';
  }
  // prev/next article links stay within the same language
  var same=idx.filter(function(p){return p.l===me.l;}), i=same.indexOf(me);
  var older=doc.querySelector('.ns-pager__older'), newer=doc.querySelector('.ns-pager__newer');
  if(older){ if(same[i+1]) older.href=same[i+1].u; else older.style.display='none'; }
  if(newer){ if(same[i-1]) newer.href=same[i-1].u; else newer.style.display='none'; }
  seoArticle(idx,me);
  // banner
  if(me.l===lang || trCode) return;
  var head=doc.querySelector('.ns-article__head')||title; if(!head) return;
  var twin = me.p ? idx.filter(function(p){return p.p===me.p && p.l===lang;})[0] : null;
  var b=doc.createElement('div'); b.className='ns-lang-banner'; b.setAttribute('role','note');
  if(twin) b.innerHTML='<span>'+esc(fill(s('avail'),lang))+'</span><a href="'+esc(twin.u)+'" lang="'+LANGS[lang].html+'">'+esc(fill(s('read'),lang))+'</a>';
  else b.innerHTML='<span>'+esc(fill(s('onlyIn'),me.l))+'</span>';
  head.parentNode.insertBefore(b,head);
}

/* ------------------------------------------------------------------
   8. LANGUAGE PICKER (popup + header button)
   ------------------------------------------------------------------ */
var GLOBE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
function choose(v){
  var old=getPref(); setPref(v);
  if(v.indexOf('tr:')!==0) clearGT(); else setGT(v.slice(3));
  if(old!==v || v.indexOf('tr:')===0) location.reload(); else closePicker();
}
var ov=null, lastFocus=null;
function closePicker(){ if(ov){ ov.remove(); ov=null; doc.removeEventListener('keydown',onKey); if(lastFocus) lastFocus.focus(); } }
function onKey(e){ if(e.key==='Escape') laterPicker(); }
// closing the first-visit picker without choosing: keep the page as it is and don't ask again on every page
function laterPicker(){ try{ localStorage.setItem('ns-lang-later','1'); }catch(e){} closePicker(); }
function openPicker(first){
  if(ov) return; lastFocus=doc.activeElement;
  var cur = getPref() || suggest();
  ov=doc.createElement('div'); ov.className='ns-lang-ov notranslate'; ov.setAttribute('translate','no');
  var opts=Object.keys(LANGS).map(function(k){
    var L=LANGS[k]; return '<button type="button" class="ns-lang-opt" data-l="'+k+'" lang="'+L.html+'" aria-pressed="'+(cur===k)+'"><b>'+L.native+'</b><small>'+(k==='en'?'Default':L.name)+'</small></button>';
  }).join('');
  var sel=TRANSLATE.map(function(t){ return '<option value="'+t[0]+'"'+(cur==='tr:'+t[0]?' selected':'')+'>'+t[1]+'</option>'; }).join('');
  ov.innerHTML='<div class="ns-lang-dlg" role="dialog" aria-modal="true" aria-labelledby="ns-lang-h">'+
    '<button type="button" class="ns-lang-x" aria-label="Close">×</button>'+
    '<div class="ns-lang-dlg__ic">'+GLOBE+'</div>'+
    '<h2 id="ns-lang-h">Choose your language · <span lang="hi">भाषा चुनें</span> · <span lang="pa">ਭਾਸ਼ਾ ਚੁਣੋ</span></h2>'+
    '<p class="ns-lang-dlg__sub">'+esc(S.en.sub)+'</p>'+
    '<div class="ns-lang-grid">'+opts+'</div>'+
    '<div class="ns-lang-more"><label for="ns-lang-sel">'+esc(S.en.other)+'</label>'+
      '<div class="ns-lang-more__row"><select id="ns-lang-sel">'+sel+'</select><button type="button" class="ns-lang-go">'+esc(S.en.go)+'</button></div>'+
      '<p>'+esc(S.en.otherNote)+'</p></div></div>';
  body.appendChild(ov);
  ov.addEventListener('click',function(e){
    var o=e.target.closest('.ns-lang-opt'); if(o) return choose(o.getAttribute('data-l'));
    if(e.target.closest('.ns-lang-go')) return choose('tr:'+ov.querySelector('#ns-lang-sel').value);
    if(e.target.closest('.ns-lang-x') || e.target===ov) laterPicker();
  });
  doc.addEventListener('keydown',onKey);
  var f=ov.querySelector('.ns-lang-opt[aria-pressed=true]')||ov.querySelector('.ns-lang-opt'); f.focus();
}
function suggest(){
  // Arriving on a Hindi/Punjabi/Bhojpuri post? Suggest that language. Else use the browser language.
  var pl=doc.querySelector('.ns-tags a[href*="/label/'+LANG_PREFIX+'"], a[rel=tag][href*="/label/'+LANG_PREFIX+'"]');
  if(pl){ var m=pl.getAttribute('href').match(/lang-([a-z]+)/); if(m&&LANGS[m[1]]) return m[1]; }
  var n=(navigator.language||'').toLowerCase();
  if(n.indexOf('hi')===0) return 'hi'; if(n.indexOf('pa')===0) return 'pa'; if(n.indexOf('bho')===0) return 'bho';
  return 'en';
}
function addButton(){
  var actions=doc.querySelector('.ns-actions'); if(!actions || doc.querySelector('.ns-lang-btn')) return;
  var b=doc.createElement('button'); b.type='button'; b.className='ns-lang-btn notranslate'; b.setAttribute('translate','no');
  var label = trCode ? trCode.toUpperCase() : LANGS[lang].short;
  b.setAttribute('aria-label',s('lang')+': '+(trCode||LANGS[lang].native));
  b.innerHTML=GLOBE+'<span>'+label+'</span>';
  b.onclick=function(){ openPicker(false); };
  actions.insertBefore(b,actions.firstChild);
}

/* ------------------------------------------------------------------
   9. GOOGLE AUTO-TRANSLATE for other languages
   ------------------------------------------------------------------ */
function domains(){ var h=location.hostname, root=h.replace(/^www\./,''); return ['',h,'.'+h,'.'+root]; }
function setGT(code){ clearGT(); doc.cookie='googtrans=/en/'+code+';path=/'; doc.cookie='googtrans=/en/'+code+';path=/;domain=.'+location.hostname.replace(/^www\./,''); }
function clearGT(){ domains().forEach(function(d){ doc.cookie='googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'+(d?';domain='+d:''); }); }
function startGT(){
  doc.querySelectorAll('.ns-brand,.ns-arn,time').forEach(function(e){ e.classList.add('notranslate'); });
  var bar=doc.createElement('div'); bar.className='ns-tr-bar notranslate';
  bar.innerHTML=esc(S.en.trBar)+'<button type="button">'+esc(S.en.trOff)+'</button>';
  bar.querySelector('button').onclick=function(){ choose('en'); };
  body.insertBefore(bar,body.firstChild);
  var box=doc.createElement('div'); box.id='ns-gt'; box.style.display='none'; body.appendChild(box);
  window.nsGTinit=function(){ try{ new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'ns-gt'); }catch(e){} };
  var sc=doc.createElement('script'); sc.src='https://translate.google.com/translate_a/element.js?cb=nsGTinit'; sc.async=true;
  sc.onerror=function(){ // fallback: Google's translation proxy
    location.href='https://translate.google.com/translate?sl=en&tl='+encodeURIComponent(trCode)+'&u='+encodeURIComponent(location.href);
  };
  body.appendChild(sc);
}

/* Older posts load Wealthy.css from the old GitHub name (gco-rai-mayank, renamed to raimayank7 on 1 Nov 2026).
   Point them at the new name so they keep their styling even if the old address stops working. */
function fixOldGithubLinks(){
  [].forEach.call(doc.querySelectorAll('link[href*="/gco-rai-mayank/"],script[src*="/gco-rai-mayank/"]'),function(el){
    var at=el.tagName==='LINK'?'href':'src', u=el.getAttribute(at).replace('/gco-rai-mayank/','/raimayank7/');
    if(at==='href'){ el.setAttribute('href',u); return; }
    var s=doc.createElement('script'); s.src=u; el.parentNode.replaceChild(s,el);
  });
}

/* ------------------------------------------------------------------
   10. RUN
   ------------------------------------------------------------------ */
html.setAttribute('lang', trCode ? 'en-IN' : LANGS[lang].html);
addButton();
langBlocks();
fixOldGithubLinks();
fixPostImages();
enhance404();
stylePopular();
seoBusiness();
seoTitles();
translateTree(body);
localDates(doc);
if(trCode){ setGT(trCode); startGT(); }

// keep translating text that the theme adds later (calculator results, form messages…)
if(lang!=='en' && window.MutationObserver){
  var queue=[];   // every change is kept until the next pass (changes that came in while one was waiting used to be lost)
  new MutationObserver(function(muts){
    if(!queue.length) setTimeout(function(){
      var q=queue; queue=[];
      q.forEach(function(m){ var t=m.target.nodeType===3?m.target.parentNode:m.target; if(t&&t.nodeType===1&&t.isConnected&&!t.closest('.ns-grid')) translateTree(t); });
    },30);
    queue.push.apply(queue,muts);
  }).observe(body,{childList:true,subtree:true,characterData:true});
}

loadIndex().then(function(idx){
  filterLists(idx);
  filterPopular(idx);
  rankPopular();
  articleExtras(idx);
}, function(){}).then(unpend);

var later=null; try{ later=localStorage.getItem('ns-lang-later'); }catch(e){}
if(!pref && !later && !isBot) setTimeout(function(){ openPicker(true); },400);

window.NSLang={open:function(){openPicker(false);},set:choose,lang:lang};
})();

/* ===== Invest with me (Wealthy) ===== */
(function(){
'use strict';
var WEALTHY='https://invest.niveshsahayak.in/';
var WPRIVACY='https://www.wealthy.in/privacy';

var pref=null; try{pref=localStorage.getItem('ns-lang');}catch(e){}
var lang=(pref==='hi'||pref==='pa'||pref==='bho')?pref:'en';
var tr=(pref&&pref.indexOf('tr:')===0)?pref.slice(3):null;
// Wealthy's own page supports: en, hi, bn, ta, te, ka (Kannada), gu, mr
var wl={hi:'hi',bho:'hi',bn:'bn',ta:'ta',te:'te',kn:'ka',gu:'gu',mr:'mr'}[tr||lang]||'en';
var WLINK=WEALTHY+'?lang='+wl+'#lead';

var S={
en:{eyebrow:"Invest with me",h:"Ready to start investing?",lead:"Learn here, then invest through Wealthy, my partner platform. Share your details on the form and Love Rai will get in touch with you.",
 t1:"Mutual funds · SIPs",p1:"Start a SIP or lumpsum investment and track your family’s portfolio in the Wealthy app.",b1:"Start investing →",
 note:"Love Rai is an AMFI Registered Mutual Fund Distributor (ARN-354017). This link opens our partner platform Wealthy, where your transactions and account details are handled under its terms and privacy policy. Mutual Fund investments are subject to market risks, read all scheme related documents carefully.",
 ctaH:"Ready to put this into practice?",ctaS:"Opens the Wealthy form · Love Rai, AMFI Registered MFD, ARN-354017",
 mTitle:"Before you continue",mIntro:"The next page is Wealthy, our partner platform. It has a short form that asks for:",
 ask1:"Your first and last name",ask2:"Your mobile number, confirmed with a one-time code (OTP) sent by SMS",
 useH:"How your details are used",
 use1:"They reach Love Rai through the Wealthy partner app, so you can get a call back about investing.",
 use2:"Wealthy sends the OTP to confirm the number is yours.",
 use3:"No bank or payment details are asked at this step, and there is no obligation to invest.",
 use4:"This website does not collect or store anything you type on the next page.",
 consent:"By continuing, you agree to be contacted by Love Rai about mutual fund investments. Your details are handled under",privacy:"Wealthy’s privacy policy",
 go:"Continue to Wealthy →",cancel:"Not now",close:"Close"},
hi:{eyebrow:"मेरे साथ निवेश करें",h:"निवेश शुरू करने के लिए तैयार हैं?",lead:"यहाँ सीखें, फिर मेरे पार्टनर प्लेटफ़ॉर्म Wealthy के ज़रिए निवेश करें। फ़ॉर्म में अपना विवरण दें — लव राय की ओर से आपसे संपर्क किया जाएगा।",
 t1:"म्यूचुअल फंड · SIP",p1:"Wealthy ऐप में SIP या एकमुश्त निवेश शुरू करें और अपने परिवार का पोर्टफ़ोलियो एक जगह देखें।",b1:"निवेश शुरू करें →",
 note:"लव राय एक AMFI पंजीकृत म्यूचुअल फंड वितरक (ARN-354017) हैं। यह लिंक हमारा पार्टनर प्लेटफ़ॉर्म Wealthy खोलता है, जहाँ आपके लेन-देन और खाते की जानकारी उसकी शर्तों और गोपनीयता नीति के तहत संभाली जाती है। म्यूचुअल फंड निवेश बाज़ार जोखिमों के अधीन हैं, योजना संबंधी सभी दस्तावेज़ों को ध्यान से पढ़ें।",
 ctaH:"इसे अमल में लाने के लिए तैयार हैं?",ctaS:"Wealthy फ़ॉर्म खुलेगा · लव राय, AMFI पंजीकृत MFD, ARN-354017",
 mTitle:"आगे बढ़ने से पहले",mIntro:"अगला पेज हमारा पार्टनर प्लेटफ़ॉर्म Wealthy है। वहाँ एक छोटा फ़ॉर्म है, जिसमें पूछा जाएगा:",
 ask1:"आपका पहला और अंतिम नाम",ask2:"आपका मोबाइल नंबर — SMS से आए वन-टाइम कोड (OTP) से इसकी पुष्टि होगी",
 useH:"आपकी जानकारी का इस्तेमाल कैसे होगा",
 use1:"यह जानकारी Wealthy पार्टनर ऐप के ज़रिए लव राय तक पहुँचती है, ताकि निवेश के बारे में आपको कॉल किया जा सके।",
 use2:"नंबर आपका ही है, यह पक्का करने के लिए Wealthy OTP भेजता है।",
 use3:"इस चरण में बैंक या भुगतान की कोई जानकारी नहीं माँगी जाती, और निवेश करने की कोई बाध्यता नहीं है।",
 use4:"अगले पेज पर आप जो भी भरते हैं, उसे यह वेबसाइट न तो इकट्ठा करती है, न रखती है।",
 consent:"आगे बढ़कर आप म्यूचुअल फंड निवेश के बारे में लव राय की ओर से संपर्क किए जाने के लिए सहमति देते हैं। आपकी जानकारी इसके तहत संभाली जाती है:",privacy:"Wealthy की गोपनीयता नीति",
 go:"Wealthy पर आगे बढ़ें →",cancel:"अभी नहीं",close:"बंद करें"},
pa:{eyebrow:"ਮੇਰੇ ਨਾਲ ਨਿਵੇਸ਼ ਕਰੋ",h:"ਨਿਵੇਸ਼ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?",lead:"ਇੱਥੇ ਸਿੱਖੋ, ਫਿਰ ਮੇਰੇ ਪਾਰਟਨਰ ਪਲੇਟਫ਼ਾਰਮ Wealthy ਰਾਹੀਂ ਨਿਵੇਸ਼ ਕਰੋ। ਫ਼ਾਰਮ ਵਿੱਚ ਆਪਣੇ ਵੇਰਵੇ ਦਿਓ — ਲਵ ਰਾਏ ਵੱਲੋਂ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕੀਤਾ ਜਾਵੇਗਾ।",
 t1:"ਮਿਊਚੁਅਲ ਫੰਡ · SIP",p1:"Wealthy ਐਪ ਵਿੱਚ SIP ਜਾਂ ਇੱਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਆਪਣੇ ਪਰਿਵਾਰ ਦਾ ਪੋਰਟਫ਼ੋਲੀਓ ਇੱਕ ਥਾਂ ਦੇਖੋ।",b1:"ਨਿਵੇਸ਼ ਸ਼ੁਰੂ ਕਰੋ →",
 note:"ਲਵ ਰਾਏ ਇੱਕ AMFI ਰਜਿਸਟਰਡ ਮਿਊਚੁਅਲ ਫੰਡ ਡਿਸਟ੍ਰੀਬਿਊਟਰ (ARN-354017) ਹਨ। ਇਹ ਲਿੰਕ ਸਾਡਾ ਪਾਰਟਨਰ ਪਲੇਟਫ਼ਾਰਮ Wealthy ਖੋਲ੍ਹਦਾ ਹੈ, ਜਿੱਥੇ ਤੁਹਾਡੇ ਲੈਣ-ਦੇਣ ਅਤੇ ਖਾਤੇ ਦੀ ਜਾਣਕਾਰੀ ਉਸਦੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਪਰਦੇਦਾਰੀ ਨੀਤੀ ਤਹਿਤ ਸੰਭਾਲੀ ਜਾਂਦੀ ਹੈ। ਮਿਊਚੁਅਲ ਫੰਡ ਨਿਵੇਸ਼ ਬਾਜ਼ਾਰ ਦੇ ਜੋਖਮਾਂ ਦੇ ਅਧੀਨ ਹਨ, ਸਕੀਮ ਨਾਲ ਸਬੰਧਤ ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
 ctaH:"ਇਸਨੂੰ ਅਮਲ ਵਿੱਚ ਲਿਆਉਣ ਲਈ ਤਿਆਰ ਹੋ?",ctaS:"Wealthy ਫ਼ਾਰਮ ਖੁੱਲ੍ਹੇਗਾ · ਲਵ ਰਾਏ, AMFI ਰਜਿਸਟਰਡ MFD, ARN-354017",
 mTitle:"ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ",mIntro:"ਅਗਲਾ ਪੇਜ ਸਾਡਾ ਪਾਰਟਨਰ ਪਲੇਟਫ਼ਾਰਮ Wealthy ਹੈ। ਉੱਥੇ ਇੱਕ ਛੋਟਾ ਫ਼ਾਰਮ ਹੈ, ਜਿਸ ਵਿੱਚ ਪੁੱਛਿਆ ਜਾਵੇਗਾ:",
 ask1:"ਤੁਹਾਡਾ ਪਹਿਲਾ ਅਤੇ ਆਖ਼ਰੀ ਨਾਮ",ask2:"ਤੁਹਾਡਾ ਮੋਬਾਈਲ ਨੰਬਰ — SMS ਰਾਹੀਂ ਆਏ ਵਨ-ਟਾਈਮ ਕੋਡ (OTP) ਨਾਲ ਇਸਦੀ ਪੁਸ਼ਟੀ ਹੋਵੇਗੀ",
 useH:"ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਵਰਤੀ ਜਾਵੇਗੀ",
 use1:"ਇਹ ਜਾਣਕਾਰੀ Wealthy ਪਾਰਟਨਰ ਐਪ ਰਾਹੀਂ ਲਵ ਰਾਏ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ, ਤਾਂ ਜੋ ਨਿਵੇਸ਼ ਬਾਰੇ ਤੁਹਾਨੂੰ ਕਾਲ ਕੀਤੀ ਜਾ ਸਕੇ।",
 use2:"ਨੰਬਰ ਤੁਹਾਡਾ ਹੀ ਹੈ, ਇਹ ਪੱਕਾ ਕਰਨ ਲਈ Wealthy OTP ਭੇਜਦਾ ਹੈ।",
 use3:"ਇਸ ਪੜਾਅ 'ਤੇ ਬੈਂਕ ਜਾਂ ਭੁਗਤਾਨ ਦੀ ਕੋਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗੀ ਜਾਂਦੀ, ਅਤੇ ਨਿਵੇਸ਼ ਕਰਨ ਦੀ ਕੋਈ ਮਜਬੂਰੀ ਨਹੀਂ ਹੈ।",
 use4:"ਅਗਲੇ ਪੇਜ 'ਤੇ ਤੁਸੀਂ ਜੋ ਵੀ ਭਰਦੇ ਹੋ, ਉਸਨੂੰ ਇਹ ਵੈੱਬਸਾਈਟ ਨਾ ਇਕੱਠਾ ਕਰਦੀ ਹੈ, ਨਾ ਰੱਖਦੀ ਹੈ।",
 consent:"ਅੱਗੇ ਵਧ ਕੇ ਤੁਸੀਂ ਮਿਊਚੁਅਲ ਫੰਡ ਨਿਵੇਸ਼ ਬਾਰੇ ਲਵ ਰਾਏ ਵੱਲੋਂ ਸੰਪਰਕ ਕੀਤੇ ਜਾਣ ਲਈ ਸਹਿਮਤੀ ਦਿੰਦੇ ਹੋ। ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਇਸ ਤਹਿਤ ਸੰਭਾਲੀ ਜਾਂਦੀ ਹੈ:",privacy:"Wealthy ਦੀ ਪਰਦੇਦਾਰੀ ਨੀਤੀ",
 go:"Wealthy 'ਤੇ ਅੱਗੇ ਵਧੋ →",cancel:"ਹਾਲੇ ਨਹੀਂ",close:"ਬੰਦ ਕਰੋ"},
bho:{eyebrow:"हमरा साथे निवेश करीं",h:"निवेश शुरू करे खातिर तइयार बानी?",lead:"इहाँ सीखीं, फेर हमरा पार्टनर प्लेटफॉर्म Wealthy से निवेश करीं। फॉर्म में आपन विवरण दीं — लव राय के ओर से रउआ से संपर्क कइल जाई।",
 t1:"म्यूचुअल फंड · SIP",p1:"Wealthy ऐप में SIP भा एकमुश्त निवेश शुरू करीं आ अपना परिवार के पोर्टफोलियो एके जगह देखीं।",b1:"निवेश शुरू करीं →",
 note:null, /* legal text: Hindi version is used */
 ctaH:"एकरा के अमल में लावे खातिर तइयार बानी?",ctaS:"Wealthy फॉर्म खुली · लव राय, AMFI रजिस्टर्ड MFD, ARN-354017",
 mTitle:"आगे बढ़े से पहिले",mIntro:"अगिला पेज हमनी के पार्टनर प्लेटफॉर्म Wealthy ह। ओहिजा एगो छोट फॉर्म बा, जवना में पूछल जाई:",
 ask1:"रउआ पहिला आ आखिरी नाम",ask2:"रउआ मोबाइल नंबर — SMS से आइल वन-टाइम कोड (OTP) से एकर पुष्टि होई",
 useH:"रउआ जानकारी के इस्तेमाल कइसे होई",
 use1:"ई जानकारी Wealthy पार्टनर ऐप से लव राय ले पहुँचेला, ताकि निवेश के बारे में रउआ के फोन कइल जा सके।",
 use2:"नंबर रउए के ह, ई पक्का करे खातिर Wealthy OTP भेजेला।",
 use3:"एह कदम पर बैंक भा भुगतान के कवनो जानकारी ना माँगल जाला, आ निवेश करे के कवनो मजबूरी नइखे।",
 use4:"अगिला पेज पर रउआ जवन भरीं, ओकरा के ई वेबसाइट ना जुटावेले, ना रखेले।",
 consent:null,privacy:null, /* consent wording: Hindi version is used */
 go:"Wealthy पर आगे बढ़ीं →",cancel:"अबहीं ना",close:"बंद करीं"}
};
function s(k){ var v=S[lang][k]; return v!=null?v:(lang==='bho'&&S.hi[k]!=null?S.hi[k]:S.en[k]); }
function esc(t){ return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
var L={en:'en-IN',hi:'hi',pa:'pa',bho:'bho'}[lang];
var ext=' target="_blank" rel="noopener"';
function goBtn(cls){ return '<a class="'+cls+'" data-ns-wealthy href="'+WLINK+'"'+ext+'>'+esc(s('b1'))+'</a>'; }

function section(inner){
  return '<section class="ns-inv" id="invest" lang="'+L+'"><div class="'+(inner?'':'ns-wrap')+'">'+
    '<div class="ns-inv__head"><span class="ns-eyebrow">'+esc(s('eyebrow'))+'</span><h2>'+esc(s('h'))+'</h2><p>'+esc(s('lead'))+'</p></div>'+
    '<div class="ns-inv__card"><div class="ns-inv__body"><span class="ns-inv__tag">'+esc(s('t1'))+'</span><h3>Wealthy</h3><p>'+esc(s('p1'))+'</p></div>'+goBtn('ns-btn')+'</div>'+
    '<p class="ns-inv__note">'+esc(s('note'))+'</p></div></section>';
}

var body=document.body, path=location.pathname;

// 1) Homepage: section above the footer
var footer=document.querySelector('footer.ns-footer');
if(body.classList.contains('is-home') && footer) footer.insertAdjacentHTML('beforebegin',section(false));

// 2) Contact page: section at the top of the page content
if(/\/p\/contact\.html$/.test(path)){
  var main=document.querySelector('.ns-content');
  if(main) main.insertAdjacentHTML('afterbegin',section(true));
}

// 3) Articles: short strip before the author box
if(body.classList.contains('is-post')){
  var at=document.querySelector('.ns-author')||document.querySelector('.ns-pager');
  if(at) at.insertAdjacentHTML('beforebegin','<div class="ns-inv-cta" lang="'+L+'"><div><b>'+esc(s('ctaH'))+'</b><small>'+esc(s('ctaS'))+'</small></div>'+goBtn('ns-btn')+'</div>');
}

// 4) "Before you continue" popup — explains the next page, then opens the Wealthy form
var ov=null, lastFocus=null;
function closeM(){ if(!ov) return; ov.remove(); ov=null; document.removeEventListener('keydown',onKey); if(lastFocus) lastFocus.focus(); }
function onKey(e){ if(e.key==='Escape') closeM(); }
function openM(){
  if(ov) return; lastFocus=document.activeElement;
  ov=document.createElement('div'); ov.className='ns-wl-ov';
  ov.innerHTML='<div class="ns-wl" role="dialog" aria-modal="true" aria-labelledby="ns-wl-h" lang="'+L+'">'+
    '<button type="button" class="ns-wl__x" aria-label="'+esc(s('close'))+'">×</button>'+
    '<h2 id="ns-wl-h">'+esc(s('mTitle'))+'</h2><p class="ns-wl__intro">'+esc(s('mIntro'))+'</p>'+
    '<ul class="ns-wl__ask"><li><span>1</span>'+esc(s('ask1'))+'</li><li><span>2</span>'+esc(s('ask2'))+'</li></ul>'+
    '<h3>'+esc(s('useH'))+'</h3><ul class="ns-wl__use"><li>'+esc(s('use1'))+'</li><li>'+esc(s('use2'))+'</li><li>'+esc(s('use3'))+'</li><li>'+esc(s('use4'))+'</li></ul>'+
    '<p class="ns-wl__consent">'+esc(s('consent'))+' <a href="'+WPRIVACY+'"'+ext+'>'+esc(s('privacy'))+'</a>.</p>'+
    '<div class="ns-wl__btns"><button type="button" class="ns-btn ns-btn--ghost ns-wl__no">'+esc(s('cancel'))+'</button>'+
    '<a class="ns-btn ns-wl__go" href="'+WLINK+'"'+ext+'>'+esc(s('go'))+'</a></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(e){
    if(e.target===ov || e.target.closest('.ns-wl__x') || e.target.closest('.ns-wl__no')) return closeM();
    if(e.target.closest('.ns-wl__go')) setTimeout(closeM,50);   // the link itself opens Wealthy in a new tab
  });
  document.addEventListener('keydown',onKey);
  ov.querySelector('.ns-wl__go').focus();
}
document.addEventListener('click',function(e){
  var a=e.target.closest && e.target.closest('a[data-ns-wealthy]');
  if(!a || e.ctrlKey || e.metaKey || e.shiftKey) return;   // Ctrl/Cmd-click still opens Wealthy directly
  e.preventDefault(); openM();
});
})();
}

loadPages(nsMain);
})();

/* "Add as a preferred source on Google" (Google Search Top Stories): Google's official button at the top of the footer.
   Docs: developers.google.com/search/docs/appearance/preferred-sources. If Google's script can't load (blocked or offline),
   a plain link to the same Google page is shown instead. */
;(function () {
  function add() {
    var foot = document.querySelector('footer');
    if (!foot || document.querySelector('[google-add-preferred-source-btn]')) return;
    var root = document.documentElement, t = (root.getAttribute('data-theme') || root.className || '') + ' ' + (document.body.className || '');
    var dark = /dark|black/.test(t) || (!/light|sepia/.test(t) && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var box = document.createElement('div'), btn = document.createElement('div');
    box.className = 'pref-source'; box.style.cssText = 'display:flex;justify-content:center;min-height:40px;padding:0 12px 28px;margin:0 auto 36px;max-width:1200px;' +
      'border-bottom:1px solid color-mix(in srgb,currentColor 14%,transparent)';   // its own band, clear of the link columns
    btn.setAttribute('google-add-preferred-source-btn', ''); btn.setAttribute('data-theme', dark ? 'dark' : 'light');
    box.appendChild(btn); foot.insertBefore(box, foot.firstChild);
    var s = document.createElement('script'); s.async = true; s.src = 'https://news.google.com/swg/js/v1/publisher.js';
    document.head.appendChild(s);
    setTimeout(function () {   // fallback: Google's deep link
      if (btn.childNodes.length) return;
      var a = document.createElement('a');
      a.href = 'https://www.google.com/preferences/source?q=' + encodeURIComponent(location.hostname.replace(/^www\./, ''));
      a.target = '_blank'; a.rel = 'noopener'; a.textContent = '★ Add us as a preferred source on Google';
      a.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1px solid currentColor;border-radius:999px;font:600 14px/1.2 system-ui,sans-serif;text-decoration:none;color:inherit;opacity:.85';
      btn.appendChild(a);
    }, 6000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

/* Header: a compact "Preferred source on Google" button (Google's G; the words show on wide screens). It opens Google's own
   page for adding this site as a preferred source, the deep link Google documents for custom buttons. */
;(function () {
  function add() {
    if (document.querySelector('.pref-src-head')) return;
    var box = document.querySelector('.nav-actions, .ns-actions'), before = null;
    if (box) before = box.querySelector('[aria-label*="dark" i], [aria-label*="light" i]') || box.firstElementChild;
    else { var cta = document.querySelector('header .header-cta'); if (!cta) return; box = cta.parentNode; before = cta; }
    var navLink = !document.querySelector('.nav-actions, .ns-actions') && document.querySelector('header nav a');   // no actions box: match the menu's text colour
    var a = document.createElement('a');
    a.className = 'pref-src-head';
    a.href = 'https://www.google.com/preferences/source?q=' + encodeURIComponent(location.hostname.replace(/^www\./, ''));
    a.target = '_blank'; a.rel = 'noopener';
    a.title = 'Add us as a preferred source on Google'; a.setAttribute('aria-label', a.title);
    a.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
      '</svg><span>Preferred source</span>';
    box.insertBefore(a, before);
    if (navLink) a.style.color = getComputedStyle(navLink).color;
    var st = document.createElement('style');
    st.textContent = '.pref-src-head{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:38px;height:38px;padding:0 9px;box-sizing:border-box;' +
      'border-radius:999px;border:1px solid color-mix(in srgb,currentColor 22%,transparent);color:inherit;text-decoration:none;font:600 13px/1 system-ui,sans-serif;white-space:nowrap;flex:none}' +
      '.pref-src-head:hover{border-color:color-mix(in srgb,currentColor 45%,transparent)}.pref-src-head svg{width:18px;height:18px;flex:none}' +
      '.pref-src-head span{display:none}@media (min-width:1100px){.pref-src-head{padding:0 13px}.pref-src-head span{display:inline}}';
    document.head.appendChild(st);
    // only where it fits: on a crowded phone header it steps aside (the footer button is still there)
    var header = a.closest('header') || box, t = 0;
    function fit() {
      a.style.display = '';
      if (document.documentElement.scrollWidth > innerWidth + 1 || header.scrollWidth > header.clientWidth + 1 || box.scrollWidth > box.clientWidth + 1) a.style.display = 'none';
    }
    fit(); setTimeout(fit, 1500);
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

/* Footer credit (owner rule: every project): "Designed & Developed by: Nivesh Sahayak" in the footer's bottom row,
   drawn by the shared credit.js badge (plain text if that file can't load). */
;(function () {
  function add() {
    var row = document.querySelector('.ns-legal__bottom');
    if (!row || row.querySelector('[data-ns-credit], .ns-credit')) return;
    var s = document.createElement('span');
    s.setAttribute('data-ns-credit', '');
    s.innerHTML = 'Designed &amp; Developed by: <a href="https://www.niveshsahayak.in/">Nivesh Sahayak</a>';
    row.appendChild(s);
    if (!document.querySelector('script[src*="niveshsahayak.in/assets/credit.js"]')) {
      var j = document.createElement('script'); j.async = true; j.src = 'https://assets.niveshsahayak.in/assets/credit.js'; document.head.appendChild(j);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

/* Tab icon = the new NS emblem (owner, 2026-11-04): gold for light browser themes, silver for dark ones.
   Replaces the theme's old icon links, so no theme upload is needed. */
;(function () {
  var B = 'https://assets.niveshsahayak.in/assets/brand/', h = document.head;
  [].forEach.call(document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]'), function (l) { l.parentNode.removeChild(l); });
  function add(rel, href, sizes, media) {
    var l = document.createElement('link'); l.rel = rel; l.href = href;
    if (sizes) l.sizes = sizes; if (media) l.media = media; if (/png$/.test(href)) l.type = 'image/png';
    h.appendChild(l);
  }
  add('icon', B + 'favicon-light-32.png', '32x32', '(prefers-color-scheme: light)');
  add('icon', B + 'favicon-dark-32.png', '32x32', '(prefers-color-scheme: dark)');
  add('icon', B + 'favicon-light-192.png', '192x192');
  add('apple-touch-icon', B + 'apple-touch-icon.png', '180x180');
})();

/* Home page (user test 2026-11-05, #25): a section listing the free Nivesh Sahayak business tools (the home linked only a few
   of them) and a clearer tab title. Tool names stay in English: they are the names on the tools themselves. */
;(function () {
  if (!document.body.classList.contains('is-home')) return;
  var pref = null; try { pref = localStorage.getItem('ns-lang'); } catch (e) {}
  var lang = pref === 'hi' || pref === 'pa' || pref === 'bho' ? pref : 'en';
  var S = {
    en: ['Free business software', 'Tools for bills, GST and accounts, free forever. No login: your data stays in your own browser.', 'See every tool in the App'],
    hi: ['मुफ़्त बिज़नेस सॉफ़्टवेयर', 'बिल, जीएसटी और हिसाब-किताब के टूल, हमेशा मुफ़्त। कोई लॉगिन नहीं: आपका डेटा आपके अपने ब्राउज़र में रहता है।', 'सारे टूल ऐप में देखें'],
    pa: ['ਮੁਫ਼ਤ ਬਿਜ਼ਨੈਸ ਸਾਫ਼ਟਵੇਅਰ', 'ਬਿੱਲ, ਜੀਐਸਟੀ ਅਤੇ ਹਿਸਾਬ-ਕਿਤਾਬ ਦੇ ਟੂਲ, ਹਮੇਸ਼ਾ ਮੁਫ਼ਤ। ਕੋਈ ਲਾਗਇਨ ਨਹੀਂ: ਤੁਹਾਡਾ ਡਾਟਾ ਤੁਹਾਡੇ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।', 'ਸਾਰੇ ਟੂਲ ਐਪ ਵਿੱਚ ਦੇਖੋ'],
    bho: ['मुफ्त बिजनेस सॉफ्टवेयर', 'बिल, जीएसटी आ हिसाब-किताब के टूल, हमेशा मुफ्त। कवनो लॉगिन ना: रउआ डेटा रउए ब्राउजर में रहेला।', 'सगरी टूल ऐप में देखीं']
  }[lang];
  var T = [['app', 'Nivesh Sahayak App'], ['billing', 'GST Billing'], ['quotation', 'Quotation'], ['cash-memo', 'Cash Memo'], ['receipt', 'Receipt'], ['voucher', 'Payment Voucher'],
    ['purchase', 'Purchase Bills'], ['expenses', 'Expenses'], ['khata', 'Khata Book'], ['stock', 'Stock Register'], ['pos', 'Shop POS'], ['gstr1', 'GSTR-1'], ['gstr3b', 'GSTR-3B'],
    ['eway-bill', 'E-way Bill'], ['e-invoice', 'E-invoice'], ['gstin', 'GSTIN Check'], ['hsn', 'HSN Finder'], ['gst-calendar', 'GST Calendar'], ['salary-slip', 'Salary Slip'],
    ['rent-receipt', 'Rent Receipt'], ['profit-loss', 'Profit and Loss'], ['tally', 'Tally Export'], ['designs', 'Website Designs']];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var h = '<section class="ns-tools" id="free-tools" aria-labelledby="ns-tools-h"><div class="ns-wrap"><h2 id="ns-tools-h">' + esc(S[0]) + '</h2><p>' + esc(S[1]) + '</p><ul>' +
    T.map(function (x) { return '<li><a href="https://' + x[0] + '.niveshsahayak.in/">' + esc(x[1]) + '</a></li>'; }).join('') +
    '</ul><p class="ns-tools__all"><a href="https://app.niveshsahayak.in/">' + esc(S[2]) + ' →</a></p></div></section>';
  function add() {
    if (document.getElementById('free-tools')) return;
    var at = document.getElementById('invest') || document.querySelector('footer.ns-footer');
    if (at) at.insertAdjacentHTML('beforebegin', h);
    if (/^Nivesh Sahayak$/.test(document.title.trim())) document.title = 'Nivesh Sahayak: Investment Guides and Free GST Billing Software';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
