import {IBrowser} from "../src/infrastructure";
import {ITabMessenger} from "../src/infrastructure/BrowserMessengers/TabMessenger";
import {IPopupMessenger} from "../src/infrastructure/BrowserMessengers/PopupMessenger";
import {BrowserDataStorage, Browsers, Environments} from "../src/infrastructure/Browser/Browser";
import {IBackgroundMessenger, RateResponse} from "../src/infrastructure/BrowserMessengers/BackgroundMessenger";
import {JSDOM} from "jsdom";
import {HtmlMock} from "./Html.mock";

export class BrowserMock implements IBrowser {

    readonly extensionName: string;
    readonly access: typeof chrome;
    readonly author: string;
    readonly background: IBackgroundMessenger;
    readonly environment: Environments;
    readonly extensionUrl: string;
    readonly extensionVersion: string;
    readonly id: string;
    readonly isChrome: boolean;
    readonly isDevelopment: boolean;
    readonly isEdge: boolean;
    readonly isFirefox: boolean;
    readonly isProduction: boolean;
    readonly popup: IPopupMessenger;
    readonly reviewLink: string;
    readonly tab: ITabMessenger;
    readonly type: Browsers;

    readonly rates: Record<string, Record<string, number>> = {}
    private _url?: URL;

    addRate(from: string, to: string, rate: number) {
        if (!this.rates[from]) this.rates[from] = {}
        this.rates[from][to] = rate;
    }

    setUrl(url: URL) {
        this._url = url;
    }

    constructor() {
        this.extensionName = 'Universal Automatic Currency Converter'
        // @ts-ignore
        this.access = {}
        this.author = 'Baizey'
        // @ts-ignore
        this.background = {
            getRate: async (from: string, to: string): Promise<RateResponse | null> => {
                const symbols = await this.background.getSymbols();
                if (!(from in symbols) || !(to in symbols)) return null;
                if (this.rates[from] && this.rates[from][to])
                    return {from: from, to: to, timestamp: Date.now(), rate: this.rates[from][to], path: []}
                return {from: from, to: to, timestamp: Date.now(), rate: 1, path: []}
            },
            getSymbols: (): Promise<{ [key: string]: string }> => {
                return Promise.resolve({
                    "symbols": {
                        "AED": "United Arab Emirates Dirham",
                        "AFN": "Afghan Afghani",
                        "ALL": "Albanian Lek",
                        "AMD": "Armenian Dram",
                        "ANG": "Netherlands Antillean Guilder",
                        "AOA": "Angolan Kwanza",
                        "ARS": "Argentine Peso",
                        "AUD": "Australian Dollar",
                        "AWG": "Aruban Florin",
                        "AZN": "Azerbaijani Manat",
                        "BAM": "Bosnia-Herzegovina Convertible Mark",
                        "BBD": "Barbadian Dollar",
                        "BDT": "Bangladeshi Taka",
                        "BGN": "Bulgarian Lev",
                        "BHD": "Bahraini Dinar",
                        "BIF": "Burundian Franc",
                        "BMD": "Bermudan Dollar",
                        "BND": "Brunei Dollar",
                        "BOB": "Bolivian Boliviano",
                        "BRL": "Brazilian Real",
                        "BSD": "Bahamian Dollar",
                        "BTC": "Bitcoin",
                        "BTN": "Bhutanese Ngultrum",
                        "BWP": "Botswanan Pula",
                        "BYN": "Belarusian Ruble",
                        "BYR": "Belarusian Ruble",
                        "BZD": "Belize Dollar",
                        "CAD": "Canadian Dollar",
                        "CDF": "Congolese Franc",
                        "CHF": "Swiss Franc",
                        "CLF": "Chilean Unit of Account (UF)",
                        "CLP": "Chilean Peso",
                        "CNY": "Chinese Yuan",
                        "COP": "Colombian Peso",
                        "CRC": "Costa Rican Colón",
                        "CUC": "Cuban Convertible Peso",
                        "CUP": "Cuban Peso",
                        "CVE": "Cape Verdean Escudo",
                        "CZK": "Czech Republic Koruna",
                        "DJF": "Djiboutian Franc",
                        "DKK": "Danish Krone",
                        "DOP": "Dominican Peso",
                        "DZD": "Algerian Dinar",
                        "EGP": "Egyptian Pound",
                        "ERN": "Eritrean Nakfa",
                        "ETB": "Ethiopian Birr",
                        "EUR": "Euro",
                        "FJD": "Fijian Dollar",
                        "FKP": "Falkland Islands Pound",
                        "GBP": "British Pound Sterling",
                        "GEL": "Georgian Lari",
                        "GGP": "Guernsey Pound",
                        "GHS": "Ghanaian Cedi",
                        "GIP": "Gibraltar Pound",
                        "GMD": "Gambian Dalasi",
                        "GNF": "Guinean Franc",
                        "GTQ": "Guatemalan Quetzal",
                        "GYD": "Guyanaese Dollar",
                        "HKD": "Hong Kong Dollar",
                        "HNL": "Honduran Lempira",
                        "HRK": "Croatian Kuna",
                        "HTG": "Haitian Gourde",
                        "HUF": "Hungarian Forint",
                        "IDR": "Indonesian Rupiah",
                        "ILS": "Israeli New Sheqel",
                        "IMP": "Manx pound",
                        "INR": "Indian Rupee",
                        "IQD": "Iraqi Dinar",
                        "IRR": "Iranian Rial",
                        "ISK": "Icelandic Króna",
                        "JEP": "Jersey Pound",
                        "JMD": "Jamaican Dollar",
                        "JOD": "Jordanian Dinar",
                        "JPY": "Japanese Yen",
                        "KES": "Kenyan Shilling",
                        "KGS": "Kyrgystani Som",
                        "KHR": "Cambodian Riel",
                        "KMF": "Comorian Franc",
                        "KPW": "North Korean Won",
                        "KRW": "South Korean Won",
                        "KWD": "Kuwaiti Dinar",
                        "KYD": "Cayman Islands Dollar",
                        "KZT": "Kazakhstani Tenge",
                        "LAK": "Laotian Kip",
                        "LBP": "Lebanese Pound",
                        "LKR": "Sri Lankan Rupee",
                        "LRD": "Liberian Dollar",
                        "LSL": "Lesotho Loti",
                        "LTL": "Lithuanian Litas",
                        "LVL": "Latvian Lats",
                        "LYD": "Libyan Dinar",
                        "MAD": "Moroccan Dirham",
                        "MDL": "Moldovan Leu",
                        "MGA": "Malagasy Ariary",
                        "MKD": "Macedonian Denar",
                        "MMK": "Myanma Kyat",
                        "MNT": "Mongolian Tugrik",
                        "MOP": "Macanese Pataca",
                        "MRO": "Mauritanian Ouguiya (pre-2018)",
                        "MUR": "Mauritian Rupee",
                        "MVR": "Maldivian Rufiyaa",
                        "MWK": "Malawian Kwacha",
                        "MXN": "Mexican Peso",
                        "MYR": "Malaysian Ringgit",
                        "MZN": "Mozambican Metical",
                        "NAD": "Namibian Dollar",
                        "NGN": "Nigerian Naira",
                        "NIO": "Nicaraguan Córdoba",
                        "NOK": "Norwegian Krone",
                        "NPR": "Nepalese Rupee",
                        "NZD": "New Zealand Dollar",
                        "OMR": "Omani Rial",
                        "PAB": "Panamanian Balboa",
                        "PEN": "Peruvian Nuevo Sol",
                        "PGK": "Papua New Guinean Kina",
                        "PHP": "Philippine Peso",
                        "PKR": "Pakistani Rupee",
                        "PLN": "Polish Zloty",
                        "PYG": "Paraguayan Guarani",
                        "QAR": "Qatari Rial",
                        "RON": "Romanian Leu",
                        "RSD": "Serbian Dinar",
                        "RUB": "Russian Ruble",
                        "RWF": "Rwandan Franc",
                        "SAR": "Saudi Riyal",
                        "SBD": "Solomon Islands Dollar",
                        "SCR": "Seychellois Rupee",
                        "SDG": "Sudanese Pound",
                        "SEK": "Swedish Krona",
                        "SGD": "Singapore Dollar",
                        "SHP": "Saint Helena Pound",
                        "SLL": "Sierra Leonean Leone",
                        "SOS": "Somali Shilling",
                        "SRD": "Surinamese Dollar",
                        "STD": "São Tomé and Príncipe Dobra (pre-2018)",
                        "SVC": "Salvadoran Colón",
                        "SYP": "Syrian Pound",
                        "SZL": "Swazi Lilangeni",
                        "THB": "Thai Baht",
                        "TJS": "Tajikistani Somoni",
                        "TMT": "Turkmenistani Manat",
                        "TND": "Tunisian Dinar",
                        "TOP": "Tongan Pa'anga",
                        "TRY": "Turkish Lira",
                        "TTD": "Trinidad and Tobago Dollar",
                        "TWD": "New Taiwan Dollar",
                        "TZS": "Tanzanian Shilling",
                        "UAH": "Ukrainian Hryvnia",
                        "UGX": "Ugandan Shilling",
                        "USD": "United States Dollar",
                        "UYU": "Uruguayan Peso",
                        "UZS": "Uzbekistan Som",
                        "VEF": "Venezuelan Bolívar Fuerte (Old)",
                        "VND": "Vietnamese Dong",
                        "VUV": "Vanuatu Vatu",
                        "WST": "Samoan Tala",
                        "XAF": "CFA Franc BEAC",
                        "XAG": "Silver Ounce",
                        "XAU": "Gold Ounce",
                        "XCD": "East Caribbean Dollar",
                        "XDR": "Special Drawing Rights",
                        "XOF": "CFA Franc BCEAO",
                        "XPF": "CFP Franc",
                        "YER": "Yemeni Rial",
                        "ZAR": "South African Rand",
                        "ZMK": "Zambian Kwacha (pre-2013)",
                        "ZMW": "Zambian Kwacha",
                        "ZWL": "Zimbabwean Dollar",
                        "CNH": "Chinese Yuan (Offshore)",
                        "MRU": "Mauritanian Ouguiya",
                        "SSP": "South Sudanese Pound",
                        "STN": "São Tomé and Príncipe Dobra",
                        "VES": "Venezuelan Bolívar Soberano",
                        "XPD": "Palladium Ounce",
                        "XPT": "Platinum Ounce"
                    }
                }.symbols);
            }
        };
        // @ts-ignore
        this.tab = {}
        this.popup = {}
        this.isFirefox = true;
        this.isChrome = true;
        this.isEdge = true;
        this.isProduction = true;
        this.isDevelopment = false;
        this.environment = Environments.Prod;
        this.reviewLink = '';
        this.id = '';
        this.extensionVersion = '4.0.0'
        this.extensionUrl = ''

        // TODO: fix
        //const useragent = window.navigator.userAgent;
        const useragent = 'HeadlessChrome'
        if (useragent.indexOf('HeadlessChrome') >= 0)
            this.type = Browsers.Chrome
        else
            this.type = Browsers.Firefox
    }

    get document(): Document {
        return {
            body: HtmlMock.empty()
        } as Document
    }

    get url() {
        return this._url || new URL('https://google.com');
    }

    get host() {
        if (!this._url) return ''
        return this._url.host;
    }

    get hostname() {
        if (!this._url) return ''
        return this._url.hostname;
    }

    get hostAndPath() {
        if (!this._url) return ''
        return this._url.hostname + this._url.pathname;
    }

    loadLocal<T>(key: string): Promise<T> {
        // @ts-ignore
        return Promise.resolve();
    }

    loadSync<T>(key: string): Promise<T> {
        // @ts-ignore
        return Promise.resolve();
    }

    openReviewLink(): void {
    }

    saveLocal(key: string, value: any): Promise<void> {
        return Promise.resolve();
    }

    saveSync(key: string, value: any): Promise<void> {
        return Promise.resolve();
    }

    // @ts-ignore
    get tabs(): typeof chrome.tabs {
        // @ts-ignore
        return {
            create: () => {
            },
            // @ts-ignore
            query: () => {
            },
            sendMessage: () => {
            }
        }
    }

    // @ts-ignore
    get runtime(): typeof chrome.runtime {
        return {
            // @ts-ignore
            onMessage: {
                addListener: () => {
                }
            }
        }
    }

    // @ts-ignore
    get contextMenus(): typeof chrome.contextMenus {
        return {
            create: () => {
            },
            // @ts-ignore
            onClicked: {
                addListener: () => {
                }
            }
        }
    }

    // @ts-ignore
    get storage(): typeof chrome.storage {
        // @ts-ignore
        return {}
    }

    allStorage(): Promise<BrowserDataStorage[]> {
        return Promise.resolve([]);
    }

    clearSettings(): Promise<void> {
        return Promise.resolve();
    }

}