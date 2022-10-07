export function getInitial(str) {
	if (str) {
		return str.split(` `).map(word => word[0]).join(``).toUpperCase().substr(0, 2)
	}
}