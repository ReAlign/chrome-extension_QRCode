const _b_ = {
  checkURL(url = '') {
    let _url = url;

    // 相对路径，补全域名
    if (_url.indexOf('/') === 0) {
      // eslint-disable-next-line no-restricted-globals
      _url = location.origin + _url;
    }
    const exp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
    return new RegExp(exp).test(_url);
  },
  createWin(opts = {}) {
    const {
      url = '',
      pasteFlag = '0',
    } = opts;
    chrome.windows.create({
      url: `context-menus.html?url=${url}&pasteFlag=${pasteFlag}`,
      type: 'popup',
      top: 200,
      left: 200,
      width: 300,
      height: 320,
    });
  },
};

// 右键菜单 - 当前内容生成二维码
chrome.contextMenus.create({
  title: '当前内容生成二维码',
  type: 'normal',
  contexts: ['selection', 'link'],
  documentUrlPatterns: ['http://*/*', 'https://*/*'],
  targetUrlPatterns: ['http://*/*', 'https://*/*'],
  //单击时的处理函数
  onclick: (info = {}, tab = {}) => {
    const {
      selectionText = '',
      linkUrl = '',
    } = info;

    const _url = linkUrl || selectionText;
    const isUrl = _b_.checkURL(_url);

    if (isUrl) {
      _b_.createWin({
        url: encodeURIComponent(_url),
      });
    } else {
      alert('not url.');
    }
  }
});

// 右键菜单 - 剪贴板内容生成二维码
chrome.contextMenus.create({
  title: '剪贴板内容生成二维码',
  type: 'normal',
  contexts: ['all'],
  documentUrlPatterns: ['http://*/*', 'https://*/*'],
  targetUrlPatterns: ['http://*/*', 'https://*/*'],
  //单击时的处理函数
  onclick: (info = {}, tab = {}) => {
    _b_.createWin({
      pasteFlag: '1',
    });
  }
});