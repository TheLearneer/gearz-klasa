/**
 * It is always bad ideas to extend prototypes...
 */

function toTitleCase() {
	return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function shorten(maxLen) {
	if (!maxLen) return String(this);
	return this.length > maxLen ? `${this.substr(0, maxLen - 3)}...` : String(this);
}

String.prototype.toTitleCase = toTitleCase;
String.prototype.shorten = shorten;
