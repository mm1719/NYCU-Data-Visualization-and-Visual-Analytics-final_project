# NYCU-Data-Visualization-and-Visual-Analytics-final_project
Cause of Deaths around the World (Historical Data)


## 檔案說明
### world.html, world.js
* world.html 是這次project 的主頁面
* 啟動 VScode 的 live server 查看 world.html 頁面
* world.js 會抓 data/continents/continents-topojson.json 的資料並畫出用六大洲劃分的世界地圖

### AF/AS/EU/NA/OC/SA.html, AF/AS/EU/NA/OC/SA.js
* AF-非洲, AS-亞洲, EU-歐洲, NA-北美洲, OC-大洋洲, SA-南美洲
* 從 world.html 點擊任一洲，便會進入指定的洲.html
* 同理指定的洲.js 會抓 data/countries 裡的 JSON
  * e.g. AS.js 會抓 data/countries/AS/AS-topojson.json 的資料並畫出用國家/地區劃分的亞洲地圖


