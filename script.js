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
async function printLore(data, index = 0) {
    const loreTitleElement = document.getElementById("loreTitle");
    const loreTextElement = document.getElementById("loreText");
    const bodyElement = document.body;

    const eraData = data[index];

    // Set background
    bodyElement.style.backgroundImage = `url(images/${eraData.backgroundImageURL})`;

    // Begin animation
    loreTitleElement.classList.add("slideOut");
    loreTextElement.classList.add("slideOut");

    // Wait until animation is finished, then set the new text
    setTimeout(() => {
        loreTitleElement.innerText = eraData.title;
        loreTextElement.innerText = eraData.text;

        loreTitleElement.classList.remove("slideOut");
        loreTextElement.classList.remove("slideOut");
        loreTitleElement.classList.add("slideIn");
        loreTextElement.classList.add("slideIn");
    }, 400);

    console.debug("Lore printed on the web page");
}

const rangeElement = document.getElementById("timeline");
let rangeValue = rangeElement.value;
const rangeMax = rangeElement.max;

getLoreData().then((data) => {
    printLore(data);

    const totalEras = data.length - 1;
    const eraLength = Math.floor(rangeMax / (totalEras + 1));
    console.debug("Total eras: ", totalEras, "| Era length: ", eraLength);

    let currentEra = Math.floor(rangeValue / eraLength);

    // Range slider listener
    const rangeSlider = rangeElement;
    rangeSlider.addEventListener("input", () => {
        rangeValue = rangeElement.value;

        // Check if the current era has changed
        if (Math.floor(rangeValue / (eraLength + 1)) !== currentEra) {
            currentEra = Math.floor(rangeValue / eraLength);
            console.debug("Lore changed to era: ", currentEra);
            printLore(data, currentEra);
        }
    });
});
