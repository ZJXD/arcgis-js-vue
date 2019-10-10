window.Utils = {
  // 产生随机的ID
  generateID() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
};
