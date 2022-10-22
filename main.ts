import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {BetterFormatting} from "src/betterformatting"
// Remember to rename these classes and interfaces!

interface MakeItBiggerSettings {
	font_size: number;
}

const DEFAULT_SETTINGS: MakeItBiggerSettings = {
	font_size: 20,
}

export default class MakeItBigger extends Plugin {
	settings: MakeItBiggerSettings;
	formatter: BetterFormatting;

	async onload() {
		this.formatter = new BetterFormatting(this.app,this)
		await this.loadSettings();
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'make-text-bigger',
			name: 'Make text bigger',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.formatter.toggleWrapper(editor, view, `<font size=${this.settings.font_size}>`, '</font>')
			}
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MakeItBiggerSettingsPane(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class MakeItBiggerSettingsPane extends PluginSettingTab {
	plugin: MakeItBigger;

	constructor(app: App, plugin: MakeItBigger) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings: '});

		new Setting(containerEl)
			.setName('font size')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.font_size.toString())
				.onChange(async (value) => {
					this.plugin.settings.font_size = parseInt(value);
					await this.plugin.saveSettings();
				}));
	}
}
