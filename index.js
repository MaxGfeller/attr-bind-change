module.exports = function () {
    var bindings = {};
    var config = { attributes: true, childList: true, characterData: true };
    
    return function (elem, attr) {
        var key = elem[attr];
        var b = bindings[key];
        if (!b) b = bindings[key] = { elements: [], value: get(elem) };
        else set(elem, b.value);
        
        b.elements.push(elem);
        
        elem.addEventListener('change', onchange);
        elem.addEventListener('keydown', onchange);
        elem.addEventListener('keyup', onchange);
        
        function onchange () {
            var x = get(elem);
            if (x === b.value) return;
            b.value = x;
            
            for (var i = 0; i < b.elements.length; i++) {
                if (b.elements[i] === elem) continue;
                set(b.elements[i], b.value);
            }
        }
    };
    
    function set (elem, value) {
        if (typeof value !== 'string') value = String(value);
        
        if (elem.value !== undefined) {
            elem.value = value;
        }
        else if (elem.textContent !== undefined) {
            elem.textContent = value;
        }
        else if (elem.innerText !== undefined) {
            elem.innerText = value;
        }
        else {
            var txt = document.createTextNode(value);
            elem.innerHTML = '';
            elem.appendChild(txt);
        }
    }
    
    function get (elem) {
        if (elem.value !== undefined) return elem.value;
        if (editable(elem)) return elem.value;
        return elem.textContent || elem.innerText;
    }
    
    function editable (elem) {
        if (!elem || !elem.tagName) return false;
        var tag = elem.tagName.toUpperCase();
        return tag === 'INPUT' || tag === 'TEXTAREA';
    }
};
