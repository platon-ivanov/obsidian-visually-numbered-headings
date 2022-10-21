import { syntaxTree } from "@codemirror/language";
import { Extension, RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";

const baseTheme = EditorView.baseTheme({
	".cm-header-count": {
		position: "absolute",
		transform: "translateX(calc(-100% - 0.7rem))",
		opacity: 0.5,
	},
});

const className = "HyperMD-header_HyperMD-header-";

class Counter {
	countArr: number[] = new Array(6).fill(0);
	prevLvl = 0;

	count(cn: string) {
		const lvl = this.extractLvl(cn);

		this.incrementLvl(lvl);

		if (lvl < this.prevLvl) {
			this.resetCountArrOnLevel(lvl);
		}

		this.prevLvl = lvl;

		return this.createNum(lvl);
	}

	incrementLvl(lvl: number) {
		this.countArr[this.getLvlIndex(lvl)] += 1;
	}

	resetCountArrOnLevel(lvl: number) {
		this.countArr.length = lvl;
		this.countArr = new Array(6)
			.fill(0)
			.map((res, i) => this.countArr[i] || 0);
	}

	resetLvl() {
		this.prevLvl = 0;
	}

	getLvlIndex(lvl: number) {
		return lvl - 1;
	}

	getCount(lvl: number) {
		return this.countArr[this.getLvlIndex(lvl)];
	}

	extractLvl(name: string) {
		console.log(name, className);

		const headingLvl = name.replace(`${className}`, "");

		return Number(headingLvl);
	}

	createNum(lvl: number) {
		const newArr = [...this.countArr];
		newArr.length = lvl;

		return newArr.join(".");
	}
}

export class CountWidget extends WidgetType {
	constructor(private count: string) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = this.count;
		div.classList.add("cm-header-count");

		return div;
	}
}

class HeadingCountCMPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const counter = new Counter();

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
					const nodeName = node.type.name;

					if (nodeName.startsWith(className)) {
						const num = counter.count(nodeName);

						builder.add(
							node.from,
							node.from,
							Decoration.widget({
								widget: new CountWidget(num),
							})
						);
					}
				},
			});
		}

		return builder.finish();
	}
}

const pluginSpec: PluginSpec<HeadingCountCMPlugin> = {
	decorations: (value: HeadingCountCMPlugin) => value.decorations,
};

export const headingCountPlugin = ViewPlugin.fromClass(
	HeadingCountCMPlugin,
	pluginSpec
);

export function headingCount(options: { step?: number } = {}): Extension {
	return [baseTheme, headingCountPlugin];
}
