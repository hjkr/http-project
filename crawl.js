const { JSDOM } = require('jsdom');


async function crawlPage(currentURL) {
    console.log(`actively crawling ${currentURL}`);

    try {
        const response = await fetch(currentURL);

        if (response.status > 399) { 
            console.log(`error: ${response.status} on page: "${currentURL}"`);
            return;
        }

        //check if response is html
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('text/html')) {
            console.log(`error: non html response, content type: ${contentType} on page "${currentURL}"`);
            return;
        }


        //console.log(await response.text())
    } catch (error) {
        console.log(`error in fetch:  ${error.message} on page: "${currentURL}"`);
    }

}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);

    const links = dom.window.document.querySelectorAll('a')
 
    for (const link of links) {
        let fullURL = '';

        if(link.href.startsWith('/')) {

            try {
                fullURL = `${baseURL}${link.href}`;
                const urlObj = new URL(fullURL);
    
                urls.push(urlObj.href);                
            } catch (error) {
                console.log ('Error creating URL:', error);
            }

        } else {

            try {
                const urlObj = new URL(link.href);
                urls.push(urlObj.href);                
            } catch (error) {
                console.log ('Error creating URL:', error)   
            }

        }
    }

    return urls;s
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);

    let hostPath = `${urlObj.hostname}${urlObj.pathname}`;

    if (hostPath.length > 0 && hostPath.endsWith('/')) {
        hostPath = hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    crawlPage,
    getURLsFromHTML,
    normalizeURL,
}