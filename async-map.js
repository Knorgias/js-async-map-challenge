const asyncMap = (listItem, listItemCallback) => {
  const delay = Math.floor(Math.random() * 100) + 200;
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
  let currentIndex = 0; // thanks to "closure" we can make use of currentIndex in the recursive function below

  const processNextItem = () => {
    // exit recursive function when we reach array length
    if (currentIndex === list.length) {
      listCallback(mappedList);
      return;
    }

    const remainingItems = list.length - currentIndex;
    /** Smallest of either nrConcurrentCalls OR remainingItems; 
      * thus we make sure we don't try to make more concurrent calls than there are remaining items in the list
      */
    const numCalls = Math.min(nrConcurrentCalls, remainingItems);

    let completedCalls = 0;

    const handleItemCallback = (mappedListItem) => {
      mappedList[currentIndex] = mappedListItem;
      completedCalls++;
      currentIndex++;

      
      if (completedCalls === numCalls) {
        // all the concurrent calls within the current batch have completed
        // recursively start processing the next batch
        processNextItem();
      }
    };

    for (let i = 0; i < numCalls; i++) {
      asyncMap(list[currentIndex], handleItemCallback);
    }
  };

  processNextItem();
};

// Rest of the scenarios...


// Scenario 1
mapList(
  ["First", "Second", "Third", "Forth", "Fifth"],
  (mappedList) => {
    console.log("Scenario 1: ", mappedList);
    //  Should output: ["User First", "User Second", "User Third", "User Fourth", "User Fifth"]
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
    //  Should output: ["User First", "User Second", "User Third", "User Fourth", "User Fifth"]
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
