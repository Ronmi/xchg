[![Build Status](https://travis-ci.org/Ronmi/xchg.svg?branch=master)](https://travis-ci.org/Ronmi/xchg)

雖然是 code walk，但這東西我真的有在用XD

# Code walk

從舊到新，一個一個 commit 看它的 log message 和 diff，應該可以理解我的開發思路；別忘了開個分支出來執行和修改看看。

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
