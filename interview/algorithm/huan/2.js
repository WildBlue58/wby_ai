const hasCycle = (head) => {
  while (head) {
    if (head.visited) {
      return true;
    }
    head.visited = true;
    head = head.next;
  }
  return false;
};
