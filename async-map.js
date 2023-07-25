const asyncMap = (listItem, listItemCallback, index) => {
  const delay = Math.floor(Math.random() * 100) + 200 + index * 50; // make sure delays are unique, by adding i * 100 on top
  setTimeout(() => {
    const mappedListItem = `User ${listItem}`;
    listItemCallback(mappedListItem);
  }, delay);
};

const defaultAsyncMap = (listItem, listItemCallback) => {
  const mappedListItem = listItem;
  setTimeout(() => {
    listItemCallback(mappedListItem);
  }, 0);
};

const mapList = (list, listCallback, { nrConcurrentCalls = 1, asyncMap = defaultAsyncMap } = {}) => {
  const mappedList = [];
  /**
   * thanks to "closure" we can make use of currentIndex in the callback function below 
   * to put each list item in the right order
   */
  let currentIndex = 0; 

  // processNextBatch better reflects the function's purpose of handling concurrent calls
  const processNextBatch = () => {
    const remainingItems = list.length - currentIndex;
    /** The smaller of nrConcurrentCalls and remainingItems; 
      * thus we make sure we don't try to make more concurrent calls than there are remaining items in the list
      */
    const numCalls = Math.min(nrConcurrentCalls, remainingItems);

    let completedCalls = 0;

    // The callback passed to asyncmap for each list item
    const handleItemCallback = (mappedListItem, index) => {
      mappedList[index] = mappedListItem;
      completedCalls++;

      if (completedCalls === numCalls) {
        currentIndex += numCalls;

        if (currentIndex < list.length) {
          // recursive call for next batch, until we reach list length
          processNextBatch();
        } else {
          // all list items have been processed
          listCallback(mappedList);
        }
      }
    };

    for (let i = 0; i < numCalls; i++) {
      asyncMap(list[currentIndex + i], (mappedListItem) => handleItemCallback(mappedListItem, currentIndex + i), currentIndex + i);
    }
  };

  processNextBatch();
};

// Rest of the scenarios...

// Scenario 1
mapList(
  ["First", "Second", "Third", "Forth", "Fifth"],
  (mappedList) => {
    console.log("Scenario 1: ", mappedList);
    // Should output: ["User First", "User Second", "User Third", "User Fourth", "User Fifth"]
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
    // Should output: ["User First", "User Second", "User Third", "User Fourth", "User Fifth"]
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
    // Should output: ["First", "Second", "Third", "Forth", "Fifth"]
  },
  { nrConcurrentCalls: 2 }
);

// Scenario 4
mapList(["First", "Second", "Third", "Forth", "Fifth"], (mappedList) => {
  console.log("Scenario 4: ", mappedList);
  // Should output: ["First", "Second", "Third", "Forth", "Fifth"]
});
