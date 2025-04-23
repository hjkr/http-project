const {normalizeURL, getURLsFromHTML} = require('../crawl.js');
const {test, expect} = require('@jest/globals');

test('normalizeURL strip', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normalizeURL with /', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normalizeURL capitals', () => {
    const input = 'http://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML absolute urls', () => {
    const inputHTML = `
        <html>
            <head>
                <title>Test</title>
            </head>
            <body>
                <a href="https://blog.boot.dev/path/">Boot.dev Blog</a>
            </body>
        </html>
    `
    const input = 'http://blog.boot.dev/path/';
    const actual = getURLsFromHTML(inputHTML, input);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML relative urls', () => {
    const inputHTML = `
        <html>
            <head>
                <title>Test</title>
            </head>
            <body>
                <a href="/path/">Boot.dev Blog</a>
            </body>
        </html>
    `
    const input = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTML, input);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
})


test('getURLsFromHTML multiple urls', () => {
    const inputHTML = `
        <html>
            <head>
                <title>Test</title>
            </head>
            <body>
                <a href="https://blog.boot.dev/path1/">Boot.dev Blog</a>
                <a href="https://blog.boot.dev/path2/">Boot.dev Blog</a>
                <a href="/path3/">Boot.dev Blog</a>                
            </body>
        </html>
    `
    const input = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTML, input);
    const expected = [  "https://blog.boot.dev/path1/",
                        "https://blog.boot.dev/path2/",
                        "https://blog.boot.dev/path3/"
                    ];
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML invalid urls', () => {
    const inputHTML = `
        <html>
            <head>
                <title>Test</title>
            </head>
            <body>
                <a href="https://blog.boot.dev/path1/">Boot.dev Blog</a>
                <a href="invalid">Boot.dev Blog</a>
                <a href="/path3/">Boot.dev Blog</a>                
            </body>
        </html>
    `
    const input = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTML, input);
    const expected = [  "https://blog.boot.dev/path1/",
                        "https://blog.boot.dev/path3/"
                    ];
    expect(actual).toEqual(expected);
})