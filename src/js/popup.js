chrome.tabs.getSelected(null, (tab = {}) => {
  const {
    url,
  } = tab;
  if(_.checkURL(url)) {
    if (_.isLocal(url)) {
      _.getLocalIP().then((ip = '') => {
        const _url = _.replaceHostname(url, ip);
        _.buildQRCode(_url);
        _.buildLocalID(_url);
        _.bindShortUrlEvt(_url);
      });
    } else {
      _.buildQRCode(url);
      _.buildLocalID(url);
      _.bindShortUrlEvt(url);
    }
  }

  _.buildOpenIP();
  _.buildLocalIP();
});