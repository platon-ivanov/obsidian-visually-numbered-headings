import { Plugin } from "obsidian";

export default class HeadingCountPlugin extends Plugin {
	hClassName = "cm-header";
	countArr: number[] = new Array(6).fill(0);
	prevLvl = 0;

	async onload(): Promise<void> {
		this.registerInterval(
			window.setInterval(this.updateHeadingNums.bind(this), 1000)
		);
	}

	async updateHeadingNums() {
		this.addDataAttrs(document.querySelectorAll(`.${this.hClassName}`));
		this.addDataAttrs(document.querySelectorAll(`h1, h2, h3, h4, h5, h6`));
	}

	addDataAttrs(headings: NodeListOf<Element>) {
		this.resetCountArr(0);
		this.resetLvl();

		for (const h of headings) {
			if (!(h instanceof HTMLElement)) return;

			const headingLvl = Number(
				h.className
					.split(" ")
					.find((c) => c.startsWith(`${this.hClassName}-`))
					?.replace(`${this.hClassName}-`, "")
			);

			this.countArr[headingLvl - 1] += 1;

			if (headingLvl < this.prevLvl) {
				this.resetCountArr(headingLvl);
			}

			for (const [i, count] of this.countArr.entries()) {
				h.dataset[`level-${(i + 1).toString()}`] = count.toString();
			}

			this.prevLvl = headingLvl;
		}
	}

	resetCountArr(level: number) {
		this.countArr.length = level;
		this.countArr = new Array(6)
			.fill(0)
			.map((res, i) => this.countArr[i] || 0);
	}

	resetLvl() {
		this.prevLvl = 0;
	}
}
