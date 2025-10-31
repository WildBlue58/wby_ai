function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next; // 慢指针走一步
    fast = fast.next.next; // 快指针走两步

    if (slow === fast) {
      return true; // 快慢指针相遇，说明有环
    }
  }

  return false; // 快指针走到尽头，说明无环
}
