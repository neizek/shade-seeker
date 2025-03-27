export function addLeadingZeros(num: number | string, totalLength: number = 3) {
	return String(num).padStart(totalLength, '0');
}