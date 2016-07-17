# API 規格

- 所有錯誤都會回傳 json 格式錯誤訊息 `"error message"`
- 伺服器錯誤回傳 `500 Internal Server Error`
- 參數錯誤回傳 `400 Bad Request`
- 資料不存在回傳 `404 Not Found`
- 正常回傳 `200 OK`

回傳值都一定是 json 格式，錯誤訊息是 json string `"error message"`，正常資料則是 json object `{key:value pairs}`

沒有回傳值的 API 代表它會回傳 `null`，這種狀況只要檢查 http status code 就可以。

# 資料結構 - Order

Order 物件由以下四個欄位組成，通通都是必要欄位

- `code`: 三碼英文貨幣代碼，不分大小寫，但伺服器回傳的一定是大寫。
- `when`: 交易時間的 timestamp。
- `foreign`: 外幣資產的變動，買入外幣為正，賣出為負。
- `local`: 本地貨幣資產的變動，買入外幣為負，賣出為正。

# API 列表

## /api/auth

使用者認證，並取回 token

### 參數

`{pin: "6 digit string"}`

`pin` 碼必須是 6 個數字

### 回傳值

成功的話傳回 token 字串，密碼錯誤則是 400 Bad Request

## /api/listall

一次列出所有交易資料

### 參數

`{token: "token string"}`

### 回傳值

`[Order object, Order object, ...]`

沒有資料不會回傳 404，而是回傳空陣列。

## /api/list

列出特定外幣的所有交易資料

### 參數

`{code: "currency code", token: "token string"}`

`code` 必須是三碼英文，不分大小寫。

### 回傳值

`[Order, Order, ...]`

沒有資料不會回傳 404，而是回傳空陣列。

## /api/add

新增一筆交易資料

### 參數

`{data: Order object, token: "token string"}`
