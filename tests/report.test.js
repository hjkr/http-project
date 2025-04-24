const {sortPages} = require('../src/report.js');
const {test, expect} = require('@jest/globals');


test('sortPages - 2 pages', () => {
    const input = {
        'www.wagslane.dev/posts/optimize-for-simplicit-first': 2,
        'www.wagslane.dev/posts/kanban-vs-scrum': 4
    }
    const actual = sortPages(input);
    const expected = [
        ['www.wagslane.dev/posts/kanban-vs-scrum', 4],
        ['www.wagslane.dev/posts/optimize-for-simplicit-first', 2],
    ]
    expect(actual).toEqual(expected);
})


test('sortPages - 5 pages', () => {
    const input = {
        'www.wagslane.dev/posts/optimize-for-simplicit-first': 2,
        'www.amp.co.nz/learn/contents-insurance-cover-when-moving-house': 1,
        'www.wagslane.dev/posts/leave-scrum-to-rugby': 5,
        'www.wagslane.dev/posts/kanban-vs-scrum': 4,
        'www.amp.co.nz/kiwisaver/kiwisaver-for-under-18s': 6
    }
    const actual = sortPages(input);
    const expected = [
        [ 'www.amp.co.nz/kiwisaver/kiwisaver-for-under-18s', 6 ],
        ['www.wagslane.dev/posts/leave-scrum-to-rugby', 5],
        ['www.wagslane.dev/posts/kanban-vs-scrum', 4],
        ['www.wagslane.dev/posts/optimize-for-simplicit-first', 2],
        ['www.amp.co.nz/learn/contents-insurance-cover-when-moving-house', 1],
    ]
    expect(actual).toEqual(expected);
})
