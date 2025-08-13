## 个人主页(个人导航)

> 家庭服务器部署应用过多记不得端口

> 页面部分效果借鉴于 [sun-panel](https://github.com/hslr-s/sun-panel) 

### 数据配置

 config.json

```json
{
  "title": "Yinx",
  "group": [
    {
      "name": "Panel",
      "icon": "uim:layer-group", #图标可使用 https://icon-sets.iconify.design
      "items": [
        {
          "title": "YinnBlog",
          "description": "",
          "icon": "./static/img/icon/yinn.svg",
          "url": "http://yinn.top",
          "lanUrl": "http://127.0.0.1:8080"
        }
      ]
    }
  ]
}

```
