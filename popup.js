$(document).ready(function() {
  $('.loader-container').hide();

  chrome.storage.sync.get(null, function(x, y) {
    if (!x['proxy_url']) {
      $('.add-proxy').removeClass('hide');
    } else {
      $('.add-domains').removeClass('hide');
      $('.domain-input').val(x['proxy_domains'].join('\n'));
    }
  });

  $('.add-proxy > button').click(function() {
    chrome.storage.sync.set(
      { proxy_url: $('.add-proxy> input').val() },
      function() {
        message('Settings saved');
      }
    );
  });

  $('.add-domains > .button_clear').click(function() {
    chrome.storage.sync.clear();
  });

  $('.add-domains > .button_save').click(function() {
    var domain = $('.domain-input')
      .val()
      .split('\n');
      var obj = {};
        obj['proxy_domains'] = domain;
        chrome.storage.sync.set(obj, function() {
          message('Settings saved');
        });
  });
});
