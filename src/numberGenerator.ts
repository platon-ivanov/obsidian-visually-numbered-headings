import CountPlugin from "./main";
import { CountArray } from "./types";

export class NumberGenerator {
	arr: CountArray = new Array(6).fill(0) as CountArray;
	prevLvl = 0;

	constructor(private plugin: CountPlugin) {}

	result(lvl: number) {
		return this.nextNum(lvl);
	}

	nextNum(lvl: number) {
		this.incrementLvl(lvl);

		if (lvl < this.prevLvl) {
			this.resetCountArrOnLevel(lvl);
		}

		const newArr = [...this.arr].slice(
			this.plugin.settings.countStartLvl - 1,
			lvl
		);

		this.prevLvl = lvl;

		return (
			newArr.join(this.plugin.settings.joinSymbol) +
			(newArr.length !== 0 ? this.plugin.settings.endSymbol : "")
		);
	}

	incrementLvl(lvl: number, increment?: number) {
		this.arr[this.getLvlIndex(lvl)] += increment || 1;
	}

	getLvlIndex(lvl: number) {
		return lvl - 1;
	}

	resetCountArrOnLevel(lvl: number) {
		const newArr = [...this.arr];
		newArr.length = lvl;

		const res = new Array(6).fill(0);

		for (const [i, prevLvl] of newArr.entries()) {
			res[i] = prevLvl;
		}

		this.arr = res;
	}
}
