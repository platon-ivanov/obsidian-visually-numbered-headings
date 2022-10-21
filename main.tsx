import { Plugin } from "obsidian";
import { headingCount } from "cmPlugin";

export default class CountPlugin extends Plugin {
	async onload(): Promise<void> {
		this.registerEditorExtension(headingCount());
	}
}
