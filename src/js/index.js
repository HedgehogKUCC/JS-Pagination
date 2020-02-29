import '../scss/index.scss'
import '@babel/polyfill'

async function fetchAsync () {
  // 解決跨域問題 https://cors-anywhere.herokuapp.com/ + api
  const api = 'https://cors-anywhere.herokuapp.com/https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97'
  let response = await fetch(api)
  let data = await response.json()
  return data.result.records
}

fetchAsync().then( records => {
  let loader = document.querySelector('.loader')
  loader.classList.add('hide')

  const data = records
  let allZone = []

  data.forEach( e => allZone.push(e.Zone) )

  let filterZone = allZone.filter((e, i, a) => a.indexOf(e) === i)

  let regions = document.querySelector('#regions')

  filterZone.forEach( zone => {
    let option = document.createElement("option")
    option.value = zone
    option.text = zone
    regions.appendChild(option)
  })

  let list = document.querySelector('.list')
  let title = document.querySelector('#title')
  let pagination = document.querySelector('.pagination')
  let main = document.querySelector('.main')

  initList()

  regions.addEventListener('change', comparisonRegion)
  main.addEventListener('click', checkButton)
  pagination.addEventListener('click', switchPage)

  function comparisonRegion (e) {
    let select = e.target.value
    let len = data.length
    let array = []
    pagination.addEventListener('click', switchPage)

    if(select === '所有行政區') { 
      pagination.addEventListener('click', switchPage)

      perPage(data, 1) 

      function switchPage(e) {
        e.preventDefault()
        if(e.target.nodeName !== 'A') { return }
        const page = e.target.dataset.page
        perPage(data, page)
      }

      title.textContent = select
      return
    }
    
    for(let i = 0; i < len; i++) {
      if(select === data[i].Zone) {
        array.push({
          Name: data[i].Name,
          Picture1: data[i].Picture1,
          Opentime: data[i].Opentime,
          Add: data[i].Add,
          Tel: data[i].Tel
        })
      }
    }
    
    perPage(array, 1)

    function switchPage(e) {
      e.preventDefault()
      if(e.target.nodeName !== 'A') { return }
      const page = e.target.dataset.page
      perPage(array, page)
    }

    title.textContent = select
  }

  function checkButton(e) {
    if(e.target.nodeName !== 'BUTTON') { return }
    comparisonRegion(e)
  }

  function perPage(jsonData, nowPage) {
    // 取得全部資料長度
    const dataTotal = jsonData.length

    // 設定要顯示在畫面上的資料數量
    // 預設每一頁只顯示幾筆資料
    const perPage = 10

    // page 按鈕總數量公式，總資料數量 / 每一頁要顯示的資料
    // 因為有可能出現餘數，所以要無條件進位
    // 參考：http://www.eion.com.tw/Blogger/?Pid=1173
    const pageTotal = Math.ceil( dataTotal / perPage )

    // 對應現在當前頁數
    let currentPage = nowPage

    if(currentPage > pageTotal) { 
      currentPage = pageTotal
    }

    // 點選第二頁時要撈第 11 筆至第 20 筆
    // 由上述回推出公式
    const minData = (currentPage * perPage) - perPage + 1
    const maxData = currentPage * perPage

    const perPageData = []

    jsonData.forEach( (e, i) => {

      // 獲取陣列索引，但因為索引是從 0 開始，所以這裡才要 + 1
      const num = i + 1

      // 當 num 比 minData 大於等於且比 maxData 小於等於的資料就 push 進去新陣列
      if( num >= minData && num <= maxData) {
        perPageData.push(e)
      }
    })

    const page = {
      pageTotal,
      currentPage,
      hasPage: currentPage > 1,
      hasNext: currentPage < pageTotal
    }

    updateList(perPageData)
    pageBtn(page)
  }

  function updateList (items) {
    let str = ''
    let len = items.length
    
    for(let i = 0; i < len; i++) {
      str += `<div class="col-6 mt-36">
        <div class="card h-100">
          <div class="card-body bg-cover" style="background-image: url('${items[i].Picture1}'); height: 155px;">
            <div class="card-title">${items[i].Name}</div>
          </div>
          <div class="card-footer bg-white">
            <p class="card-text text-left"><i class="fas fa-clock"></i>${items[i].Opentime}</p>
            <p class="card-text text-left"><i class="fas fa-map-marker-alt"></i>${items[i].Add}</p>
            <p class="card-text text-left"><i class="fas fa-mobile-alt"></i>${items[i].Tel}</p>
          </div>
        </div>
      </div>`
    }
    
    list.innerHTML = str
  }

  function pageBtn(page) {
    let str = ''
    const total = page.pageTotal

    if(page.hasPage) {
      str += `
        <li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">上一頁</a></li>
      `
    } else {
      str += `
        <li class="page-item disabled"><span class="page-link">上一頁</span></li>
      `
    }

    for(let i = 1; i <= total; i++) {
      if(Number(page.currentPage) === i) {
        str += `
          <li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>
        `
      } else {
        str += `
          <li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>
        `
      }
    }

    if(page.hasNext) {
      str += `
        <li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">下一頁</a></li>
      `
    } else {
      str += `
        <li class="page-item disabled"><span class="page-link">下一頁</span></li>
      `
    }

    pagination.innerHTML = str
  }

  function switchPage(e) {
    e.preventDefault()
    if(e.target.nodeName !== 'A') { return }
    const page = e.target.dataset.page
    perPage(data, page)
  }

  function initList () {
    perPage(data, 1)
    title.textContent = '全部行政區'
  }
})
