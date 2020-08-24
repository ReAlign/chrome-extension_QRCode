const _ = {
  QRCodeSize: 240,
  getParams() {
    const url = location.search;
    const pars = {};
    if (url.indexOf('?') != -1) {
      url.substr(1).split('&').forEach(item => {
        const [k = '', v = ''] = item.split('=');
        pars[k] = v;
      });
    }
    return pars;
  },
  getOpenIP() {
    return new Promise((resolve) => {
      const url = 'https://apis.map.qq.com/ws/location/v1/ip?key=3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5';
      jQuery.get(url, (res = {}) => {
        const result = res.result || {};
        const ip = result.ip || '';
        resolve(ip);
      });
    });
  },
  getLocalIP() {
    return new Promise((resolve) => {
      const recode = {};
      let RTCPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;

      // 如果不存在则使用一个iframe绕过
      if (!RTCPeerConnection) {
        // 因为这里用到了iframe，所以在调用这个方法的script上必须有一个iframe标签
        // <iframe id="iframe" sandbox="allow-same-origin" style="display:none;"></iframe>
        let win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
      }

      //创建实例，生成连接
      const RTCPC = new RTCPeerConnection();

      // 匹配字符串中符合ip地址的字段
      function handleCandidate(candidate = '') {
        const ip = candidate.split(' ')[4] || '';
        if (!recode[ip]) {
          resolve(ip);
          recode[ip] = true;
        }
      }

      //监听icecandidate事件
      RTCPC.onicecandidate = (ice) => {
        if (ice.candidate) {
          handleCandidate(ice.candidate.candidate);
        }
      };
      //建立一个伪数据的通道
      RTCPC.createDataChannel('');
      RTCPC.createOffer((res) => {
        RTCPC.setLocalDescription(res);
      }, () => {});
    });
  },
  isLocal(url = '') {
    const {
      hostname,
    } = new URL(url);
    const _map = [
      'localhost',
      '127.0.0.1',
    ];

    return _map.includes(hostname);
  },
  replaceHostname(url = '', newHostname = '') {
    const {
      protocol,
      hostname,
      port,
      pathname,
      search,
      hash,
    } = new URL(url);
    const _hn = newHostname || hostname;
    return `${protocol}//${_hn}${port ? `:${port}` : ''}${pathname}${search}${hash}`;
  },
  buildQRCode(url = '') {
    jQuery('#j-qrcode-container').qrcode({
      text: url,
      width: _.QRCodeSize,
      height: _.QRCodeSize,
    });
  },
  buildLocalIP() {
    _.getLocalIP().then((ip = '') => {
      jQuery('#j-local-ip-container').html(`${ip}`);

      _.copyEvt('#j-copy-local-ip-btn', ip);
    });
  },
  buildOpenIP() {
    _.getOpenIP().then((ip = '') => {
      jQuery('#j-open-ip-container').html(`${ip}`);
      _.copyEvt('#j-copy-open-ip-btn', ip);
    });
  },
  buildLocalID(url = '') {
    jQuery('#j-local-id-container').html(`${url}`);
    jQuery('#j-local-id-container').attr('title', `${url}`);
    _.copyEvt('#j-copy-local-id-btn', url);
  },
  copyEvt(id = '', txt = '') {
    new ClipboardJS(id, {
        text: () => {
          return txt;
        },
      })
      .on('success', (e) => {
        const _txt = jQuery(id).html();
        jQuery(id).html(`已${_txt}`);
        setTimeout(() => {
          jQuery(id).html(_txt);
        }, 1500);
      });
  },
  checkURL(url = '') {
    const indexLH = url.indexOf('localhost');
    const index127 = url.indexOf('127.0.0.1');
    const isLocal = (indexLH === 7 || indexLH === 8 || index127 === 7 || index127 === 8);
    if (isLocal) {
      return true;
    }

    const exp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
    return new RegExp(exp).test(url);
  },
  renderText(txt = '') {
    jQuery('body').html(`
      <p style="text-align: center;line-height: 16;font-size: 16px;">
        ${txt}
      </p>
    `);
  },
  bindShortUrlEvt(url = '') {
    jQuery('#j-short_url-btn').click(() => {
      _.shortUrl(url);
    });
  },
  shortUrl(url = '') {
    fetch('https://note.realign.pro/o/short_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x1u-token': 'fae5dc6210e0e1f8b0032485f92695e8'
        },
        body: JSON.stringify({
          url,
        })
      })
      .then(response => response.json())
      .then((json = {}) => {
        const {
          data = {}
        } = json;
        const shortUrl = data.shortUrl;
        if (shortUrl) {
          navigator.clipboard.writeText(shortUrl).then(
            () => {
              // ok
              alert('ok');
            },
            () => {
             // err
             alert('err');
            }
          );
        }
      })
  },
};