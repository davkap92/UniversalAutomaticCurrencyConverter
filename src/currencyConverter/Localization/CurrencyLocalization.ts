import {IBrowser, ILogger, ISetting} from "../../infrastructure";
import {Provider} from '../../infrastructure';

export class CurrencyLocalization {
    value: string;
    defaultValue: string;
    detectedValue: string;
    private browser: IBrowser;

    private readonly key: string;
    private readonly setting: ISetting<string>;
    private readonly logger: ILogger;

    constructor({browser, logger}: Provider, key: string, setting: ISetting<string>) {
        this.logger = logger;
        this.browser = browser;
        this.setting = setting;
        this.key = key
        this.value = '';
        this.defaultValue = '';
        this.detectedValue = '';
    }

    override(value: string | undefined): void {
        if (!value) return;
        if (/^[A-Z]{3}$/.test(value))
            this.value = value;
    }

    async save(): Promise<void> {
        await this.browser.saveLocal(this.key, this.value);
    }

    setDetected(value: string): void {
        this.override(value)
        this.detectedValue = this.value;
        this.logger.debug(`Detected localization: ${this.detectedValue}`)
    }

    async load(): Promise<void> {
        const localValue = await this.browser.loadLocal<string>(this.key);
        this.value = localValue || this.setting.value;
        this.defaultValue = this.value;
        this.logger.debug(`Default localization: ${this.defaultValue}`)
    }

    reset(toDefault: boolean): void {
        this.value = toDefault ? this.defaultValue : this.detectedValue;
    }

    hasConflict(): boolean {
        return this.detectedValue !== this.defaultValue;
    }
}