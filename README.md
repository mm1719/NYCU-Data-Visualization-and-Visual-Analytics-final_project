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
* allData
  * 除了原本 kaggle 給的各國的數據資料，還有各大洲的數據總和，以及全球的數據總和
* worldData
  * 對應到 world.html, world.js，僅有全球總合和各大洲數據總和的資料
* afData
  * 對應到 AF.html, AF.js，包含非洲資料的數據總和，以及非洲各國的數據資料
* asData, euData, naData, ocData, saData
  * 同理於 afData

