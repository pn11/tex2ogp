# TeX2OGP

<https://tex2ogp.web.app/>

## ディレクトリ構成

- `src`: Vue.js のソース
  - `App.vue`: Vue-Router を呼び出すだけ
  - `main.js`: Vue のライブラリなどをインポートして Vue のインスタンスを作る
  - `assets`: 画像などを入れる
  - `components`: Vue コンポーネントを入れる
  - `router`: Vue-Router
- `functions`: Firebase Cloud Functions 用のディレクトリ

## 参考リンク

- [Vue.jsとFirebaseでOGP画像生成系のサービスを爆速で作ろう - Qiita](https://qiita.com/serinuntius/items/3017fb6ef51cd47352f6)
- [「Vue.jsとFirebaseでOGP画像生成系のサービスを爆速で作ろう」を実際に作ってみる - Qiita](https://qiita.com/kanye__east/items/6cbcdc8fe5103084c737)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Firebase

```bash
npm run build
firebase deploy
```

Files in `dist` will be uploaded to Firebase.

- <https://tex2ogp.web.app/>
- <https://tex2ogp.firebaseapp.com>
