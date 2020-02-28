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
  const data = records

  let regions = document.querySelector('#regions')
  let list = document.querySelector('.list')
  let title = document.querySelector('#title')
  let pagination = document.querySelector('.pagination')
  let pageItems = pagination.getElementsByClassName('page-item')
  let page1 = document.querySelector('.page1')
  let page2 = document.querySelector('.page2')
  let page3 = document.querySelector('.page3')
  let main = document.querySelector('.main')

  initList()

  // 參考 w3schools.com
  // https://www.w3schools.com/howto/howto_js_active_element.asp
  for (let i = 0; i < pageItems.length; i++) {
    pageItems[i].addEventListener("click", function() {
      let current = document.getElementsByClassName("active")
      current[0].className = current[0].className.replace(" active", "")
      this.className += " active"
    })
  }

  regions.addEventListener('change', comparisonRegion)
  main.addEventListener('click', checkButton)
  page1.addEventListener('click', pageOne)
  page2.addEventListener('click', pageTwo)
  page3.addEventListener('click', pageThree)

  function comparisonRegion (e) {
    let select = e.target.value
    let len = data.length
    let array = []
    
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
    
    updateList(array)
    title.textContent = select
  }

  function checkButton(e) {
    if(e.target.nodeName !== 'BUTTON') { return }
    comparisonRegion(e)
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
    pagination.classList.add('hide')
  };

  function initList () {
    pageOne()
    title.textContent = '全部行政區'
  }

  function pageOne () {
    let str = ''
    
    for(let i = 0; i < 10; i++) {
      str += `<div class="col-6 mt-36">
        <div class="card h-100">
          <div class="card-body bg-cover" style="background-image: url('${data[i].Picture1}'); height: 155px;">
            <div class="card-title">${data[i].Name}</div>
          </div>
          <div class="card-footer bg-white">
            <p class="card-text text-left"><i class="fas fa-clock"></i>${data[i].Opentime}</p>
            <p class="card-text text-left"><i class="fas fa-map-marker-alt"></i>${data[i].Add}</p>
            <p class="card-text text-left"><i class="fas fa-mobile-alt"></i>${data[i].Tel}</p>
          </div>
        </div>
      </div>`
    }
    
    list.innerHTML = str
  };

  function pageTwo () {
    let str = ''
    
    for(let i = 10; i < 20; i++) {
      str += `<div class="col-6 mt-36">
        <div class="card h-100">
          <div class="card-body bg-cover" style="background-image: url('${data[i].Picture1}'); height: 155px;">
            <div class="card-title">${data[i].Name}</div>
          </div>
          <div class="card-footer bg-white">
            <p class="card-text text-left"><i class="fas fa-clock"></i>${data[i].Opentime}</p>
            <p class="card-text text-left"><i class="fas fa-map-marker-alt"></i>${data[i].Add}</p>
            <p class="card-text text-left"><i class="fas fa-mobile-alt"></i>${data[i].Tel}</p>
          </div>
        </div>
      </div>`
    }
    
    list.innerHTML = str
  };

  function pageThree () {
    let str = ''
    
    for(let i = 20; i < 22; i++) {
      str += `<div class="col-6 mt-36">
        <div class="card h-100">
          <div class="card-body bg-cover" style="background-image: url('${data[i].Picture1}'); height: 155px;">
            <div class="card-title">${data[i].Name}</div>
          </div>
          <div class="card-footer bg-white">
            <p class="card-text text-left"><i class="fas fa-clock"></i>${data[i].Opentime}</p>
            <p class="card-text text-left"><i class="fas fa-map-marker-alt"></i>${data[i].Add}</p>
            <p class="card-text text-left"><i class="fas fa-mobile-alt"></i>${data[i].Tel}</p>
          </div>
        </div>
      </div>`
    }
    
    list.innerHTML = str
  }
})
