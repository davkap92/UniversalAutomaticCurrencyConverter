import useMockContainer from './Container.mock';
import {BackendApi, IBackendApi} from '../src/currencyConverter/BackendApi';
import {CurrencyRegex} from '../src/currencyConverter/Detection/CurrencyRegex';

describe('CurrencyRegex', () => {
    const create = (html: string): string => {
        const div = document.createElement('div');
        div.innerHTML = html;
        // @ts-ignore
        return div.children[0].innerText;
    }
    const tests = [
        {
            text: `$3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: '$3.99',
                currencies: ['$', '']
            }, null]
        },
        {
            text: `3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: `3.99`,
                currencies: ['', '']
            }, null]
        },
        {
            text: `$3.99 . $3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: '$3.99 .',
                currencies: ['$', '']
            }, {
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: ' $3.99',
                currencies: ['$', '']
            }, null]
        },
        {
            text: `$3.99 $3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: '$3.99 ',
                currencies: ['$', '']
            }, {
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: ' $3.99',
                currencies: ['$', '']
            }, null]
        },
        /* TODO: make this detect properly
        {
            text: `$3.99$3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: '$3.',
                currencies: ['$', '$']
            }, {
                amounts: [{neg: '+', integer: '3', decimal: '99'}],
                text: '.99',
                currencies: ['$', '']
            }, null]
        },
         */
        {
            text: `$3.99 - 3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}, {neg: '+', integer: '3', decimal: '99'}],
                text: '$3.99 - 3.99',
                currencies: ['$', '']
            }, null]
        },
        {
            text: `$3.99-3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}, {neg: '+', integer: '3', decimal: '99'}],
                text: '$3.99-3.99',
                currencies: ['$', '']
            }, null]
        },
        {
            text: `3.99-3.99`, expect: [{
                amounts: [{neg: '+', integer: '3', decimal: '99'}, {neg: '+', integer: '3', decimal: '99'}],
                text: `3.99-3.99`,
                currencies: ['', '']
            }, null]
        },
        {
            name: 'invis char', text: "‎$34.99", expect: [{
                amounts: [{neg: '+', integer: '34', decimal: '99'}],
                text: '‎$34.99',
                currencies: ['$', '']
            }, null]
        }
    ];
    tests.forEach((test: { name?: string, expect: ({ amounts: any, text: string, currencies: string[] } | null)[], text: string }) => {
        it(`${test.name || test.text}`, async () => {
            // Setup
            const [container, provider] = useMockContainer();
            await provider.activeLocalization.overload({dollar: 'USD'})
            const regex = new CurrencyRegex(test.text);

            // Act
            const actual = [];
            while (actual.length < test.expect.length) actual.push(regex.next());

            // Assert
            for (let i = 0; i < test.expect.length; i++) {
                if(!test.expect[i]) {
                    expect(actual[i]).toBeNull();
                    continue
                }
                expect(actual[i]?.text).toEqual(test.expect[i]?.text)
                expect(actual[i]?.currencies).toEqual(test.expect[i]?.currencies)
                expect(actual[i]?.amounts).toEqual(test.expect[i]?.amounts)
            }
        });
    })
});