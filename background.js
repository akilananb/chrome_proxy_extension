console.log('hello world');
let proxy_url = '',
  proxy_domains = {};

let updateStore = () => {
  chrome.storage.sync.get(null, function(x, y) {
    proxy_url = x['proxy_url'];
    proxy_domains = x['proxy_domains'];
  });
};

let extractRootDomain = url => {
  var domain = extractHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
};

let extractHostname = url => {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

updateStore();

chrome.storage.onChanged.addListener((changes, location) => {
  console.log(location);
  if (location === 'sync') updateStore();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let { url, status } = changeInfo;

  if (
    status === 'loading' &&
    proxy_domains.includes(extractRootDomain(url)) &&
    url.indexOf(proxy_url) == -1
  ) {
    chrome.tabs.update(tabId, {
      url: `${proxy_url}?${url}`
    });
  }
});
