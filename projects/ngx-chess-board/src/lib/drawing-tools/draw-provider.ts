import {Circle} from './circle';
import {Arrow} from './arrow';

export class DrawProvider {

  private _circles: Circle[];
  private _arrows: Arrow[];


  constructor() {
    this._arrows = [];
    this._circles = [];
  }

  addCircle(circle: Circle) {
    this.circles.push(circle);
  }

  addArrow(arrow: Arrow) {
    this.arrows.push(arrow);
  }

  get circles(): Circle[] {
    return this._circles;
  }

  get arrows(): Arrow[] {
    return this._arrows;
  }

  containsCircle(circle: Circle) {
    return this.circles.some(e => e.isEqual(circle));
  }

  containsArrow(arrow: Arrow) {
    return this.arrows.some(e => e.isEqual(arrow));
  }

  clear() {
    this._arrows = [];
    this._circles = [];
  }

}
