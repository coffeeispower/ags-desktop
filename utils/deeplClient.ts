import { AstalIO, GLib } from "astal";

export const sourceLanguageMap = {
    BG: "ブルガリア語",
    CS: "チェコ語",
    DA: "デンマーク語",
    DE: "ドイツ語",
    EL: "ギリシャ語",
    EN: "英語",
    ES: "スペイン語",
    ET: "エストニア語",
    FI: "フィンランド語",
    FR: "フランス語",
    HU: "ハンガリー語",
    ID: "インドネシア語",
    IT: "イタリア語",
    JA: "日本語",
    KO: "韓国語",
    LT: "リトアニア語",
    LV: "ラトビア語",
    NB: "ノルウェー語",
    NL: "オランダ語",
    PL: "ポーランド語",
    PT: "ポルトガル語",
    RO: "ルーマニア語",
    RU: "ロシア語",
    SK: "スロバキア語",
    SL: "スロベニア語",
    SV: "スウェーデン語",
    TR: "トルコ語",
    UK: "ウクライナ語",
    ZH: "中国語"
} as const;

export const targetLanguageMap = {
    AR: "アラビア語",
    BG: "ブルガリア語",
    CS: "チェコ語",
    DA: "デンマーク語",
    DE: "ドイツ語",
    EL: "ギリシャ語",
    "EN-GB": "英語（イギリス）",
    "EN-US": "英語（アメリカ）",
    ES: "スペイン語",
    ET: "エストニア語",
    FI: "フィンランド語",
    FR: "フランス語",
    HU: "ハンガリー語",
    ID: "インドネシア語",
    IT: "イタリア語",
    JA: "日本語",
    KO: "韓国語",
    LT: "リトアニア語",
    LV: "ラトビア語",
    NB: "ノルウェー語",
    NL: "オランダ語",
    PL: "ポーランド語",
    "PT-BR": "ポルトガル語（ブラジル）",
    "PT-PT": "ポルトガル語（ヨーロッパ）",
    RO: "ルーマニア語",
    RU: "ロシア語",
    SK: "スロバキア語",
    SL: "スロベニア語",
    SV: "スウェーデン語",
    TR: "トルコ語",
    UK: "ウクライナ語",
    ZH: "中国語",
    "ZH-HANS": "中国語（簡体字）",
    "ZH-HANT": "中国語（繁体字）"
} as const;
export type TargetLanguage = keyof typeof targetLanguageMap;
export type SourceLanguage = keyof typeof sourceLanguageMap;
export const allSourceLanguages = Object.keys(sourceLanguageMap) as SourceLanguage[];
export const allTargetLanguages = Object.keys(targetLanguageMap) as TargetLanguage[];
export const sourceToTargetExceptionsLanguageMap: { [key in SourceLanguage]?: TargetLanguage } = {
    EN: "EN-US",
    PT: "PT-PT",
    ZH: "ZH-HANS",
};

export const targetToSourceExceptionsLanguageMap: { [key in TargetLanguage]?: SourceLanguage } = {
    "EN-GB": "EN",
    "EN-US": "EN",
    "PT-BR": "PT",
    "PT-PT": "PT",
    "ZH-HANS": "ZH",
    "ZH-HANT": "ZH",
};
export function convertSourceToTargetLanguage(sourceLang: SourceLanguage): TargetLanguage {
    return sourceToTargetExceptionsLanguageMap[sourceLang] || (sourceLang as TargetLanguage);
}

export function convertTargetToSourceLanguage(targetLang: TargetLanguage): SourceLanguage {
    return targetToSourceExceptionsLanguageMap[targetLang] || (targetLang as SourceLanguage);
}
export interface TranslateOptions {
    text: string[];
    target_lang: TargetLanguage;
    source_lang?: SourceLanguage;
    formality?: "default" | "more" | "less";
}

export interface DeepLTranslation {
    detected_source_language: string;
    text: string;
}

export interface TranslateResponse {
    translations: DeepLTranslation[];
}

export class DeepLClient {
    private apiKey: string;
    private baseUrl: string;

    /**
     * @param apiKey Your DeepL API key.
     * @param freeApi If true, uses the free API endpoint.
     */
    constructor(apiKey: string, freeApi = false) {
        this.apiKey = apiKey;
        this.baseUrl = freeApi ? "https://api-free.deepl.com/v2" : "https://api.deepl.com/v2";
    }

    /**
     * Translate text using DeepL API.
     *
     * @param options Translation options.
     * @returns A promise that resolves to the translation response.
     */
    async translate(options: TranslateOptions): Promise<TranslateResponse> {
        const url = `${this.baseUrl}/translate`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(options),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `DeepL-Auth-Key ${this.apiKey}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`DeepL API error (status: ${response.status}): ${errorBody}`);
        }

        return response.json();
    }
}
const home = GLib.get_user_config_dir();
const apiKeyFilePath = `${home}/deepl-api-key`;
const apiKey = AstalIO.read_file(apiKeyFilePath).trim();
export const globalDeeplClient = new DeepLClient(apiKey, true)