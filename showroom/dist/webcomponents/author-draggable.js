// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-draggable v1.0.0 available at github.com/author-elements/draggable
// Last Build: 7/30/2019, 3:52:34 AM
var AuthorDraggableElement = (function () {
  'use strict';

  if (!window.hasOwnProperty('AuthorBaseElement')) {
              console.error('[ERROR] <author-draggable> Required dependency "AuthorBaseElement" not found.');
              console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
            }
          (function () {
            let missingDependencies = Array.from(new Set([])).filter(dep => !customElements.get(dep));
            if (missingDependencies.length > 0) {
              console.error(`[ERROR] <author-draggable> Required dependenc${missingDependencies.length !== 1 ? 'ies' : 'y'} not found: ${missingDependencies.map(d => `<${d}>`).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])}`);
              missingDependencies.forEach((dep, i) => console.info(`${i+1}. <${dep}> is available at ${'https://github.com/author-elements/draggable'.replace('draggable', dep.replace('author-', ''))}`));
            }
          })();
          class AuthorDraggableElement extends AuthorBaseElement(HTMLElement) {
    constructor () {
      super(`<template><style>@charset "UTF-8"; :host{display:flex;cursor:move}:host *,:host :after,:host :before{box-sizing:border-box}:host([clone][dragging]){contain:content!important;position:fixed!important;z-index:2147483647!important;will-change:left,top}author-draggable{display:flex;cursor:move}author-draggable *,author-draggable :after,author-draggable :before{box-sizing:border-box}author-draggable[clone][dragging]{contain:content!important;position:fixed!important;z-index:2147483647!important;will-change:left,top}</style><slot></slot></template>`);

      this.UTIL.defineAttributes({
        direction: {
          default: null
        },

        disabled: {
          default: false
        },

        free: {
          default: false
        },

        'max-drag-distance': {
          default: null
        },

        'min-drag-distance': {
          default: null
        },

        type: {
          default: null
        },
      });

      this.UTIL.defineProperties({
        acceptedConstraintKeys: {
          private: true,
          readonly: true,
          default: [
            'x',
            'y',
            'up',
            'right',
            'down',
            'left'
          ]
        },

        canDrop: {
          private: true,
          default: false
        },

        clone: {
          private: true,
          default: null
        },

        constraints: {
          private: true,
          readonly: true,
          get: () => {
            if (!this.direction) {
              return null
            }

            return this.direction.replace(/\s+/g,' ').trim().split(' ')
          }
        },

        data: {
          default: null
        },

        dimensions: {
          private: true,
          readonly: true,
          get: () => this.getBoundingClientRect()
        },

        dragArea: {
          private: true,
          readonly: true,
          get: () => {
            let dragAreas = document.querySelectorAll('author-dragarea');

            for (let dragArea of dragAreas) {
              if (dragArea.contains(this)) {
                return dragArea
              }
            }

            return document.body
          }
        },

        dragIsActive: {
          private: true,
          default: false
        },

        dropTargets: {
          private: true,
          default: null
        },

        initialPosition: {
          private: true,
          default: null
        },

        initialTimestamp: {
          private: true,
          default: null
        },

        pointerEventsSupported: {
          private: true,
          readonly: true,
          default: window.PointerEvent === undefined ? false : true
        },

        pointerOffset: {
          private: true,
          default: null
        },

        userIsTouching: {
          private: true,
          default: false
        },

        types: {
          private: true,
          readonly: true,
          get: () => {
            if (!this.type) {
              return null
            }

            return this.type.replace(/\s+/g,' ').trim().split(' ')
          }
        }
      });

      this.UTIL.definePrivateMethods({
        forwardEvent: (evt, newEvtName, detail = {}, target = this) => {
          evt.preventDefault();

          detail.originalEvent = evt;

          if (!this.PRIVATE.pointerEventsSupported) {
            this.emit(newEvtName, detail, target);
          }
        },

        // Polyfill for Firefox bug from 2002 :|
        // window.getComputedStyle(el).cssText returns ""
        // https://bugzilla.mozilla.org/show_bug.cgi?id=137687
        getComputedStylesCssText: element => {
          let computed = window.getComputedStyle(element);
          let acc = [];

          if (computed.cssText !== '') {
            return computed.cssText
          }

          for (let property in computed) {
            if (typeof computed[property] === 'string') {
              acc.push(`${property}: ${computed[property]}`);
            }
          }

          return acc.join('; ')
        },

        handshakeAcceptedHandler: evt => {
          let { dropTarget } = evt.detail;

          this.PRIVATE.dropTargets.push(dropTarget);
          dropTarget.on('drop.allow', evt => this.PRIVATE.canDrop = true);
          dropTarget.on('drop.deny', evt => this.PRIVATE.canDrop = false);
        },

        initializeClone: () => {
          this.setAttribute('dragging', '');

          this.PRIVATE.clone = this.cloneNode(true);
          this.PRIVATE.synchronizeStyles();
          this.PRIVATE.clone.sourceElement = this;

          this.removeAttribute('dragging');
          this.PRIVATE.clone.setAttribute('clone', '');

          document.body.appendChild(this.PRIVATE.clone);
        },

        pointerupHandler: evt => {
          let dragendEvent = new CustomEvent('drag.end', this.PRIVATE.getEventData(evt, {
            drag: {
              distance: this.PRIVATE.getDragDistance(evt),
              duration: evt.timeStamp - this.PRIVATE.initialTimestamp
            },
            position: this.PRIVATE.getPointerPosition(evt, false)
          }));

          this.emit(dragendEvent);
          this.PRIVATE.reset();
        },

        mouseupHandler: evt => {
          this.PRIVATE.forwardEvent(evt, 'pointerup', {}, document.body);
        },

        touchendHandler: evt => {
          // document.removeEventListener(this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', this.PRIVATE.pointerMoveHandler)
        },

        applyBodyListeners: () => {
          document.body.addEventListener('pointerup', this.PRIVATE.pointerupHandler);
          document.body.addEventListener('mouseup', this.PRIVATE.mouseupHandler);
          document.body.addEventListener('touchend', this.PRIVATE.touchendHandler);
        },

        removeBodyListeners: () => {
          document.body.removeEventListener('pointerup', this.PRIVATE.pointerupHandler);
          document.body.removeEventListener('mouseup', this.PRIVATE.mouseupHandler);
          document.body.removeEventListener('touchend', this.PRIVATE.touchendHandler);
          document.body.removeEventListener(this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', this.PRIVATE.pointerMoveHandler);
        },

        initiateDrag: () => {
          this.PRIVATE.applyBodyListeners();

          this.setAttribute(this.free ? 'dragging' : 'ghost', '');
          this.PRIVATE.dragIsActive = true;
          // this.emit(new CustomEvent('after.drag.start', this.PRIVATE.getEventData(evt, {
          //
          // })))
        },

        getRelativePointerPosition: (relWidth, relHeight, left, top) => {
          let right = relWidth - left;
          let bottom = relHeight - top;

          return {
            x: left,
            y: top,

            top: {
              px: top,
              pct: this.UTIL.getPercentageDecimal(top, relHeight)
            },

            right: {
              px: right,
              pct: this.UTIL.getPercentageDecimal(right, relWidth)
            },

            bottom: {
              px: bottom,
              pct: this.UTIL.getPercentageDecimal(bottom, relHeight)
            },

            left: {
              px: left,
              pct: this.UTIL.getPercentageDecimal(left, relWidth)
            }
          }
        },

        getPercentageDecimal: (portion, whole, decimalPlaces = null) => {
          let decimal = portion / whole;

          if (decimal < 0) {
            return 0
          }

          if (decimalPlaces !== null) {
            return decimal.toFixed(decimalPlaces)
          }

          return decimal
        },

        getPointerPosition: (evt, offset = true, client = true, doc = true,) => {
          let obj = {};

          if (offset) {
            obj.offset = this.PRIVATE.getRelativePointerPosition(this.offsetWidth, this.offsetHeight, evt.offsetX, evt.offsetY);
          }

          if (client) {
            obj.client = this.PRIVATE.getRelativePointerPosition(document.documentElement.clientWidth, document.documentElement.clientHeight, evt.clientX, evt.clientY);
          }

          if (doc) {
            obj.document = this.PRIVATE.getRelativePointerPosition(document.documentElement.scrollWidth, document.documentElement.scrollHeight, evt.pageX, evt.pageY);
          }

          return obj
        },

        getEventData: (evt, props = {}) => {
          let config = {
            cancelable: true,
            composed: true,

            detail: Object.assign({}, {
              altKey: evt.altKey,
              ctrlKey: evt.ctrlKey,
              metaKey: evt.metaKey,
              shiftKey: evt.shiftKey,
              types: this.PRIVATE.types
            }, props)
          };

          Object.defineProperty(config.detail, 'data', {
            set: value => this.data = value,
            get: () => this.data
          });

          return config
        },

        pointerMoveHandler: evt => {
          if (!this.PRIVATE.dragIsActive) {
            if (!this.free) {
              this.PRIVATE.initializeClone();
            }

            let dragstartEvent = new CustomEvent('drag.start', this.PRIVATE.getEventData(evt, {
              position: this.PRIVATE.getPointerPosition(evt)
            }));

            this.emit(dragstartEvent);

            if (dragstartEvent.defaultPrevented) {
              return
            }

            this.PRIVATE.initiateDrag();
          }

          let dragEvent = new CustomEvent('drag', this.PRIVATE.getEventData(evt, {
            canDrop: this.PRIVATE.canDrop,
            drag: {
              distance: this.PRIVATE.getDragDistance(evt),
              duration: evt.timeStamp - this.PRIVATE.initialTimestamp
            },
            position: this.PRIVATE.getPointerPosition(evt, false)
          }));

          this.emit(dragEvent);

          if (dragEvent.defaultPrevented) {
            return
          }

          this.PRIVATE.updatePosition(evt);
        },

        getDragDistance: evt => ({
          x: Math.abs(this.PRIVATE.initialPosition.x - evt.pageX),
          y: Math.abs(this.PRIVATE.initialPosition.y - evt.pageY)
        }),

        reset: () => {
          if (this.free) {
            this.removeAttribute('dragging');
          } else {
            this.removeAttribute('ghost');

            if (this.PRIVATE.clone !== null) {
              document.body.removeChild(this.PRIVATE.clone);
              this.PRIVATE.clone = null;
            }
          }

          this.PRIVATE.dragIsActive = false;
          this.PRIVATE.pointerOffset = null;
          this.PRIVATE.removeBodyListeners();
          this.PRIVATE.dropTargets = null;
          this.PRIVATE.initialPosition = null;
          this.PRIVATE.initialTimestamp = null;
        },

        storeDropTargets: () => {
          this.PRIVATE.dropTargets = [];
          let allDropTargets = document.querySelectorAll('author-droptarget');

          this.on('handshake.accepted', this.PRIVATE.handshakeAcceptedHandler);

          for (let dropTarget of allDropTargets) {
            this.emit('handshake.offered', {
              draggable: this,
              types: this.PRIVATE.types
            }, dropTarget);
          }

          this.off('handshake.accepted', this.PRIVATE.handshakeHandler);
        },

        synchronizeStyles: () => {
          let { clone, getComputedStylesCssText } = this.PRIVATE;

          clone.style.cssText = getComputedStylesCssText(this);

          let children = this.getElementsByTagName('*');
          let cloneChildren = clone.getElementsByTagName('*');

          if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
              cloneChildren[i].style.cssText = getComputedStylesCssText(children[i]);
            }
          }
        },

        updatePosition: evt => {
          let { clone, dimensions, originalCoordinates, pointerOffset } = this.PRIVATE;
          let newCoordinates = {
            x: evt.clientX - pointerOffset.x,
            y: evt.clientY - pointerOffset.y
          };

          if (this.free) {
            newCoordinates = {
              x: newCoordinates.x - (originalCoordinates.x - window.scrollX),
              y: newCoordinates.y - (originalCoordinates.y - window.scrollY)
            };

            return this.UTIL.setStyleProperty('dragging', 'transform', `translate(${newCoordinates.x}px, ${newCoordinates.y}px)`)
          }

          clone.UTIL.setStyleProperties('dragging', [
            {
              name: 'left',
              value: `${newCoordinates.x}px`,
              important: true
            },
            {
              name: 'top',
              value: `${newCoordinates.y}px`,
              important: true
            }
          ]);
        }
      });

      this.UTIL.registerListeners(this, {
        'attribute.changed': evt => {
          let { attribute, newValue, oldValue } = evt.detail;

          switch (attribute) {
            case 'free':
              if (!this.free) {
                this.UTIL.removeStyleProperty('dragging', 'transform');
              }
              break
          }
        },

        connected: () => {
          this.UTIL.insertStyleRule('dragging', ':host {}');

          this.emit('author-draggable.connected', {
            draggable: this
          }, window);
        },

        mousedown: evt => {
          if (this.PRIVATE.userIsTouching) {
            return evt.preventDefault()
          }

          this.PRIVATE.forwardEvent(evt, 'pointerdown');
        },

        touchstart: evt => {
          evt.preventDefault();
          this.PRIVATE.userIsTouching = true;
          this.PRIVATE.forwardEvent(evt, 'pointerdown');
        },

        pointerup: evt => {
          this.PRIVATE.reset();
        },

        pointerdown: evt => {
          let client = {};

          this.PRIVATE.initialTimestamp = evt.timeStamp;

          if (evt instanceof CustomEvent) {
            client.x = evt.detail.originalEvent.clientX;
            client.y = evt.detail.originalEvent.clientY;
          } else {
            client.x = evt.clientX;
            client.y = evt.clientY;
          }

          this.PRIVATE.initialPosition = {
            x: client.x,
            y: client.y
          };

          this.PRIVATE.pointerOffset = {
            x: client.x - this.PRIVATE.dimensions.left,
            y: client.y - this.PRIVATE.dimensions.top
          };

          document.body.addEventListener(this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', this.PRIVATE.pointerMoveHandler);
          this.PRIVATE.storeDropTargets();
        },

        rendered: () => {
          this.UTIL.defineProperty('originalCoordinates', {
            private: true,
            readonly: true,
            default: {
              x: this.PRIVATE.dimensions.left + window.scrollX,
              y: this.PRIVATE.dimensions.top + window.scrollY
            }
          });
        }
      });
    }

    static get observedAttributes () {
      return ['direction', 'disabled', 'free', 'min-drag-distance', 'max-drag-distance', 'type']
    }
  }

  customElements.define('author-draggable', AuthorDraggableElement);

  return AuthorDraggableElement;

}());
//# sourceMappingURL=author-draggable.js.map
