/*
 * @function checkBrowserSupport
 * @description Cut the mustard. If this function returns false,
 * then the browser is unsupported. Fuck 'em.
 * http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
 */
export default function checkBrowserSupport() {
  return new Promise((resolve, reject) => {
    const isSupported = ('querySelector' in document &&
            'localStorage' in window &&
            'addEventListener' in window);

    if (isSupported) {
      resolve();
    } else {
      reject();
    }
  });
}
