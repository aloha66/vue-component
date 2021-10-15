### 支撑骨架

"https://s5.mogucdn.com/mlcdn/c45406/210718_34k9lad6ci61bd8i599508fej3ja5_640x960.jpg".match(/_([0-9x]*)\./)

1. 单列容器顶宽 220
2. 根据服务器图片地址获取图片真实宽高
3. 根据真实宽高和定宽容器得出容器高度
4. 填充到容器内 img 的父 div（定宽定高）

### 懒加载插入图片

1. 获取容器比例

原图按比例的宽 s = 220 / 750 \* clientWidth
750（目测是 iphone6 2 倍稿的意思）

如果是手机
原图按比例的宽 s = is_mobile ? 220 / 750 \* clientWidth : 220

l = parseFloat(s) \* dpr
