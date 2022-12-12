import { NumberGenerator } from "./numberGenerator";
import { syntaxTree } from "@codemirror/language";
import { Extension, RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import CountPlugin from "./main";

const className = "HyperMD-header_HyperMD-header-";

export class CountWidget extends WidgetType {
	constructor(private count: string) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = this.count;
		div.classList.add("custom-heading-count");

		return div;
	}
}

export function headingCountPlugin(plugin: CountPlugin) {
	return ViewPlugin.fromClass(
		class {
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
				const numGen = new NumberGenerator(plugin);

				syntaxTree(view.state).iterate({
					enter(node) {
						const nodeName = node.type.name;

						if (nodeName.startsWith(className)) {
							const hRef = node;
							const hLevel = Number(nodeName.split(className)[1]);

							builder.add(
								hRef.from,
								hRef.from,
								Decoration.widget({
									widget: new CountWidget(
										numGen.nextNum(hLevel)
									),
								})
							);
						}
					},
				});

				return builder.finish();
			}
		},
		{ decorations: (v) => v.decorations }
	);
}

export function cmPlugin(plugin: CountPlugin): Extension {
	const baseTheme = EditorView.baseTheme({
		".custom-heading-count": {
			opacity: 0.5,
		},
	});

	return [baseTheme, headingCountPlugin(plugin)];
}
