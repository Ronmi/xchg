[![Build Status](https://travis-ci.org/Ronmi/xchg.svg?branch=master)](https://travis-ci.org/Ronmi/xchg)

雖然是 code walk，但這東西我真的有在用XD

# Code walk

從舊到新，一個一個 commit 看它的 log message 和 diff，應該可以理解我的開發思路；別忘了開個分支出來執行和修改看看。

## TL; DR

- [萬事起頭難](https://github.com/Ronmi/xchg/commit/b81ff0eeb3c2091c1a5b01779f3f22af4e2a9774)
- [先從定義格式開始](https://github.com/Ronmi/xchg/commit/ae3cd9870ed7319a4bf6b19a26cf0d056d50947a)
- [寫個測試](https://github.com/Ronmi/xchg/commit/88d90f864ed94d0074ef655b8a870745700471e0)
- [時常確認你的測試跟規格書相符](https://github.com/Ronmi/xchg/commit/b8960372f2decf85931f904796ac39131f2b0c92)
- [當心測試污染](https://github.com/Ronmi/xchg/commit/220e9aea8263a18c49ad54622cd32eb9be1b2ad1)
- test coverage [1](https://github.com/Ronmi/xchg/commit/a166211e5a75f71a7006b087d57e52dbdc66564c) [2](https://github.com/Ronmi/xchg/commit/2ec1d9e59b6269dc3041ab48f2bac727356fc8c0)
- [抽換不可測試的程式](https://github.com/Ronmi/xchg/commit/61cfecc146dceb8c40f93827994ab6de16a4bd05)
- [優質參考資料](https://github.com/Ronmi/xchg/commit/ad10bcb9ab66dbdde846187319f68daf15492baf)

- [vuejs/angular2/react 的一點感想](https://github.com/Ronmi/xchg/commit/ed4d7fa5be1dcff297f0f5c95295d5d689ff559f)
- [先寫規格再寫測試碼](https://github.com/Ronmi/xchg/commit/728f5da42198b2b7324399d7f1bacc1a9d2f22ac)
- [儘力避免測試實作細節](https://github.com/Ronmi/xchg/commit/561c2365951fb28bda2a4b132a682d9e0c745cdf)
- [抽換不可測試的程式](https://github.com/Ronmi/xchg/commit/0ec5630d1a767a771ab8aabe6a349acd8ceffa09)
- [為了語意清晰](https://github.com/Ronmi/xchg/commit/5ee43375a033b0846715a7bdb348e0afc1fc8d01)
- [重構的步驟](https://github.com/Ronmi/xchg/commit/fbc9a12f2c83c5bab5f56f9b25cad1ad2bf12007)
- [語意清晰的效果](https://github.com/Ronmi/xchg/commit/5cc64d994788ef7e06bcbc96a97b7b9fa9c8580e)
- [pure-render anti-pattern，以及為 Component class 寫 decorator 的小技巧](https://github.com/Ronmi/xchg/commit/b2183bedab61f533c717df7c2fde2361da4362ea)
- [為什麼上面的小技巧是錯誤的做法](https://github.com/Ronmi/xchg/commit/1eda5887547846cf66b81b844bac4bfaa2168d06)
- [不要破壞自己對函式定義的信任](https://github.com/Ronmi/xchg/commit/2191d550c6da1507706a5c5703ae519da35f5512)
- [這就是為什麼我們要寫測試](https://github.com/Ronmi/xchg/commit/1814d1fe12a9e8c26d69bee128fe7c00f7ecd362)

- [merge 的好習慣](https://github.com/Ronmi/xchg/commit/56fbcea41fdeb6a27fda54b1b8ba7fe249bfa733)

# 源起

一開始只是想摸看看 typescript 和 vuejs，所以想找個小東西試試手感。寫到一半的時候想到：對一些新手而言，學會語法還是寫不出完整的程式來。我認為這是因為沒有語感，就好像背了一堆英文單字，結果看到外國人還是說不出話來。語感是培養出來的，多聽多說自然會提昇。所以我決定把原專案砍掉重練，記錄每一階段的開發思路，希望能讓中、新手可以多一個參考。

註：現在前端部份已經轉移到 react 了。原因可以看 [commit log](https://github.com/Ronmi/xchg/commit/ed4d7fa5be1dcff297f0f5c95295d5d689ff559f)

# 適合閱讀這個專案的人

### 對 go 有基本理解的人

這個專案裡用到了 sql database/http server/json，所以你得先對這幾個 package 裡的 API 有基本理解。

此外還有 jsonapi/sdm 都是我自己的 toy project，一個是仿 http package 但 handler 是 json stream；一個是讓 sql 可以直接 scan 給 struct。這兩個 package 的 API 都十分接近對應的官方套件，應該不妨礙理解思路才對。

### 想學習 typescript 的人

基本上我也剛開始學，所以這部份除了思路之外沒有什麼參考價值：我的 js 部份完全沒有按照 best practice 走；自己亂搞踩地雷是我比較習慣的自學方式。所以同是新手，互相交流一下也不錯。

### open-minded FLOSS people

心態正確做什麼都方便

# 不適合閱讀這個的人

### 語法還看不太懂的人

要學習語感之前，你得先背夠單字。

### 還沒讀過「提問的藝術」的人

還不快去讀！ [ihower 翻譯版](https://ihower.tw/blog/archives/457)

### @c9s

別讀了，直接送 PR 來吧 <3


# 安裝

    go get github.com/Ronmi/xchg/cmd/xchg
    xchg --ui $(go list -f "{{.Dir}}" github.com/Ronmi/xchg/cmd/xchg)/../../ui
