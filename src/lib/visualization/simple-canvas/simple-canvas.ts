// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

export class SimpleCanvas {
  protected ctx: CanvasRenderingContext2D;

  public constructor(canvasId: string, width: number, height: number) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    canvas.width = width;
    canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public line(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  public rectangle(x1: number, y1: number, x2: number, y2: number): void {
    this.line(x1, y1, x2, y1);
    this.line(x1, y2, x2, y2);
    this.line(x1, y1, x1, y2);
    this.line(x2, y1, x2, y2);
  }
}
