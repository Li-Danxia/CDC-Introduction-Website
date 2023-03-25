export const loadMathJax = (url: string) =>
  new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.head.appendChild(script);
    script.onload = function () {
      resolve(`success: ${url}`);
    };
    script.onerror = function () {
      reject(Error(`${url} load error!`));
    };
  });