export const createBoardList = (words) => {
  // Create the HTML to render the word list
  const list = document.createElement("ul");
  list.classList.add("word-list");

  words.forEach((word) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = word.toUpperCase();
    listItem.setAttribute("data-word", word.toLowerCase());
    list.append(listItem);
  });

  return list;
};
