let open = $state(false)
let hidden = $state(false)

export function getMenu() {
	function setOpen(o) {
		open = o
	}
	function setHidden(h) {
		hidden = h
	}
	return {
		get open() {
			return open;
		},
		setOpen,
		get hidden() {
			return hidden;
		},
		setHidden,
	};
}