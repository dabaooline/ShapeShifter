import { FractionProperty, NumberProperty, Property } from 'app/model/properties';
import { Rect } from 'app/scripts/common';
import * as _ from 'lodash';

import { ConstructorArgs as AbstractConstructorArgs, AbstractLayer } from './AbstractLayer';

const DEFAULTS = {
  width: 24,
  height: 24,
  alpha: 1,
};

/**
 * Model object that mirrors the VectorDrawable's '<vector>' element.
 */
@Property.register(
  // TODO: add 'canvas color' property?
  new NumberProperty('width', { isAnimatable: false, min: 1, isInteger: true }),
  new NumberProperty('height', { isAnimatable: false, min: 1, isInteger: true }),
  new FractionProperty('alpha', { isAnimatable: true }),
)
export class VectorLayer extends AbstractLayer {
  constructor(obj = { children: [], name: 'vector' } as ConstructorArgs) {
    super(obj);
    const setterFn = (num: number, def: number) => (_.isNil(num) ? def : num);
    this.width = setterFn(obj.width, DEFAULTS.width);
    this.height = setterFn(obj.height, DEFAULTS.height);
    this.alpha = setterFn(obj.alpha, DEFAULTS.alpha);
  }

  getIconName() {
    return 'vectorlayer';
  }

  getPrefix() {
    return 'vector';
  }

  clone() {
    const clone = new VectorLayer(this);
    clone.children = this.children.slice();
    return clone;
  }

  deepClone() {
    const clone = this.clone();
    clone.children = this.children.map(c => c.deepClone());
    return clone;
  }

  getBoundingBox() {
    return new Rect(0, 0, this.width, this.height);
  }

  toJSON() {
    const obj = Object.assign(super.toJSON(), {
      width: this.width,
      height: this.height,
      alpha: this.alpha,
      children: this.children.map(child => child.toJSON()),
    });
    Object.entries(DEFAULTS).forEach(([key, value]) => {
      if (obj[key] === value) {
        delete obj[key];
      }
    });
    return obj;
  }
}

interface VectorLayerArgs {
  width?: number;
  height?: number;
  alpha?: number;
}

export interface VectorLayer extends AbstractLayer, VectorLayerArgs {}
export interface ConstructorArgs extends AbstractConstructorArgs, VectorLayerArgs {}
