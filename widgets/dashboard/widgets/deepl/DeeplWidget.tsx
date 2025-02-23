import {
	sourceLanguageMap,
	globalDeeplClient,
	type SourceLanguage,
	type TargetLanguage,
	targetLanguageMap,
	convertSourceToTargetLanguage,
	convertTargetToSourceLanguage,
} from '../../../../utils/deeplClient';
import { WidgetContainer } from '../../WidgetContainer';
import { bind, type GLib, GObject } from 'astal';
import { astalify, type ConstructProps } from 'astal/gtk3';
import Variable from 'astal/variable';
import Gtk from 'gi://Gtk?version=3.0';
const inputText = Variable('');
const translatedText = Variable('');
const sourceLang = Variable('EN' as SourceLanguage);
const targetLang = Variable('JA' as TargetLanguage);

class GtkComboBox extends astalify(Gtk.ComboBox) {
    static { GObject.registerClass(GtkComboBox) }

    constructor(props: ConstructProps<
        GtkComboBox,
        Gtk.ComboBox.ConstructorProps,
        { onChanged: [] }
    >) {
        // biome-ignore lint/suspicious/noExplicitAny: shove the props into the super class and hope for the best
        super(props as any)
    }
}
class GtkTextView extends astalify(Gtk.TextView) {
	static { GObject.registerClass(GtkTextView) }

	constructor(props: ConstructProps<
		GtkTextView,
		Gtk.TextView.ConstructorProps,
		{ onChanged: [] }
	>) {
		// biome-ignore lint/suspicious/noExplicitAny: shove the props into the super class and hope for the best
		super(props as any)
	}
}
function swapLanguages() {
	const currentSourceLang = sourceLang.get();
	const currentTargetLang = targetLang.get();
	sourceLang.set(convertTargetToSourceLanguage(currentTargetLang));
	targetLang.set(convertSourceToTargetLanguage(currentSourceLang));
	inputText.set(translatedText.get());
	handleTranslate();
}
async function handleTranslate() {
	if (!inputText.get()) {
		translatedText.set('');
		return;
	}
	try {
		const response = await globalDeeplClient.translate({
			source_lang: sourceLang.get(),
			target_lang: targetLang.get(),
			text: [inputText.get()],
		});

		translatedText.set(
			response?.translations?.[0].text || '翻訳に失敗しました。',
		);
	} catch (error) {
		console.error(`翻訳エラー ( ${sourceLang.get()} -> ${targetLang.get()} ):`, error);
		translatedText.set('翻訳中にエラーが発生しました。');
	}
}

export function DeeplWidget() {


	return (
		<WidgetContainer className="deepl-widget">
			<box className="widget-header" spacing={24} hexpand css="margin-bottom: 0">
				<label
					className={'widget-icon'}
					label=""
				/>
				<label
					className={'widget-title'}
					label="翻訳 (DeepL)"
				/>
				<button
					className="swap-languages-button"
					label="⇆"
					onClicked={swapLanguages}
					tooltipText={"言語を入れ替える"}
				/>
			</box>
			<box>
				<box vertical className="input-side">
					<GtkComboBox
						model={(() => {
							const store = new Gtk.ListStore();
							store.set_column_types([GObject.TYPE_STRING, GObject.TYPE_STRING]);
							for (const entry of Object.entries(sourceLanguageMap)) {
								store.set(store.append(), [1, 0], entry);
							}
							return store;
						})()}
						setup={(comboBox) => {
							const renderer = new Gtk.CellRendererText();
							comboBox.pack_start(renderer, false);
							comboBox.add_attribute(renderer, "text", 0);
							comboBox.set_active_id(sourceLang.get());
							sourceLang.subscribe(() => comboBox.set_active_id(sourceLang.get()));
							comboBox.connect("changed", () => {
								sourceLang.set(comboBox.get_active_id() as SourceLanguage);
								handleTranslate();
							});
						}}
						idColumn={1}
						tooltipText='翻訳元の言語'
						
					/>
					<GtkTextView
						expand
						wrapMode={Gtk.WrapMode.CHAR}
						setup={(textView) => {
							let timeoutId: GLib.Source | null = null;

							textView.buffer.connect("changed", () => {
								if (timeoutId) {
									clearTimeout(timeoutId);
								}
								timeoutId = setTimeout(() => {
									inputText.set(textView.buffer.get_text(textView.buffer.get_start_iter(), textView.buffer.get_end_iter(), false));
									handleTranslate();
									timeoutId = null;
								}, 1000);
							});
						}}
					/>
				</box>
				<box vertical className="output-side">
					<GtkComboBox
						model={(() => {
							const store = new Gtk.ListStore();
							store.set_column_types([GObject.TYPE_STRING, GObject.TYPE_STRING]);
							for (const entry of Object.entries(targetLanguageMap)) {
								store.set(store.append(), [1, 0], entry);
							}
							return store;
						})()}
						setup={(comboBox) => {
							const renderer = new Gtk.CellRendererText();
							comboBox.pack_start(renderer, false);
							comboBox.add_attribute(renderer, "text", 0);
							comboBox.set_active_id(targetLang.get());
							targetLang.subscribe(() => comboBox.set_active_id(targetLang.get()));
							comboBox.connect("changed", () => {
								targetLang.set(comboBox.get_active_id() as TargetLanguage);
								handleTranslate();
							});
						}}
						tooltipText='翻訳先の言語'
						idColumn={1}
					/>
					{bind(translatedText).as(t => (
						<GtkTextView
							expand
							buffer={new Gtk.TextBuffer({ text: t })}
							wrapMode={Gtk.WrapMode.CHAR}
							editable={false}
						/>
					))}
				</box>
			</box>
		</WidgetContainer>
	);
}
