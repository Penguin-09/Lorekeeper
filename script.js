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
async function printLore(data, index = 0, slidingLeft = false) {
    const loreTitleElement = document.getElementById("loreTitle");
    const loreTextElement = document.getElementById("loreText");
    const bodyElement = document.body;

    const eraData = data[index];

    // Set background
    bodyElement.style.backgroundImage = `url(images/${eraData.backgroundImageURL})`;

    // Clear existing animations
    loreTitleElement.classList.remove(
        "slideInFromLeft",
        "slideInFromRight",
        "slideOutToLeft",
        "slideOutToRight"
    );
    loreTextElement.classList.remove(
        "slideInFromLeft",
        "slideInFromRight",
        "slideOutToLeft",
        "slideOutToRight"
    );

    // Begin animation
    if (slidingLeft) {
        loreTitleElement.classList.add("slideOutToLeft");
        loreTextElement.classList.add("slideOutToLeft");
    } else {
        loreTitleElement.classList.add("slideOutToRight");
        loreTextElement.classList.add("slideOutToRight");
    }

    // Wait until animation is finished, then set the new text
    setTimeout(() => {
        loreTitleElement.innerText = eraData.title;
        loreTextElement.innerText = eraData.text;

        // Clear existing animations
        loreTitleElement.classList.remove("slideOutToLeft", "slideOutToRight");
        loreTextElement.classList.remove("slideOutToLeft", "slideOutToRight");

        if (slidingLeft) {
            // New content comes in from right
            loreTitleElement.classList.add("slideInFromRight");
            loreTextElement.classList.add("slideInFromRight");
        } else {
            // New content comes in from left
            loreTitleElement.classList.add("slideInFromLeft");
            loreTextElement.classList.add("slideInFromLeft");
        }
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

        const newEra = Math.floor(rangeValue / eraLength);

        if (newEra !== currentEra) {
            console.debug(
                "Lore changed from era",
                currentEra,
                "to era:",
                newEra
            );

            // Determine direction (going forward or backward in time)
            const toRight = newEra < currentEra;

            // Update current era
            currentEra = newEra;

            // Print lore with the appropriate direction
            printLore(data, currentEra, toRight);
        }
    });
});
