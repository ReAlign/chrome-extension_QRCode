const actEvt = (url) => {
  if (_.isLocal(url)) {
    _.getLocalIP().then((ip = '') => {
      const _url = _.replaceHostname(url, ip);
      _.buildQRCode(_url);
    });
  } else {
    _.buildQRCode(url);
  }
};

const loadEvt = () => {
  const pasteFlag = _.getParams().pasteFlag;
  if(pasteFlag === '1') {
    navigator.clipboard.readText().then((txt = '') => {
      if(_.checkURL(txt)) {
        actEvt(txt);
      } else {
        _.renderText('剪贴板没有可生成二维码的地址');
      }
   });
  } else {
    const url = decodeURIComponent(_.getParams().url || '');
    actEvt(url);
  }
};

loadEvt();