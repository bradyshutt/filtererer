'use strict'


$(function() {

  $('#filterer-query').on('input', inputChange)

  //$('#filterer-results').data('og', getItems('#filterer-results').toString())


  $('#filterer-button').click(function() {
    console.log('yo')
    console.log( $('#filterer-results').data('og').split(','))
  })

  fuzzySearch.register('#filterer-results')


  /* Automatically click button after 2 seconds FOR DEV USE */
  //window.setTimeout(function() { $('#filterer-button').click() }, 1000)
})


function inputChange() {
  let currentItems = getCurrentItems('#filterer-results')
  //sort(items)
  let query = $('#filterer-query').val()
  //console.log('Query: ', query)
  fuzzySearch(query)//, items)
}


function sort(items) {
  console.log('Sorting items')
  let sorted = items.sort()
  updateResults(sorted)
}


function updateResults(items) {
  console.log('Updating results')
  let list = document.getElementById('filterer-results')
  if (items.length === 0) {
    list.innerHTML = '<li class="no-results">No results found.</li>'
  } else list.innerHTML = listify(items).join('')
}


function fuzzySearch(query, items) {
  if (fuzzySearch[query]) {
    console.log('Match found from memo:', query)
    updateResults(fuzzySearch[query])
    return fuzzySearch[query] 
  } 

  if (fuzzySearch[query.slice(0, -1)])
    items = fuzzySearch[query.slice(0, -1)] 
  else 
    items = items || fuzzySearch['__default__']

  console.log('Fuzzy searching through [', items.length,']items')

  let results = items.filter(function(word) { 
    word = word.toLowerCase()
    let widx = 0
    let qidx = 0
    for ( ; widx < word.length; widx++) {
      if (query[qidx] === word[widx]) {
        /* If this is the last letter in the query, return true */
        if (qidx === query.length - 1)
          return true
        else
          qidx++
      }
    } 
    return false
  })
  fuzzySearch[query] = results
  updateResults(results)
}

fuzzySearch.register = function(items) {
  fuzzySearch[''] = getCurrentItems(items)
  fuzzySearch['__default__'] = fuzzySearch['']
}


/* Surround each item in items with <li> open & close tags */
function listify(items) {
  return items.map(function(e) { return '<li>' + e + '</li>'})
}


function getCurrentItems(ul) {
  return $(ul + ' li')
    .map(function() { return $(this).text() })
    .toArray()
}






