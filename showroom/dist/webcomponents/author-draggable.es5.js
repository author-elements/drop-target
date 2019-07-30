// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-draggable v1.0.0 available at github.com/author-elements/draggable
// Last Build: 7/30/2019, 3:52:34 AM
var AuthorDraggableElement = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  if (!window.hasOwnProperty('AuthorBaseElement')) {
    console.error('[ERROR] <author-draggable> Required dependency "AuthorBaseElement" not found.');
    console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
  }

  (function () {
    var missingDependencies = Array.from(new Set([])).filter(function (dep) {
      return !customElements.get(dep);
    });

    if (missingDependencies.length > 0) {
      console.error("[ERROR] <author-draggable> Required dependenc".concat(missingDependencies.length !== 1 ? 'ies' : 'y', " not found: ").concat(missingDependencies.map(function (d) {
        return "<".concat(d, ">");
      }).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])));
      missingDependencies.forEach(function (dep, i) {
        return console.info("".concat(i + 1, ". <").concat(dep, "> is available at ").concat('https://github.com/author-elements/draggable'.replace('draggable', dep.replace('author-', ''))));
      });
    }
  })();

  var AuthorDraggableElement =
  /*#__PURE__*/
  function (_AuthorBaseElement) {
    _inherits(AuthorDraggableElement, _AuthorBaseElement);

    function AuthorDraggableElement() {
      var _this;

      _classCallCheck(this, AuthorDraggableElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthorDraggableElement).call(this, "<template><style>@charset \"UTF-8\"; :host{display:flex;cursor:move}:host *,:host :after,:host :before{box-sizing:border-box}:host([clone][dragging]){contain:content!important;position:fixed!important;z-index:2147483647!important;will-change:left,top}author-draggable{display:flex;cursor:move}author-draggable *,author-draggable :after,author-draggable :before{box-sizing:border-box}author-draggable[clone][dragging]{contain:content!important;position:fixed!important;z-index:2147483647!important;will-change:left,top}</style><slot></slot></template>"));

      _this.UTIL.defineAttributes({
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
        }
      });

      _this.UTIL.defineProperties({
        acceptedConstraintKeys: {
          private: true,
          readonly: true,
          default: ['x', 'y', 'up', 'right', 'down', 'left']
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
          get: function get() {
            if (!_this.direction) {
              return null;
            }

            return _this.direction.replace(/\s+/g, ' ').trim().split(' ');
          }
        },
        data: {
          default: null
        },
        dimensions: {
          private: true,
          readonly: true,
          get: function get() {
            return _this.getBoundingClientRect();
          }
        },
        dragArea: {
          private: true,
          readonly: true,
          get: function get() {
            var dragAreas = document.querySelectorAll('author-dragarea');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = dragAreas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var dragArea = _step.value;

                if (dragArea.contains(_assertThisInitialized(_this))) {
                  return dragArea;
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return document.body;
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
          get: function get() {
            if (!_this.type) {
              return null;
            }

            return _this.type.replace(/\s+/g, ' ').trim().split(' ');
          }
        }
      });

      _this.UTIL.definePrivateMethods({
        forwardEvent: function forwardEvent(evt, newEvtName) {
          var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _assertThisInitialized(_this);
          evt.preventDefault();
          detail.originalEvent = evt;

          if (!_this.PRIVATE.pointerEventsSupported) {
            _this.emit(newEvtName, detail, target);
          }
        },
        // Polyfill for Firefox bug from 2002 :|
        // window.getComputedStyle(el).cssText returns ""
        // https://bugzilla.mozilla.org/show_bug.cgi?id=137687
        getComputedStylesCssText: function getComputedStylesCssText(element) {
          var computed = window.getComputedStyle(element);
          var acc = [];

          if (computed.cssText !== '') {
            return computed.cssText;
          }

          for (var property in computed) {
            if (typeof computed[property] === 'string') {
              acc.push("".concat(property, ": ").concat(computed[property]));
            }
          }

          return acc.join('; ');
        },
        handshakeAcceptedHandler: function handshakeAcceptedHandler(evt) {
          var dropTarget = evt.detail.dropTarget;

          _this.PRIVATE.dropTargets.push(dropTarget);

          dropTarget.on('drop.allow', function (evt) {
            return _this.PRIVATE.canDrop = true;
          });
          dropTarget.on('drop.deny', function (evt) {
            return _this.PRIVATE.canDrop = false;
          });
        },
        initializeClone: function initializeClone() {
          _this.setAttribute('dragging', '');

          _this.PRIVATE.clone = _this.cloneNode(true);

          _this.PRIVATE.synchronizeStyles();

          _this.PRIVATE.clone.sourceElement = _assertThisInitialized(_this);

          _this.removeAttribute('dragging');

          _this.PRIVATE.clone.setAttribute('clone', '');

          document.body.appendChild(_this.PRIVATE.clone);
        },
        pointerupHandler: function pointerupHandler(evt) {
          var dragendEvent = new CustomEvent('drag.end', _this.PRIVATE.getEventData(evt, {
            drag: {
              distance: _this.PRIVATE.getDragDistance(evt),
              duration: evt.timeStamp - _this.PRIVATE.initialTimestamp
            },
            position: _this.PRIVATE.getPointerPosition(evt, false)
          }));

          _this.emit(dragendEvent);

          _this.PRIVATE.reset();
        },
        mouseupHandler: function mouseupHandler(evt) {
          _this.PRIVATE.forwardEvent(evt, 'pointerup', {}, document.body);
        },
        touchendHandler: function touchendHandler(evt) {// document.removeEventListener(this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', this.PRIVATE.pointerMoveHandler)
        },
        applyBodyListeners: function applyBodyListeners() {
          document.body.addEventListener('pointerup', _this.PRIVATE.pointerupHandler);
          document.body.addEventListener('mouseup', _this.PRIVATE.mouseupHandler);
          document.body.addEventListener('touchend', _this.PRIVATE.touchendHandler);
        },
        removeBodyListeners: function removeBodyListeners() {
          document.body.removeEventListener('pointerup', _this.PRIVATE.pointerupHandler);
          document.body.removeEventListener('mouseup', _this.PRIVATE.mouseupHandler);
          document.body.removeEventListener('touchend', _this.PRIVATE.touchendHandler);
          document.body.removeEventListener(_this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', _this.PRIVATE.pointerMoveHandler);
        },
        initiateDrag: function initiateDrag() {
          _this.PRIVATE.applyBodyListeners();

          _this.setAttribute(_this.free ? 'dragging' : 'ghost', '');

          _this.PRIVATE.dragIsActive = true; // this.emit(new CustomEvent('after.drag.start', this.PRIVATE.getEventData(evt, {
          //
          // })))
        },
        getRelativePointerPosition: function getRelativePointerPosition(relWidth, relHeight, left, top) {
          var right = relWidth - left;
          var bottom = relHeight - top;
          return {
            x: left,
            y: top,
            top: {
              px: top,
              pct: _this.UTIL.getPercentageDecimal(top, relHeight)
            },
            right: {
              px: right,
              pct: _this.UTIL.getPercentageDecimal(right, relWidth)
            },
            bottom: {
              px: bottom,
              pct: _this.UTIL.getPercentageDecimal(bottom, relHeight)
            },
            left: {
              px: left,
              pct: _this.UTIL.getPercentageDecimal(left, relWidth)
            }
          };
        },
        getPercentageDecimal: function getPercentageDecimal(portion, whole) {
          var decimalPlaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
          var decimal = portion / whole;

          if (decimal < 0) {
            return 0;
          }

          if (decimalPlaces !== null) {
            return decimal.toFixed(decimalPlaces);
          }

          return decimal;
        },
        getPointerPosition: function getPointerPosition(evt) {
          var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var client = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
          var doc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
          var obj = {};

          if (offset) {
            obj.offset = _this.PRIVATE.getRelativePointerPosition(_this.offsetWidth, _this.offsetHeight, evt.offsetX, evt.offsetY);
          }

          if (client) {
            obj.client = _this.PRIVATE.getRelativePointerPosition(document.documentElement.clientWidth, document.documentElement.clientHeight, evt.clientX, evt.clientY);
          }

          if (doc) {
            obj.document = _this.PRIVATE.getRelativePointerPosition(document.documentElement.scrollWidth, document.documentElement.scrollHeight, evt.pageX, evt.pageY);
          }

          return obj;
        },
        getEventData: function getEventData(evt) {
          var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var config = {
            cancelable: true,
            composed: true,
            detail: Object.assign({}, {
              altKey: evt.altKey,
              ctrlKey: evt.ctrlKey,
              metaKey: evt.metaKey,
              shiftKey: evt.shiftKey,
              types: _this.PRIVATE.types
            }, props)
          };
          Object.defineProperty(config.detail, 'data', {
            set: function set(value) {
              return _this.data = value;
            },
            get: function get() {
              return _this.data;
            }
          });
          return config;
        },
        pointerMoveHandler: function pointerMoveHandler(evt) {
          if (!_this.PRIVATE.dragIsActive) {
            if (!_this.free) {
              _this.PRIVATE.initializeClone();
            }

            var dragstartEvent = new CustomEvent('drag.start', _this.PRIVATE.getEventData(evt, {
              position: _this.PRIVATE.getPointerPosition(evt)
            }));

            _this.emit(dragstartEvent);

            if (dragstartEvent.defaultPrevented) {
              return;
            }

            _this.PRIVATE.initiateDrag();
          }

          var dragEvent = new CustomEvent('drag', _this.PRIVATE.getEventData(evt, {
            canDrop: _this.PRIVATE.canDrop,
            drag: {
              distance: _this.PRIVATE.getDragDistance(evt),
              duration: evt.timeStamp - _this.PRIVATE.initialTimestamp
            },
            position: _this.PRIVATE.getPointerPosition(evt, false)
          }));

          _this.emit(dragEvent);

          if (dragEvent.defaultPrevented) {
            return;
          }

          _this.PRIVATE.updatePosition(evt);
        },
        getDragDistance: function getDragDistance(evt) {
          return {
            x: Math.abs(_this.PRIVATE.initialPosition.x - evt.pageX),
            y: Math.abs(_this.PRIVATE.initialPosition.y - evt.pageY)
          };
        },
        reset: function reset() {
          if (_this.free) {
            _this.removeAttribute('dragging');
          } else {
            _this.removeAttribute('ghost');

            if (_this.PRIVATE.clone !== null) {
              document.body.removeChild(_this.PRIVATE.clone);
              _this.PRIVATE.clone = null;
            }
          }

          _this.PRIVATE.dragIsActive = false;
          _this.PRIVATE.pointerOffset = null;

          _this.PRIVATE.removeBodyListeners();

          _this.PRIVATE.dropTargets = null;
          _this.PRIVATE.initialPosition = null;
          _this.PRIVATE.initialTimestamp = null;
        },
        storeDropTargets: function storeDropTargets() {
          _this.PRIVATE.dropTargets = [];
          var allDropTargets = document.querySelectorAll('author-droptarget');

          _this.on('handshake.accepted', _this.PRIVATE.handshakeAcceptedHandler);

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = allDropTargets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var dropTarget = _step2.value;

              _this.emit('handshake.offered', {
                draggable: _assertThisInitialized(_this),
                types: _this.PRIVATE.types
              }, dropTarget);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _this.off('handshake.accepted', _this.PRIVATE.handshakeHandler);
        },
        synchronizeStyles: function synchronizeStyles() {
          var _this$PRIVATE = _this.PRIVATE,
              clone = _this$PRIVATE.clone,
              getComputedStylesCssText = _this$PRIVATE.getComputedStylesCssText;
          clone.style.cssText = getComputedStylesCssText(_assertThisInitialized(_this));

          var children = _this.getElementsByTagName('*');

          var cloneChildren = clone.getElementsByTagName('*');

          if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
              cloneChildren[i].style.cssText = getComputedStylesCssText(children[i]);
            }
          }
        },
        updatePosition: function updatePosition(evt) {
          var _this$PRIVATE2 = _this.PRIVATE,
              clone = _this$PRIVATE2.clone,
              dimensions = _this$PRIVATE2.dimensions,
              originalCoordinates = _this$PRIVATE2.originalCoordinates,
              pointerOffset = _this$PRIVATE2.pointerOffset;
          var newCoordinates = {
            x: evt.clientX - pointerOffset.x,
            y: evt.clientY - pointerOffset.y
          };

          if (_this.free) {
            newCoordinates = {
              x: newCoordinates.x - (originalCoordinates.x - window.scrollX),
              y: newCoordinates.y - (originalCoordinates.y - window.scrollY)
            };
            return _this.UTIL.setStyleProperty('dragging', 'transform', "translate(".concat(newCoordinates.x, "px, ").concat(newCoordinates.y, "px)"));
          }

          clone.UTIL.setStyleProperties('dragging', [{
            name: 'left',
            value: "".concat(newCoordinates.x, "px"),
            important: true
          }, {
            name: 'top',
            value: "".concat(newCoordinates.y, "px"),
            important: true
          }]);
        }
      });

      _this.UTIL.registerListeners(_assertThisInitialized(_this), {
        'attribute.changed': function attributeChanged(evt) {
          var _evt$detail = evt.detail,
              attribute = _evt$detail.attribute,
              newValue = _evt$detail.newValue,
              oldValue = _evt$detail.oldValue;

          switch (attribute) {
            case 'free':
              if (!_this.free) {
                _this.UTIL.removeStyleProperty('dragging', 'transform');
              }

              break;
          }
        },
        connected: function connected() {
          _this.UTIL.insertStyleRule('dragging', ':host {}');

          _this.emit('author-draggable.connected', {
            draggable: _assertThisInitialized(_this)
          }, window);
        },
        mousedown: function mousedown(evt) {
          if (_this.PRIVATE.userIsTouching) {
            return evt.preventDefault();
          }

          _this.PRIVATE.forwardEvent(evt, 'pointerdown');
        },
        touchstart: function touchstart(evt) {
          evt.preventDefault();
          _this.PRIVATE.userIsTouching = true;

          _this.PRIVATE.forwardEvent(evt, 'pointerdown');
        },
        pointerup: function pointerup(evt) {
          _this.PRIVATE.reset();
        },
        pointerdown: function pointerdown(evt) {
          var client = {};
          _this.PRIVATE.initialTimestamp = evt.timeStamp;

          if (evt instanceof CustomEvent) {
            client.x = evt.detail.originalEvent.clientX;
            client.y = evt.detail.originalEvent.clientY;
          } else {
            client.x = evt.clientX;
            client.y = evt.clientY;
          }

          _this.PRIVATE.initialPosition = {
            x: client.x,
            y: client.y
          };
          _this.PRIVATE.pointerOffset = {
            x: client.x - _this.PRIVATE.dimensions.left,
            y: client.y - _this.PRIVATE.dimensions.top
          };
          document.body.addEventListener(_this.PRIVATE.pointerEventsSupported ? 'pointermove' : 'mousemove', _this.PRIVATE.pointerMoveHandler);

          _this.PRIVATE.storeDropTargets();
        },
        rendered: function rendered() {
          _this.UTIL.defineProperty('originalCoordinates', {
            private: true,
            readonly: true,
            default: {
              x: _this.PRIVATE.dimensions.left + window.scrollX,
              y: _this.PRIVATE.dimensions.top + window.scrollY
            }
          });
        }
      });

      return _this;
    }

    _createClass(AuthorDraggableElement, null, [{
      key: "observedAttributes",
      get: function get() {
        return ['direction', 'disabled', 'free', 'min-drag-distance', 'max-drag-distance', 'type'];
      }
    }]);

    return AuthorDraggableElement;
  }(AuthorBaseElement(HTMLElement));

  customElements.define('author-draggable', AuthorDraggableElement);

  return AuthorDraggableElement;

}());
//# sourceMappingURL=author-draggable.es5.js.map
