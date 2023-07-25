const asyncMap = (listItem, listItemCallback) => {
  const delay = Math.floor(Math.random() * 100) + 200;
  setTimeout(() => {
    const mappedListItem = `User ${listItem}`;
    listItemCallback(mappedListItem);
  }, delay);
};

const defaultAsyncMap = (listItem, listItemCallback) => {
  const mappedListItem = listItem;
  listItemCallback(mappedListItem);
};

const mapList = (list, listCallback, { nrConcurrentCalls = 1, asyncMap = defaultAsyncMap } = {}) => {
  // TODO: Implement this
};

// Scenario 1
mapList(
  ["First", "Second", "Third", "Forth", "Fifth"],
  (mappedList) => {
    console.log("Scenario 1: ", mappedList);
    //  Should output: ["User First", "User Secod", "User Third", "User Forth", "User Fifth"]
  },
  {
    nrConcurrentCalls: 2,
    asyncMap,
  }
);
// Scenario 2
mapList(
  ["First", "Second", "Third", "Forth", "Fifth"],
  (mappedList) => {
    console.log("Scenario 2: ", mappedList);
    //  Should output: ["User First", "User Secod", "User Third", "User Forth", "User Fifth"]
  },
  {
    asyncMap,
  }
);
// Scenario 3
mapList(
  ["First", "Second", "Third", "Forth", "Fifth"],
  (mappedList) => {
    console.log("Scenario 3: ", mappedList);
    //  Should output: ["First", "Second", "Third", "Forth", "Fifth"]
  },
  { nrConcurrentCalls: 2 }
);
// Scenario 4
mapList(["First", "Second", "Third", "Forth", "Fifth"], (mappedList) => {
  console.log("Scenario 4: ", mappedList);
  //  Should output: ["First", "Second", "Third", "Forth", "Fifth"]
});