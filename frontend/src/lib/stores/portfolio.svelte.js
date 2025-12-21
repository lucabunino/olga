let view = $state('grid')
let category = $state(undefined)
let filters = $state(false)
let search = $state('search')

export function getPortfolio() {
	function setView(v) {
		view = v
	}
	function setCategory(c) {
		category = c
	}
	function setFilters(f) {
		filters = f
	}
	function setSearch(s) {
		search = s
	}
	return {
		get view() {
			return view;
		},
		setView,
		get category() {
			return category;
		},
		setCategory,
		get filters() {
			return filters;
		},
		setFilters,
		get search() {
			return search;
		},
		setSearch,
	};
}