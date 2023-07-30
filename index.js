/**
 * Key for the query parameter that marks a page as the last visited petition.
 * @type {string}
 */
const LAST_VISITED_PETITION_QUERY_PARAM_KEY = 'lvp';

/**
 * Key for the LocalStorage item that stores the last visited petition ID.
 * @type {string}
 */
const LAST_VISITED_PETITION_LS_KEY = 'pra-last-visited-petition';

/**
 * Checks if a given string is a valid numeric string.
 *
 * @param {string} str - The input string to check.
 * @returns {boolean} Returns true if the input string is a valid numeric string, otherwise false.
 */
const isNumericString = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

/**
 * Redirects the user to the last visited petition page.
 *
 * @param {string} petitionId - The ID of the last visited petition.
 */
const redirectToLastVisitedPetition = (petitionId) => {
  window.location.href = `https://petition.president.gov.ua/petition/${petitionId}?lvp=true`;
}

/**
 * Initializes the application.
 * - If the current page is marked as the last visited petition, removes the LocalStorage item.
 * - If the current page is the home page ("/") and a last visited petition ID is available in LocalStorage,
 *   redirects to the last visited petition page.
 * - If the current page is a petition page and has a valid petition ID, stores it as the last visited petition ID.
 */
const initialize = () => {
  if ("navigation" in window) {
    const { currentEntry } = window.navigation;
    if (currentEntry) {
      if (currentEntry.index !== 0) {
        return;
      }
    }
  }
  
  const { search, pathname } = location;
  const queryParams = new URLSearchParams(search);

  /**
   * Indicates whether the current page is marked as the last visited petition.
   * @type {boolean}
   */
  const pageIsLastVisitedPetition = queryParams.get(LAST_VISITED_PETITION_QUERY_PARAM_KEY) !== null;

  if (pageIsLastVisitedPetition) {
    // If the current page is marked as the last visited petition, remove the LocalStorage item.
    localStorage.removeItem(LAST_VISITED_PETITION_LS_KEY);
    return;
  }

  if (pathname === "/") {
    /**
     * The ID of the last visited petition obtained from LocalStorage.
     * @type {string|null}
     */
    const petitionId = localStorage.getItem(LAST_VISITED_PETITION_LS_KEY);

    if (petitionId !== null) {
      // If a last visited petition ID is available, redirect to the last visited petition page.
      redirectToLastVisitedPetition(petitionId);
    }
    return;
  }

  /**
   * Array of path segments obtained by splitting the current pathname.
   * @type {string[]}
   */
  const [, , petitionId] = pathname.split("/");

  /**
   * Indicates whether the current page is a petition page (has a valid numeric petition ID).
   * @type {boolean}
   */
  const isPetitionPage = isNumericString(petitionId);

  if (isPetitionPage) {
    // If the current page is a petition page, store its ID as the last visited petition ID in LocalStorage.
    localStorage.setItem(LAST_VISITED_PETITION_LS_KEY, petitionId);
  }
}

// Call the initialize function when the script is executed.
initialize();