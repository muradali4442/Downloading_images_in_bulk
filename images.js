// axios
const axios = require('axios');
// file system module
const fs = require("fs");
const client = require('https');

/**
 * Special delayer
 * @param {String} ms miliseconds
 * @returns 
 */
 const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Extracts images from iNaturalist
 */
const extractImages = async () => {
    
    // configuration
    let startFromPage = 1; 
    let endOnPage = 5;

    for(let i = startFromPage; i <= endOnPage; i++){
        console.log('Processing page '+i);
        await delay(2000);
        let config = {
          method: 'get',
          url: `https://api.inaturalist.org/v1/observations?photos=true&q=Alliaria+petiolata&search_on=names&quality_grade=research&term_id=12&term_value_id=13&year=2020&per_page=500&page=${i}`,
          headers: { 
            'Accept': 'application/json'
          }
        };

        /**
         * Send Request to get data
         */
        await axios(config)
        .then(async (response) => {
          // get the resutls
          let results = response.data.results;
          console.log(`Total Records ${results.length}`);
          // interate though results
          for(let x in results){
            let id = results[x].id;
            // extract original picture and replace square with original
            let originalPhoto = results[x].photos[0].url.replace('square','medium');
            // extract file extension
            let fileExtension = originalPhoto.split('.').pop();
            // download the image and place in images folder
            await downloadImage(originalPhoto, `./500_flowering/${id}.${fileExtension}`);
          }
          console.log('Completed downloading page '+ i);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    /**
     * Download the files
     * @param {String} url source url
     * @param {String} filepath name with path and extension
     * @returns
     */
     async function  downloadImage(url, filepath) {
        client.get(url, (res) => {
            res.pipe(fs.createWriteStream(filepath));
        });
    }
};

extractImages();