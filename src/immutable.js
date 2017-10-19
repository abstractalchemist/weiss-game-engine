// implements immutable 

function update(state, property, newval) {
    // clone all other properties
    let newstate = {}
    // we assume an object with a length property is an array
    for(let prop in state) {
	if(state.hasOwnProperty(prop)) {
	    if(prop === property)
		newstate[prop] = newval
	    else
		newstate[prop] = state[prop]
//	    delete state.prop
	}
    }
    return newstate;
}

function copyarray(ar) {
    return ar.map(o => o);
}

function updatearray(ar, index, val) {
    let buffer = [];
    ar.forEach( (curval, i) => {
	if(i === index)
	    buffer.push(val)
	else
	    buffer.push(curval)
//	delete ar[i]
    })
    return buffer;
	
}

function removearrayelem(ar, index) {
    let buffer = []
    let found = false;
    ar.forEach( (val, i) => {
	if(found || i !== index) {
	    buffer.push(val)
	}
	
	found = found || i === index;
    })
    return buffer;
}

export { update, copyarray, updatearray, removearrayelem }
				   
