let view = $state('grid')
let category = $state(undefined)
let subcategories = $state([])
let filters = $state(false)
let search = $state('search')

export function getPortfolio() {
    return {
        get view() { return view; },
        setView(v) { view = v; },
        
        get category() { return category; },
        setCategory(c) {
            category = c;
            subcategories = [];
        },

        get subcategories() { return subcategories; },
        toggleSubcategory(slug) {
            if (subcategories.includes(slug)) {
                subcategories = subcategories.filter(s => s !== slug);
            } else {
                subcategories = [...subcategories, slug];
            }
        },

        get filters() { return filters; },
        setFilters(f) { filters = f; },
        
        get search() { return search; },
        setSearch(s) { search = s; }
    };
}