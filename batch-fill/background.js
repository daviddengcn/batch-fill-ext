if (typeof IS_TESTING == "undefined") {
    IS_TESTING = false;
}

function save(options) {
    localStorage['options'] = JSON.stringify(options)
    console.log('options saved')
}

function save_current(current) {
    localStorage['current'] = '' + current
}

function load_current() {
    return parseInt(localStorage['current']) || 0
}

function load() {
    var options = {}
    try {
        options = JSON.parse(localStorage['options'])
    } catch (err) {
        console.log("Load options failed: " + localStorage['options'] + ", " + err)
    }
    
    return options
}

function parseLine(line) {
    var res = []
    var in_quote = false
    var cur = ''
    for (var i = 0; i < line.length; i++) {
        if (in_quote) {
            if (line[i] == '"') {
                if (i < line.length - 1 && line[i + 1] == '"') {
                    cur += '"'
                    i++
                } else {
                    in_quote = false
                }
            } else {
                cur += line[i]
            }
        } else {
            if (line[i] == ',') {
                res.push(cur)
                cur = ''
            } else if (line[i] == '"') {
                in_quote = true
            } else {
                cur += line[i]
            }
        }
    }
    
    res.push(cur)
    return res
}

function parseCSV(csv) {
    var lines = csv.split('\n')
    var data = {fields: [], lines: []}
    
    if (lines.length > 0) {
        data.fields = parseLine(lines[0])
    }
    
    for (var i = 1; i < lines.length; i++) {
        data.lines.push(parseLine(lines[i]))
    }
    
    return data
}

if (!IS_TESTING) {
	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.options) {
			    save(request.options)
			    return
			}
			
			if (request.get_options) {
				sendResponse(load())
				return
			}
			
			if (request.get_data) {
			    var options = load()
			    var data = parseCSV(options.list)
			    data.current = load_current()
			    data.options = options
				sendResponse(data)
				return
			}
			
			if (request.set_current) {
			    save_current(request.set_current.current)
			    return
			}
			
			if (request.next_line) {
			    var current = load_current()
			    var options = load()
			    var data = parseCSV(options.list)
			    if (current < data.lines.length) {
			        current++
                    console.log("next_line: " + current)
			        save_current(current)
			    }
			}
		}
	)
}
