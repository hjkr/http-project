const { crawlPage } = require("./src/crawl");
const {printReport} = require("./src/report");

async function main() {
    // 2nd arg is the website to crawl
    // 3rd arg is the host url

    if (process.argv.length < 4) {
        console.log("no website provided!!");
        process.exit(1);
    }

    if (process.argv.length > 4) {
        console.log("too many args provided!!");
        process.exit(1);
    }

    const baseURL = process.argv[3];
    const targetURL = process.argv[2];

    console.log(`starting crawl of ${targetURL} ...`);

    const pages = await crawlPage(baseURL, targetURL, {});



    console.log(`Total pages: ${Object.keys(pages).length}`);
    //printReport(pages);

    // for (const page in pages) {
    //     console.log(`Found ${pages[page]} links to page: ${page}`);
    // }
}


main();