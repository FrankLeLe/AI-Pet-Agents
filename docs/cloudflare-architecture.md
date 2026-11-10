# Cloudflare 生产架构

## 当前请求链路

```text
访客 → Cloudflare DNS / TLS
     ├─ /assets/*、/pets/*、/api/v1/* → Workers Static Assets
     ├─ /downloads/<file>.zip        → Workers Static Assets
     ├─ /downloads/<release>/<file>  → Worker 校验版本并读取 ASSETS
     └─ 页面与 RSC 请求              → vinext Worker → Workers Cache
```

生产运行不读取 GitHub、第三方 CDN 或外部字体。图片、动画、目录 JSON、宠物 ZIP
和 Hatch Pet Skill 都随同一个 Worker 版本上传到 Cloudflare。版本化下载地址使用长期
不可变缓存；非版本化下载地址保留重新验证，避免更新后拿到旧包。

## 数据分层

- `Workers Static Assets`：网站脚本、样式、图片、动画、公开 JSON 和 ZIP。
- `Worker`：SSR、语言处理、版本化下载校验、安全响应头和断点续传。
- `Workers Cache`：缓存 HTML/RSC 输出，并按部署版本隔离。
- `D1`：当前不绑定。静态目录不应为一次展示增加数据库往返。
- `R2`：当前不使用。单文件远低于 Static Assets 的 25 MiB 上限，迁入 R2 不会自然变快。

## 扩展边界

当需要后台动态上架、无需重新部署即可发布宠物时，再引入控制面：D1 保存宠物元数据、
版本和发布状态，R2 保存 ZIP 与原始大图，Worker 负责读取并签发公开下载响应。网页仍应
消费已发布的静态目录快照，避免每次浏览都查询数据库。

## 发布与验证

从项目根目录执行 `npm test`，通过后执行 `npm run deploy`。部署后检查首页、宠物列表、
造宠工坊、WebP 动画，以及版本化 ZIP 的 `200`、`206`、缓存头和 SHA-256。Cloudflare
凭据只通过本地环境变量提供，不写入仓库。
