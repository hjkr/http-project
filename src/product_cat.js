const playwright = require('playwright');

const products = {
    'ks': {
        url: 'https://www.amp.co.nz/returns-and-unit-prices/kiwisaver',
        title: 'KiwiSaver returns',
    },
    'nzrt': {
        url: 'https://www.amp.co.nz/returns-and-unit-prices/nzrt',
        title: 'New Zealand Retirement Trust returns',
    },
    'amf': {
        url: 'https://www.amp.co.nz/returns-and-unit-prices/amf',
        title: 'Managed Funds returns',
    },
}

async function getProductReturns(product) {
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
  
    const productURL = products[product].url;
    const tableTitle = products[product].title;
  
    try {
      await page.goto(productURL, { waitUntil: 'domcontentloaded' });
  
      const tableRows = await page.$$eval('.title', (titles, {tableTitle, product}) => {
  
        for (const title of titles) {
          console.log(title.textContent.trim());  
        }
          
        const targetTitle = titles.find(title => title.textContent.includes(tableTitle));
  
        if (!targetTitle) {
          throw new Error(`❌ "${tableTitle}" 텍스트를 찾을 수 없음`);
        }
  
        const section = targetTitle.closest('.outer-container');
        const table = section ? section.querySelector('table') : null;
  
        if (!table) {
          throw new Error('❌ 테이블을 찾을 수 없음');
        }
  
        const rows = Array.from(table.querySelectorAll('tr'));
        const headers = Array.from(rows[0].querySelectorAll('td, th')).map(cell => cell.textContent.trim());
    
        return rows.slice(1).map(row => {
          const cells = Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent.trim());
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = cells[i] || '';
          });
          obj['product'] = product;

          return obj;
        });
      }, {tableTitle, product});
  
      console.log('✅ Result:', tableRows);
      return tableRows
    } catch (err) {
      console.error('🔥 Error!!:', err.message);
    } finally {
      await browser.close();
    }
  
  };

  



function readProductCat(path) {

}

async function totalReturns() {
    const ks = await getProductReturns('ks');
    const rt = await getProductReturns('nzrt');
    const amf = await getProductReturns('amf');
    const total = [...ks, ...rt, ...amf];
    console.log('Total returns:', total);

}




module.exports = {
    readProductCat,
    totalReturns,
    getProductReturns
}