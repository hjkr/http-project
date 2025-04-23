const { JSDOM } = require('jsdom');


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
                urls.push(link.href);                
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
    normalizeURL,
    getURLsFromHTML
}