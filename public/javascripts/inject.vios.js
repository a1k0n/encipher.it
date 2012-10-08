// Generated by CoffeeScript 1.3.3
(function() {
  var BASE_URL, CRYPTO_FOOTER, CRYPTO_HEADER, HELP, HTML_INPUT, HTML_POPUP, Popup, main, show,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  BASE_URL = "http://localhost:3000";

  HELP = "This message is encrypted. Visit " + BASE_URL + " to learn how to deal with it.\n\n";

  CRYPTO_HEADER = "EnCt2";

  CRYPTO_FOOTER = "IwEmS";

  HTML_INPUT = function() {
    return "<input type='text' style='position: absolute; display: block; top: 4px; left: 4px; right: 4px; bottom: 32px; display: none;' id='crypt-key-plain'/>     <input type='password' style='position: absolute; display: block; top: 4px; left: 4px; right: 4px; bottom: 32px;' id='crypt-key-pass'/>    <u style='cursor: pointer; font-size: 14px; display: block; position: absolute; display: block; top: 10px; right: 16px; color: black;' id='crypt-show-pass' z-index='10000'>Unmask</u>";
  };

  HTML_POPUP = function(title, body, action) {
    return "<div style='position: fixed; z-index: 9999; background: #D9DCE0; border-radius: 10px; border: 1px solid black; color: black; font-size: 14px; text-shadow: 0 1px 1px #CCC;'>        <div style='position: absolute; left: 0; right: 0; color: black; margin: 4px; height: 32px;'>            <b style='padding: 8px; float: left;'>" + title + "</b>            <img style='border: none; float: right; cursor: pointer;' id='crypt-close' src='" + BASE_URL + "/close-new.png'/>        </div>        <div style='position: absolute; bottom: 0; top: 32px; margin: 4px; padding: 10px; left: 0; right: 0;'>            " + body + "            <b style='position: absolute; display: block; left: 4px; bottom: 4px;' id='crypt-message''></b>            <input disabled='true' style='position: absolute; display: block; right: 4px; bottom: 4px; height: 25px;' id='crypt-btn' type='button' value='" + action + "'/>        </div>    </div>";
  };

  Popup = (function() {

    function Popup() {
      this.cache = {};
      if (this.parse()) {
        if (this.encrypted) {
          this.input("Enter decryption key", "Decrypt");
        } else {
          if (this.text) {
            this.input("Enter encryption key", "Encrypt");
          } else {
            this.show("Message is empty", "Cancel", "Please type the message first");
          }
        }
      } else {
        this.show("Message not found", "Cancel", "Please select the input area");
      }
    }

    Popup.prototype.input = function(title, action) {
      var _this = this;
      this.show(title, action, HTML_INPUT());
      jQuery('#crypt-show-pass').click(function() {
        var el, pass;
        pass = _this.password();
        jQuery('#crypt-key-plain').toggle().val(pass);
        jQuery('#crypt-key-pass').toggle().val(pass);
        el = jQuery('#crypt-show-pass');
        if (el.html() === 'Unmask') {
          return el.html('Mask');
        } else {
          return el.html('Unmask');
        }
      });
      jQuery('#crypt-key-plain,#crypt-key-pass').focus().keyup(function(e) {
        var enabled, score;
        enabled = _this.password() !== '';
        score = _this.score();
        jQuery('#crypt-message').html(score);
        jQuery('#crypt-btn').attr('disabled', !enabled);
        if (e.which === 27) {
          return _this.hide();
        }
        if (e.which === 13 && enabled) {
          return _this.run();
        }
      });
      jQuery('#crypt-key-plain').toggle().toggle().val("");
      return jQuery('#crypt-key-pass').toggle().toggle().val("");
    };

    Popup.prototype.show = function(title, action, body) {
      var _this = this;
      this.frame = jQuery(HTML_POPUP(title, body, action));
      jQuery('body').append(this.frame);
      if (action === "Cancel") {
        jQuery('#crypt-btn').attr('disabled', false).click(function() {
          return _this.hide();
        }).keyup(function(e) {
          if (e.which === 27) {
            return _this.hide();
          }
        }).focus();
      } else {
        jQuery('#crypt-btn').click(function() {
          return _this.run();
        });
      }
      jQuery(window).resize(function() {
        return _this.layout();
      });
      jQuery('#crypt-close').click(function() {
        return _this.hide();
      });
      return this.layout();
    };

    Popup.prototype.alert = function(msg) {
      return jQuery('#crypt-message').html(msg);
    };

    Popup.prototype.hide = function() {
      this.frame.remove();
      return window.CRYPT_GUI = void 0;
    };

    Popup.prototype.layout = function() {
      var height, width;
      height = 105;
      width = jQuery(window).width() / 2;
      if (width < 350) {
        width = width * 2 - 20;
      }
      return this.frame.css({
        'top': (jQuery(window).height() - height) / 2 + 'px',
        'left': (jQuery(window).width() - width) / 2 + 'px',
        'width': width + 'px',
        'height': height + 'px'
      });
    };

    Popup.prototype.password = function() {
      if (jQuery('#crypt-key-plain').is(':visible')) {
        return jQuery('#crypt-key-plain').attr('value');
      } else {
        return jQuery('#crypt-key-pass').attr('value');
      }
    };

    Popup.prototype.score = function() {
      var regexp, strength, value, _i, _len, _ref;
      value = this.password();
      strength = 1;
      _ref = [/{5\,}/, /[a-z]+/, /[0-9]+/, /[A-Z]+/];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        regexp = _ref[_i];
        if (value.match(regexp)) {
          strength++;
        }
      }
      if (value.length < 5) {
        strength = 1;
      }
      if (value.length > 8) {
        strength++;
      }
      if (value.length > 12) {
        strength++;
      }
      if (value.length > 16 || strength > 5) {
        strength = 5;
      }
      return ['<span style="#c11b17">Very weak</span>', 'Weak', 'Moderate', 'Strong', 'Very strong'][strength - 1];
    };

    Popup.prototype.run = function() {
      var callback,
        _this = this;
      callback = function(res) {
        if (res) {
          return _this.hide();
        } else {
          return _this.alert("Invalid password");
        }
      };
      if (this.encrypted) {
        return this.decrypt(this.password(), callback);
      } else {
        return this.encrypt(this.password(), callback);
      }
    };

    Popup.prototype.derive = function(password, salt, callback) {
      var cacheKey, pbkdf2,
        _this = this;
      cacheKey = password + salt;
      if (this.cache[cacheKey]) {
        return callback(this.cache[cacheKey]);
      }
      pbkdf2 = new PBKDF2(password, salt, 1000, 32);
      return pbkdf2.deriveKey(function(per) {
        return _this.alert("Generating key: " + (Math.floor(per)) + "%");
      }, function(key) {
        _this.cache[cacheKey] = key;
        return callback(key);
      });
    };

    Popup.prototype.decryptNode = function(node, text, password, callback) {
      var hash, hmac, salt,
        _this = this;
      hash = text.slice(0, 64);
      hmac = text.slice(0, 40);
      salt = text.slice(64, 72);
      text = text.slice(72);
      return this.derive(password, salt, function(key) {
        text = Aes.Ctr.decrypt(text, key, 256);
        if (hex_hmac_sha1(key, text) === hmac || hash === Sha256.hash(text)) {
          _this.updateNode(node, text);
          return callback(true);
        } else {
          return callback(false);
        }
      });
    };

    Popup.prototype.decrypt = function(password, callback) {
      var i, next, success,
        _this = this;
      i = 0;
      success = false;
      next = function() {
        if (_this.nodes.length > i) {
          return _this.decryptNode(_this.nodes[i], _this.texts[i], password, function(res) {
            i += 1;
            success || (success = res);
            return next();
          });
        } else {
          return callback(success);
        }
      };
      return next();
    };

    Popup.prototype.encrypt = function(password, callback) {
      var salt,
        _this = this;
      salt = Base64.random(8);
      return this.derive(password, salt, function(key) {
        var hmac;
        hmac = hex_hmac_sha1(key, _this.text);
        hmac += hmac.slice(0, 24);
        _this.updateNode(_this.node, HELP + _this.dump(hmac + salt + Aes.Ctr.encrypt(_this.text, key, 256)));
        return callback(true);
      });
    };

    Popup.prototype.dump = function(text) {
      var i, out, _i, _ref;
      text = CRYPTO_HEADER + text + CRYPTO_FOOTER;
      i = 0;
      out = "";
      for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        out += text.charAt(i);
        if ((i % 80) === 79) {
          out += '\n';
        }
      }
      return out;
    };

    Popup.prototype.updateNode = function(node, value) {
      if (node.is('textarea')) {
        return node.val(value);
      } else {
        return node.html(value.replace(/\n/g, '<br/>'));
      }
    };

    Popup.prototype.findEncrypted = function() {
      var found, nodes, texts, traverse, traverseBody, _ref;
      _ref = [[], []], nodes = _ref[0], texts = _ref[1];
      found = function(elem, txt) {
        var ftr, hdr;
        txt = txt.replace(/[\n> ]/g, '');
        hdr = txt.indexOf(CRYPTO_HEADER);
        ftr = txt.indexOf(CRYPTO_FOOTER);
        if (hdr >= 0 && ftr >= 0) {
          txt = txt.slice(hdr + CRYPTO_HEADER.length, ftr);
          nodes.push(elem);
          texts.push(txt);
          return 1;
        }
        return 0;
      };
      traverse = function(node) {
        var elem, i, skip, _i, _ref1;
        skip = 0;
        if (node.nodeType === 3 && node.data.indexOf(CRYPTO_HEADER) >= 0) {
          elem = jQuery(node.parentNode);
          skip = found(elem, elem.text());
        } else {
          if (node.nodeType === 1 && !/(script|style)/i.test(node.tagName)) {
            if (/(input|textarea)/i.test(node.tagName)) {
              elem = jQuery(node);
              found(elem, elem.val());
            } else {
              if (node.childNodes) {
                for (i = _i = 0, _ref1 = node.childNodes.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                  i += traverse(node.childNodes[i]);
                }
              }
            }
          }
        }
        return skip;
      };
      traverseBody = function(body) {
        body.each(function() {
          return traverse(this);
        });
        return body.find("iframe").each(function() {
          try {
            return traverseBody(jQuery(this).contents().find('body'));
          } catch (e) {

          }
        });
      };
      traverseBody(jQuery('body'));
      return [nodes, texts];
    };

    Popup.prototype.findInput = function() {
      var node;
      node = jQuery('#canvas_frame').contents().find('textarea[name=body]:visible');
      if (node.length) {
        return [node, node.val()];
      }
      node = jQuery('#canvas_frame').contents().find('iframe.editable').contents().find('body');
      if (node.length) {
        return [node, node.html()];
      }
      if (jQuery('#canvas_frame').length) {
        return [void 0, void 0];
      }
      node = jQuery('iframe[name=compArea_test_]').contents().find('body');
      if (node.length) {
        return [node, node.html()];
      }
      node = jQuery('textarea[name=txtbdy]');
      if (node.length === 1) {
        return [node, node.val()];
      }
      node = jQuery('textarea');
      if (node.length === 1) {
        return [node, node.val()];
      }
      if (node.length > 1) {
        node = jQuery('textarea:focus');
      }
      if (node.length === 1) {
        return [node, node.val()];
      }
      return [void 0, void 0];
    };

    Popup.prototype.parse = function() {
      var _ref, _ref1;
      _ref = this.findEncrypted(), this.nodes = _ref[0], this.texts = _ref[1];
      _ref1 = this.findInput(), this.node = _ref1[0], this.text = _ref1[1];
      this.encrypted = this.nodes.length > 0;
      return this.encrypted || this.node !== void 0;
    };

    return Popup;

  })();

  show = function() {
    if (window.CRYPT_GUI) {
      return window.CRYPT_GUI.hide();
    } else {
      return window.CRYPT_GUI = new Popup();
    }
  };

  main = function() {
    var count, ready, script, script_tag, scripts, _i, _len, _results;
    if (window.CRYPT_LOADED) {
      return show();
    } else {
      scripts = ['AES.js', 'sha1.js', 'pbkdf2.js', 'base64.js', 'utf8.js'];
      if (typeof jQuery === "undefined") {
        scripts.push('jquery.min.js');
      }
      count = scripts.length;
      ready = function() {
        count -= 1;
        if (count === 0) {
          window.CRYPT_LOADED = true;
          if (__indexOf.call(scripts, 'jquery.min.js') >= 0) {
            $.noConflict();
          }
          jQuery.expr[':'].focus = function(elem) {
            return elem === document.activeElement && (elem.type || elem.href);
          };
          return show();
        }
      };
      _results = [];
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        script = scripts[_i];
        script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", BASE_URL + "/javascripts/" + script);
        script_tag.onload = ready;
        script_tag.onreadystatechange = function() {
          if (this.readyState === 'complete' || this.readyState === 'loaded') {
            return ready();
          }
        };
        _results.push(document.getElementsByTagName("head")[0].appendChild(script_tag));
      }
      return _results;
    }
  };

  main();

}).call(this);
