

function mergeListsOfObjects(a, b) {
  /**
   * Merges two lists of objects removing duplicates based upon object id.
   *
   * example:
   * const a = [{id: 1}, {id: 2}, {id:3}];
   * const b = [{id: 1}, {id: 4}, {id:5}, {id:3}];
   * const c = mergeListsOfObjects(a, b);
   * [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}, {"id": 5}]
   */
  const newList = [...a];
  b.forEach(item => {
    if (!newList.map(i => i.id).includes(item.id)) {
      newList.push(item)
    }
  })
  return newList;
}

export default mergeListsOfObjects;
