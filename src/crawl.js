const { JSDOM } = require('jsdom');


async function crawlPage(baseURL, currentURL, pages, level = 1) {
    //pages => pages already crawled

    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if(baseURLObj.hostname !== currentURLObj.hostname) {    
        return pages;
    }


    const normalizedURL = normalizeURL(currentURL);
    
    // archive page

    //console.log(`normalizedURL: ${normalizedURL} | baseURL: ${baseURL} | currentURL: ${currentURL} | level: ${level}`);
    if  (normalizedURL === "https://www.amp.co.nz/nz/market-commentary/archive" || 
        (level > 1 && normalizedURL === baseURL) )       return pages;

        
    //if (pages[normalizedURL] > 0) {
    if (pages.hasOwnProperty(normalizedURL)) {
        pages[normalizedURL]++;     // so we can track how many times we have attempted crawling this page
        //console.log(`already crawled ${currentURL}`);
        return pages;
    }

    pages[normalizedURL] = 1; // mark as crawled

    //console.log(`${'>'.repeat(level)}actively crawling ${normalizedURL}`);

    try {
        const response = await fetch(normalizedURL);


        if (response.status > 399) { 
            console.log(`error: ${response.status} on page: "${currentURL}"`);

            return pages;
        }

        //check if response is html
        const contentType = response.headers.get('content-type');

        if (!contentType || !(contentType.includes('text/html') || 
                              contentType.includes('application/pdf') ||
                              contentType.includes('application/xml'))) {
            console.log(`error: non html response, content type: ${contentType} on page "${currentURL}"`);
            return pages;
        }
        
        //console.log(`baseURL: ${currentURL} confirmed!!`);
        const htmlBody = await response.text();
        
        //console.log(`call getURLsFromHTML: ${htmlBody} ${baseURL}`);

        if (contentType.includes('application/pdf')||contentType.includes('application/xml')) {
            return pages;
        }
        
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        level++;
        for (const nextURL of nextURLs) {
            if (nextURL !== currentURL) {
                await crawlPage(baseURL, nextURL, pages, level);
            }
        }
    } catch (error) {
        console.log(`error in fetch:  ${error.message} on page: "${currentURL}"`);
    }

    return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    //console.log(htmlBody)
    const links = dom.window.document.querySelectorAll('a')

    // console.log('===============')
    // console.log('links=====')
    // console.log(`first link: ${links[0].href}`)
    // console.log('===============')
    for (const link of links) {
        if(link.href === '' || link.href === '?') continue;

        if (
            !link.href || // href 속성이 없는 경우
            //link.offsetParent === null || // 렌더링되지 않은 요소
            link.style.display === 'none' || // display: none
            link.style.visibility === 'hidden' || // visibility: hidden
            link.style.opacity === '0' // opacity: 0
        ) {
            console.log(`invisible link: ${link.href}`);
            continue;
        }


        let fullURL = '';

        if(link.href.startsWith('/')) {

            try {
                fullURL = `${baseURL}${link.href}`;
                const urlObj = new URL(fullURL);
    
                urls.push(urlObj.href);                
            } catch (error) {
                console.log (`Error creating URL: '${link.href}' : ${error}`)   
            }

        } else {

            try {
                const urlObj = new URL(link.href);
                urls.push(urlObj.href);                
            } catch (error) {
                console.log (`Error creating URL: '${link.href}' : ${error}`)   
            }

        }
    }

    return urls;s
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);

    let hostPath = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;

    if (hostPath.length > 0 && hostPath.endsWith('/')) {
        hostPath = hostPath.slice(0, -1);
    }
    //console.log(`hostpath: ${hostPath}`);
    return hostPath;
}

module.exports = {
    crawlPage,
    getURLsFromHTML,
    normalizeURL,
}