import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

const pos = new Tween({ x: 0, y: 0 }, { duration: 2000, easing: cubicOut })
let visible = $state(false)

export function getCursor() {
	return {
		get x() { return pos.current.x },
		get y() { return pos.current.y },
		get visible() { return visible },
		move(x, y) {
			visible = true
			pos.set({ x, y })
		},
	}
}
