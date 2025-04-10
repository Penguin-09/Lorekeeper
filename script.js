/**
 * Fetch all lore data from json or local storage
 * @returns {Array<Lore>} all lore data
 */
async function getLoreData() {
    try {
        let data = localStorage.getItem("loreData");

        if (!data) {
            // Fetch lore data from json and store in local storage
            const response = await fetch("./lore.json");
            const dataJson = await response.json();

            localStorage.setItem("loreData", JSON.stringify(dataJson));
            data = dataJson;
            console.debug(
                "Lore data retrieved from json and stored in local storage"
            );
        } else {
            // Get lore data from local storage
            data = JSON.parse(data);
            console.debug("Lore data retrieved from local storage");
        }

        return data;
    } catch (error) {
        console.error("Error fetching lore data: ", error);
        return [];
    }
}

/**
 * Print the lore and the lore title of the specified era on the web page
 * @param {number} index which era of lore to print
 */
function printLore(data, index = 0) {
    const loreTitleElement = document.getElementById("loreTitle");
    const loreTextElement = document.getElementById("loreText");

    const eraData = data[index];

    loreTitleElement.innerText = eraData.title;
    loreTextElement.innerText = eraData.text;
    console.debug("Lore printed on the web page");
}

getLoreData().then((data) => {
    printLore(data);
});
