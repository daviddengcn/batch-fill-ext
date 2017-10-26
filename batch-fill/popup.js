function fill() {
    chrome.tabs.executeScript(null, {
        code: "fast_fill()",
    })
}

function init() {
    document.getElementById('fill-btn').addEventListener('click', fill)

    var optionslink = document.getElementById('optionslink')
    if (chrome.runtime.openOptionsPage) {
        optionslink.href = '#'
        optionslink.onclick = function() {
            chrome.runtime.openOptionsPage()
        }
    }

    var update_list = function() {
        var radios = document.querySelectorAll('tbody input[type="radio"]')
        var passed = true
        for (var i = 0; i < radios.length; i++) {
            var radio = radios[i]
            var tr = radio.parentNode
            while (tr.tagName.toLowerCase() != "tr") {
                tr = tr.parentNode
            }
        
            if (radio.checked) {
                tr.classList.remove('passed')
                tr.classList.add('selected')
                chrome.extension.sendRequest({set_current:{current: i}})
                passed = false
            } else {
                tr.classList.remove('selected')
                if (passed) {
                    tr.classList.add('passed')
                } else {
                    tr.classList.remove('passed')
                }
            }
        }
    }

    chrome.extension.sendRequest({get_data:{}}, function(data) {
        var thead_tr = document.getElementById('thead_tr')
        thead_tr.innerHTML = '<td></td>'
        for (var i in data.fields) {
            var th = document.createElement("td")
            th.innerText = data.fields[i]
            thead_tr.appendChild(th)
        }
        
        var tbody = document.getElementById('tbody')
        tbody.innerHTML = ''
        for (var i = 0; i <= data.lines.length; i++) {
            var current = data.current == i
            var tr = document.createElement('tr')
            var td = document.createElement('td')
            var radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = 'list'
            radio.checked = current
            radio.id = 'radio-' + i
            radio.addEventListener('click', update_list)
            td.appendChild(radio)
            tr.appendChild(td)

            var line            
            if (i < data.lines.length) {
                var line = data.lines[i]
                for (var j = 0; j < line.length; j++) {
                    var td = document.createElement('td')
                    var vl = line[j]
                    var label = document.createElement('label')
                    label.htmlFor = radio.id
                    label.innerText = vl
                    td.appendChild(label)
                    tr.appendChild(td)
                }
            } else {
                var td = document.createElement('td')
                td.innerHTML = '<label class="end" for="' + radio.id + '">END</label>'
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }
        update_list()
    })
}

window.addEventListener('load', init)
