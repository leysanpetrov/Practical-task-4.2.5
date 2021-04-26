async function getData (url, query, search) {
  const response = await fetch(url + query + search)
  return await response.json()
}




const debounce = (appendData, debounceTime = 500) => {
  let timeOut
  return function () {
    const func = () => {appendData.apply(this, arguments)}
    clearTimeout(timeOut)
    timeOut = setTimeout(func, debounceTime)
  }
}

const input = document.querySelector('input')
input.addEventListener('input', debounce(appendData))

// фабрика по производству объекта репозитория ))))
function RepoForAdd (item) {
  this.name = item.name
  this.owner = item.owner.login
  this.stars = item.stargazers_count
}


async function appendData (event) {
  let data = await getData(`https://api.github.com/search/repositories`, '?q=topic:', event.target.value)
    .then((data) => {
      return data.items.slice(0, 5)
    })

  const variations = document.querySelector('.variations')

  variations.innerHTML = ''

  for (const item of data) {
    variations.innerHTML += `<div id = "${item.id}" class="variation">${item.name}</div>`
  }

  if (!input.value) {
    variations.innerHTML = ''
  }

  let variation = document.querySelectorAll('.variation')
  const blockRepo = document.querySelector('.block-repo')

  for (const item of variation) {
    item.addEventListener('click', addRepo)
  }

  function info (ids) {
    const element = data.find(item => item.id === Number(ids))
    let repo = new RepoForAdd(element)
    return repo

  }

  function addRepo () {
    blockRepo.innerHTML += `<div class="repo">
      <div>
      Name:${info(this.id).name}</br>
      Owner:${info(this.id).owner}</br>
      Stars:${info(this.id).stars}
      </div>
      <div class="close-btn"></div>
      </div>`
    this.removeEventListener('click', addRepo)

    let closeBtn = document.querySelectorAll('.close-btn')

    for (const item of closeBtn) {
      item.addEventListener('click', function () {
        item.parentNode.remove()
        for (const item of variation) {
          item.addEventListener('click', addRepo)
        }
      })
    }

  }

}




