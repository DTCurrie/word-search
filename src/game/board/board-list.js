export const createBoardList = (wordList) => {
  // Create the HTML to render the word list
  const list = document.createElement("ul");
  list.classList.add("word-list");

  wordList.forEach((word) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = word.toUpperCase();
    listItem.setAttribute("data-word", word.toLowerCase());
    list.append(listItem);
  });

  return list;
};
