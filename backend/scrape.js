import { Website, pageTitle } from '@spider-rs/spider-rs';

async function scrape() {
  try {
    console.log('Fetching data from https://example.com...');

    const website = new Website('https://example.com')
      .withBudget({ '*': 5 }) // Limit to 5 pages for this example
      .build();

    const onPageEvent = (error, page) => {
      if (error) {
        console.error('Error:', error);
        return;
      }
      
      const title = pageTitle(page);
      console.log(`- Found: ${page.url} - ${title}`);
    };

    await website.crawl(onPageEvent);

    console.log('\nScraping complete.');
    const links = website.getLinks();
    console.log(`Discovered ${links.length} links.`);

  } catch (error) {
    console.error('An error occurred during the scrape:', error);
  }
}

scrape();
