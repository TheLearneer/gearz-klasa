/**
 * It is always bad ideas to extend prototypes...
 */

function toHumanString() {
	const thousand = 1000, million = 1000000, billion = 1000000000;

	if (this >= billion) return `${trimFloat(this / billion)}b`;
	else if (this >= million) return `${trimFloat(this / million)}m`;
	else if (this >= thousand) return `${trimFloat(this / thousand)}k`;
	else return String(this);
}

function trimFloat(float) {
	float = float.toFixed(1);
	// eslint-disable-next-line eqeqeq
	if (float == parseInt(float)) {
		return parseInt(float);
	}
	return float;
}


Number.prototype.toHumanString = toHumanString;
