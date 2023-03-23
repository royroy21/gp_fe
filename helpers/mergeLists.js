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
  const ids = newList.map(i => i.id);
  b.forEach(item => {
    if (!ids.includes(item.id)) {
      newList.push(item);
      ids.push(item.id);
    }
  })
  return newList;
}

export default mergeListsOfObjects;
