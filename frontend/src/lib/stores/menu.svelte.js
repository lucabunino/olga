let up = $state(false)

export function getMenu() {
	function setMenu(m) {
		menu = m
	}
	return {
		get menu() {
			return menu;
		},
		setMenu,
	};
}