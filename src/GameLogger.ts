export class GameLogger {
  private mainCode: string;
  private subCode: string;

  constructor(mainCode: string, subCode: string) {
    this.mainCode = mainCode;
    this.subCode = subCode;
  }

  logGameOver(): void {
    fetch(
      `https://counter.jufankie.nl/asdflog.php?game=${this.mainCode}${this.subCode}`,
      {
        method: 'POST',
      }
    );
  }

  setSubCode(subCode: string): void {
    this.subCode = subCode;
  }
}
