class Spinner {
  constructor() {
    this.P = ["\\", "|", "/", "-"];
    this.timer = null;
    this.isSpinning = false;
    this.stream = process.stdout;
  }
  async start(text = '') {
    let x = 0;
    this.isSpinning = true;
    this.timer = await setInterval(async () => {
      await this.stream.write(this.P[x++] + text + '\r');
      if (x >= this.P.length) {
        x = 0;
      }
    }, 250);
  }
  succeed(text) {
    this.clear();
    this.stream.write('√' + text + '\r');
  }
  async clear() {
    this.clearTimer();
    await this.stream.write('\n');
  }
  clearTimer() {
    this.isSpinning = false;
    if (this.timer) {
      this.timer = clearInterval(this.timer);
      this.timer = null;
    }
  }
};
const spinner = new Spinner();


module.exports = spinner
