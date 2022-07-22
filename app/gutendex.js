const axios = require('axios').default;
 
const apiUrl = "https://gutendex.com/books/"

async function getBookInfo(bookId) {
    try {
        const resp = await axios.get(apiUrl + bookId);
        console.log(resp.data);
    } catch (err) {
        console.error(err);
    }
}
