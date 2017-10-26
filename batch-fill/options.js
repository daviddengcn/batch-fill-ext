function save() {
    var options = {
        enabled: document.getElementById('enabled').checked,
        delay: parseInt(document.getElementById('delay').value),
        site: document.getElementById('site').value,
        newline: document.getElementById('newline').value,
        list: document.getElementById('list').value,
    }
    
    chrome.extension.sendRequest({options: options})
    
    console.log('save() done')
}

function init() {
    document.getElementById('enabled').addEventListener('change', save)
    document.getElementById('delay').addEventListener('change', save)
    document.getElementById('site').addEventListener('change', save)
    document.getElementById('newline').addEventListener('change', save)
    document.getElementById('list').addEventListener('input', save)

    chrome.extension.sendRequest({get_options:{}}, function(options) {
        document.getElementById('enabled').checked = options.enabled || false
        document.getElementById('delay').value = options.delay || '0'
        document.getElementById('site').value = options.site || ''
        document.getElementById('newline').value = options.newline || ''
        document.getElementById('list').value = options.list || ''
    })
    console.log('init() done')
}

window.addEventListener('load', init)