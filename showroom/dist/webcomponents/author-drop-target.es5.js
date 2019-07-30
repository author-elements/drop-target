// Copyright (c) 2019 Author.io. MIT licensed.
// @author.io/element-drop-target v1.0.0 available at github.com/author-elements/drop-target
// Last Build: 7/29/2019, 8:54:35 PM
var AuthorDropTargetElement = (function () {
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
    console.error('[ERROR] <author-drop-target> Required dependency "AuthorBaseElement" not found.');
    console.info('AuthorBaseElement is available at https://github.com/author-elements/base');
  }

  (function () {
    var missingDependencies = Array.from(new Set([])).filter(function (dep) {
      return !customElements.get(dep);
    });

    if (missingDependencies.length > 0) {
      console.error("[ERROR] <author-drop-target> Required dependenc".concat(missingDependencies.length !== 1 ? 'ies' : 'y', " not found: ").concat(missingDependencies.map(function (d) {
        return "<".concat(d, ">");
      }).join(', ').replace(', ' + missingDependencies[missingDependencies.length - 1], ' and ' + missingDependencies[missingDependencies.length - 1])));
      missingDependencies.forEach(function (dep, i) {
        return console.info("".concat(i + 1, ". <").concat(dep, "> is available at ").concat('https://github.com/author-elements/drop-target'.replace('drop-target', dep.replace('author-', ''))));
      });
    }
  })();

  var AuthorDropTargetElement =
  /*#__PURE__*/
  function (_AuthorBaseElement) {
    _inherits(AuthorDropTargetElement, _AuthorBaseElement);

    function AuthorDropTargetElement() {
      var _this;

      _classCallCheck(this, AuthorDropTargetElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AuthorDropTargetElement).call(this, "<template><style>@charset \"UTF-8\"; :host *,:host :after,:host :before{box-sizing:border-box}author-drop-target *,author-drop-target :after,author-drop-target :before{box-sizing:border-box}</style><slot></slot></template>"));

      _this.UTIL.defineAttributes({
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

      _this.UTIL.defineProperties({
        acceptedTypes: {
          private: true,
          readonly: true,
          get: function get() {
            if (_this.accepts === null) {
              return null;
            }

            return _this.accepts.replace(/\s+/g, ' ').trim().split(' ');
          }
        },
        dimensions: {
          private: true,
          readonly: true,
          get: function get() {
            return _this.getBoundingClientRect();
          }
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

      _this.UTIL.definePrivateMethods({
        applyDragHandlers: function applyDragHandlers() {
          var draggable = _this.PRIVATE.draggable;
          draggable.on('drag', _this.PRIVATE.dragHandler);
          draggable.on('drag.end', _this.PRIVATE.dragendHandler);
        },
        getEventData: function getEventData(evt) {
          var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return {
            cancelable: true,
            composed: true,
            detail: Object.assign({}, {
              acceptedTypes: _this.PRIVATE.acceptedTypes,
              data: _this.PRIVATE.draggable.data,
              willAcceptDrop: _this.PRIVATE.willAcceptDrop,
              position: _this.PRIVATE.getPointerPosition(evt),
              source: _this.PRIVATE.draggable
            }, props)
          };
        },
        getPointerPosition: function getPointerPosition(evt) {
          var relative = {
            height: _this.offsetHeight,
            width: _this.offsetWidth
          };
          var left = evt.offsetX || _this.PRIVATE.offsetPointerPosition.x;
          var top = evt.offsetY || _this.PRIVATE.offsetPointerPosition.y;
          var right = relative.width - left;
          var bottom = relative.height - top;
          var position = {
            x: left,
            y: top,
            top: {
              px: top,
              pct: _this.UTIL.getPercentageDecimal(top, relative.height)
            },
            right: {
              px: right,
              pct: _this.UTIL.getPercentageDecimal(right, relative.width)
            },
            bottom: {
              px: bottom,
              pct: _this.UTIL.getPercentageDecimal(bottom, relative.height)
            },
            left: {
              px: left,
              pct: _this.UTIL.getPercentageDecimal(left, relative.width)
            }
          };
          return Object.assign({}, position, {
            quadrant: _this.PRIVATE.getDropQuadrant(position)
          });
        },
        dragHandler: function dragHandler(evt) {
          var _this$PRIVATE = _this.PRIVATE,
              draggable = _this$PRIVATE.draggable,
              dimensions = _this$PRIVATE.dimensions,
              lastPointerClientPosition = _this$PRIVATE.lastPointerClientPosition;
          var client = evt.detail.position.client;
          var isEntering = null;
          var isLeaving = null;
          var isOver = {
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

          _this.PRIVATE.offsetPointerPosition = {
            x: client.x - dimensions.left,
            y: client.y - dimensions.top
          };

          var isParent = _this.contains(draggable);

          if (isEntering !== null && Object.values(isEntering).some(Boolean)) {
            var dragenterEvent = new CustomEvent('drag.enter', _this.PRIVATE.getEventData(evt));

            _this.emit(dragenterEvent);

            if (isParent) {
              _this.over = false;
              _this.PRIVATE.willAcceptDrop = false;
            } else {
              if (!dragenterEvent.defaultPrevented) {
                _this.emit("drop.allow");

                _this.over = true;
                _this.PRIVATE.willAcceptDrop = true;
              }
            }
          }

          if (isOver.x && isOver.y) {
            if (!_this.over) {
              _this.over = !isParent;

              _this.emit("drop.".concat(isParent ? 'deny' : 'allow'), {});
            }

            _this.emit(new CustomEvent('drag.over', _this.PRIVATE.getEventData(evt)));
          }

          if (isLeaving !== null && Object.values(isLeaving).some(Boolean)) {
            _this.over = false;

            _this.emit('drop.deny', {});

            _this.emit(new CustomEvent('drag.leave', _this.PRIVATE.getEventData(evt)));
          }

          _this.PRIVATE.lastPointerClientPosition = {
            x: client.x,
            y: client.y
          };
        },
        getDropQuadrant: function getDropQuadrant(position) {
          var x = 'left';
          var y = 'top';

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

          return "".concat(y, " ").concat(x);
        },
        dragendHandler: function dragendHandler(evt) {
          var dropEvent = new CustomEvent('drop', _this.PRIVATE.getEventData(evt));

          if (_this.over) {
            _this.emit(dropEvent);
          }

          if (dropEvent.defaultPrevented) {
            console.log('PREVENTED');
          }

          _this.PRIVATE.removeDragHandlers();

          _this.over = false;
          _this.offsetPointerPosition = null;
        },
        removeDragHandlers: function removeDragHandlers() {
          _this.PRIVATE.draggable.off('drag', _this.PRIVATE.dragHandler);

          _this.PRIVATE.draggable.off('drag.end', _this.PRIVATE.dragendHandler);
        }
      });

      _this.UTIL.registerListeners(_assertThisInitialized(_this), {
        'handshake.offered': function handshakeOffered(evt) {
          var _evt$detail = evt.detail,
              draggable = _evt$detail.draggable,
              types = _evt$detail.types;
          var reject = false;

          switch (_this.mustMatch) {
            case 'all':
            case '*':
              if (!_this.PRIVATE.acceptedTypes.every(function (type) {
                return types.includes(type);
              })) {
                reject = true;
              }

              break;

            default:
              if (!(_this.PRIVATE.acceptedTypes.filter(function (type) {
                return types.includes(type);
              }).length >= _this.mustMatch)) {
                reject = true;
              }

          }

          if (reject) {
            return;
          }

          _this.emit('handshake.accepted', {
            dropTarget: _assertThisInitialized(_this)
          }, draggable);

          _this.PRIVATE.draggable = draggable;

          _this.PRIVATE.applyDragHandlers();
        }
      });

      return _this;
    }

    _createClass(AuthorDropTargetElement, null, [{
      key: "observedAttributes",
      get: function get() {
        return ['accepts', 'sortable'];
      }
    }]);

    return AuthorDropTargetElement;
  }(AuthorBaseElement(HTMLElement));

  customElements.define('author-drop-target', AuthorDropTargetElement);

  return AuthorDropTargetElement;

}());
//# sourceMappingURL=author-drop-target.es5.js.map
