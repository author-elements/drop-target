// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-drop-target v1.0.0 available at github.com/author-elements/drop-target
// Last Build: 7/29/2019, 8:54:35 PM
var AuthorDropTargetElement = (function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-drop-target> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          (function () {
            let missingDependencies = Array.from(new Set([])).filter(dep => !customElements.get(dep));
            if (missingDependencies.length > 0) {
              console.error(`[ERROR] <author-drop-target> Required dependenc${missingDependencies.length !== 1 ? 'ies' : 'y'} not found: ${missingDependencies.map(d => `<${d}>`).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])}`);
              missingDependencies.forEach((dep, i) => console.info(`${i+1}. <${dep}> is available at ${'https://github.com/author-elements/drop-target'.replace('drop-target', dep.replace('author-', ''))}`));
            }
          })();
          class AuthorDropTargetElement extends AuthorBaseElement(HTMLElement) {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host *,:host :after,:host :before{box-sizing:border-box}author-drop-target *,author-drop-target :after,author-drop-target :before{box-sizing:border-box}</style><slot></slot></template>`);

      this.UTIL.defineAttributes({
        accepts: {
          default: '*'
        },

        mustMatch: {
          default: 1
        },

        over: {
          default: false
        },

        sortable: {
          default: false
        },

        types: {
          default: null
        }
      });

      this.UTIL.defineProperties({
        acceptedTypes: {
          private: true,
          readonly: true,
          get: () => {
            if (this.accepts === null) {
              return null
            }

            return this.accepts.replace(/\s+/g,' ').trim().split(' ')
          }
        },

        dimensions: {
          private: true,
          readonly: true,
          get: () => this.getBoundingClientRect()
        },

        draggable: {
          private: true,
          default: null
        },

        lastPointerClientPosition: {
          private: true,
          default: null
        },

        offsetPointerPosition: {
          private: true,
          default: null
        },

        willAcceptDrop: {
          private: true,
          default: false
        }
      });

      this.UTIL.definePrivateMethods({
        applyDragHandlers: () => {
          let { draggable } = this.PRIVATE;

          draggable.on('drag', this.PRIVATE.dragHandler);
          draggable.on('drag.end', this.PRIVATE.dragendHandler);
        },

        getEventData: (evt, props = {}) => ({
          cancelable: true,
          composed: true,

          detail: Object.assign({}, {
            acceptedTypes: this.PRIVATE.acceptedTypes,
            data: this.PRIVATE.draggable.data,
            willAcceptDrop: this.PRIVATE.willAcceptDrop,
            position: this.PRIVATE.getPointerPosition(evt),
            source: this.PRIVATE.draggable
          }, props)
        }),

        getPointerPosition: evt => {
          let relative = {
            height: this.offsetHeight,
            width: this.offsetWidth
          };

          let left = evt.offsetX || this.PRIVATE.offsetPointerPosition.x;
          let top = evt.offsetY || this.PRIVATE.offsetPointerPosition.y;
          let right = relative.width - left;
          let bottom = relative.height - top;

          let position = {
            x: left,
            y: top,

            top: {
              px: top,
              pct: this.UTIL.getPercentageDecimal(top, relative.height)
            },

            right: {
              px: right,
              pct: this.UTIL.getPercentageDecimal(right, relative.width)
            },

            bottom: {
              px: bottom,
              pct: this.UTIL.getPercentageDecimal(bottom, relative.height)
            },

            left: {
              px: left,
              pct: this.UTIL.getPercentageDecimal(left, relative.width)
            }
          };

          return Object.assign({}, position, {
            quadrant: this.PRIVATE.getDropQuadrant(position)
          })
        },

        dragHandler: evt => {
          let { draggable, dimensions, lastPointerClientPosition } = this.PRIVATE;
          let { client } = evt.detail.position;
          let isEntering = null;
          let isLeaving = null;

          let isOver = {
            x: client.x >= dimensions.left && client.x <= dimensions.right,
            y: client.y >= dimensions.top && client.y <= dimensions.bottom
          };

          if (lastPointerClientPosition !== null) {
            isEntering = {
              top: isOver.x && lastPointerClientPosition.y <= dimensions.top && client.y > dimensions.top,
              right: isOver.y && lastPointerClientPosition.x >= dimensions.right && client.x < dimensions.right,
              bottom: isOver.x && lastPointerClientPosition.y >= dimensions.bottom && client.y < dimensions.bottom,
              left: isOver.y && lastPointerClientPosition.x <= dimensions.left && client.x > dimensions.left
            };

            isLeaving = {
              top: isOver.x && lastPointerClientPosition.y >= dimensions.top && client.y < dimensions.top,
              right: isOver.y && lastPointerClientPosition.x <= dimensions.right && client.x > dimensions.right,
              bottom: isOver.x && lastPointerClientPosition.y <= dimensions.bottom && client.y > dimensions.bottom,
              left: isOver.y && lastPointerClientPosition.x >= dimensions.left && client.x < dimensions.left
            };
          }

          this.PRIVATE.offsetPointerPosition = {
            x: client.x - dimensions.left,
            y: client.y - dimensions.top
          };

          let isParent = this.contains(draggable);

          if (isEntering !== null && Object.values(isEntering).some(Boolean)) {
            let dragenterEvent = new CustomEvent('drag.enter', this.PRIVATE.getEventData(evt));
            this.emit(dragenterEvent);

            if (isParent) {
              this.over = false;
              this.PRIVATE.willAcceptDrop = false;
            } else {
              if (!dragenterEvent.defaultPrevented) {
                this.emit(`drop.allow`);
                this.over = true;
                this.PRIVATE.willAcceptDrop = true;
              }
            }
          }

          if (isOver.x && isOver.y) {
            if (!this.over) {
              this.over = !isParent;
              this.emit(`drop.${isParent ? 'deny' : 'allow'}`, {});
            }

            this.emit(new CustomEvent('drag.over', this.PRIVATE.getEventData(evt)));
          }

          if (isLeaving !== null && Object.values(isLeaving).some(Boolean)) {
            this.over = false;
            this.emit('drop.deny', {});
            this.emit(new CustomEvent('drag.leave', this.PRIVATE.getEventData(evt)));
          }

          this.PRIVATE.lastPointerClientPosition = {
            x: client.x,
            y: client.y
          };
        },

        getDropQuadrant: position => {
          let x = 'left';
          let y = 'top';

          if (position.left.pct === .5) {
            x = 'center';
          }

          if (position.left.pct > .5) {
            x = 'right';
          }

          if (position.top.pct === .5) {
            y = 'center';
          }

          if (position.top.pct > .5) {
            y = 'bottom';
          }

          return `${y} ${x}`
        },

        dragendHandler: evt => {
          let dropEvent = new CustomEvent('drop', this.PRIVATE.getEventData(evt));

          if (this.over) {
            this.emit(dropEvent);
          }

          if (dropEvent.defaultPrevented) {
            console.log('PREVENTED');
          }

          this.PRIVATE.removeDragHandlers();
          this.over = false;
          this.offsetPointerPosition = null;
        },

        removeDragHandlers: () => {
          this.PRIVATE.draggable.off('drag', this.PRIVATE.dragHandler);
          this.PRIVATE.draggable.off('drag.end', this.PRIVATE.dragendHandler);
        }
      });

      this.UTIL.registerListeners(this, {
        'handshake.offered': evt => {
          let { draggable, types } = evt.detail;
          let reject = false;

          switch (this.mustMatch) {
            case 'all':
            case '*':
              if (!this.PRIVATE.acceptedTypes.every(type => types.includes(type))) {
                reject = true;
              }
              break

            default:
              if (!(this.PRIVATE.acceptedTypes.filter(type => types.includes(type)).length >= this.mustMatch)) {
                reject = true;
              }
          }

          if (reject) {
            return
          }

          this.emit('handshake.accepted', { dropTarget: this }, draggable);

          this.PRIVATE.draggable = draggable;
          this.PRIVATE.applyDragHandlers();
        }
      });
    }

    static get observedAttributes () {
      return ['accepts', 'sortable']
    }
  }

  customElements.define('author-drop-target', AuthorDropTargetElement);

  return AuthorDropTargetElement;

}());
//# sourceMappingURL=author-drop-target.js.map
