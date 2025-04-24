const { crawlPage } = require("./src/crawl");
const {printReport} = require("./src/report");

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided!!");
        process.exit(1);
    }

    if (process.argv.length > 3) {
        console.log("too many args provided!!");
        process.exit(1);
    }

    const baseURL = process.argv[2];

    console.log(`starting crawl of ${baseURL} ...`);

    const pages = await crawlPage(baseURL, baseURL, {});



    console.log(`Total pages: ${Object.keys(pages).length}`);
    //printReport(pages);

    // for (const page in pages) {
    //     console.log(`Found ${pages[page]} links to page: ${page}`);
    // }
}


main();