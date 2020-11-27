/**
 * It is always bad ideas to extend prototypes...
 */

function shuffle() {
	var t1, j, ret = this.slice(0), i = ret.length;
	while (--i > 0) {
		t1 = ret[j = Math.round(Math.random() * i)];
		ret[j] = ret[i];
		ret[i] = t1;
	}
	return ret;
}

function random() {
	return this[Math.floor(Math.random() * this.length)];
}


Array.prototype.random = random;
Array.prototype.shuffle = shuffle;
