export class GameLogger {
  private mainCode: string;
  private subCode: string;

  constructor(mainCode: string, subCode: string) {
    this.mainCode = mainCode;
    this.subCode = subCode;
  }

  logGameOver(): void {
    fetch(
      `https://counter.jufankie.nl/asdflog.php?game=${this.mainCode}&subgame=${this.subCode}`,
      {
        method: 'POST',
      },
    ).catch(() => {
      throw new Error("Can't log played game");
    });
  }

  setMainCode(mainCode: string): void {
    this.mainCode = mainCode;
  }

  setSubCode(subCode: string): void {
    this.subCode = subCode;
  }

  appendSubCode(subCode: string): void {
    this.subCode = this.subCode.concat(subCode);
  }
}
