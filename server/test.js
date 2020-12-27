const translate = require('google-translate-cn-api');

(async () => {
  // English => Chinese
  await translate('hello world', { to: 'zh-cn' })
    .then(console.info)
    .catch(console.error);

  // Chinese => English
  await translate('你好世界', { to: 'en' })
    .then(console.info)
    .catch(console.error);
})();
