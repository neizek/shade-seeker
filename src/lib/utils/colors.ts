export function slightlyChangeHexColor(hexColor: string, adjustmentLevel: number) {
	// Validate and normalize the hex color
	hexColor = hexColor.replace(/^#/, '');
	if (hexColor.length === 3) {
		hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
	}
	
	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);
	
	// Calculate adjustment amount based on level (1-5)
	// Level 1: more noticeable change, Level 5: subtle change
	const baseAdjustment = 30; // Maximum adjustment amount
	const adjustmentFactor = (6 - adjustmentLevel) / 5; // Convert level to factor (1→1.0, 5→0.2)
	const adjustmentAmount = Math.round(baseAdjustment * adjustmentFactor);
	
	// Randomly decide whether to increase or decrease each component
	const rAdjust = Math.random() > 0.5 ? adjustmentAmount : -adjustmentAmount;
	const gAdjust = Math.random() > 0.5 ? adjustmentAmount : -adjustmentAmount;
	const bAdjust = Math.random() > 0.5 ? adjustmentAmount : -adjustmentAmount;
	
	// Apply adjustments with bounds checking
	const newR = Math.min(255, Math.max(0, r + rAdjust));
	const newG = Math.min(255, Math.max(0, g + gAdjust));
	const newB = Math.min(255, Math.max(0, b + bAdjust));
	
	// Convert back to hex
	const componentToHex = (c: number) => {
		const hex = c.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	
	return '#' + componentToHex(newR) + componentToHex(newG) + componentToHex(newB);
}

export function generateRandomHexColor() {
	const hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
	let code = "";
	
	for (let i = 0; i < 6; i++) {
		code += hexArray[Math.floor(Math.random() * 16)];
	}
	
	return `#${code}`;
}