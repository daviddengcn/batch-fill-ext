function fill(data, force) {
    // check 'site'    
    var m = document.URL.match('//([^/]+)/')
    if (!m) {
        return
    }
    var host = m[1]

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    if (!(host == data.options.site || endsWith(host, "." + data.options.site))) {
        return
    }
    
    // check current
    if (data.current < 0 || data.current >= data.lines.length) {
        console.log("current: " + data.current)
        return
    }
    
    // check newline signature
    if (data.options.newline) {
        var txt = document.body.innerText
        if (txt.indexOf(data.options.newline) >= 0) {
            console.log("new_line")
            chrome.extension.sendRequest({next_line:{}})
            return
        }
    }

    // fill values
    var line = data.lines[data.current]
    var map = {}
    for (var i = 0; i < data.fields.length; i++) {
        if (i < line.length) {
            var name = data.fields[i]
            var value = line[i]
            var l = document.getElementsByName(name)
            for (var j = 0; j < l.length; j++) {
                if (force || l[j].value == '') {
                    console.log('Fill input ' + name + ' with ' + value)
                    l[j].value = value
                }
            }
        }
    }
}

chrome.extension.sendRequest({get_data:{}}, function(data) {
    if (!data.options.enabled) {
        return
    }
    
    var delay = data.options.delay || 0
    console.log("delay: " + delay)
    setTimeout(function() {
        fill(data, false)
    }, delay*1000)
})

function fast_fill() {
    console.log('fast_fill')
    chrome.extension.sendRequest({get_data:{}}, function(data) {
        if (!data.options.enabled) {
            return
        }
    
        fill(data, true)
    })
}