# NYCU-Data-Visualization-and-Visual-Analytics-final_project
Cause of Deaths around the World (Historical Data)


## 檔案說明
所有的javascript檔案都用模組化的方式寫

### world.html, world.js
* world.html 是這次project 的主頁面
* 啟動 VScode 的 live server 查看 world.html 頁面
* world.js 會抓 data/continents/continents-topojson.json 的資料並畫出用六大洲劃分的世界地圖

### AF/AS/EU/NA/OC/SA.html, AF/AS/EU/NA/OC/SA.js
* AF-非洲, AS-亞洲, EU-歐洲, NA-北美洲, OC-大洋洲, SA-南美洲
* 從 world.html 點擊任一洲，便會進入指定的洲.html
* 同理指定的洲.js 會抓 data/countries 裡的 JSON
  * e.g. AS.js 會抓 data/countries/AS/AS-topojson.json 的資料並畫出用國家/地區劃分的亞洲地圖

### deathData.js
* 將 data/cause_of_death.csv 載入並做預先處理
* `allData`
  * 除了原本 kaggle 給的各國的數據資料，還有各大洲的數據總和，以及全球的數據總和
* `worldData`
  * 對應到 world.html, world.js，僅有全球總合和各大洲數據總和的資料
* `afData`
  * 對應到 AF.html, AF.js，包含非洲資料的數據總和，以及非洲各國的數據資料
* `asData`, `euData`, `naData`, `ocData`, `saData`
  * 同理於 `afData`
* `loadData()`
  * 就是處理上述的這幾種變數
* `getData()`
  * export 給其他 JS 使用，會根據指定的地區載入 `worldData`/`afData`/`asData`/`euData`/`naData`/`ocData`/`saData`
  * 如果剛開始 world.html 載入時，因為 `allData` 是 undefined，所以會呼叫 `loadData`
  * 再來會根據指定的時間和死因呼叫 `filterData(data, selectedDeathCause, selectedYear)`
  * 要同時滿足 `selectedDeathCause` 和 `selectedYear` 存在才會，啟動!
* `data = selectContinentData(code)`
  * 根據指定的洲代碼，取出相對應的國家資料並回傳。
* `sumByYear_all(allData)`, `sumByYear_continents(data, continent, code)`
  * 得出一年一度的，各種病因的死亡人數和，前者算出全世界的人數和，後者算出各洲的人數和。這些總和的rows會被插入 allData 裡面
* `data getWorldAndContinentsData()`
  * 這是專給 `worldData` 用的，從 `allData` 拉出全世界的資料跟各大洲的資料
* `filteredData = filterData(data, selectedDeathCause, selectedYear)`
  * 根據選出的年份和死因，選出過濾的資料

###  dropdown.js
* 主要都是跟 dropdown 互動的function 我寫完了但看不懂
* 在進入新的頁面時，會去檢查如果 `sessionStorage.getItem("selectedDeathCause")` 的值改變了，就會呼叫 `getData`

### timeline.js
* 有點複雜，主要有三種觸發流程
  * click 圓點 -> 圓點變黑 -> 三角形跟隨過去 -> 更新標題的時間以及呼叫 `getData`
  * drag 三角形 -> 被指到的圓點變黑 -> 更新標題的時間以及呼叫 `getData` (這是即時的)
  * 在進入新的頁面時，`sessionStorage.getItem("selectedYear")` 的值改變了 -> 指定的圓點變黑 -> 三角形跟隨過去 -> 更新標題的時間以及呼叫 `getData`
* `handleButtonClick(event)`
  * 被點擊時啟動，處理第一種情形，負責圓點變黑和三角形跟隨
* `setActiveButton(selectedYear)`
  * dragging 三角形時啟動，處理第二種情形，負責圓點變黑並呼叫 `setTriangle(button)` 和 `handleYearSelection(selectedYear)`
    * 這個時候呼叫 `setTriangle(button)` 其實無用，是為了第三階段的流程才呼叫
  * 處理第三種情形
* `setTriangle(button)`
  * 找出 button 的位置隨後三角形移動過去
* ``
 
