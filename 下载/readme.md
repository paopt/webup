需求场景：根据url，下载文件。
<a href="xxxxx" download="logo">下载文件</a>
有时候这样不行，对于txt，png，js，css文件，浏览器会直接预览文件。zip文件会下载。
解决方案：异步下载文件流，创建blob对象，动态生成url，使用上面的方法下载。
必须设置responseType = 'blob'，否则文件下载后，不能打开


xhrDownload (params) {
      // token 等header 参数和 请求方式都可以按需配置
      const token = localStorage.getItem('token') || ''
      const url = 'http://localhost:8278/package.json'
      let xhr = new XMLHttpRequest()
      // get 方式
      xhr.open('get', url + '?timeStamp=' + new Date().getTime(), true)
      xhr.setRequestHeader('Cache-Control', 'no-cache')
      xhr.setRequestHeader('Content-type', 'application/json')
      // xhr.setRequestHeader('kms-token', token)
      // 返回类型blob，不设置会打不开 excel
      xhr.responseType = 'blob'
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
      xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
          let blob = this.response
          let url = window.URL.createObjectURL(blob)
          // 生成 url，创建一个a标签用于下载
          let a = document.createElement('a')
          a.download = '收支清单.json'
          a.href = url
          a.click()
        }
      }
      xhr.send(JSON.stringify(params))
    }
  }





/////////////////////
文件下载方式：
1、open或location.href， 指向下载地址
缺点：
会出现URL长度限制问题
需要注意url编码问题
浏览器可直接浏览的文件类型是不提供下载的，如txt、png、jpg、gif等
不能添加header，也就不能进行鉴权
无法知道下载的进度
2、a标签download属性
优点：
能解决不能直接下载浏览器可浏览的文件
缺点：
得已知下载文件地址
不能下载跨域下的浏览器可浏览的文件
有兼容性问题，特别是IE
不能进行鉴权
3、利用Blob对象
downloadFile (path, name) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', path);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function () {
        if (this.status === 200 || this.status === 304) {
            // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
            if ('msSaveOrOpenBlob' in navigator) {
                navigator.msSaveOrOpenBlob(this.response, name);
                return;
            }
            // const blob = new Blob([this.response], { type: xhr.getResponseHeader('Content-Type') });
            // const url = URL.createObjectURL(blob);
            const url = URL.createObjectURL(this.response);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
}

优点
能解决不能直接下载浏览器可浏览的文件
可设置header，也就可添加鉴权信息
缺点
兼容性问题，IE10以下不可用；Safari浏览器可以留意下使用情况
4、利用base64
/**
 * 下载文件
 * @param {String} path - 下载地址/下载请求地址。
 * @param {String} name - 下载文件的名字（考虑到兼容性问题，最好加上后缀名）
 */
downloadFile (path, name) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', path);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function () {
        if (this.status === 200 || this.status === 304) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(this.response);
            fileReader.onload = function () {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = this.result;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }
    };
}

优点
能解决不能直接下载浏览器可浏览的文件
可设置header，也就可添加鉴权信息
缺点
兼容性问题，IE10以下不可用

5、Content-Disposition



Blob URL/Object URL 是一种伪协议，允许 Blob 和 File 对象用作图像、下载二进制数据链接等的 URL 源。浏览器内部为每个通过 URL.createObjectURL 生成的 URL 存储了一个 URL → Blob 映射。因此，此类 URL 较短，但可以访问 Blob。
缺点：
虽然存储了 URL → Blob 的映射，但 Blob 本身仍驻留在内存中，浏览器无法释放它。映射在文档卸载时自动清除，因此 Blob 对象随后被释放。
针对这个问题，你可以调用 URL.revokeObjectURL(url) 方法，从内部映射中删除引用，从而允许删除 Blob（如果没有其他引用），并释放内存。




https://juejin.cn/post/6989413354628448264
https://juejin.cn/post/6980142557066067982